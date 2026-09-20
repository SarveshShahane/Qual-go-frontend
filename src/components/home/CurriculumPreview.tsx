import React, { useState } from 'react';

export const CurriculumPreview: React.FC = () => {
  const mathTopics = [
    { num: '01', title: 'Vectors', formula: 'v = (v₁, v₂)', hint: 'Representation of quantum states as structural lists where position has physical meaning.' },
    { num: '02', title: 'Vector Notation', formula: 'e₁ = [1; 0], e₂ = [0; 1]', hint: 'Column vectors, computational basis vectors, and ordered spaces.' },
    { num: '03', title: 'Complex Numbers', formula: 'z = a + bi, |z|² = a² + b²', hint: 'Phase and interference foundations essential for probability amplitudes.' },
    { num: '04', title: 'Probability', formula: 'P(A) ≥ 0, ∑ P(i) = 1', hint: 'Classical probability rules and state transition distributions.' },
    { num: '05', title: 'Probability Amplitudes', formula: 'P(x) = |α|²', hint: 'The Born rule: turning complex wave coefficients into observable measurement outcomes.' },
    { num: '06', title: 'Normalization', formula: '|α|² + |β|² = 1', hint: 'Ensuring total quantum probability always sums to exactly 1.' },
    { num: '07', title: 'Matrices', formula: 'M ∈ ℂ^(n×n)', hint: 'Rectangular arrays representing physical operators and quantum transformations.' },
    { num: '08', title: 'Matrix-Vector Multiplication', formula: '|ψ′⟩ = U |ψ⟩', hint: 'Applying quantum gates to evolve qubit statevectors over time.' },
    { num: '09', title: 'Unitary Matrices', formula: 'U† U = I', hint: 'Reversible, length-preserving transformations that preserve quantum probability.' },
    { num: '10', title: 'Dirac Notation', formula: '|ψ⟩, ⟨ϕ|, ⟨ϕ|ψ⟩', hint: 'Ket, bra, and inner product formalism universally used in quantum mechanics.' },
    { num: '11', title: 'Synthesis', formula: 'H|0⟩ = (|0⟩ + |1⟩)/√2', hint: 'Putting it all together: state evolution, interference, and measurements.' },
    { num: '12', title: 'Mastery Quiz', formula: '10 Checkpoints', hint: 'Comprehensive verification assessing linear algebra readiness for quantum algorithms.' },
  ];

  const [selectedTopic, setSelectedTopic] = useState(0);

  const modules = [
    { id: 'MOD-01', title: 'Module 1: The Mathematics You Need', status: 'Available in /modules', active: true, count: '12 Lessons + Mastery Quiz' },
    { id: 'MOD-02', title: 'Module 2: Single-Qubit Systems & Bloch Sphere', status: 'Curriculum Ready', active: false, count: '8 Lessons' },
    { id: 'MOD-03', title: 'Module 3: Multi-Qubit Systems & Entanglement', status: 'Curriculum Ready', active: false, count: '10 Lessons' },
    { id: 'MOD-04', title: 'Module 4: Standard Quantum Algorithms (Grover & Shor)', status: 'Advanced Track', active: false, count: '14 Lessons' },
  ];

  return (
    <section id="curriculum" className="py-20 border-b border-white/10 bg-[#07090e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-emerald-500/30 text-xs font-mono text-emerald-400 mb-3">
            <span>PEDAGOGICAL ARCHITECTURE • INTUITION FIRST</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Structured Quantum Learning Curriculum
          </h2>
          <p className="mt-3 text-slate-300 text-base">
            Learning philosophy: <span className="text-cyan-400 font-semibold">Intuition first</span>, 
            <span className="text-indigo-300 font-semibold"> notation second</span>, 
            <span className="text-emerald-300 font-semibold"> computation third</span>, 
            and quantum connection throughout.
          </p>
        </div>

        {/* Modules Navigation Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {modules.map((m, idx) => (
            <div
              key={m.id}
              className={`p-4 rounded-xl border transition-all ${
                idx === 0
                  ? 'bg-cyan-950/30 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/40 border-white/5 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className={idx === 0 ? 'text-cyan-400' : 'text-slate-500'}>{m.id}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] ${
                  idx === 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                }`}>
                  {m.status}
                </span>
              </div>
              <h4 className="font-heading font-semibold text-sm text-white">{m.title}</h4>
              <p className="text-xs text-slate-400 mt-1 font-mono">{m.count}</p>
            </div>
          ))}
        </div>

        {/* Deep Dive into Active Module 1 */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
            <div>
              <div className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                Active Track • Module 1 Deep Dive
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mt-1">
                The Mathematics You Need for Quantum Computing
              </h3>
            </div>
            <div className="text-xs font-mono text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              Files located in <span className="text-cyan-300">/modules/Mathematics/</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 12 Topics Grid */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {mathTopics.map((topic, i) => (
                <button
                  key={topic.num}
                  onClick={() => setSelectedTopic(i)}
                  className={`p-3 rounded-xl text-left transition-all cursor-pointer border ${
                    selectedTopic === i
                      ? 'bg-cyan-500/20 border-cyan-400 shadow-md shadow-cyan-500/20 text-white'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  <div className="font-mono text-xs text-cyan-400 font-bold mb-1">{topic.num}</div>
                  <div className="font-heading text-xs font-semibold truncate">{topic.title}</div>
                </button>
              ))}
            </div>

            {/* Selected Topic Detail Card */}
            <div className="lg:col-span-4 p-5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    TOPIC {mathTopics[selectedTopic].num}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded">
                    Theory + Quiz
                  </span>
                </div>
                <h4 className="font-heading text-lg font-bold text-white mb-2">
                  {mathTopics[selectedTopic].title}
                </h4>
                <div className="my-3 p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-sm text-cyan-300 text-center">
                  {mathTopics[selectedTopic].formula}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {mathTopics[selectedTopic].hint}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Includes: theory.md, questions.md, answers.md</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

