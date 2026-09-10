import { useState } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  Clock,
  Loader2,
  Mail,
  Phone,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, XIcon } from "../ui/BrandIcons";
import { CONTACT } from "../../lib/contact";
import { submitContactRequest } from "../../lib/contactStore";
import { Button, Container, SectionHeading } from "../ui/Kit";
import { Reveal, StaggerGroup, StaggerItem } from "../ui/Reveal";
import { cn } from "../../lib/utils";

const CHANNELS = [
  {
    icon: Mail,
    label: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    note: "Sales, support and security, all read by a person",
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

type Status = "idle" | "sending" | "sent" | "demo" | "error";

const EMPTY = { name: "", email: "", company: "", message: "" };

export function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const set = (k: keyof typeof EMPTY, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending" || status === "sent") return;

    setStatus("sending");
    const res = await submitContactRequest(form);

    if (!res.ok) {
      setError(res.error);
      setStatus("error");
      return;
    }
    if (!res.stored) {
      setStatus("demo");
      return;
    }
    setForm(EMPTY);
    setStatus("sent");
  }

  const note =
    status === "sent"
      ? `Thank you. ${CONTACT.responseTime}`
      : status === "demo"
        ? "Saved nowhere yet: this build has no Firebase config, so the form is still in demo mode."
        : status === "error"
          ? `That did not send: ${error}`
          : "We reply from a real address. No sequences, no drip campaign.";

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
              onSubmit={onSubmit}
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
                <Input
                  label="Name"
                  name="name"
                  placeholder="Ada Lovelace"
                  required
                  value={form.name}
                  onChange={(v) => set("name", v)}
                />
                <Input
                  label="Work email"
                  name="email"
                  type="email"
                  placeholder="ada@company.com"
                  required
                  value={form.email}
                  onChange={(v) => set("email", v)}
                />
              </div>
              <div className="mt-3">
                <Input
                  label="Company"
                  name="company"
                  placeholder="Acme Inc."
                  value={form.company}
                  onChange={(v) => set("company", v)}
                />
              </div>
              <div className="mt-3 flex flex-1 flex-col">
                <FieldLabel htmlFor="message">Message</FieldLabel>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder="We run a Django monolith on two EC2 boxes and want it containerised without downtime…"
                  className="min-h-[104px] flex-1 resize-y rounded-xl bg-white/[0.03] px-3.5 py-3 text-[13.5px] text-white outline-none ring-1 ring-inset ring-white/10 transition-colors placeholder:text-white/25 focus:ring-white/35"
                />
              </div>

              <Button
                type="submit"
                className="mt-5 w-full"
                disabled={status === "sending" || status === "sent"}
                icon={
                  status === "sending" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : status === "sent" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )
                }
              >
                {status === "sending"
                  ? "Sending"
                  : status === "sent"
                    ? "Message sent"
                    : "Send message"}
              </Button>

              <p
                className={cn(
                  "mt-3 text-center text-[11.5px] leading-relaxed",
                  status === "error" ? "text-clay-300" : "text-white/30",
                )}
              >
                {note}
              </p>
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
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  value?: string;
  onChange?: (v: string) => void;
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
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-11 rounded-xl bg-white/[0.03] px-3.5 text-[13.5px] text-white outline-none ring-1 ring-inset ring-white/10 transition-colors placeholder:text-white/25 focus:ring-white/35"
      />
    </div>
  );
}
