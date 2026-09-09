import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";
import { FAQ } from "../../lib/data";
import { Container, SectionHeading } from "../ui/Kit";
import { cn } from "../../lib/utils";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative scroll-mt-24 py-28 sm:py-32">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-20">
          <SectionHeading
            align="left"
            eyebrow="Questions"
            title="The things people ask"
            accent="before connecting an account."
            blurb="If something is missing here, ask us directly. We would rather answer it now than have you find out later."
          />

          <div className="flex flex-col">
            {FAQ.map((f, i) => {
              const isOpen = open === i;
              return (
                <motion.div
                  key={f.q}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.55, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-white/[0.07]"
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-start justify-between gap-6 py-5 text-left"
                  >
                    <span
                      className={cn(
                        "text-[15px] font-semibold leading-snug transition-colors duration-300",
                        isOpen ? "text-white" : "text-white/70 group-hover:text-white",
                      )}
                    >
                      {f.q}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full transition-all duration-400",
                        isOpen
                          ? "rotate-45 bg-gradient-to-br from-gold-400 to-gold-300 text-[#0a0a0a]"
                          : "bg-white/[0.06] text-white/50 group-hover:bg-white/[0.11]",
                      )}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 pr-10 text-[14px] leading-relaxed text-white/50">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
