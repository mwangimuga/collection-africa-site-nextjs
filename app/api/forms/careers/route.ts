import { NextResponse } from "next/server";
import { ALLOWED_CV_TYPES, MAX_CV_BYTES, applicationSchema } from "@/lib/validation";
import { notificationHtml, textFromRows, transporter } from "@/lib/mail";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { site } from "@/content/site";
import { record } from "@/lib/record";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`careers:${ip}`, 4, 24 * 60 * 60 * 1000).ok) {
    return NextResponse.json(
      { message: "You've already applied several times today. Email your CV to " + site.careersEmail + "." },
      { status: 429 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ message: "Invalid submission." }, { status: 400 });
  }

  const parsed = applicationSchema.safeParse({
    name: form.get("name"),
    email: form.get("email"),
    phone: form.get("phone"),
    role: form.get("role"),
    location: form.get("location") ?? "",
    message: form.get("message") ?? "",
    consent: form.get("consent") === "on",
    company_website: form.get("company_website") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message ?? "Please check your details." },
      { status: 400 },
    );
  }

  const data = parsed.data;
  if (data.company_website) return NextResponse.json({ ok: true });

  const cv = form.get("cv");
  if (!(cv instanceof File) || cv.size === 0) {
    return NextResponse.json({ message: "Attach your CV as a PDF or Word file." }, { status: 400 });
  }
  if (cv.size > MAX_CV_BYTES) {
    return NextResponse.json({ message: "That file is over 5 MB. Please compress it." }, { status: 400 });
  }
  if (!ALLOWED_CV_TYPES.includes(cv.type)) {
    return NextResponse.json({ message: "Only PDF and Word files are accepted." }, { status: 400 });
  }

  const rows: [string, string][] = [
    ["Role", data.role],
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Location", data.location || "—"],
    ["Notes", data.message || "—"],
    ["Received", new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi" })],
  ];

  const retainUntil = new Date();
  retainUntil.setMonth(retainUntil.getMonth() + 6);

  await record("applications", {
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role,
    location: data.location || undefined,
    message: data.message || undefined,
    status: "received",
    retainUntil: retainUntil.toISOString(),
  });

  try {
    const buffer = Buffer.from(await cv.arrayBuffer());
    const safeName = data.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const extension = cv.name.split(".").pop() ?? "pdf";

    await transporter().sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO_CAREERS ?? site.careersEmail,
      replyTo: `${data.name} <${data.email}>`,
      subject: `Application — ${data.role} — ${data.name}`,
      text: textFromRows(rows),
      html: notificationHtml("New job application", rows, `Submitted from ${ip}`),
      attachments: [{ filename: `cv-${safeName}.${extension}`, content: buffer, contentType: cv.type }],
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[careers] send failed", err);
    return NextResponse.json(
      { message: `We couldn't send that. Please email your CV to ${site.careersEmail}.` },
      { status: 502 },
    );
  }
}
