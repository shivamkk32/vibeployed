import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Home } from "lucide-react";
import { Button, Container } from "../components/ui/Kit";
import { Footer } from "../components/Footer";
import { pageTransition } from "../components/ui/ScrollToTop";
import { useSeo } from "../lib/useSeo";

/**
 * Client-side 404.
 *
 * Firebase serves `public/404.html` with a real 404 status for anything that
 * does not match a rewrite, so most bad URLs never reach React at all. This
 * covers the rest: a path that matches the SPA rewrite but no route. It is
 * marked noindex so a soft 404 cannot end up in search results.
 */
export function NotFound() {
  useSeo({
    title: "Page not found · Vibeployed",
    description: "That page does not exist.",
    noindex: true,
  });

  return (
    <motion.div {...pageTransition} className="relative min-h-screen">
      <Container className="relative flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
        <p className="font-mono text-[13px] tracking-[0.2em] text-white/35">404</p>

        <h1 className="mt-5 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-bold leading-[1.05] tracking-[-0.035em] text-white">
          That page does not exist.
        </h1>

        <p className="mt-5 max-w-md text-pretty text-[15.5px] leading-relaxed text-white/50">
          The link may be out of date, or the address mistyped. Nothing is
          broken on your side.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to="/">
            <Button size="lg" icon={<Home className="h-4 w-4" />}>
              Back to the homepage
            </Button>
          </Link>
          <Link to="/console">
            <Button size="lg" variant="outline" icon={<ArrowRight className="h-4 w-4" />}>
              Try the live demo
            </Button>
          </Link>
        </div>
      </Container>
      <Footer />
    </motion.div>
  );
}
