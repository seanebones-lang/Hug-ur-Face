import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const HF_SPACE_ID = process.env.HF_SPACE_ID || "bizbots/qwen-image-editor";
const HF_API_URL = `https://${HF_SPACE_ID.replace("/", "-")}.hf.space`;

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
      // Step 1: Submit job to Gradio API and get event ID
      const submitResponse = await fetch(`${HF_API_URL}/gradio_api/call/infer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [
            [image],  // images array
            prompt,  // prompt string
            loraAdapter || "Photo-to-Anime",  // lora_adapter
            0,  // seed
            true,  // randomize_seed
            1.0,  // guidance_scale
            4,  // steps
          ],
        }),
      });

      if (!submitResponse.ok) {
        // Refund credit if API call fails
        await db.user.update({
          where: { id: session.user.id },
          data: {
            imageCredits: {
              increment: 1,
            },
          },
        });

        const errorText = await submitResponse.text();
        throw new Error(`HF Space API error: ${submitResponse.statusText} - ${errorText}`);
      }

      const { event_id } = await submitResponse.json();

      if (!event_id) {
        // Refund credit if no event ID
        await db.user.update({
          where: { id: session.user.id },
          data: {
            imageCredits: {
              increment: 1,
            },
          },
        });

        throw new Error("No event ID returned from API");
      }

      // Step 2: Poll for result using SSE
      const sseResponse = await fetch(`${HF_API_URL}/gradio_api/call/infer/${event_id}`);

      if (!sseResponse.ok) {
        // Refund credit if SSE fails
        await db.user.update({
          where: { id: session.user.id },
          data: {
            imageCredits: {
              increment: 1,
            },
          },
        });

        throw new Error(`Failed to get result: ${sseResponse.statusText}`);
      }

      // Parse SSE stream
      const text = await sseResponse.text();
      const lines = text.split('\n');

      let resultData: any = null;
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.substring(6));
            if (data && Array.isArray(data) && data.length > 0) {
              resultData = data;
            }
          } catch (e) {
            // Skip invalid JSON lines
          }
        }
      }

      if (!resultData || !resultData[0]) {
        // Refund credit if no valid result
        await db.user.update({
          where: { id: session.user.id },
          data: {
            imageCredits: {
              increment: 1,
            },
          },
        });

        throw new Error("No valid output from API");
      }

      // Log the generation
      await db.accessLog.create({
        data: {
          userId: session.user.id,
          feature: "image_generation",
          spaceId: HF_SPACE_ID,
          creditsUsed: 1,
          metadata: {
            prompt: prompt.substring(0, 100),
            timestamp: new Date().toISOString(),
          },
        },
      });

      return NextResponse.json({
        success: true,
        image: resultData[0],  // First element is the generated image
        creditsRemaining: updatedUser.imageCredits,
      });
    } catch (error) {
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
