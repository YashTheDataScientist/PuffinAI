import React, { useEffect, useRef, useState } from 'react';
import SymptomCard from '../components/SymptomCard';
import SplineRobotViewer from '../components/robot';
import { Card, CardContent } from "@/components/ui/card"; // ✅ shadcn/ui 组件
import { Info } from "lucide-react"; // ✅ 图标（需要 lucide-react）
import './SymptomPage.css';

function RobotInstructionPanel() {
  return (
    <Card className="w-80 shadow-lg bg-white rounded-xl border border-gray-200">
      <CardContent className="flex flex-col items-center p-5 space-y-3">
        <Info className="w-8 h-8 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-800">How to Interact</h2>
        <p className="text-sm text-center text-gray-600">
          Hover over the <span className="text-red-500 font-semibold">red dots</span> on the robot
          to discover allergy symptoms in specific body areas.
        </p>
        <img
          src="/illustrations/hover-guide.svg"
          alt="Interaction Guide"
          className="w-32 h-auto mt-2"
        />
      </CardContent>
    </Card>
  );
}

export default function SymptomPage() {
  const [symptoms, setSymptoms] = useState([]);

  const sectionIntroRef = useRef(null);
  const sectionRobotRef = useRef(null);
  const sectionSymptomRef = useRef(null);

  useEffect(() => {
    fetch('data//allergy_symptoms_detailed_info.json')
      .then((res) => res.json())
      .then((data) => setSymptoms(data))
      .catch((err) => console.error('Failed to load symptoms:', err));
  }, []);

  const scrollToRef = (ref) => {
    const headerOffset = 40;
    const elementPosition = ref.current?.getBoundingClientRect().top;
    const offsetPosition = window.scrollY + elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

  const normalizeSeverity = (s) => {
    if (!s) return '';
    const lower = s.toLowerCase();
    if (lower.includes('severe')) return 'Severe';
    if (lower.includes('moderate')) return 'Moderate';
    return 'Mild';
  };

  const severityOrder = {
    Mild: 1,
    Moderate: 2,
    Severe: 3,
  };

  const normalizedSymptoms = symptoms
    .map((s) => ({
      symptom: s.Symptom,
      description: s.Description_EN,
      severity: normalizeSeverity(s.Severity),
      triggers: s.Triggers_EN || [],
      remedies: s.Remedies_EN || [],
      seeDoctor: s.SeeDoctor_EN || [],
      duration: s.Duration || '',
    }))
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return (
    <div className="full-page-wrapper">
      {/* === Step 0: Intro Section with Stats === */}
      <section className="intro-page" ref={sectionIntroRef}>
        <h1>Understand Common Allergy Symptoms</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-number">4.6M</div>
            <div className="stat-label">Australians suffer from hay fever</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌸</div>
            <div className="stat-number">70%</div>
            <div className="stat-label">Symptoms triggered in spring</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❓</div>
            <div className="stat-number">1 in 5</div>
            <div className="stat-label">Unaware of allergy triggers</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-number">$7.8B</div>
            <div className="stat-label">Annual economic cost</div>
          </div>
        </div>

        <div className="arrow-container" onClick={() => scrollToRef(sectionRobotRef)}>
          <p className="scroll-label">Click to explore symptoms</p>
          <div className="arrow-group">
            {[0, 1, 2].map((delay) => (
              <svg
                key={delay}
                className={`arrow-icon delay-${delay}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="40"
                height="40"
              >
                <polyline
                  points="6 9 12 15 18 9"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ))}
          </div>
        </div>
      </section>

      {/* === Step 0.5: Robot Viewer Section with Instruction === */}
      <section className="robot-viewer-section" ref={sectionRobotRef}>
        <h1 className="robot-section-title fixed-title">
          Allergic Reactions in Different Body Areas
        </h1>
        <div className="flex flex-row gap-10 items-center mt-12">
          <SplineRobotViewer />
          <RobotInstructionPanel />
        </div>
      </section>

      {/* === Step 1: Symptom List Section === */}
      <section className="symptom-page" ref={sectionSymptomRef}>
        <div className="symptom-header">
          <h1>Allergy Symptoms</h1>
        </div>

        <div className="symptom-list">
          {normalizedSymptoms.map((sym, idx) => (
            <SymptomCard key={idx} {...sym} />
          ))}
        </div>
      </section>
    </div>
  );
}
