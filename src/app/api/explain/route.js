import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Paper from "@/lib/models/paper";
import { explainThesis } from "@/lib/deepseek";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paperId } = await request.json();

    if (!paperId) {
      return NextResponse.json(
        { error: "Paper ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const paper = await Paper.findOne({
      _id: paperId,
      userId: session.user.id,
    });

    if (!paper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    if (paper.explanation) {
      return NextResponse.json({ explanation: paper.explanation });
    }

    const explanation = await explainThesis(paper.originalContent);

    paper.explanation = explanation;
    paper.summary = explanation.tldr || explanation.overview;
    await paper.save();

    return NextResponse.json({ explanation });
  } catch (error) {
    console.error("Error explaining paper:", error);
    return NextResponse.json(
      { error: "Failed to explain paper. Please try again." },
      { status: 500 }
    );
  }
}