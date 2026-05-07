import { useRef } from "react";
import type { ReactNode, MouseEvent } from "react";
import "./TiltCard.css";

interface Props {
  children: ReactNode;
  className?: string;
}

const TiltCard = ({ children, className = "" }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateX(${(y - 0.5) * -4}deg) rotateY(${(x - 0.5) * 4}deg) translateZ(4px)`;
  };

  const onMouseLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      className={`tilt-wrap${className ? ` ${className}` : ""}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  );
};

export default TiltCard;
