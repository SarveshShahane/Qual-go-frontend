import React from 'react';

export const ObjectivesSection: React.FC = () => {
  const objectives = [
    {
      id: 'OBJ-01',
      title: 'Interactive Web-Based Learning Platform',
      desc: 'Design and develop a cloud-native, high-performance platform for learning quantum computing fundamentals and state-of-the-art quantum algorithms with zero client-side installation.',
      icon: (
        <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      ),
      tags: ['Cloud-Native', 'Responsive', 'Cross-Platform'],
      accent: 'border-cyan-500/30 group-hover:border-cyan-500/60',
    },
    {
      id: 'OBJ-02',
      title: 'Graphical & Code-Based Circuit Design',
      desc: 'Dual-mode quantum studio featuring an intuitive drag-and-drop gate canvas synchronized bidirectionally with code editors supporting Python, Qiskit, and OpenQASM.',
      icon: (
        <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      tags: ['Drag-and-Drop', 'Live Code Sync', 'QASM 3.0'],
      accent: 'border-sky-500/30 group-hover:border-sky-500/60',
    },
    {
      id: 'OBJ-03',
      title: 'Multi-Backend Simulation Engine',
      desc: 'Real-time execution across major quantum backends including Qiskit Aer, PennyLane, Cirq, and qBraid with unified state extraction and shot counts.',
      icon: (
        <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      tags: ['Qiskit Aer', 'PennyLane', 'Cirq', 'qBraid'],
      accent: 'border-indigo-500/30 group-hover:border-indigo-500/60',
    },
    {
      id: 'OBJ-04',
      title: 'AI-Assisted Tutoring & Debugging',
      desc: 'Intelligent AI copilot for natural language concept explanations, syntax & gate error detection, circuit depth optimization, and personalized adaptive learning trajectories.',
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      tags: ['AI Tutor', 'Error Detection', 'Circuit Optimization'],
      accent: 'border-emerald-500/30 group-hover:border-emerald-500/60',
    },
    {
      id: 'OBJ-05',
      title: 'State & Bloch Sphere Visualization',
      desc: 'Interactive 3D Bloch spheres, continuous statevector displays, measurement probability histograms, phase disks, and Dirac bra-ket notations for intuitive comprehension.',
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
      tags: ['3D Bloch Sphere', 'Phase Angle', 'Dirac Amplitudes'],
      accent: 'border-amber-500/30 group-hover:border-amber-500/60',
    },
    {
      id: 'OBJ-06',
      title: 'Assessment & Instructor Analytics',
      desc: 'Automated evaluation modules, interactive coding challenges with test suites, mastery checkpoint quizzes, and educator dashboards tracking cohort progress.',
      icon: (
        <svg className="w-6 h-6 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      tags: ['Mastery Quizzes', 'Coding Tests', 'Cohort Analytics'],
      accent: 'border-cyan-500/30 group-hover:border-cyan-500/60',
    },
  ];

  return (
    <section id="objectives" className="py-20 border-b border-white/10 bg-[#07090e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-3">
            <span>PLATFORM SPECIFICATION & SCOPE</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Core Platform Objectives
          </h2>
          <p className="mt-3 text-slate-300 text-base">
            Systematic engineering pillars designed to empower learners from foundational quantum mechanics 
            to advanced algorithmic design and multi-qubit compilation.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {objectives.map((obj) => (
            <div
              key={obj.id}
              className={`p-6 rounded-2xl bg-slate-900/50 border ${obj.accent} backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/5 group flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {obj.icon}
                  </div>
                  <span className="text-xs font-mono text-slate-500 group-hover:text-cyan-400 transition-colors">
                    {obj.id}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {obj.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {obj.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                {obj.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[11px] font-mono text-slate-300 bg-slate-800/60 border border-slate-700/60 rounded"
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

