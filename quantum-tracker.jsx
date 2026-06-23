import { useState, useEffect } from 'react';
import { Check, Circle, ExternalLink, ChevronDown, ChevronRight, Atom, BookOpen, Code2, Award, Briefcase, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'qc-roadmap-progress-v1';

const PHASES = [
  {
    id: 'foundations',
    title: 'Foundations',
    sub: 'Months 1–4',
    icon: BookOpen,
    accent: '#5B7FDE',
    items: [
      { id: 'f1', label: 'Linear algebra refresher — complex vector spaces, eigenvalues, unitaries, tensor products', link: null },
      { id: 'f2', label: 'Core concepts: superposition, entanglement, measurement, no-cloning theorem', link: null },
      { id: 'f3', label: 'IBM Quantum Learning — full beginner path', link: 'https://learning.quantum.ibm.com/' },
      { id: 'f4', label: 'Qiskit Textbook — work through alongside concepts', link: 'https://qiskit.org/learn' },
      { id: 'f5', label: 'UChicago "Quantum Computing for Everyone" (edX) — optional warm-up, no cert needed', link: 'https://www.edx.org/' },
      { id: 'f6', label: 'Can explain + implement Deutsch-Jozsa, Grover\'s, and QFT from scratch', link: null },
    ],
  },
  {
    id: 'portfolio',
    title: 'Hands-On & Portfolio',
    sub: 'Months 4–8',
    icon: Code2,
    accent: '#2DAA9E',
    items: [
      { id: 'p1', label: 'Pick a primary SDK to go deep on (Qiskit / Cirq / PennyLane / Q#)', link: null },
      { id: 'p2', label: 'Project: simulate a Bell state', link: null },
      { id: 'p3', label: 'Project: implement Grover\'s search algorithm', link: null },
      { id: 'p4', label: 'Project: VQE for a small molecule (toy chemistry)', link: null },
      { id: 'p5', label: 'Project: QAOA optimizer for a toy logistics/optimization problem', link: null },
      { id: 'p6', label: 'Run at least one circuit on real quantum hardware (not just simulator)', link: null },
      { id: 'p7', label: 'All projects on GitHub with clear READMEs and benchmarks', link: null },
      { id: 'p8', label: 'Microsoft Quantum Katas — for low-level circuit understanding', link: 'https://github.com/microsoft/QuantumKatas' },
    ],
  },
  {
    id: 'specialize',
    title: 'Specialize & Get Visible',
    sub: 'Months 8–14',
    icon: Award,
    accent: '#C4762B',
    items: [
      { id: 's1', label: 'Choose specialization track (algorithms / error correction / hybrid systems / QML / PQC / infrastructure)', link: null },
      { id: 's2', label: 'UC Berkeley — Vazirani\'s "Quantum Mechanics & Quantum Computation" (CS191x) — gold standard for theory depth', link: 'https://www.youtube.com/playlist?list=PLDAjb_zu5aoFazE31_8yT0OfzsTcmvAVg' },
      { id: 's3', label: 'IBM Certified Associate Developer — Quantum Computation using Qiskit', link: 'https://www.ibm.com/training/certification' },
      { id: 's4', label: 'University of Toronto — Quantum Machine Learning (edX), if QML track', link: 'https://www.edx.org/' },
      { id: 's5', label: 'Microsoft Azure Quantum Developer Certification, if hybrid/infra track', link: 'https://learn.microsoft.com/en-us/certifications/' },
      { id: 's6', label: 'One open-source contribution to Qiskit, Cirq, or PennyLane', link: null },
      { id: 's7', label: 'Write 2–3 technical posts explaining what you built', link: null },
      { id: 's8', label: 'Join QED-C, IBM Quantum, or Google Quantum community channels', link: 'https://quantumconsortium.org/' },
    ],
  },
  {
    id: 'apply',
    title: 'Apply Strategically',
    sub: 'Months 12+',
    icon: Briefcase,
    accent: '#A8447A',
    items: [
      { id: 'a1', label: 'Optional capstone credential: Udacity Nanodegree (placement support) or MIT xPro (prestige)', link: null },
      { id: 'a2', label: 'Resume rewritten with specifics, not vague claims (e.g. "implemented and benchmarked X against baseline Y")', link: null },
      { id: 'a3', label: 'Target list built: hybrid roles first (quantum SDK dev, PQC engineer, quantum software eng)', link: null },
      { id: 'a4', label: 'Shortlist of startups (IonQ, Rigetti, Quantinuum, PsiQuantum, PQC startups) for faster-hire first roles', link: null },
      { id: 'a5', label: 'Active on quantum-specific job boards (not just LinkedIn)', link: 'https://quantumjobs.us' },
      { id: 'a6', label: 'First application sent', link: null },
    ],
  },
];

const TOTAL_ITEMS = PHASES.reduce((sum, p) => sum + p.items.length, 0);

export default function QuantumTracker() {
  const [checked, setChecked] = useState({});
  const [expanded, setExpanded] = useState({ foundations: true });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get(STORAGE_KEY);
        if (result?.value) setChecked(JSON.parse(result.value));
      } catch (e) {
        // no saved progress yet
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const persist = async (next) => {
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Could not save progress', e);
    }
  };

  const toggleItem = (id) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    persist(next);
  };

  const togglePhase = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetAll = async () => {
    setChecked({});
    await persist({});
  };

  const doneCount = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((doneCount / TOTAL_ITEMS) * 100);

  if (!loaded) {
    return (
      <div style={{ minHeight: '100vh', background: '#0E1116', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#5B7FDE', fontFamily: 'monospace', fontSize: 14 }}>loading…</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0E1116',
      color: '#E7E9EE',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      paddingBottom: 64,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .item-row:hover { background: rgba(255,255,255,0.03); }
        .link-icon:hover { opacity: 1 !important; }
        ::selection { background: #5B7FDE55; }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: '1px solid #1F242E',
        padding: '40px 24px 32px',
        background: 'radial-gradient(ellipse 800px 300px at 20% 0%, #5B7FDE15, transparent)',
      }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <Atom size={20} color="#5B7FDE" strokeWidth={1.75} />
            <span className="mono" style={{ fontSize: 12, color: '#5B7FDE', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Noob → Pro → Hired
            </span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.01em' }}>
            Quantum Computing Career Roadmap
          </h1>
          <p style={{ color: '#9098A8', fontSize: 15, margin: '0 0 28px', maxWidth: 520, lineHeight: 1.5 }}>
            CS background → quantum job. Four phases, ~12–24 months. Check items off as you go — your progress is saved automatically.
          </p>

          {/* Progress bar */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="mono" style={{ fontSize: 13, color: '#9098A8' }}>{doneCount} / {TOTAL_ITEMS} complete</span>
            <span className="mono" style={{ fontSize: 22, fontWeight: 600, color: '#5B7FDE' }}>{pct}%</span>
          </div>
          <div style={{ height: 6, background: '#1A1E27', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #5B7FDE, #2DAA9E)',
              transition: 'width 0.4s ease',
              borderRadius: 3,
            }} />
          </div>
        </div>
      </div>

      {/* Phases */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 24px 0' }}>
        {PHASES.map((phase, idx) => {
          const Icon = phase.icon;
          const phaseDone = phase.items.filter((i) => checked[i.id]).length;
          const isOpen = expanded[phase.id];

          return (
            <div key={phase.id} style={{ marginBottom: 16 }}>
              <button
                onClick={() => togglePhase(phase.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '16px 18px',
                  background: '#151922',
                  border: '1px solid #232834',
                  borderRadius: 10,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: `${phase.accent}1A`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={17} color={phase.accent} strokeWidth={1.75} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{idx + 1}. {phase.title}</span>
                    <span className="mono" style={{ fontSize: 11, color: '#697184' }}>{phase.sub}</span>
                  </div>
                  <span className="mono" style={{ fontSize: 12, color: phaseDone === phase.items.length ? '#2DAA9E' : '#697184' }}>
                    {phaseDone}/{phase.items.length} done
                  </span>
                </div>
                {isOpen ? <ChevronDown size={18} color="#697184" /> : <ChevronRight size={18} color="#697184" />}
              </button>

              {isOpen && (
                <div style={{
                  border: '1px solid #232834',
                  borderTop: 'none',
                  borderRadius: '0 0 10px 10px',
                  background: '#101319',
                  overflow: 'hidden',
                }}>
                  {phase.items.map((item, i) => {
                    const isChecked = !!checked[item.id];
                    return (
                      <div
                        key={item.id}
                        className="item-row"
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 12,
                          padding: '13px 18px',
                          borderTop: i === 0 ? 'none' : '1px solid #1A1E27',
                          cursor: 'pointer',
                        }}
                        onClick={() => toggleItem(item.id)}
                      >
                        <div style={{ marginTop: 1, flexShrink: 0 }}>
                          {isChecked ? (
                            <div style={{
                              width: 18, height: 18, borderRadius: 5,
                              background: phase.accent, display: 'flex',
                              alignItems: 'center', justifyContent: 'center',
                            }}>
                              <Check size={12} color="#0E1116" strokeWidth={3} />
                            </div>
                          ) : (
                            <div style={{
                              width: 18, height: 18, borderRadius: 5,
                              border: '1.5px solid #353C49',
                            }} />
                          )}
                        </div>
                        <span style={{
                          fontSize: 14,
                          lineHeight: 1.45,
                          color: isChecked ? '#5C6473' : '#D5D8DE',
                          textDecoration: isChecked ? 'line-through' : 'none',
                          flex: 1,
                        }}>
                          {item.label}
                        </span>
                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="link-icon"
                            style={{ opacity: 0.5, marginTop: 2, flexShrink: 0 }}
                          >
                            <ExternalLink size={14} color="#5B7FDE" />
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <button
          onClick={resetAll}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            margin: '24px auto 0',
            padding: '8px 14px',
            background: 'transparent',
            border: '1px solid #232834',
            borderRadius: 8,
            color: '#697184',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={12} />
          Reset progress
        </button>
      </div>
    </div>
  );
}
