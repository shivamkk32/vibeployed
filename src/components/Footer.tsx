import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { CONTACT } from "../lib/contact";
import { Container } from "./ui/Kit";
import { Logo } from "./ui/Logo";
import { GithubIcon, LinkedinIcon, XIcon } from "./ui/BrandIcons";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how" },
      { label: "Modes", href: "/#modes" },
      { label: "Architecture", href: "/#design" },
      { label: "Cost model", href: "/#cost" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    title: "Clouds",
    links: [
      { label: "AWS", href: "/#design" },
      { label: "Google Cloud", href: "/#design" },
      { label: "Azure", href: "/#design" },
      { label: "Terraform export", href: "/#design" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Security", href: "/#security" },
      { label: "FAQ", href: "/#faq" },
      { label: "Contact", href: "/#contact" },
    ],
  },
];

const SOCIALS = [
  { icon: GithubIcon, label: "GitHub", href: CONTACT.github },
  { icon: XIcon, label: "X", href: CONTACT.twitter },
  { icon: LinkedinIcon, label: "LinkedIn", href: CONTACT.linkedin },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.07] bg-[oklch(0.145_0_0)]">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <Link
              to="/"
              className="inline-flex items-center transition-opacity duration-300 hover:opacity-80"
              aria-label="Vibeployed home"
            >
              <Logo className="h-[22px]" />
            </Link>
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-white/40">
              Deployment infrastructure for people who would rather see the
              architecture and the bill before the resources exist.
            </p>

            <ul className="mt-6 flex flex-col gap-2.5">
              <li>
                <a
                  href={`mailto:${CONTACT.salesEmail}`}
                  className="flex items-center gap-2.5 text-[13px] text-white/50 transition-colors hover:text-white"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0 text-white/30" />
                  {CONTACT.salesEmail}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`}
                  className="flex items-center gap-2.5 text-[13px] text-white/50 transition-colors hover:text-white"
                >
                  <Phone className="h-3.5 w-3.5 shrink-0 text-white/30" />
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-[13px] leading-relaxed text-white/50">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/30" />
                <span>
                  {CONTACT.addressLine1}
                  <br />
                  {CONTACT.addressLine2}
                </span>
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-1.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="grid h-9 w-9 place-items-center rounded-lg text-white/40 transition-colors duration-300 hover:bg-white/[0.07] hover:text-white"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
                {col.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-[13px] text-white/50 transition-colors duration-300 hover:text-white"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/[0.07] pt-7 sm:flex-row sm:items-center">
          <p className="text-[12px] text-white/30">
            © {new Date().getFullYear()} Vibeployed. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <a
              href={`mailto:${CONTACT.securityEmail}`}
              className="text-[12px] text-white/30 transition-colors hover:text-white/70"
            >
              Report a vulnerability
            </a>
            {["Privacy", "Terms", "Status"].map((l) => (
              <a
                key={l}
                href="/#faq"
                className="text-[12px] text-white/30 transition-colors hover:text-white/70"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
