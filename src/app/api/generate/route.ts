import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const HF_TOKEN = process.env.HF_TOKEN;
const HF_SPACE_ID = process.env.HF_SPACE_ID || "bizbots/qwen-image-editor";

// HuggingFace Space Gradio API endpoint
const HF_SPACE_URL = `https://bizbots-qwen-image-editor.hf.space`;

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
      // Step 1: Initiate the Gradio API call to /call/predict
      const callResponse = await fetch(`${HF_SPACE_URL}/call/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(HF_TOKEN && { "Authorization": `Bearer ${HF_TOKEN}` })
        },
        body: JSON.stringify({
          data: [
            [image], // images - array with base64 data URI
            prompt,   // prompt
            loraAdapter, // lora_adapter
            42, // seed
            true, // randomize_seed
            512, // width
            512, // height
            0.8, // guidance_scale
            20  // num_inference_steps
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
        throw new Error("No event_id received from HuggingFace");
      }

      // Step 2: Get results from /call/predict/{event_id}
      const resultResponse = await fetch(`${HF_SPACE_URL}/call/predict/${eventId}`, {
        headers: {
          ...(HF_TOKEN && { "Authorization": `Bearer ${HF_TOKEN}` })
        }
      });

      if (!resultResponse.ok) {
        const errorText = await resultResponse.text();
        console.error("HF result fetch failed:", resultResponse.status, errorText);
        throw new Error(`Failed to get results: ${resultResponse.statusText}`);
      }

      // Parse Server-Sent Events response
      const resultText = await resultResponse.text();
      const lines = resultText.split('\n');
      let eventType = null;
      let data = null;

      for (const line of lines) {
        if (line.startsWith('event:')) {
          eventType = line.substring(6).trim();
        } else if (line.startsWith('data:')) {
          data = line.substring(5).trim();
        }
      }

      if (eventType === 'error') {
        console.error('HF returned error:', data);
        throw new Error('HuggingFace processing error');
      }

      if (eventType !== 'complete' || !data) {
        throw new Error('Unexpected response format from HuggingFace');
      }

      const result = JSON.parse(data);
      const resultImage = result[0]; // First element is the output image

      // Result should be in base64 format with data URI
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
