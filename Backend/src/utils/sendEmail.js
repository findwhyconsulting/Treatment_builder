import "dotenv/config";
import sgMail from "@sendgrid/mail";

// Initialize SendGrid with the API key
sgMail.setApiKey(process.env.SENDGRID_KEY);

/**
 * Sends a custom email using SendGrid.
 * @param {Object} options - Email options.
 * @param {string|string[]} options.to - Recipient email address(es).
 * @param {string} options.from - Sender email address.
 * @param {string} options.subject - Email subject.
 * @param {string} [options.text] - Plain text version of the email body.
 * @param {string} [options.html] - HTML version of the email body.
 */
export const sendCustomEmail = async ({ to, subject, text, html, attachments }) => {
  if (!process.env.SENDGRID_KEY) {
    throw new Error("SENDGRID_KEY is not defined in environment variables.");
  }

  if (!to || !subject || (!text && !html)) {
    throw new Error("Required fields: to, from, subject, and either text or html.");
  }

  const msg = {
    to,
    from : "members@consultation.club",
    subject,
    text,
    html,
    attachments
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully to:", to);
    return true
  } catch (error) {
    if (error.response) {
      console.error("Error response body:", error.response.body.errors);
    } else {
      console.error("Error sending email:", error.message);
    }
  }
};

