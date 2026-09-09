import { useState } from "react";
import { motion } from "framer-motion";
import { FileCode2, Layers, MousePointerClick } from "lucide-react";
import {
  ArchitectureDiagram,
  DetailToggle,
  type DiagramDetail,
} from "../ui/ArchitectureDiagram";
import { ContainerScroll } from "../ui/ContainerScroll";
import { Container, Eyebrow } from "../ui/Kit";
import { Reveal } from "../ui/Reveal";

export function Architecture() {
  const [detail, setDetail] = useState<DiagramDetail>("hld");

  return (
    <section id="design" className="relative scroll-mt-24">
      {/* The diagram tilts up out of the page and settles flat as you scroll,
          then behaves as a normal interactive surface. */}
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center gap-5 px-4">
            <Eyebrow>Before anything is created</Eyebrow>
            <h2 className="font-display font-bold text-balance text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.08] tracking-[-0.035em] text-white">
              See the architecture{" "}
              <span className="accent-text">you are about to pay for.</span>
            </h2>
            <p className="max-w-2xl text-pretty text-[15.5px] leading-relaxed text-white/55">
              Vibeployed renders the topology it intends to build. Switch to the
              low-level view for instance classes, scaling bounds, ports and
              storage policy: the detail an architect would actually review.
            </p>
          </div>
        }
      >
        <div className="flex h-full flex-col p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-[11.5px] font-medium text-white/45">
              <Layers className="h-3.5 w-3.5 text-white/70" />
              {detail === "hld"
                ? "High-level design, service topology"
                : "Low-level design, resource specification"}
            </span>
            <DetailToggle value={detail} onChange={setDetail} />
          </div>

          {/* the lattice needs room; let narrow screens pan it */}
          <div className="relative -mx-1 flex-1 overflow-x-auto">
            <div className="min-w-[720px] px-1">
              <ArchitectureDiagram detail={detail} />
            </div>
          </div>
        </div>
      </ContainerScroll>

      <Container className="-mt-16 pb-28 sm:-mt-24 sm:pb-32">
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Layers,
                title: "Two diagrams, one source",
                body: "The HLD and the LLD are projections of the same plan, so they can never drift apart from each other.",
              },
              {
                icon: FileCode2,
                title: "Compiles to real IaC",
                body: "What you approve becomes version-pinned Terraform or Pulumi, yours to export and run without us.",
              },
              {
                icon: MousePointerClick,
                title: "Editable in Manual mode",
                body: "Swap a service, pin a region, change an instance class. Policy and cost re-evaluate as you type.",
              },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl bg-white/[0.025] p-5 ring-hairline"
              >
                <c.icon className="h-4 w-4 text-white/70" />
                <h4 className="mt-3.5 font-ui text-[14px] font-semibold text-white/90">
                  {c.title}
                </h4>
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/45">
                  {c.body}
                </p>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
