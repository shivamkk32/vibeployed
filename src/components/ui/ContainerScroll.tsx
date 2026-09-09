import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

/**
 * Scroll-driven 3D reveal: the card starts tilted away from the viewer and
 * rotates flat as the section scrolls through, while the heading above it
 * drifts up. Once flat the card is a normal, fully interactive surface.
 *
 * Adapted from Aceternity UI's container-scroll-animation for this codebase:
 * plain Vite/React (no next/image, no "@/" alias) and the Graphite Mono
 * surfaces instead of the original hard-coded greys.
 */
export const ContainerScroll = ({
  titleComponent,
  children,
  className,
}: {
  titleComponent: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [0.8, 0.95] : [1.04, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      ref={containerRef}
      className={`relative flex h-[52rem] items-center justify-center p-2 md:h-[68rem] md:p-16 ${className ?? ""}`}
    >
      <div className="relative w-full py-10 md:py-28" style={{ perspective: "1000px" }}>
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: React.ReactNode;
}) => (
  <motion.div style={{ translateY: translate }} className="mx-auto max-w-5xl text-center">
    {titleComponent}
  </motion.div>
);

const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
}) => (
  <motion.div
    style={{
      rotateX: rotate,
      scale,
      boxShadow: "0 24px 48px -16px #00000066, 0 80px 90px -40px #00000040",
      willChange: "transform",
    }}
    className="mx-auto -mt-10 h-[26rem] w-full max-w-5xl rounded-[30px] border-2 border-[oklch(0.371_0_0)] bg-[oklch(0.235_0_0)] p-2 md:h-[36rem] md:p-4"
  >
    <div className="h-full w-full overflow-hidden rounded-2xl bg-[oklch(0.165_0_0)] md:rounded-2xl">
      {children}
    </div>
  </motion.div>
);
