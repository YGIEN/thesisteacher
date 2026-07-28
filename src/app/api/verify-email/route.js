import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import VerificationToken from "@/lib/models/verificationToken";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return NextResponse.json(
        { error: "Missing token or email" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the verification token
    const storedToken = await VerificationToken.findOne({
      email: email.toLowerCase(),
      token,
    });

    if (!storedToken) {
      return NextResponse.json(
        { error: "Invalid or expired verification link" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (storedToken.expires < new Date()) {
      await VerificationToken.deleteOne({ _id: storedToken._id });
      return NextResponse.json(
        { error: "Verification link has expired. Please sign up again." },
        { status: 400 }
      );
    }

    // Update user as verified
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.emailVerified = new Date();
    await user.save();

    // Delete the used token
    await VerificationToken.deleteOne({ _id: storedToken._id });

    return NextResponse.json({
      message: "Email verified successfully! You can now log in.",
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}