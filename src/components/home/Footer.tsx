import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-paper border-t border-rule py-12 text-sm text-ink-2">
      <div className="academic-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Lab Masthead */}
          <div className="md:col-span-1">
            <div className="mb-3">
              <span className="font-display font-semibold text-lg text-ink tracking-tight">
                QUALGO
              </span>
              <span className="block text-xs text-muted">
                Quantum Algorithm Laboratory
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Open interactive computing environment and instructional platform for quantum algorithms, statevector simulation, and linear algebra foundations.
            </p>
            <p className="mt-3 text-xs text-muted">
              Division of Quantum Education · Egreen Quanta
            </p>
          </div>

          {/* Col 2: Simulation Engines */}
          <div>
            <h4 className="font-display font-semibold text-xs text-ink mb-3 tracking-normal">
              Simulation Backends
            </h4>
            <ul className="space-y-1.5 text-xs text-muted">
              <li>Qiskit Aer Statevector Engine</li>
              <li>Google Cirq Architecture</li>
              <li>Xanadu PennyLane Differentiable</li>
              <li>OpenQASM 3.0 Intermediate Rep</li>
              <li>Wasm Local Micro-Simulators</li>
            </ul>
          </div>

          {/* Col 3: Instructional Modules */}
          <div>
            <h4 className="font-display font-semibold text-xs text-ink mb-3 tracking-normal">
              Instructional Tracks
            </h4>
            <ul className="space-y-1.5 text-xs text-muted">
              <li>Module 01 · Mathematical Foundations</li>
              <li>Module 02 · Single-Qubit Systems</li>
              <li>Module 03 · Entanglement Formalisms</li>
              <li>Module 04 · Grover Search & Factoring</li>
              <li>Module 05 · Variational Algorithms</li>
            </ul>
          </div>

          {/* Col 4: Reference Resources */}
          <div>
            <h4 className="font-display font-semibold text-xs text-ink mb-3 tracking-normal">
              Reference Courseware
            </h4>
            <ul className="space-y-1.5 text-xs text-muted">
              <li>Course Syllabus & Notes</li>
              <li>Benchmark Algorithmic Circuits</li>
              <li>Interactive Dirac State Studio</li>
              <li>System Milestone Register</li>
              <li>Python & Qiskit Sandboxes</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-muted">
          <div>
            <span>© 2026 QUALGO · Quantum Algorithm Laboratory. Released under open academic educational license.</span>
          </div>
          <nav className="flex flex-wrap items-center gap-4 sm:gap-6" aria-label="Legal and citation links">
            <a
              href="#metadata"
              className="text-muted hover:text-ink active:text-ink transition-colors focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
            >
              Academic Colophon
            </a>
            <a
              href="#curriculum"
              className="text-muted hover:text-ink active:text-ink transition-colors focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
            >
              Syllabus Guidelines
            </a>
            <a
              href="#deliverables"
              className="text-muted hover:text-ink active:text-ink transition-colors focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
            >
              System Specifications
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};
