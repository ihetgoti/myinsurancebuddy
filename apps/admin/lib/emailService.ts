import nodemailer from 'nodemailer';

// Create transporter - configure based on your email provider
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOTPEmail(email: string, otp: string, name?: string) {
  const mailOptions = {
    from: `"MyInsuranceBuddies Admin" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: 'Password Reset OTP - MyInsuranceBuddies Admin',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 32px; text-align: center;">
              <div style="width: 48px; height: 48px; background: white; border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Password Reset</h1>
            </div>

            <!-- Content -->
            <div style="padding: 32px;">
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                Hello${name ? ` ${name}` : ''},
              </p>
              <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                You requested to reset your password for the MyInsuranceBuddies Admin panel. Use the OTP below to verify your identity:
              </p>

              <!-- OTP Box -->
              <div style="background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
                <p style="color: #64748b; font-size: 14px; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
                <div style="font-size: 36px; font-weight: 700; color: #1e293b; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                  ${otp}
                </div>
                <p style="color: #94a3b8; font-size: 13px; margin: 12px 0 0;">
                  Valid for 10 minutes
                </p>
              </div>

              <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 24px 0 0;">
                If you didn't request this password reset, please ignore this email or contact support if you have concerns about your account security.
              </p>
            </div>

            <!-- Footer -->
            <div style="background: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 13px; margin: 0; text-align: center;">
                This is an automated message from MyInsuranceBuddies Admin.<br>
                Please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Password Reset OTP - MyInsuranceBuddies Admin

Hello${name ? ` ${name}` : ''},

You requested to reset your password for the MyInsuranceBuddies Admin panel.

Your OTP Code: ${otp}

This code is valid for 10 minutes.

If you didn't request this password reset, please ignore this email.

- MyInsuranceBuddies Admin Team
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: any) {
    console.error('Failed to send OTP email:', error);
    return { success: false, error: error.message };
  }
}

export function generateOTP(): string {
  // Generate 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}
