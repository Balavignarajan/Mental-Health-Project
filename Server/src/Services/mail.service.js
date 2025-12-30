const { createMailerTransport } = require("../config/mail");
const { cfg } = require("../config/config");

async function sendMail(toEmailValue, subjectValue, htmlValue) {
  try {
    const transporter = createMailerTransport();
    const fromEmail = cfg.FROM_EMAIL || cfg.MAIL_USER;
    await transporter.sendMail({
      from: `"Soukya Stacks" <${fromEmail}>`,
      to: toEmailValue,
      subject: subjectValue,
      html: htmlValue
    });
  } catch (error) {
    // Re-throw with more context
    throw new Error(`Email sending failed: ${error.message}`);
  }
}

async function sendVerifyEmail(toEmailValue, verificationCode) {
  await sendMail(
    toEmailValue,
    "Verify your email - Verification Code",
    `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Verification</h2>
        <p>Hello,</p>
        <p>Thank you for signing up! Please use the following verification code to verify your email address:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 8px; margin: 0;">${verificationCode}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't create an account, please ignore this email.</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">Best regards,<br>Soukya Stacks Team</p>
      </div>
    `
  );
}

async function sendResetPasswordEmail(toEmailValue, resetUrlValue) {
  await sendMail(
    toEmailValue,
    "Reset your password",
    `<p>Reset link:</p><a href="${resetUrlValue}">${resetUrlValue}</a>`
  );
}

async function sendLoginOtpEmail(toEmailValue, otpCode) {
  await sendMail(
    toEmailValue,
    "Login OTP Code",
    `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Login OTP Code</h2>
        <p>Hello,</p>
        <p>You requested to login with OTP. Please use the following code to complete your login:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 8px; margin: 0;">${otpCode}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email and ensure your account is secure.</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">Best regards,<br>Soukya Stacks Team</p>
      </div>
    `
  );
}

async function sendInvoiceEmail(toEmailValue, invoiceNumberValue) {
  await sendMail(
    toEmailValue,
    "Payment receipt / Invoice",
    `<p>Your invoice <b>${invoiceNumberValue}</b> is generated.</p>`
  );
}

/**
 * Send assessment link via email
 * @param {string|string[]} recipientEmails - Single email or array of emails
 * @param {string} linkUrl - Full assessment link URL
 * @param {string} campaignName - Campaign name (optional)
 * @param {string} testTitle - Test title
 * @param {string} testDescription - Test description (optional)
 * @param {Date} expiresAt - Expiration date (optional)
 * @param {string} customMessage - Custom message from admin (optional)
 */
async function sendAssessmentLinkEmail(recipientEmails, linkUrl, campaignName, testTitle, testDescription, expiresAt, customMessage) {
  // baseUrl is already included in linkUrl parameter, no need to construct it here
  
  // Format expiration date if provided
  let expirationText = '';
  if (expiresAt) {
    const expiryDate = new Date(expiresAt);
    expirationText = `
      <p style="color: #666; font-size: 14px; margin: 15px 0;">
        <strong>⏰ Important:</strong> This assessment link expires on ${expiryDate.toLocaleDateString()} at ${expiryDate.toLocaleTimeString()}.
      </p>
    `;
  }

  // Custom message section
  const customMessageSection = customMessage ? `
    <div style="background-color: #f0f9ff; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; color: #333; font-style: italic;">${customMessage}</p>
    </div>
  ` : '';

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 30px 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Mental Health Assessment</h1>
                  ${campaignName ? `<p style="color: #e8f5e9; margin: 10px 0 0 0; font-size: 16px;">${campaignName}</p>` : ''}
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                    Hello,
                  </p>
                  
                  ${customMessageSection}
                  
                  <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                    You've been invited to take the <strong>${testTitle}</strong> assessment.
                  </p>
                  
                  ${testDescription ? `
                    <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 15px 0;">
                      ${testDescription}
                    </p>
                  ` : ''}
                  
                  ${expirationText}
                  
                  <!-- CTA Button -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                    <tr>
                      <td align="center">
                        <a href="${linkUrl}" style="display: inline-block; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(76, 175, 80, 0.3);">
                          Start Assessment Now
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Link as text (backup) -->
                  <p style="color: #666; font-size: 12px; margin: 20px 0; word-break: break-all;">
                    Or copy and paste this link into your browser:<br>
                    <a href="${linkUrl}" style="color: #4CAF50; text-decoration: underline;">${linkUrl}</a>
                  </p>
                  
                  <!-- Privacy Note -->
                  <div style="background-color: #f8f9fa; border-radius: 6px; padding: 15px; margin: 25px 0;">
                    <p style="color: #666; font-size: 12px; line-height: 1.5; margin: 0;">
                      <strong>🔒 Privacy & Confidentiality:</strong> Your responses are private and securely stored. This assessment is for informational purposes only and is not a substitute for professional medical advice.
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                  <p style="color: #999; font-size: 12px; margin: 0;">
                    This email was sent by Soukya Stacks<br>
                    If you have any questions, please contact us.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const subject = campaignName 
    ? `${campaignName} - Take Your Assessment`
    : `Take the ${testTitle} Assessment`;

  // Handle multiple recipients (bulk send)
  const emails = Array.isArray(recipientEmails) ? recipientEmails : [recipientEmails];
  const results = [];
  
  for (const email of emails) {
    try {
      await sendMail(email.trim(), subject, emailHtml);
      results.push({ email: email.trim(), success: true });
    } catch (error) {
      results.push({ email: email.trim(), success: false, error: error.message });
    }
  }
  
  return results;
}

module.exports = { sendVerifyEmail, sendResetPasswordEmail, sendInvoiceEmail, sendLoginOtpEmail, sendAssessmentLinkEmail };
