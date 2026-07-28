import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import PendingUser from "@/lib/models/pendingUser";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists (in real Users or pending)
    const { default: User } = await import("@/lib/models/user");
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Check if already pending (resend verification)
    const existingPending = await PendingUser.findOne({ email });
    if (existingPending) {
      // Remove old pending record
      await PendingUser.deleteOne({ email });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store ONLY in pending — user is NOT created yet
    await PendingUser.create({
      name,
      email,
      password: hashedPassword,
      token,
      expires,
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, name, token);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // If email fails, still tell user to check email
      // The pending record will auto-expire in 24h
    }

    return NextResponse.json(
      {
        message:
          "Verification email sent! Please check your inbox to activate your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}