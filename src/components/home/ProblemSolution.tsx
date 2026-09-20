import React from 'react';

export const ProblemSolution: React.FC = () => {
  return (
    <section id="problem-solution" className="py-20 border-b border-white/10 bg-[#07090e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-400 mb-3">
            <span>TRANSFORMATIVE TECHNOLOGY • WORKFORCE ACCELERATION</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Bridging the Quantum Education Gap
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Quantum computing is revolutionizing cryptography, materials science, and optimization. 
            Yet, foundational education has been blocked by theoretical abstractions and hardware scarcity.
          </p>
        </div>

        {/* 2-Column Comparison: The Hurdle vs The Platform Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Card 1: Traditional Limitations */}
          <div className="p-8 rounded-2xl bg-rose-950/10 border border-rose-500/20 backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-white">The Educational Bottleneck</h3>
                <span className="text-xs font-mono text-rose-400">Current Barriers & Static Materials</span>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                <p>
                  <strong className="text-white">Abstract Conceptual Hurdles:</strong> Core concepts like qubits, 
                  Hilbert spaces, superposition, entanglement, and phase interference are mathematically intimidating without immediate visual feedback.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                <p>
                  <strong className="text-white">Static & Dry Resources:</strong> Existing textbooks and slide decks are 
                  passive, heavily symbolic, and lack tactile experimentation or live interactive exploration.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                <p>
                  <strong className="text-white">Inaccessible Physical Hardware:</strong> Cryogenic QPUs and enterprise cloud queues 
                  are expensive and inaccessible for university classrooms, beginners, and self-directed learners.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0"></span>
                <p>
                  <strong className="text-white">High Dropout Rates:</strong> Without individualized scaffolding and intelligent debugging, 
                  students frequently get trapped on basic matrix calculations and quantum gate algebra.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: The Qual Solution */}
          <div className="p-8 rounded-2xl bg-cyan-950/15 border border-cyan-500/30 backdrop-blur-md relative overflow-hidden shadow-lg shadow-cyan-950/40">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-white">The Qual.dev Integrated Solution</h3>
                <span className="text-xs font-mono text-cyan-400">Interactive • Intelligent • Hands-On</span>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-200">
              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
                <p>
                  <strong className="text-white">Dual-Mode Circuit Creation:</strong> Assemble quantum circuits 
                  effortlessly with visual drag-and-drop or code directly in synchronized Python (Qiskit, PennyLane, Cirq).
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
                <p>
                  <strong className="text-white">Real-Time Multi-Backend Simulation:</strong> Zero-setup execution 
                  across Qiskit Aer, Cirq, PennyLane, and qBraid simulators with instant measurement histogram feedback.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
                <p>
                  <strong className="text-white">Personalized AI Tutoring:</strong> Context-aware AI copilot explains 
                  quantum gate mechanics, detects unitary violations, debugs circuits, and generates step-by-step mathematical proofs.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
                <p>
                  <strong className="text-white">Intuitive Multi-Dimensional Visualization:</strong> Live Bloch spheres, 
                  statevectors, probability amplitudes, and Dirac bra-ket notations reveal quantum phenomena at a glance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Expected Solution Callout */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0a101d] to-slate-900 border border-slate-700/80">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">Expected Solution</span>
              <h3 className="font-heading text-2xl font-bold text-white mt-1">
                A Unified Gateway for the Quantum Workforce
              </h3>
              <p className="mt-2 text-slate-300 text-sm max-w-3xl leading-relaxed">
                A comprehensive AI-based interactive quantum learning platform that seamlessly integrates education, 
                programming, simulation, visualization, and intelligent tutoring. Designed for scalability, accessibility, 
                and institutional adoption in university curricula and industrial reskilling programs.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <span className="px-3 py-1.5 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono rounded-lg">
                Scalable Web Architecture
              </span>
              <span className="px-3 py-1.5 bg-indigo-950/70 border border-indigo-500/40 text-indigo-300 text-xs font-mono rounded-lg">
                Multi-Framework SDK
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

