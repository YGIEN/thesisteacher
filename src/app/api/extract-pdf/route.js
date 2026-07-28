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

    // pdf-parse v2 uses PDFParse class
    const { PDFParse } = await import("pdf-parse");
    const pdf = new PDFParse(buffer);

    // Get text from all pages
    let fullText = "";
    const totalPages = pdf.getPageLength();

    for (let i = 1; i <= totalPages; i++) {
      const page = pdf.getPage(i);
      const textContent = await page.getTextContent();
      const lines = textContent.items.map((item) => item.str || "");
      fullText += lines.join(" ") + "\n\n";
    }

    const text = fullText.trim();

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
      pages: totalPages,
    });
  } catch (error) {
    console.error("PDF extraction error:", error);
    return NextResponse.json(
      {
        error:
          "Failed to extract text from PDF. Try pasting the text directly instead.",
      },
      { status: 500 }
    );
  }
}