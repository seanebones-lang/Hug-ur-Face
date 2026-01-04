import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const HF_TOKEN = process.env.HF_TOKEN;
const HF_SPACE_ID = process.env.HF_SPACE_ID || "bizbots/qwen-image-editor";

// HuggingFace Space Gradio API endpoint
const HF_SPACE_URL = `https://bizbots-qwen-image-editor.hf.space`;
const HF_SPACE_API = `${HF_SPACE_URL}/gradio_api/call/infer`;

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's current credits
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { imageCredits: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has credits
    if (user.imageCredits < 1) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          creditsRemaining: 0,
          message: "Please purchase more credits to continue generating images."
        },
        { status: 402 }
      );
    }

    const body = await request.json();
    const { prompt, image, loraAdapter } = body;

    if (!prompt || !image) {
      return NextResponse.json(
        { error: "Missing prompt or image" },
        { status: 400 }
      );
    }

    // Deduct 1 credit BEFORE generation (to prevent abuse)
    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: {
        imageCredits: {
          decrement: 1,
        },
      },
    });

    try {
      // Step 1: Initiate the Gradio API call
      const callResponse = await fetch(HF_SPACE_API, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [
            [image], // images - array with base64 image
            prompt,   // prompt
            loraAdapter, // lora_adapter
            0, // seed
            true, // randomize_seed
            1.0, // guidance_scale
            4  // steps (fast)
          ]
        }),
      });

      if (!callResponse.ok) {
        // Refund credit if API call fails
        await db.user.update({
          where: { id: session.user.id },
          data: {
            imageCredits: {
              increment: 1,
            },
          },
        });

        const errorText = await callResponse.text();
        console.error("HF Space API Error:", callResponse.status, errorText);
        throw new Error(`HF Space API error: ${callResponse.statusText}`);
      }

      const callData = await callResponse.json();
      const eventId = callData.event_id;

      if (!eventId) {
        throw new Error("No event_id received from Gradio API");
      }

      // Step 2: Poll for the result using the event_id
      const statusUrl = `${HF_SPACE_URL}/gradio_api/call/infer/${eventId}`;
      let resultImage = null;
      let attempts = 0;
      const maxAttempts = 60; // 60 seconds timeout

      while (attempts < maxAttempts && !resultImage) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

        const statusResponse = await fetch(statusUrl, {
          headers: {
            "Authorization": `Bearer ${HF_TOKEN}`,
          },
        });

        if (statusResponse.ok) {
          const text = await statusResponse.text();
          const lines = text.split('\n').filter(line => line.trim());

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.msg === 'process_completed' && data.output?.data) {
                  resultImage = data.output.data[0]; // First element is the output image
                  break;
                }
              } catch (e) {
                // Continue if JSON parse fails
              }
            }
          }
        }

        attempts++;
      }

      if (!resultImage) {
        throw new Error("Timeout waiting for image generation");
      }

      // Result is already in base64 format with data URI
      const resultBase64 = resultImage.startsWith("data:") ? resultImage : `data:image/png;base64,${resultImage}`;

      // Log the generation
      await db.accessLog.create({
        data: {
          userId: session.user.id,
          feature: "image_generation",
          spaceId: "qwen-image-editor",
          creditsUsed: 1,
          metadata: {
            prompt: prompt.substring(0, 100),
            loraAdapter,
            timestamp: new Date().toISOString(),
          },
        },
      });

      return NextResponse.json({
        success: true,
        image: resultBase64,
        creditsRemaining: updatedUser.imageCredits,
      });
    } catch (error) {
      // Refund credit on error
      await db.user.update({
        where: { id: session.user.id },
        data: {
          imageCredits: {
            increment: 1,
          },
        },
      });

      console.error("Image generation error:", error);
      return NextResponse.json(
        {
          error: "Image generation failed",
          message: error instanceof Error ? error.message : "Unknown error"
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
