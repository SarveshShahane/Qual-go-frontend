import React, { useState } from 'react';

interface TopicItem {
  num: string;
  title: string;
  formula: string;
  hint: string;
}

interface ModuleItem {
  id: string;
  title: string;
  status: string;
  count: string;
  active: boolean;
}

export const CurriculumPreview: React.FC = () => {
  const mathTopics: TopicItem[] = [
    { num: '01', title: 'Vectors', formula: 'v = (v₁, v₂)', hint: 'Representation of quantum states as ordered column matrices where index position has physical state significance.' },
    { num: '02', title: 'Vector Notation', formula: 'e₁ = [1; 0], e₂ = [0; 1]', hint: 'Computational basis vectors and state space coordinates in finite-dimensional Hilbert space.' },
    { num: '03', title: 'Complex Numbers', formula: 'z = a + bi, |z|² = a² + b²', hint: 'Phase and quantum interference foundations required for complex probability amplitude manipulation.' },
    { num: '04', title: 'Probability', formula: 'P(A) ≥ 0, ∑ P(i) = 1', hint: 'Classical probability foundations, Kolmogorov axioms, and state outcome distributions.' },
    { num: '05', title: 'Probability Amplitudes', formula: 'P(x) = |α|²', hint: 'The Born rule: mapping continuous complex probability amplitudes to discrete observable measurement outcomes.' },
    { num: '06', title: 'State Normalization', formula: '|α|² + |β|² = 1', hint: 'Conservation of total probability ensuring quantum state vectors maintain unit length under all transformations.' },
    { num: '07', title: 'Operators and Matrices', formula: 'M ∈ ℂ^(n×n)', hint: 'Linear operators acting on statevectors, represented by complex square matrices.' },
    { num: '08', title: 'Matrix-Vector Multiplication', formula: '|ψ′⟩ = U |ψ⟩', hint: 'Applying quantum gate operators to evolve the statevector deterministically forward in time.' },
    { num: '09', title: 'Unitary Matrices', formula: 'U† U = I', hint: 'Reversible, inner-product preserving transformations that satisfy physical quantum mechanics.' },
    { num: '10', title: 'Dirac Formalism', formula: '|ψ⟩, ⟨ϕ|, ⟨ϕ|ψ⟩', hint: 'Universal bra-ket notation for state representation, dual spaces, and inner product projections.' },
    { num: '11', title: 'Superposition Synthesis', formula: 'H|0⟩ = (|0⟩ + |1⟩)/√2', hint: 'Creating balanced quantum superposition states, destructive interference, and projective measurement.' },
    { num: '12', title: 'Mastery Examination', formula: '10 Checkpoints', hint: 'Rigorous interactive assessment evaluating linear algebra and foundational quantum mechanics readiness.' },
  ];

  const [selectedTopic, setSelectedTopic] = useState<number>(0);

  const modules: ModuleItem[] = [
    { id: 'MOD-01', title: 'Mathematical Foundations', status: 'Active Syllabus', count: '12 Lessons + Quiz', active: true },
    { id: 'MOD-02', title: 'Single-Qubit Systems & Bloch Sphere', status: 'Curriculum Ready', count: '8 Lessons', active: false },
    { id: 'MOD-03', title: 'Multi-Qubit Systems & Entanglement', status: 'Curriculum Ready', count: '10 Lessons', active: false },
    { id: 'MOD-04', title: 'Standard Quantum Algorithms', status: 'Advanced Track', count: '14 Lessons', active: false },
  ];

  const activeTopic = mathTopics[selectedTopic];

  return (
    <section id="curriculum" className="py-20 border-b border-rule bg-paper relative">
      <div className="academic-container">
        <div className="max-w-3xl mb-10">
          <p className="text-xs text-muted mb-2">Section 05 · Syllabus & Courseware</p>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-ink tracking-tight">
            Structured quantum computing curriculum
          </h2>
          <p className="mt-2 text-sm text-muted">
            A four-tier instructional progression moving from foundational linear algebra to multi-qubit entanglement and quantum search algorithms.
          </p>
        </div>

        {/* Modules Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {modules.map((m) => (
            <div
              key={m.id}
              className={`p-4 border bg-sheet ${
                m.active
                  ? 'border-ink ring-1 ring-ink'
                  : 'border-rule'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-muted">{m.id}</span>
                <span className={`tag-academic ${m.active ? 'text-navy border-navy/30 bg-navy/5 font-semibold' : ''}`}>
                  {m.status}
                </span>
              </div>
              <h3 className="font-display font-semibold text-sm text-ink">
                {m.title}
              </h3>
              <p className="text-xs text-muted mt-2 font-mono">
                {m.count}
              </p>
            </div>
          ))}
        </div>

        {/* Deep Dive into Active Module */}
        <div className="border border-rule bg-sheet p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between pb-6 mb-6 border-b border-rule gap-3">
            <div>
              <p className="text-xs text-muted mb-1">Module 01 Specification</p>
              <h3 className="text-xl sm:text-2xl font-display font-semibold text-ink">
                Mathematical foundations for quantum computing
              </h3>
            </div>
            <div className="text-xs text-muted">
              Course directory: <code className="font-mono text-ink-2 bg-paper px-1.5 py-0.5 border border-rule">/modules/Mathematics/</code>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 12 Topics Grid */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {mathTopics.map((topic, i) => {
                const isSelected = selectedTopic === i;
                return (
                  <button
                    key={topic.num}
                    type="button"
                    onClick={() => setSelectedTopic(i)}
                    className={`p-3 text-left border cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 active:bg-paper-3 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isSelected
                        ? 'bg-ink text-sheet border-ink'
                        : 'bg-paper text-ink border-rule hover:border-ink'
                    }`}
                  >
                    <div className={`num font-mono text-xs font-semibold mb-1 ${isSelected ? 'text-paper' : 'text-muted'}`}>
                      {topic.num}
                    </div>
                    <div className="text-xs font-medium truncate">
                      {topic.title}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Topic Details */}
            <div className="lg:col-span-4 p-5 bg-paper border border-rule flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="text-muted">
                    Topic <span className="num font-mono font-semibold text-ink">{activeTopic.num}</span> of <span className="num font-mono">12</span>
                  </span>
                  <span className="tag-academic">
                    Lesson & Exercise
                  </span>
                </div>
                <h4 className="font-display font-semibold text-base text-ink mb-2">
                  {activeTopic.title}
                </h4>
                <div className="my-3 p-3 bg-sheet border border-rule font-mono text-xs sm:text-sm text-ink font-semibold text-center">
                  {activeTopic.formula}
                </div>
                <p className="text-xs text-ink-2 leading-relaxed">
                  {activeTopic.hint}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-rule text-xs text-muted">
                <span>Verified units: theory.md, questions.md, solutions.md</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
