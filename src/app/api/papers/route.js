import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Paper from "@/lib/models/paper";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const papers = await Paper.find({ userId: session.user.id })
      .select("title summary createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ papers });
  } catch (error) {
    console.error("Error fetching papers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const paper = await Paper.create({
      userId: session.user.id,
      title,
      originalContent: content,
    });

    return NextResponse.json({ paper }, { status: 201 });
  } catch (error) {
    console.error("Error creating paper:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}