import React from 'react';

interface HeroProps {
  onNavigate?: (view: 'home' | 'auth' | 'courses' | 'designer') => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-12 pb-16 md:pt-16 md:pb-20 border-b border-rule bg-paper">
      <div className="academic-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Heading, Statement, and Direct Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="mb-4">
              <span className="text-xs font-body text-muted border-b border-rule pb-1">
                Instructional computing division, coursework and research
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink leading-[1.08] max-w-xl">
              An Open Laboratory for Quantum Algorithms
            </h1>

            <p className="mt-5 text-base sm:text-lg text-muted font-body leading-relaxed max-w-lg">
              Interactive circuit design, multi-backend simulation, and Dirac state visualization for university study.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('designer');
                  } else {
                    scrollTo('circuit-demo');
                  }
                }}
                className="px-5 py-2.5 rounded-sm font-body font-semibold text-accent-ink bg-accent hover:opacity-90 active:opacity-95 focus-visible:outline-2 focus-visible:outline-focus transition-opacity cursor-pointer"
              >
                Launch Laboratory
              </button>

              <button
                onClick={() => scrollTo('curriculum')}
                className="px-5 py-2.5 rounded-sm font-body font-medium text-ink bg-sheet hover:bg-paper-2 active:bg-paper-3 border border-rule focus-visible:outline-2 focus-visible:outline-focus transition-colors cursor-pointer"
              >
                Review Curriculum
              </button>

              <button
                onClick={() => scrollTo('problem-solution')}
                className="px-4 py-2.5 rounded-sm font-body font-medium text-muted hover:text-ink active:text-ink focus-visible:outline-2 focus-visible:outline-focus transition-colors cursor-pointer"
              >
                Syllabus Notes
              </button>
            </div>

            {/* Academic Spec Line */}
            <div className="mt-10 pt-6 border-t border-rule grid grid-cols-3 gap-4 text-xs font-body text-muted">
              <div>
                <span className="block text-ink font-semibold">4 Execution engines</span>
                <span>Qiskit, Cirq, PennyLane, qBraid</span>
              </div>
              <div>
                <span className="block text-ink font-semibold">Dirac notation</span>
                <span>Exact statevector extraction</span>
              </div>
              <div>
                <span className="block text-ink font-semibold">6 Course units</span>
                <span>Undergraduate to advanced</span>
              </div>
            </div>
          </div>

          {/* Right Column: Signature Quantum State Monitor */}
          <div className="lg:col-span-5 border border-rule-2 bg-sheet p-5 rounded-sm shadow-sm">
            <div className="flex items-center justify-between border-b border-rule pb-3 mb-4">
              <div>
                <div className="text-xs font-body font-semibold text-ink">Reference state: Bell pair</div>
                <div className="text-xs text-muted font-mono mt-0.5">|Φ⁺⟩ = 1/√2 (|00⟩ + |11⟩)</div>
              </div>
              <span className="text-xs font-body bg-paper-2 px-2 py-0.5 border border-rule text-ink">
                Fidelity <span className="font-mono num">1.000</span>
              </span>
            </div>

            {/* Dirac Bra-Ket Statevector Breakdown */}
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-muted mb-1 font-body">
                  <span className="font-mono">|00⟩</span>
                  <span>Probability: <span className="font-mono num text-ink font-semibold">0.500 (50.0%)</span></span>
                </div>
                <div className="w-full bg-paper-2 h-2.5 rounded-none overflow-hidden border border-rule">
                  <div className="bg-navy h-full w-1/2" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-muted mb-1 font-body">
                  <span className="font-mono">|01⟩</span>
                  <span>Probability: <span className="font-mono num">0.000 (0.0%)</span></span>
                </div>
                <div className="w-full bg-paper-2 h-2.5 rounded-none overflow-hidden border border-rule">
                  <div className="bg-navy h-full w-0" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-muted mb-1 font-body">
                  <span className="font-mono">|10⟩</span>
                  <span>Probability: <span className="font-mono num">0.000 (0.0%)</span></span>
                </div>
                <div className="w-full bg-paper-2 h-2.5 rounded-none overflow-hidden border border-rule">
                  <div className="bg-navy h-full w-0" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-muted mb-1 font-body">
                  <span className="font-mono">|11⟩</span>
                  <span>Probability: <span className="font-mono num text-ink font-semibold">0.500 (50.0%)</span></span>
                </div>
                <div className="w-full bg-paper-2 h-2.5 rounded-none overflow-hidden border border-rule">
                  <div className="bg-navy h-full w-1/2" />
                </div>
              </div>
            </div>

            {/* Backend Verification Register */}
            <div className="mt-4 pt-4 border-t border-rule">
              <div className="text-xs font-body text-muted mb-2">
                Simultaneous target verification
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-body">
                <div className="p-1.5 bg-paper-2 border border-rule">
                  <div className="text-ink font-semibold">Qiskit Aer</div>
                  <div className="text-[10px] text-muted font-mono num">0.14 ms</div>
                </div>
                <div className="p-1.5 bg-paper-2 border border-rule">
                  <div className="text-ink font-semibold">Cirq v1.7</div>
                  <div className="text-[10px] text-muted font-mono num">0.18 ms</div>
                </div>
                <div className="p-1.5 bg-paper-2 border border-rule">
                  <div className="text-ink font-semibold">PennyLane</div>
                  <div className="text-[10px] text-muted font-mono num">0.22 ms</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
