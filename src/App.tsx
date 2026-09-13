import { AnimatePresence } from "framer-motion";
import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Nav } from "./components/Nav";
import { Landing } from "./pages/Landing";
import { NotFound } from "./pages/NotFound";
import { ScrollToTop } from "./components/ui/ScrollToTop";

/*
 * The console is a second app: six step components, the provisioning log and
 * the run state machine. Most visitors never open it, so it is split into its
 * own chunk and fetched on demand. Hosting is billed on bytes served, so this
 * is the difference between every visitor paying for it and only the ones who
 * click through.
 */
const Console = lazy(() =>
  import("./pages/Console").then((m) => ({ default: m.Console })),
);

/* Legal pages are rarely read and share a chunk of their own. */
const Privacy = lazy(() =>
  import("./pages/Legal").then((m) => ({ default: m.Privacy })),
);
const Terms = lazy(() =>
  import("./pages/Legal").then((m) => ({ default: m.Terms })),
);

export function prefetchConsole() {
  void import("./pages/Console");
}

/** Holds the page height while the chunk arrives, so the layout does not jump. */
function RouteFallback() {
  return <div className="min-h-screen" aria-busy="true" />;
}

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route
          path="/console"
          element={
            <Lazy>
              <Console />
            </Lazy>
          }
        />
        <Route
          path="/privacy"
          element={
            <Lazy>
              <Privacy />
            </Lazy>
          }
        />
        <Route
          path="/terms"
          element={
            <Lazy>
              <Terms />
            </Lazy>
          }
        />
        {/* Unknown paths normally hit Firebase's 404.html with a real 404
            status. This catches anything that slips past the rewrite rules. */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      {/* Keyboard and screen reader users land on the header first and would
          otherwise tab through every nav link on every route before reaching
          the page. Visually hidden until focused. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2.5 focus:text-[13.5px] focus:font-semibold focus:text-[oklch(0.165_0_0)]"
      >
        Skip to content
      </a>
      <Nav />
      <div id="main" tabIndex={-1} className="outline-none">
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
}
