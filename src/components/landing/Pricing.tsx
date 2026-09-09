import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import { PRICING } from "../../lib/data";
import { Button, Container, SectionHeading } from "../ui/Kit";
import { SpotlightCard } from "../ui/Spotlight";
import { cn } from "../../lib/utils";

export function Pricing() {
  return (
    <section id="pricing" className="relative scroll-mt-24 py-28 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Pricing"
          title="Free while it is a side project."
          accent="Priced when it is a business."
          blurb="Audit mode is unmetered on every plan. Checking what you already run should never be the thing you cannot afford."
        />

        <div className="mt-16 grid items-start gap-5 lg:grid-cols-3">
          {PRICING.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.75, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={cn("relative", p.featured && "lg:-mt-5")}
            >
              {p.featured && (
                <div className="absolute -inset-px -z-10 rounded-2xl bg-gradient-to-b from-gold-500/50 via-gold-400/25 to-transparent" />
              )}

              <SpotlightCard
                glow={p.featured ? "229,229,229" : "107,107,107"}
                className="flex h-full flex-col p-7 sm:p-8"
                /* Opaque so the gradient wrapper behind reads as a 1px rim
                   rather than flooding the whole card. */
                style={p.featured ? { background: "#1c1c1c" } : undefined}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display font-bold text-[22px] tracking-[-0.03em] text-white">
                    {p.name}
                  </h3>
                  {p.featured && (
                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gold-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-200 ring-1 ring-inset ring-gold-400/30">
                      <Sparkles className="h-3 w-3" />
                      Most picked
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/45">
                  {p.blurb}
                </p>

                <div className="mt-7 flex items-baseline gap-1.5">
                  {p.price === null ? (
                    <span className="font-display font-bold text-[38px] tracking-[-0.03em] text-white">
                      Custom
                    </span>
                  ) : (
                    <>
                      <span className="font-display font-bold text-[50px] leading-none tracking-[-0.03em] text-white">
                        ${p.price}
                      </span>
                      <span className="text-[13px] text-white/35">/ {p.cadence}</span>
                    </>
                  )}
                </div>
                {p.price === null && (
                  <div className="mt-1 text-[13px] text-white/35">{p.cadence}</div>
                )}

                <ul className="mt-7 flex flex-1 flex-col gap-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span
                        className={cn(
                          "mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full",
                          p.featured ? "bg-gold-400/20" : "bg-white/[0.07]",
                        )}
                      >
                        <Check
                          className={cn(
                            "h-2.5 w-2.5",
                            p.featured ? "text-gold-200" : "text-white/60",
                          )}
                        />
                      </span>
                      <span className="text-[13px] leading-relaxed text-white/55">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link to="/console" className="mt-8 block">
                  <Button
                    className="w-full"
                    variant={p.featured ? "primary" : "outline"}
                  >
                    {p.cta}
                  </Button>
                </Link>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center text-[12.5px] text-white/30">
          Cloud spend is billed by your provider, directly to you. Vibeployed never
          resells infrastructure.
        </p>
      </Container>
    </section>
  );
}
