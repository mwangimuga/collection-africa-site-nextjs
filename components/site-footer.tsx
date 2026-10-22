import Link from "next/link";
import { getCompany, getServices } from "@/lib/cms";
import { Logo } from "@/components/logo";

export async function SiteFooter() {
  const [services, site] = await Promise.all([getServices(), getCompany()]);
  const offices = site.offices;

  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__grid">
          <div className="footer__brand">
            <Logo tone="light" />
            <p>
              Debt recovery, county revenue and credit services across Kenya since {site.founded}.
              Licensed, ethical and accountable.
            </p>
          </div>

          <div>
            <h4>Services</h4>
            <ul>
              {services.map((s) => (
                <li key={s.slug}><Link href={`/services/${s.slug}`}>{s.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About us</Link></li>
              <li><Link href="/insights">Insights</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/ethics">Ethical Recovery Charter</Link></li>
            </ul>
          </div>

          <div>
            <h4>Offices</h4>
            <ul>
              {offices.map((o) => (
                <li key={o.city}>
                  <strong style={{ color: "#fff", display: "block" }}>{o.city}</strong>
                  {o.street}
                </li>
              ))}
              <li><a href={`tel:${site.phone}`}>{site.phoneDisplay}</a></li>
              <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__base">
          <span>© {new Date().getFullYear()} {site.legalName}. All rights reserved.</span>
          <nav aria-label="Legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/ethics">Ethical recovery</Link>
            <a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
