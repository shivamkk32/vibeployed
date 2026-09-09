import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown } from "lucide-react";
import { GUARDRAILS } from "../../lib/data";
import { AnimatedNumber } from "../ui/AnimatedNumber";
import { Container, SectionHeading } from "../ui/Kit";
import { SpotlightCard } from "../ui/Spotlight";
import { Reveal, StaggerGroup, StaggerItem } from "../ui/Reveal";

const STATS = [
  { value: 0, suffix: "", label: "Long-lived cloud keys stored", accent: "#bdbdbd" },
  { value: 40, suffix: "+", label: "Policy checks run per plan", accent: "#e5e5e5" },
  { value: 2, suffix: "", label: "Approval gates before apply", accent: "#f5f5f5" },
  { value: 1, suffix: "-click", label: "Rollback to last known good", accent: "#9e9e9e" },
];

export function Security() {
  return (
    <section id="security" className="relative scroll-mt-24 py-28 sm:py-32">
      {/* section wash */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/4 h-[30rem]"
        style={{
          background:
            "radial-gradient(45% 50% at 50% 50%, rgba(189,189,189,0.09), transparent 70%)",
        }}
      />

      <Container className="relative">
        <SectionHeading
          eyebrow="Guardrails"
          title="The two things that actually go wrong:"
          accent="a breach, or the bill."
          blurb="Most deployment tools optimise for speed and hand you the consequences. Vibeployed treats the security posture and the monthly cost as part of the build output, not as something you discover afterwards."
        />

        {/* the two failure modes, stated plainly */}
        <div className="mt-14 grid gap-4 lg:grid-cols-2">
          <FailureCard
            icon={AlertTriangle}
            tone="rose"
            title="A misconfiguration nobody reviewed"
            body="A bucket left public. A database on an open port. A role with a wildcard on it. None of these look urgent until they are the incident."
            fix="Every plan is checked against the policy pack before it can be applied, and the violations are shown inline with the fix already written."
          />
          <FailureCard
            icon={TrendingDown}
            tone="amber"
            title="A bill nobody saw coming"
            body="An autoscaler without a ceiling. A test environment left running since March. Egress from a chatty service that was never measured."
            fix="Cost is estimated line by line before apply, ceilings are enforced at creation, and idle resources are surfaced continuously, not at the end of the month."
          />
        </div>

        {/* guardrail grid */}
        <StaggerGroup className="mt-4 grid gap-4 sm:grid-cols-2">
          {GUARDRAILS.map((g) => (
            <StaggerItem key={g.title}>
              <SpotlightCard glow={g.rgb} className="h-full p-6 sm:p-7">
                <div
                  className="grid h-10 w-10 place-items-center rounded-xl"
                  style={{
                    background: `rgba(${g.rgb},0.12)`,
                    boxShadow: `inset 0 0 0 1px rgba(${g.rgb},0.28)`,
                  }}
                >
                  <g.icon className="h-4.5 w-4.5" style={{ color: g.accent }} />
                </div>
                <h3 className="mt-5 font-ui text-[16.5px] font-semibold tracking-[-0.01em] text-white">
                  {g.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-white/50">
                  {g.body}
                </p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {/* stat strip */}
        <Reveal delay={0.1} className="mt-4">
          <div className="glass grid grid-cols-2 gap-px overflow-hidden rounded-2xl lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="px-6 py-7 text-center">
                <div
                  className="font-display font-bold text-[40px] leading-none tracking-[-0.03em]"
                  style={{ color: s.accent }}
                >
                  <AnimatedNumber value={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-2.5 text-[12px] leading-snug text-white/40">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function FailureCard({
  icon: Icon,
  tone,
  title,
  body,
  fix,
}: {
  icon: typeof AlertTriangle;
  tone: "rose" | "amber";
  title: string;
  body: string;
  fix: string;
}) {
  const rgb = tone === "rose" ? "242,109,109" : "158,158,158";
  const accent = tone === "rose" ? "#f26d6d" : "#9e9e9e";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="glass relative overflow-hidden rounded-2xl p-7 sm:p-8"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full"
        style={{ background: `radial-gradient(circle, rgba(${rgb},0.18), transparent 70%)` }}
      />
      <div className="relative">
        <Icon className="h-5 w-5" style={{ color: accent }} />
        <h3 className="mt-5 font-display font-bold text-[21px] tracking-[-0.03em] text-white">
          {title}
        </h3>
        <p className="mt-2.5 text-[14px] leading-relaxed text-white/45">{body}</p>

        <div
          className="mt-5 rounded-xl px-4 py-3.5"
          style={{
            background: `rgba(${rgb},0.06)`,
            boxShadow: `inset 0 0 0 1px rgba(${rgb},0.18)`,
          }}
        >
          <div
            className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: accent }}
          >
            What Vibeployed does
          </div>
          <p className="text-[13px] leading-relaxed text-white/60">{fix}</p>
        </div>
      </div>
    </motion.div>
  );
}
