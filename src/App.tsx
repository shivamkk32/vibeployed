import { AnimatePresence } from "framer-motion";
import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Nav } from "./components/Nav";
import { Landing } from "./pages/Landing";
import { ScrollToTop } from "./components/ui/ScrollToTop";

/*
 * The console is a second app: six step components, the provisioning log and
 * the run state machine. Most visitors never open it, so it is split into its
 * own chunk and fetched on demand. Hosting is billed on bytes served, so this
 * is the difference between every visitor paying for it and only the ones who
 * click through.
 *
 * It is prefetched on hover over any link to it, so by the time someone
 * clicks, the chunk is usually already there.
 */
const Console = lazy(() =>
  import("./pages/Console").then((m) => ({ default: m.Console })),
);

export function prefetchConsole() {
  void import("./pages/Console");
}

/** Holds the page height while the chunk arrives, so the layout does not jump. */
function RouteFallback() {
  return <div className="min-h-screen" aria-busy="true" />;
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
            <Suspense fallback={<RouteFallback />}>
              <Console />
            </Suspense>
          }
        />
        <Route path="*" element={<Landing />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Nav />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
