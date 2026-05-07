import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%<>";

const rand = () => CHARS[Math.floor(Math.random() * CHARS.length)];

const ScrambleText = ({ text, className }: { text: string; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(() =>
    text.split("").map((c) => (c === " " ? " " : rand())).join("")
  );
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const duration = 250;
    const start = performance.now();
    const chars = text.split("");
    const len = chars.length;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const locked = Math.floor(progress * len);
      setDisplay(
        chars.map((c, i) => {
          if (c === " ") return " ";
          return i < locked ? c : rand();
        }).join("")
      );
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, text]);

  return <span ref={ref} className={className}>{display}</span>;
};

export default ScrambleText;
