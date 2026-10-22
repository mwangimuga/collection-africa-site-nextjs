import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validation";
import { notificationHtml, textFromRows, transporter } from "@/lib/mail";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { site } from "@/content/site";
import { record } from "@/lib/record";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = clientIp(req);
  const limit = rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000);

  if (!limit.ok) {
    return NextResponse.json(
      { message: "You've sent several enquiries already. Please email us directly." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return NextResponse.json(
      { message: "Please check the highlighted fields.", fieldErrors },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Silent bot rejection: honeypot filled, or submitted impossibly fast.
  // Return 200 so bots don't learn what tripped them.
  if (data.company_website || (data.elapsed !== undefined && data.elapsed < 3000)) {
    return NextResponse.json({ ok: true });
  }

  const rows: [string, string][] = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone || "—"],
    ["Organisation", data.organisation || "—"],
    ["Service", data.service || "Not specified"],
    ["Message", data.message],
    ["Received", new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi" })],
  ];

  // Saved first, so a mail-server outage never loses an enquiry.
  await record("enquiries", {
    name: data.name,
    email: data.email,
    phone: data.phone || undefined,
    organisation: data.organisation || undefined,
    service: data.service || undefined,
    message: data.message,
    status: "new",
  });

  try {
    const mail = transporter();

    await mail.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO_ENQUIRIES ?? site.email,
      replyTo: `${data.name} <${data.email}>`,
      subject: `Website enquiry — ${data.service || "General"} — ${data.name}`,
      text: textFromRows(rows),
      html: notificationHtml("New website enquiry", rows, `Submitted from ${ip}`),
    });

    // Acknowledgement to the enquirer. Failure here must not fail the request.
    mail
      .sendMail({
        from: process.env.MAIL_FROM,
        to: data.email,
        subject: "We've received your enquiry — Collection Africa",
        text: `Hello ${data.name},\n\nThank you for contacting Collection Africa. A member of our team will reply within one working day.\n\nFor reference, this is what you sent us:\n\n${data.message}\n\nIf it's urgent, call ${site.phoneDisplay} between 8:00am and 5:00pm, Monday to Friday.\n\n${site.legalName}\n${site.url}`,
        html: notificationHtml(
          "We've received your enquiry",
          [
            ["Hello", data.name],
            ["Status", "A member of our team will reply within one working day."],
            ["Your message", data.message],
            ["Urgent?", `Call ${site.phoneDisplay}, 8:00am–5:00pm, Monday to Friday.`],
          ],
          `${site.legalName} · ${site.url}`,
        ),
      })
      .catch((err) => console.error("[contact] acknowledgement failed", err));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] send failed", err);
    return NextResponse.json(
      { message: `We couldn't send that. Please email ${site.email} directly.` },
      { status: 502 },
    );
  }
}
