import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  Clock,
  Mail,
  MessageSquare,
  Phone,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, XIcon } from "../ui/BrandIcons";
import { CONTACT } from "../../lib/contact";
import { Button, Container, SectionHeading } from "../ui/Kit";
import { Reveal, StaggerGroup, StaggerItem } from "../ui/Reveal";
import { cn } from "../../lib/utils";

const CHANNELS = [
  {
    icon: Mail,
    label: "Sales",
    value: CONTACT.salesEmail,
    href: `mailto:${CONTACT.salesEmail}`,
    note: "Pricing, procurement, security reviews",
  },
  {
    icon: MessageSquare,
    label: "Support",
    value: CONTACT.supportEmail,
    href: `mailto:${CONTACT.supportEmail}`,
    note: "Deployment issues and account help",
  },
  {
    icon: Phone,
    label: "Phone",
    value: CONTACT.phone,
    href: `tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`,
    note: CONTACT.phoneHours,
  },
  {
    icon: Building2,
    label: "Office",
    value: CONTACT.addressLine1,
    href: CONTACT.mapUrl,
    note: CONTACT.addressLine2,
  },
];

const SOCIALS = [
  { icon: GithubIcon, label: "GitHub", href: CONTACT.github },
  { icon: XIcon, label: "X", href: CONTACT.twitter },
  { icon: LinkedinIcon, label: "LinkedIn", href: CONTACT.linkedin },
];

export function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="relative scroll-mt-24 py-28 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Talk to us"
          title="Questions the FAQ did not answer?"
          accent="Ask a person."
          blurb="Security reviews, procurement paperwork, an architecture you are not sure we handle. All of it goes to a human who has actually used the product."
        />

        <div className="mt-16 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)]">
          {/* ------------------------------ channels ----------------------------- */}
          <StaggerGroup className="grid gap-4 sm:grid-cols-2">
            {CHANNELS.map((c) => (
              <StaggerItem key={c.label}>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={c.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group flex h-full flex-col rounded-2xl bg-white/[0.025] p-5 ring-hairline transition-colors duration-300 hover:bg-white/[0.05]"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.06]">
                    <c.icon className="h-4 w-4 text-white/70" />
                  </span>
                  <span className="mt-4 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/35">
                    {c.label}
                  </span>
                  <span className="mt-1.5 text-[14.5px] font-medium text-white transition-colors group-hover:text-white">
                    {c.value}
                  </span>
                  <span className="mt-1 text-[12.5px] leading-relaxed text-white/40">
                    {c.note}
                  </span>
                </a>
              </StaggerItem>
            ))}

            <StaggerItem className="sm:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white/[0.025] px-5 py-4 ring-hairline">
                <span className="flex items-center gap-2.5 text-[13px] text-white/55">
                  <Clock className="h-4 w-4 text-white/40" />
                  {CONTACT.responseTime}
                </span>
                <div className="flex items-center gap-1.5">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      className="grid h-9 w-9 place-items-center rounded-lg text-white/45 transition-colors duration-300 hover:bg-white/[0.07] hover:text-white"
                    >
                      <s.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>
            </StaggerItem>
          </StaggerGroup>

          {/* -------------------------------- form ------------------------------- */}
          <Reveal delay={0.1}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="glass flex h-full flex-col rounded-2xl p-6 sm:p-7"
            >
              <h3 className="font-ui text-[16px] font-semibold text-white">
                Send us a message
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/45">
                Tell us what you are trying to deploy and we will point you at the
                right answer.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Input label="Name" name="name" placeholder="Ada Lovelace" required />
                <Input
                  label="Work email"
                  name="email"
                  type="email"
                  placeholder="ada@company.com"
                  required
                />
              </div>
              <div className="mt-3">
                <Input label="Company" name="company" placeholder="Acme Inc." />
              </div>
              <div className="mt-3 flex flex-1 flex-col">
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder="We run a Django monolith on two EC2 boxes and want it containerised without downtime…"
                  className="min-h-[104px] flex-1 resize-y rounded-xl bg-white/[0.03] px-3.5 py-3 text-[13.5px] text-white outline-none ring-1 ring-inset ring-white/10 transition-colors placeholder:text-white/25 focus:ring-white/35"
                />
              </div>

              <Button
                type="submit"
                className="mt-5 w-full"
                disabled={sent}
                icon={
                  sent ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )
                }
              >
                {sent ? "Message noted" : "Send message"}
              </Button>

              <motion.p
                animate={{ opacity: 1 }}
                className="mt-3 text-center text-[11.5px] leading-relaxed text-white/30"
              >
                {sent
                  ? "This demo does not submit anywhere. Wire the form to your own inbox or CRM before launch."
                  : "We reply from a real address. No sequences, no drip campaign."}
              </motion.p>
            </form>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------- pieces -------------------------------- */

function FieldLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35"
    >
      {children}
    </label>
  );
}

function Input({
  label,
  name,
  type = "text",
  placeholder,
  required,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-11 rounded-xl bg-white/[0.03] px-3.5 text-[13.5px] text-white outline-none ring-1 ring-inset ring-white/10 transition-colors placeholder:text-white/25 focus:ring-white/35"
      />
    </div>
  );
}
