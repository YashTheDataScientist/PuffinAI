
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "./SectionPollenIntro.css";
import sectionBg from "../assets/section1bg.png";
import pollenImg from "../assets/pollen.png";

const SectionPollenIntro = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const pollenArray = Array.from({ length: 15 });

  return (
    <section className="pollen-section" ref={ref}>
      <img src={sectionBg} alt="Background" className="section-bg" />

      {/* Floating pollen particles */}
      {pollenArray.map((_, index) => (
        <img
          key={index}
          src={pollenImg}
          alt="Pollen"
          className={`pollen pollen-${index + 1} ${inView ? "float" : ""}`}
        />
      ))}

      {/* Main pollen appears with delay */}
      {/* {inView && (
        <motion.img
          src={pollenImg}
          alt="Main Pollen"
          className="main-pollen"
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.2 }}
        />
      )} */}

      {/* Text with background */}
      <div className="pollen-text">
        <motion.div
          className="text-box"
          initial={{ x: -300, opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 1.5, delay: 1 }}
        >
          <h2>What is Pollen?</h2>
          <p>
            Pollen is a microscopic powder made by plants — especially grasses, trees, and flowers —
            as part of their reproductive process. It may be tiny, but it plays a huge role in seasonal allergies.
            Pollen grains are so light that they float through the air, often travelling long distances on the wind.
            <br /><br />
            Even though we can’t see them, they’re everywhere during spring. And for millions of people,
            these tiny particles can cause sneezing, itchy eyes, and breathing issues.
          </p>
        </motion.div>
      </div>

        
        <div className="down-arrow">
          <span>↓</span>
        </div>

    </section>
  );
};

export default SectionPollenIntro;
