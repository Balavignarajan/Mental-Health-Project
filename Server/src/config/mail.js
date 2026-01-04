const nodemailer = require("nodemailer");
const { cfg } = require("./config");

function createMailerTransport() {
  // Check if email is configured
  if (!cfg.MAIL_USER || !cfg.MAIL_PASS) {
    throw new Error("Email service not configured. Please set SMTP_USER (or MAIL_USER) and SMTP_PASS (or MAIL_PASS) in .env file");
  }

  return nodemailer.createTransport({
    host: cfg.MAIL_HOST,
    port: cfg.MAIL_PORT,
    secure: cfg.MAIL_PORT === 465,
    auth: { user: cfg.MAIL_USER, pass: cfg.MAIL_PASS }
  });
}

module.exports = { createMailerTransport };
