import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "./SectionDivider.css";

const SectionDivider = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className="section-divider"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1 }}
    />
  );
};

export default SectionDivider;
