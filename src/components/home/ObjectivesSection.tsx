import React from 'react';

export const ObjectivesSection: React.FC = () => {
  const pillars = [
    {
      id: '01',
      title: 'Web-Based Execution Environment',
      desc: 'Cloud-native execution laboratory for quantum computing fundamentals and state-of-the-art algorithms with zero client-side installation or driver configuration.',
      tags: ['Browser Runtime', 'Cross-Platform', 'Zero Setup'],
    },
    {
      id: '02',
      title: 'Dual-Mode Circuit Synthesis',
      desc: 'Graphical wire canvas supporting single and multi-qubit gates, synchronized bidirectionally with code generation for Python, Qiskit, and OpenQASM 3.0.',
      tags: ['Drag and Drop', 'Bidirectional Sync', 'OpenQASM 3.0'],
    },
    {
      id: '03',
      title: 'Multi-Backend Simulation Engine',
      desc: 'Real-time execution across major simulation engines including Qiskit Aer, PennyLane, Cirq, and qBraid with unified state extraction and measurement counts.',
      tags: ['Qiskit Aer', 'Google Cirq', 'PennyLane', 'qBraid'],
    },
    {
      id: '04',
      title: 'Automated Formalism Diagnostics',
      desc: 'Context-aware diagnostic system providing step-by-step gate explanations, unitary violation checks, and circuit depth optimization recommendations.',
      tags: ['Unitary Check', 'Depth Optimization', 'Formal Proofs'],
    },
    {
      id: '05',
      title: 'Statevector & Bloch Sphere Projections',
      desc: '3D Bloch sphere projections, continuous statevector displays, measurement probability histograms, phase disks, and Dirac bra-ket expansions.',
      tags: ['Bloch Sphere', 'Dirac Notation', 'Phase Geometry'],
    },
    {
      id: '06',
      title: 'Structured Assessment & Mastery Checks',
      desc: 'Automated evaluation modules, interactive coding challenges with test suites, and milestone quizzes tracking theoretical and algorithmic comprehension.',
      tags: ['Milestone Quizzes', 'Coding Tests', 'Progress Tracking'],
    },
  ];

  return (
    <section id="objectives" className="py-16 md:py-20 border-b border-rule bg-paper">
      <div className="academic-container">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-body text-muted mb-2">
            Section 03 · Platform Architecture
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink">
            Six Pillars of the Instructional Engine
          </h2>
          <p className="mt-3 text-muted font-body text-base leading-relaxed">
            A cohesive computational environment designed to take students from matrix mechanics to complex multi-qubit algorithm synthesis.
          </p>
        </div>

        {/* 3-Column Academic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="p-6 rounded-sm bg-sheet border border-rule flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between border-b border-rule pb-2 mb-4">
                  <span className="text-xs text-muted">Pillar <span className="num font-mono">{pillar.id}</span></span>
                </div>
                <h3 className="font-display font-semibold text-lg text-ink mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm font-body text-ink-2 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-rule flex flex-wrap gap-1.5">
                {pillar.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs font-body text-muted bg-paper-2 border border-rule rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
