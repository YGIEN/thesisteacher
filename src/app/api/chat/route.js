import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Paper from "@/lib/models/paper";
import ChatMessage from "@/lib/models/chatMessage";
import { chatAboutThesis } from "@/lib/deepseek";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paperId, message } = await request.json();

    if (!paperId || !message) {
      return NextResponse.json(
        { error: "Paper ID and message are required" },
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

    if (!paper.explanation) {
      return NextResponse.json(
        { error: "Paper has not been explained yet" },
        { status: 400 }
      );
    }

    // Save user message
    await ChatMessage.create({
      paperId,
      userId: session.user.id,
      role: "user",
      content: message,
    });

    // Get conversation history
    const history = await ChatMessage.find({ paperId, userId: session.user.id })
      .sort({ createdAt: 1 })
      .lean();

    // Get AI response
    const reply = await chatAboutThesis(
      paper.originalContent,
      paper.explanation,
      history
    );

    // Save AI response
    const aiMessage = await ChatMessage.create({
      paperId,
      userId: session.user.id,
      role: "assistant",
      content: reply,
    });

    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      { error: "Failed to get response. Please try again." },
      { status: 500 }
    );
  }
}