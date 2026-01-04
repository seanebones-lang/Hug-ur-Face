import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const HF_TOKEN = process.env.HF_TOKEN;
const HF_SPACE_ID = process.env.HF_SPACE_ID || "bizbots/qwen-image-editor";

// HuggingFace Space API endpoint
const HF_SPACE_API = `https://huggingface.co/spaces/${HF_SPACE_ID}/api/predict`;

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
      // Call HuggingFace Space API (Gradio format)
      const response = await fetch(HF_SPACE_API, {
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

      if (!response.ok) {
        // Refund credit if API call fails
        await db.user.update({
          where: { id: session.user.id },
          data: {
            imageCredits: {
              increment: 1,
            },
          },
        });

        const errorText = await response.text();
        console.error("HF Space API Error:", response.status, errorText);
        throw new Error(`HF Space API error: ${response.statusText}`);
      }

      const callResult = await response.json();
      const resultImage = callResult.data[0]; // First element is the output image

      // Result is already in base64 format with data URI
      const resultBase64 = resultImage.startsWith("data:") ? resultImage : `data:image/png;base64,${resultImage}`;

      // Log the generation
      await db.accessLog.create({
        data: {
          userId: session.user.id,
          feature: "image_generation",
          spaceId: "inference-api",
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
