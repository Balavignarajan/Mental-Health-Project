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

async function sendVerifyEmail(toEmailValue, verifyUrlValue) {
  await sendMail(
    toEmailValue,
    "Verify your email",
    `<p>Click to verify:</p><a href="${verifyUrlValue}">${verifyUrlValue}</a>`
  );
}

async function sendResetPasswordEmail(toEmailValue, resetUrlValue) {
  await sendMail(
    toEmailValue,
    "Reset your password",
    `<p>Reset link:</p><a href="${resetUrlValue}">${resetUrlValue}</a>`
  );
}

async function sendInvoiceEmail(toEmailValue, invoiceNumberValue) {
  await sendMail(
    toEmailValue,
    "Payment receipt / Invoice",
    `<p>Your invoice <b>${invoiceNumberValue}</b> is generated.</p>`
  );
}

module.exports = { sendVerifyEmail, sendResetPasswordEmail, sendInvoiceEmail };
