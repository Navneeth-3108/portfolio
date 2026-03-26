/**
 * Escape HTML special characters to prevent XSS in email templates
 */
const escapeHtml = (text) => {
  if (!text) return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return String(text).replace(/[&<>"']/g, (char) => map[char]);
};

const parseRecipients = (value) => {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const isResendConfigured = () => {
  return !!(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
};

const sendViaResend = async ({ to, replyTo, subject, text, html }) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL,
      to,
      reply_to: replyTo,
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend request failed (${response.status}): ${body || "Unknown error"}`);
  }
};

/**
 * Check if mailer is properly configured
 */
const isMailerConfigured = () => {
  return !!(isResendConfigured() && process.env.CONTACT_NOTIFY_EMAIL);
};

/**
 * Send contact notification email
 * Does NOT throw on error - logs instead for fire-and-forget behavior
 */
const sendContactNotification = async ({ name, email, subject, message }) => {
  const recipientList = parseRecipients(process.env.CONTACT_NOTIFY_EMAIL);

  // Guard: Log if mailer not configured but don't block message submission.
  if (!isMailerConfigured()) {
    console.warn("[Email] Mailer not configured. Set RESEND_API_KEY, RESEND_FROM_EMAIL, CONTACT_NOTIFY_EMAIL.");
    console.warn("[Email] Current config:", {
      RESEND_API_KEY: process.env.RESEND_API_KEY ? "SET" : "MISSING",
      RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL ? "SET" : "MISSING",
      CONTACT_NOTIFY_EMAIL: process.env.CONTACT_NOTIFY_EMAIL ? "SET" : "MISSING",
    });
    return { success: false, reason: "Mailer not configured" };
  }

  if (!recipientList.length) {
    console.warn("[Email] CONTACT_NOTIFY_EMAIL has no valid recipients");
    return { success: false, reason: "No recipients configured" };
  }

  try {
    const title = escapeHtml(subject?.trim() || "No Subject");
    const escapedName = escapeHtml(name);
    const escapedEmail = escapeHtml(email);
    const escapedMessage = escapeHtml(message);

    const formattedSubject = `[Portfolio Contact] ${title}`;
    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${title}`,
      "",
      "Message:",
      message,
    ].join("\n");
    const html = `
        <h2>New Portfolio Contact Message</h2>
        <p><strong>Name:</strong> ${escapedName}</p>
        <p><strong>Email:</strong> ${escapedEmail}</p>
        <p><strong>Subject:</strong> ${title}</p>
        <p><strong>Message:</strong></p>
        <p>${escapedMessage.replace(/\n/g, "<br />")}</p>
      `;

    await sendViaResend({
      to: recipientList,
      replyTo: email,
      subject: formattedSubject,
      text,
      html,
    });
    console.log(`[Email] ✓ Contact notification sent via Resend to ${recipientList.join(", ")}`);
    return { success: true, provider: "resend" };
  } catch (error) {
    console.error("[Email] ✗ Email send failed");
    console.error("[Email] Error details:", {
      message: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
    });
    console.error("[Email] Configuration used:", {
      resend: process.env.RESEND_API_KEY ? "SET" : "MISSING",
      to: recipientList,
      from: process.env.RESEND_FROM_EMAIL || "MISSING",
    });
    // Return error info but don't throw - caller will handle gracefully
    return { success: false, reason: error.message };
  }
};

module.exports = {
  sendContactNotification,
  isMailerConfigured,
  escapeHtml,
};