import nodemailer from "nodemailer"

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
  MEETING_LINK,
  WEBINAR_DATE,
  WEBINAR_TIME,
  NODE_ENV,
} = process.env

type SendEmailParams = {
  to: string
  name: string
  phone?: string
  company?: string
  registrationId?: string
}

function isSMTPConfigured() {
  return (
    SMTP_HOST &&
    SMTP_PORT &&
    SMTP_USER &&
    SMTP_PASS &&
    SMTP_FROM
  )
}

export async function sendConfirmationEmail({
  to,
  name,
  phone,
  company,
  registrationId,
}: SendEmailParams) {
  // ✅ Never block form submission in development
  if (NODE_ENV === "development") {
    console.log("[email] Skipped (development mode)", {
      to,
      name,
    })
    return
  }

  // ✅ Fail gracefully if SMTP is not configured
  if (!isSMTPConfigured()) {
    console.warn("[email] SMTP not configured. Email not sent.")
    return
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // true for SSL, false for TLS
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // avoids TLS issues on some hosts
    },
  })

  try {
    // ✅ Verify connection first (clean failure if creds are wrong)
    await transporter.verify()

    const link = MEETING_LINK ?? "https://example.com/meeting-link"
    const date = WEBINAR_DATE ?? "TBD"
    const time = WEBINAR_TIME ?? "TBD"

    await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject: "🎉 Your Webinar Booking Confirmation",
      html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background:#f8fafc; padding:40px;">
  <div style="max-width:600px; margin:auto; background:#fff; border-radius:8px; overflow:hidden;">
    <div style="background:#0f172a; color:#fff; padding:30px; text-align:center;">
      <h1>Booking Confirmed!</h1>
      <p>Your seat is reserved</p>
    </div>
    <div style="padding:30px;">
      <p>Hi ${name || "there"},</p>
      <p>Thank you for registering. Here are your details:</p>

      <ul>
        <li><strong>Email:</strong> ${to}</li>
        ${phone ? `<li><strong>Phone:</strong> ${phone}</li>` : ""}
        ${company ? `<li><strong>Company:</strong> ${company}</li>` : ""}
        ${registrationId ? `<li><strong>Booking ID:</strong> ${registrationId}</li>` : ""}
      </ul>

      <h3>📅 Webinar Info</h3>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      <p>
        <a href="${link}" target="_blank">${link}</a>
      </p>

      <p style="margin-top:30px;">See you there,<br><strong>The Webinar Team</strong></p>
    </div>
  </div>
</body>
</html>
      `,
    })

    console.log("[email] Confirmation sent to", to)
  } catch (error) {
    // ✅ DO NOT throw — log and move on
    console.error("[email] Failed to send email:", error)
  }
}
