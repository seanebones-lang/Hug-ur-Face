import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const HF_TOKEN = process.env.HF_TOKEN;
const HF_SPACE_ID = process.env.HF_SPACE_ID || "bizbots/nexteleven-image-editor";
const HF_SPACE_URL = `https://bizbots-nexteleven-image-editor.hf.space`;

export const maxDuration = 120; // Allow 120 seconds for generation

export async function POST(request: Request) {
  try {
    const session = await auth();

    console.log("Session check:", {
      hasSession: !!session,
      hasUser: !!session?.user,
      hasUserId: !!session?.user?.id,
      userId: session?.user?.id
    });

    if (!session?.user?.id) {
      console.error("Unauthorized: No session or user ID");
      return NextResponse.json({
        error: "Unauthorized",
        details: "Please sign in to generate images"
      }, { status: 401 });
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
      // Step 1: Upload image to Space
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, 'base64');

      const formData = new FormData();
      formData.append('files', new Blob([buffer], { type: 'image/png' }), 'image.png');

      const uploadResponse = await fetch(`${HF_SPACE_URL}/gradio_api/upload`, {
        method: 'POST',
        headers: {
          ...(HF_TOKEN && { "Authorization": `Bearer ${HF_TOKEN}` })
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        // Refund credit if upload fails
        await db.user.update({
          where: { id: session.user.id },
          data: { imageCredits: { increment: 1 } },
        });
        throw new Error('Failed to upload image');
      }

      const uploadData = await uploadResponse.json();
      const filePath = Array.isArray(uploadData) ? uploadData[0] : uploadData;

      // Step 2: Call infer API with uploaded file
      const callResponse = await fetch(`${HF_SPACE_URL}/gradio_api/call/infer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(HF_TOKEN && { "Authorization": `Bearer ${HF_TOKEN}` })
        },
        body: JSON.stringify({
          data: [
            [filePath], // uploaded file path
            prompt,
            loraAdapter,
            42,
            true,
            1.0,
            20
          ]
        }),
      });

      if (!callResponse.ok) {
        await db.user.update({
          where: { id: session.user.id },
          data: { imageCredits: { increment: 1 } },
        });
        throw new Error('Failed to start generation');
      }

      const callData = await callResponse.json();
      const eventId = callData.event_id;

      if (!eventId) {
        throw new Error("No event_id received");
      }

      // Step 3: Poll for results (up to 120 seconds)
      let resultImage = null;
      for (let i = 0; i < 120; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const resultResponse = await fetch(`${HF_SPACE_URL}/gradio_api/call/infer/${eventId}`, {
          headers: {
            ...(HF_TOKEN && { "Authorization": `Bearer ${HF_TOKEN}` })
          }
        });

        const resultText = await resultResponse.text();
        const lines = resultText.split('\n');
        let eventType = null;
        let data = null;

        for (const line of lines) {
          if (line.startsWith('event:')) eventType = line.substring(6).trim();
          else if (line.startsWith('data:')) data = line.substring(5).trim();
        }

        if (eventType === 'complete' && data && data !== 'null') {
          const result = JSON.parse(data);
          resultImage = result[0];
          break;
        } else if (eventType === 'error') {
          throw new Error('Generation failed');
        }
      }

      if (!resultImage) {
        throw new Error('Generation timeout');
      }

      const resultBase64 = resultImage.startsWith("data:") ? resultImage : `data:image/png;base64,${resultImage}`;

      // Log the generation
      await db.accessLog.create({
        data: {
          userId: session.user.id,
          feature: "image_generation",
          spaceId: "nexteleven-image-editor",
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
