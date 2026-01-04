import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const HF_TOKEN = process.env.HF_TOKEN;

// Use image-to-image model via Inference API
const HF_INFERENCE_API = "https://api-inference.huggingface.co/models/timbrooks/instruct-pix2pix";

// Map our LoRA adapter names to instruction prompts
const STYLE_PROMPTS: Record<string, string> = {
  "Photo-to-Anime": "turn this photo into anime art style",
  "Upscaler": "enhance resolution and add fine details",
  "Style-Transfer": "apply artistic painting style",
  "Manga-Tone": "convert to black and white manga comic art",
  "Multiple-Angles": "show from different viewing angle",
  "Any-Pose": "change the pose",
  "Light-Migration": "improve the lighting and add dramatic lighting effects",
};

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
      // Convert base64 to buffer
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const imageBuffer = Buffer.from(base64Data, "base64");

      // Get style-specific prompt enhancement
      const stylePrompt = STYLE_PROMPTS[loraAdapter] || "";
      const fullPrompt = `${stylePrompt}. ${prompt}`.trim();

      // Call HuggingFace Inference API with image data
      const response = await fetch(HF_INFERENCE_API, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: {
            image: base64Data,
            prompt: fullPrompt,
          },
          parameters: {
            num_inference_steps: 20,
            guidance_scale: 7.5,
          }
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
        console.error("HF API Error:", response.status, errorText);
        throw new Error(`HuggingFace API error: ${response.statusText}`);
      }

      const resultBlob = await response.blob();
      const resultBuffer = Buffer.from(await resultBlob.arrayBuffer());
      const resultBase64 = `data:image/png;base64,${resultBuffer.toString("base64")}`;

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
