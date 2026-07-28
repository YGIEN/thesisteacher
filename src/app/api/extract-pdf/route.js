import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "File must be a PDF" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // pdf-parse v1 - simple and reliable
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);

    const text = data.text?.trim();

    if (!text || text.length < 20) {
      return NextResponse.json(
        {
          error:
            "Could not extract text from this PDF. It may be scanned or image-based. Try pasting the text directly instead.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      text,
      pages: data.numpages || 1,
    });
  } catch (error) {
    console.error("PDF extraction error:", error.message);
    return NextResponse.json(
      {
        error:
          "Failed to extract text from PDF. Try pasting the text directly instead.",
      },
      { status: 500 }
    );
  }
}