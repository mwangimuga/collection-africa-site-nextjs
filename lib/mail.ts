import nodemailer, { type Transporter } from "nodemailer";

let cached: Transporter | null = null;

function required(key: string) {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
}

export function transporter(): Transporter {
  if (cached) return cached;

  cached = nodemailer.createTransport({
    host: required("SMTP_HOST"),
    port: Number(process.env.SMTP_PORT ?? 587),
    // Port 465 uses implicit TLS; 587 upgrades with STARTTLS.
    secure: process.env.SMTP_SECURE === "true" || Number(process.env.SMTP_PORT) === 465,
    auth: { user: required("SMTP_USER"), pass: required("SMTP_PASS") },
    // Keeps a warm connection for bursts of submissions.
    pool: true,
    maxConnections: 2,
  });

  return cached;
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Consistent internal notification layout for every form on the site. */
export function notificationHtml(heading: string, rows: [string, string][], footer?: string) {
  const body = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid #e6e8ef;color:#5a6079;font:600 12px/1.4 Arial,sans-serif;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #e6e8ef;color:#12162e;font:400 14px/1.6 Arial,sans-serif">${escapeHtml(value).replace(/\n/g, "<br>")}</td>
      </tr>`,
    )
    .join("");

  return `<!doctype html><html><body style="margin:0;background:#f4f6f9;padding:24px">
    <table role="presentation" width="100%" style="max-width:640px;margin:0 auto;background:#fff;border:1px solid #e6e8ef;border-radius:4px;border-collapse:collapse">
      <tr><td style="background:#1b2149;padding:18px 16px;color:#fff;font:700 15px/1.3 Arial,sans-serif">${escapeHtml(heading)}</td></tr>
      ${body}
      ${footer ? `<tr><td colspan="2" style="padding:14px 16px;color:#5a6079;font:400 12px/1.5 Arial,sans-serif">${escapeHtml(footer)}</td></tr>` : ""}
    </table></body></html>`;
}

export function textFromRows(rows: [string, string][]) {
  return rows.map(([k, v]) => `${k}: ${v}`).join("\n");
}
