import React from 'react';

export const ProblemSolution: React.FC = () => {
  return (
    <section id="problem-solution" className="py-16 md:py-20 border-b border-rule bg-paper">
      <div className="academic-container">
        {/* Section Masthead */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-body text-muted mb-2">
            Section 02 · Pedagogical Foundations
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink">
            Bridging the Quantum Abstraction Barrier
          </h2>
          <p className="mt-3 text-muted font-body text-base leading-relaxed">
            Quantum mechanics is governed by linear algebra in complex Hilbert spaces. Traditional instructional methods rely heavily on static symbols, obscuring the physical intuition of quantum interference and entanglement.
          </p>
        </div>

        {/* 2-Column Academic Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Column 1: Traditional Limitations */}
          <div className="p-6 rounded-sm bg-sheet border border-rule shadow-sm">
            <div className="border-b border-rule pb-3 mb-5">
              <h3 className="font-display font-semibold text-lg text-ink">The Classical Pedagogical Barrier</h3>
              <span className="text-xs font-body text-muted">Limitations of static textbook instruction</span>
            </div>

            <div className="space-y-4 text-sm font-body text-ink-2">
              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-muted mt-2 shrink-0" aria-hidden="true" />
                <p>
                  <strong className="text-ink">Abstract Mathematical Formalism:</strong> Superposition, tensor products of state spaces, and phase kickback are difficult to conceptualize without immediate visual statevector feedback.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-muted mt-2 shrink-0" aria-hidden="true" />
                <p>
                  <strong className="text-ink">Hardware Access Scarcity:</strong> Physical cryogenic quantum processors and enterprise cloud queues present prohibitive cost and latency barriers for university classrooms and independent researchers.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-muted mt-2 shrink-0" aria-hidden="true" />
                <p>
                  <strong className="text-ink">Disconnection from Physical Frameworks:</strong> Students struggle to bridge the gap between abstract matrix operators and executable code in industry frameworks like Qiskit, Cirq, and PennyLane.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-muted mt-2 shrink-0" aria-hidden="true" />
                <p>
                  <strong className="text-ink">Error Detection Deficit:</strong> Non-unitary gate placements, phase errors, and circuit depth inefficiencies often go unnoticed without automated mathematical diagnostics.
                </p>
              </div>
            </div>
          </div>

          {/* Column 2: The Laboratory Method */}
          <div className="p-6 rounded-sm bg-sheet border border-rule shadow-sm">
            <div className="border-b border-rule pb-3 mb-5">
              <h3 className="font-display font-semibold text-lg text-ink">The Interactive Laboratory Method</h3>
              <span className="text-xs font-body text-muted">Empirical experimentation and continuous state telemetry</span>
            </div>

            <div className="space-y-4 text-sm font-body text-ink-2">
              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" aria-hidden="true" />
                <p>
                  <strong className="text-ink">Dual-Mode Circuit Synthesis:</strong> Assemble quantum circuits visually on a wire canvas with continuous bidirectional synchronization to Qiskit, Cirq, PennyLane, and OpenQASM 3.0.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" aria-hidden="true" />
                <p>
                  <strong className="text-ink">Real-Time Multi-Backend Execution:</strong> Zero-installation execution across four simulation engines, validating statevector fidelity and shot measurement statistics.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" aria-hidden="true" />
                <p>
                  <strong className="text-ink">Geometric & Algebraic Projection:</strong> 3D Bloch sphere projections, Dirac notation expansions, and phase disk representations make quantum kinematics immediately apparent.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" aria-hidden="true" />
                <p>
                  <strong className="text-ink">Rigorous Formalism Guidance:</strong> Automated checks for non-unitary operations, circuit depth optimization hints, and step-by-step conceptual explanations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Spec Box */}
        <div className="p-6 rounded-sm bg-paper-2 border border-rule">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-xl font-semibold text-ink">
                Curricular alignment with standard quantum physics curricula
              </h3>
              <p className="mt-2 text-ink-2 font-body text-sm max-w-2xl leading-relaxed">
                Designed to support undergraduate and graduate quantum information courses, research group workshops, and laboratory coursework with reproducible computational environments.
              </p>
            </div>
            <div className="shrink-0 flex flex-wrap items-center gap-2">
              <code className="px-2.5 py-1 bg-sheet border border-rule text-ink text-xs font-mono">
                OpenQASM 3.0
              </code>
              <code className="px-2.5 py-1 bg-sheet border border-rule text-ink text-xs font-mono">
                Qiskit 2.5
              </code>
              <code className="px-2.5 py-1 bg-sheet border border-rule text-ink text-xs font-mono">
                Cirq 1.7
              </code>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
