import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { sisterId, question, type, displayOrder, animationType, options, memoryImageUrl, memoryCaption } = body;

    if (!sisterId || !question || !type) {
      return NextResponse.json(
        { error: "Sister ID, question text, and type are required." },
        { status: 400 }
      );
    }

    // Optional attached memory photo
    let createdMemoryId: string | null = null;
    if (memoryImageUrl) {
      const mem = await db.memory.create({
        data: {
          sisterId,
          imageUrl: memoryImageUrl,
          caption: memoryCaption || null,
        },
      });
      createdMemoryId = mem.id;
    }

    const maxOrder = await db.question.aggregate({
      where: { sisterId },
      _max: { displayOrder: true },
    });

    const nextOrder = displayOrder ?? (maxOrder._max.displayOrder ? maxOrder._max.displayOrder + 1 : 1);

    const newQuestion = await db.question.create({
      data: {
        sisterId,
        question,
        type,
        displayOrder: nextOrder,
        animationType: animationType || "typewriter",
        options: {
          create: (options || []).map((opt: { label: string; value?: string; responseMessage?: string; animationType?: string; nextQuestionId?: string; attachMemory?: boolean }) => ({
            label: opt.label,
            value: opt.value || opt.label,
            responseMessage: opt.responseMessage || null,
            animationType: opt.animationType || "confetti",
            nextQuestionId: opt.nextQuestionId || null,
            memoryId: opt.attachMemory ? createdMemoryId : null,
          })),
        },
      },
      include: {
        options: { include: { memory: true } },
      },
    });

    return NextResponse.json({ success: true, question: newQuestion });
  } catch (error) {
    console.error("Admin POST question error:", error);
    return NextResponse.json({ error: "Failed to create question." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { id, question, type, displayOrder, animationType, options, reorderList } = body;

    // Batch reorder
    if (Array.isArray(reorderList)) {
      for (const item of reorderList) {
        await db.question.update({
          where: { id: item.id },
          data: { displayOrder: item.displayOrder },
        });
      }
      return NextResponse.json({ success: true, message: "Questions reordered." });
    }

    if (!id) {
      return NextResponse.json({ error: "Question ID is required." }, { status: 400 });
    }

    // Delete existing options and replace with updated ones
    if (Array.isArray(options)) {
      await db.answerOption.deleteMany({
        where: { questionId: id },
      });
    }

    const updated = await db.question.update({
      where: { id },
      data: {
        ...(question && { question }),
        ...(type && { type }),
        ...(displayOrder !== undefined && { displayOrder }),
        ...(animationType && { animationType }),
        ...(Array.isArray(options) && {
          options: {
            create: options.map((opt: { label: string; value?: string; responseMessage?: string; animationType?: string; nextQuestionId?: string; memoryId?: string }) => ({
              label: opt.label,
              value: opt.value || opt.label,
              responseMessage: opt.responseMessage || null,
              animationType: opt.animationType || "confetti",
              nextQuestionId: opt.nextQuestionId || null,
              memoryId: opt.memoryId || null,
            })),
          },
        }),
      },
      include: {
        options: { include: { memory: true } },
      },
    });

    return NextResponse.json({ success: true, question: updated });
  } catch (error) {
    console.error("Admin PUT question error:", error);
    return NextResponse.json({ error: "Failed to update question." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Question ID is required." }, { status: 400 });
    }

    await db.question.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Question deleted." });
  } catch (error) {
    console.error("Admin DELETE question error:", error);
    return NextResponse.json({ error: "Failed to delete question." }, { status: 500 });
  }
}
