import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});

export async function sendVerificationEmail(email, name, token) {
  const baseUrl = process.env.AUTH_URL || "http://localhost:3000";
  const verifyUrl = `${baseUrl}/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  const info = await transporter.sendMail({
    from: `"Thesisteacher" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your email address - Thesisteacher",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #6C5CE7; font-size: 28px; margin: 0;">
            <span style="color: #6C5CE7;">Thesis</span>Teacher
          </h1>
        </div>
        
        <div style="background: #f8f9fa; border-radius: 12px; padding: 32px;">
          <h2 style="margin-top: 0; font-size: 20px;">Hi ${name}!</h2>
          <p style="color: #555; line-height: 1.6;">
            Thanks for signing up for Thesisteacher. Please verify your email address
            by clicking the button below.
          </p>
          
          <div style="text-align: center; margin: 28px 0;">
            <a href="${verifyUrl}" 
               style="background: #6C5CE7; color: white; text-decoration: none; 
                      padding: 14px 32px; border-radius: 8px; font-weight: 600; 
                      display: inline-block; font-size: 16px;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #888; font-size: 13px; line-height: 1.5;">
            Or copy and paste this link in your browser:<br>
            <a href="${verifyUrl}" style="color: #6C5CE7; word-break: break-all;">${verifyUrl}</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;">
          
          <p style="color: #888; font-size: 12px;">
            This link expires in 24 hours. If you didn't sign up for Thesisteacher,
            you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });

  console.log("Verification email sent:", info.messageId);
}