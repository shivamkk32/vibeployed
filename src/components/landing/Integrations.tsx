import { BrandLogo, BRANDS, type BrandKey } from "../ui/BrandLogo";
import { Container } from "../ui/Kit";
import { Marquee } from "../ui/Marquee";
import { Reveal } from "../ui/Reveal";

const TOOLS: BrandKey[] = [
  "github",
  "gitlab",
  "bitbucket",
  "docker",
  "kubernetes",
  "terraform",
  "pulumi",
  "postgresql",
  "redis",
  "nextjs",
  "node",
  "django",
  "fastapi",
  "rails",
  "go",
  "spring",
];

export function Integrations() {
  return (
    <section className="relative border-y border-white/[0.07] bg-[oklch(0.165_0_0)] py-12">
      <Container>
        <Reveal>
          <p className="mb-9 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-white/30">
            Reads the stacks you already build on
          </p>
        </Reveal>
      </Container>

      <Marquee speed={52}>
        {TOOLS.map((t) => (
          <span
            key={t}
            className="group flex select-none items-center gap-3 whitespace-nowrap"
          >
            <BrandLogo
              brand={t}
              className="h-7 w-7 shrink-0 opacity-55 transition-opacity duration-500 group-hover:opacity-100 sm:h-8 sm:w-8"
            />
            <span className="font-ui text-[17px] font-medium tracking-[-0.01em] text-white/35 transition-colors duration-500 group-hover:text-white/80 sm:text-[19px]">
              {BRANDS[t].label}
            </span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
