import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CONTACT } from "../lib/contact";
import { Container } from "../components/ui/Kit";
import { Footer } from "../components/Footer";
import { pageTransition } from "../components/ui/ScrollToTop";
import { useJsonLd, useSeo } from "../lib/useSeo";

/* Last substantive revision. Update when the text changes, not on every deploy. */
const UPDATED = "11 September 2026";

function Shell({
  title,
  path,
  intro,
  children,
}: {
  title: string;
  path: string;
  intro: string;
  children: React.ReactNode;
}) {
  /* Gives search results the "Vibeployed > Privacy policy" trail instead of a
     bare URL. Mirrors the "Back to site" link, which is the only real nesting
     these pages have. */
  useJsonLd("breadcrumb", {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://vibeployed.com/" },
      { "@type": "ListItem", position: 2, name: title, item: `https://vibeployed.com${path}` },
    ],
  });

  return (
    <motion.div {...pageTransition} className="relative min-h-screen">
      <Container className="relative pb-24 pt-36 sm:pt-40">
        <Link
          to="/"
          className="group inline-flex items-center gap-1.5 text-[12.5px] text-white/40 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Back to site
        </Link>

        <h1 className="mt-5 font-display text-[clamp(2rem,4.4vw,3rem)] font-bold tracking-[-0.035em] text-white">
          {title}
        </h1>
        <p className="mt-3 text-[14px] text-white/40">Last updated {UPDATED}</p>
        <p className="mt-6 max-w-2xl text-[15.5px] leading-relaxed text-white/55">
          {intro}
        </p>

        <div className="mt-12 max-w-2xl">{children}</div>
      </Container>
      <Footer />
    </motion.div>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-ui text-[17px] font-semibold text-white">{heading}</h2>
      <div className="mt-3 flex flex-col gap-3 text-[14.5px] leading-relaxed text-white/55">
        {children}
      </div>
    </section>
  );
}

/* ------------------------------- Privacy ------------------------------- */

export function Privacy() {
  useSeo({
    title: "Privacy policy · Vibeployed",
    description:
      "What Vibeployed collects, why, how long it is kept, and how to have it deleted.",
    path: "/privacy",
  });

  return (
    <Shell
      title="Privacy policy"
      path="/privacy"
      intro="Short version: the only personal data we hold is what you type into the contact form. There is no advertising, no tracking across sites, and nothing is sold or shared."
    >
      <Section heading="What we collect">
        <p>
          When you submit the contact form we store the name, email address,
          company and message you entered. Alongside them we record the time of
          submission, the page that referred you, and your browser's user agent
          string, which help us tell genuine enquiries from automated spam.
        </p>
        <p>
          We do not collect payment details, we do not use advertising cookies,
          and we do not track you across other websites.
        </p>
      </Section>

      <Section heading="Storage on your device">
        <p>
          The site stores a single timestamp in your browser's local storage,
          recording when you last submitted the form. It exists only to stop the
          form being submitted repeatedly in quick succession. It never leaves
          your device and is not a cookie.
        </p>
      </Section>

      <Section heading="Where it goes">
        <p>
          Submissions are stored in Google Cloud Firestore, in the United
          States. The site itself is served by Firebase Hosting. Google acts as
          our data processor; their handling is governed by the Google Cloud
          Privacy Notice.
        </p>
        <p>
          Access is restricted to us. The database rules deny all read access
          from browsers, so no visitor can read anyone's submission, including
          their own.
        </p>
      </Section>

      <Section heading="How long we keep it">
        <p>
          Contact form submissions are kept for up to 24 months, then deleted.
          If a message leads to an ongoing business relationship, we may keep it
          for as long as that relationship lasts.
        </p>
      </Section>

      <Section heading="Your rights">
        <p>
          You can ask us for a copy of what we hold about you, ask us to correct
          it, or ask us to delete it. Email{" "}
          <a
            href={`mailto:${CONTACT.email}`}
            className="text-white underline underline-offset-4 hover:text-white/80"
          >
            {CONTACT.email}
          </a>{" "}
          and we will respond within 30 days. You do not need an account, and
          there is no charge.
        </p>
        <p>
          If you are in the UK or EU, you also have the right to complain to
          your local data protection authority.
        </p>
      </Section>

      <Section heading="Changes">
        <p>
          If this policy changes materially we will update the date at the top.
          We will not reduce your rights without telling you.
        </p>
      </Section>

      <Section heading="Contact">
        <p>
          {CONTACT.email}
          <br />
          {CONTACT.addressLine1}, {CONTACT.addressLine2}
        </p>
      </Section>
    </Shell>
  );
}

/* -------------------------------- Terms -------------------------------- */

export function Terms() {
  useSeo({
    title: "Terms and conditions · Vibeployed",
    description:
      "The terms under which the Vibeployed website and interactive demo are provided.",
    path: "/terms",
  });

  return (
    <Shell
      title="Terms and conditions"
      path="/terms"
      intro="These terms cover the use of this website and the interactive demo on it. They are deliberately short."
    >
      <Section heading="The demo is a demo">
        <p>
          The interactive run at <code className="font-mono text-white/70">/console</code>{" "}
          is a simulation. It does not connect to any cloud account, it does not
          read any repository, and it creates no infrastructure. Every figure it
          shows, including the cost estimates, is illustrative and produced by a
          model built for demonstration.
        </p>
        <p>
          Do not rely on those figures for budgeting or architectural decisions.
          Real prices depend on your provider, region and usage.
        </p>
      </Section>

      <Section heading="Accuracy">
        <p>
          We try to keep this site accurate and current, but we make no warranty
          that it is free of errors. Content may change without notice.
        </p>
      </Section>

      <Section heading="Acceptable use">
        <p>
          Please do not attempt to disrupt the site, submit automated or
          abusive traffic through the contact form, or use it to send unlawful
          content. We may block access where necessary to keep the service
          working for everyone.
        </p>
      </Section>

      <Section heading="Liability">
        <p>
          The site is provided as is. To the extent permitted by law we are not
          liable for any loss arising from its use, including decisions made on
          the basis of the demo or its estimates. Nothing here limits liability
          that cannot lawfully be limited.
        </p>
      </Section>

      <Section heading="Intellectual property">
        <p>
          The Vibeployed name, logo and site content belong to us. Third-party
          names and logos shown on this site, such as those of cloud providers
          and developer tools, are the trademarks of their respective owners and
          are used only to identify those products.
        </p>
      </Section>

      <Section heading="Contact">
        <p>
          Questions about these terms:{" "}
          <a
            href={`mailto:${CONTACT.email}`}
            className="text-white underline underline-offset-4 hover:text-white/80"
          >
            {CONTACT.email}
          </a>
        </p>
      </Section>
    </Shell>
  );
}
