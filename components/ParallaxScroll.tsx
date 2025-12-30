
import { useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

export const ParallaxScroll = ({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) => {
  const gridRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start end", "end start"],
  });

  // Optimized spring physics for ultra-smooth, weightier scrolling
  const smoothProgress = useSpring(scrollYProgress, {
      stiffness: 50,
      damping: 30,
      mass: 0.5,
      restDelta: 0.001
  });

  const translateFirst = useTransform(smoothProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(smoothProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(smoothProgress, [0, 1], [0, -200]);

  const third = Math.ceil(images.length / 3);

  const firstPart = images.slice(0, third);
  const secondPart = images.slice(third, 2 * third);
  const thirdPart = images.slice(2 * third);

  return (
    <div
      className={cn("items-start w-full overflow-hidden antialiased", className)}
      ref={gridRef}
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 items-start max-w-7xl mx-auto gap-3 md:gap-10 pt-10 pb-0 px-4 md:px-6">
        <div className="grid gap-3 md:gap-10">
          {firstPart.map((el, idx) => (
            <motion.div
              style={{ y: translateFirst }}
              key={"grid-1" + idx}
              className="will-change-transform"
            >
              <img
                src={el}
                className="h-64 md:h-96 w-full object-cover object-center rounded-lg shadow-sm"
                height="400"
                width="400"
                alt="Crafting Detail"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-3 md:gap-10">
          {secondPart.map((el, idx) => (
            <motion.div style={{ y: translateSecond }} key={"grid-2" + idx} className="will-change-transform">
              <img
                src={el}
                className="h-64 md:h-96 w-full object-cover object-center rounded-lg shadow-sm"
                height="400"
                width="400"
                alt="Crafting Detail"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
        <div className="hidden lg:grid gap-3 md:gap-10">
          {thirdPart.map((el, idx) => (
            <motion.div style={{ y: translateThird }} key={"grid-3" + idx} className="will-change-transform">
              <img
                src={el}
                className="h-96 w-full object-cover object-center rounded-lg shadow-sm"
                height="400"
                width="400"
                alt="Crafting Detail"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
