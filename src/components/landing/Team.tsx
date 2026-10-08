import { Container, SectionHeading } from "../ui/Kit";
import { LinkedinIcon } from "../ui/BrandIcons";
import { Reveal, StaggerGroup, StaggerItem } from "../ui/Reveal";

/*
 * Photos are the originals from hackstrut.com, 800x800, unmodified. They are
 * the largest raster assets on the page after the logo, so both are lazy
 * loaded with explicit dimensions to keep them out of the first paint and
 * stop the grid reflowing as they arrive.
 */
const TEAM = [
  {
    name: "Francis Cordor",
    role: "CEO",
    affiliation: "Founder, Francordsoft",
    photo: "/team/francis-cordor.jpg",
    linkedin: "https://www.linkedin.com/in/francis-cordor-96a40338",
  },
  {
    name: "Shivam R",
    role: "Founder and CTO",
    affiliation: "Engineering and AI",
    photo: "/team/shivam-r.jpg",
    linkedin: null,
  },
];

export function Team() {
  return (
    <section id="team" className="relative scroll-mt-24 py-28 sm:py-32">
      {/* Plain radial gradient, not a blurred div. Blur filters promote a
          permanent compositing layer and were the cause of the scroll cost
          measured earlier. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-1/3 h-[26rem]"
        style={{
          background:
            "radial-gradient(42% 48% at 50% 50%, rgba(229,229,229,0.07), transparent 70%)",
        }}
      />

      <Container className="relative">
        <SectionHeading
          eyebrow="Team"
          title="The people building it,"
          accent="and answering your email."
          blurb="A small team that has run this problem from both sides: the deployment that has to ship, and the bill that arrives afterwards."
        />

        <StaggerGroup className="mx-auto mt-14 grid max-w-3xl gap-4 sm:grid-cols-2">
          {TEAM.map((m) => (
            <StaggerItem key={m.name}>
              <article className="group h-full overflow-hidden rounded-2xl bg-white/[0.025] ring-hairline">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={m.photo}
                    alt={`Portrait of ${m.name}`}
                    width={800}
                    height={800}
                    loading="lazy"
                    decoding="async"
                    /* Rests slightly desaturated so the cards sit inside the
                       greyscale palette, and comes up to full colour on hover. */
                    className="h-full w-full object-cover object-center grayscale-[0.65] transition-[filter,transform] duration-500 group-hover:scale-[1.02] group-hover:grayscale-0"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[oklch(0.145_0_0)] via-transparent to-transparent" />
                </div>

                <div className="flex items-start justify-between gap-4 p-5 sm:p-6">
                  <div className="min-w-0">
                    <h3 className="font-ui text-[16px] font-semibold tracking-[-0.01em] text-white">
                      {m.name}
                    </h3>
                    <p className="mt-1 text-[13px] font-medium text-white/70">{m.role}</p>
                    <p className="mt-0.5 text-[12.5px] text-white/40">{m.affiliation}</p>
                  </div>

                  {m.linkedin && (
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${m.name} on LinkedIn`}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white/40 transition-colors duration-300 hover:bg-white/[0.07] hover:text-white"
                    >
                      <LinkedinIcon className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-8 max-w-md text-center text-[13px] leading-relaxed text-white/35">
            Every message through the contact form reaches one of us directly.
            There is no support queue in between.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
