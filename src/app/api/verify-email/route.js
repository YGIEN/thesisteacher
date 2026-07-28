import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import PendingUser from "@/lib/models/pendingUser";

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

    // Find the pending user record
    const pending = await PendingUser.findOne({
      email: email.toLowerCase(),
      token,
    });

    if (!pending) {
      return NextResponse.json(
        { error: "Invalid or expired verification link" },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (pending.expires < new Date()) {
      await PendingUser.deleteOne({ _id: pending._id });
      return NextResponse.json(
        { error: "Verification link has expired. Please sign up again." },
        { status: 400 }
      );
    }

    // Check if user was already created (e.g. double-clicked link)
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      // Clean up pending record
      await PendingUser.deleteOne({ _id: pending._id });
      return NextResponse.json({
        message: "Email already verified! You can log in.",
      });
    }

    // NOW create the real user (only on successful verification)
    const user = await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      emailVerified: new Date(),
    });

    // Clean up pending record
    await PendingUser.deleteOne({ _id: pending._id });

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