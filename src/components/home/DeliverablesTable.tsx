import React, { useState } from 'react';

interface DeliverableItem {
  id: string;
  name: string;
  category: 'Core System' | 'Simulation' | 'AI Intelligence' | 'Pedagogy' | 'Analytics';
  description: string;
  techStack: string;
  status: 'Complete' | 'In Development' | 'Planned';
}

export const DeliverablesTable: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');

  const deliverables: DeliverableItem[] = [
    {
      id: 'DEL-01',
      name: 'Interactive Web Platform Core & Auth Service',
      category: 'Core System',
      description: 'Production-ready responsive frontend with modern state management, coupled to an asynchronous FastAPI backend with secure HttpOnly JWT session authentication and PostgreSQL persistence.',
      techStack: 'React 19, Vite, Redux Toolkit, Tailwind CSS, FastAPI, SQLAlchemy Async, PostgreSQL, Alembic',
      status: 'Complete',
    },
    {
      id: 'DEL-02',
      name: 'Graphical Drag-and-Drop Quantum Circuit Studio',
      category: 'Core System',
      description: 'Visual quantum wire designer enabling users to drag, drop, configure, and inspect single- and multi-qubit gates (H, X, Y, Z, S, T, CNOT, SWAP, Toffoli, Phase) with instant wire validation.',
      techStack: 'HTML5 Canvas / SVG, React State Engine, OpenQASM 3.0 Transpiler',
      status: 'In Development',
    },
    {
      id: 'DEL-03',
      name: 'Real-Time Multi-Backend Execution Engine',
      category: 'Simulation',
      description: 'Unified simulation runner interfacing multiple quantum engines: Qiskit Aer (statevector & noisy shots), PennyLane (differentiable circuits), Cirq (google architecture), and qBraid cloud access.',
      techStack: 'Python 3.12, Qiskit Aer, PennyLane, Cirq, WebAssembly Micro-Simulators',
      status: 'In Development',
    },
    {
      id: 'DEL-04',
      name: 'Quantum AI Copilot & Automated Circuit Debugger',
      category: 'AI Intelligence',
      description: 'Context-aware LLM engine providing line-by-line quantum algorithm explanations, non-unitary gate error diagnostics, circuit depth reduction hints, and conversational tutoring.',
      techStack: 'LangChain / Gemini SDK, Vector Knowledge Retrieval, Custom Quantum Prompt Engine',
      status: 'In Development',
    },
    {
      id: 'DEL-05',
      name: 'Multi-Dimensional State & Bloch Sphere Visualizer',
      category: 'Simulation',
      description: 'Interactive visualization toolkit rendering 3D Bloch sphere projections for single-qubit states, complex probability amplitude bar charts, phase disks, and Dirac notation expansions.',
      techStack: 'Three.js / WebGL, D3.js, MathJax / KaTeX rendering',
      status: 'In Development',
    },
    {
      id: 'DEL-06',
      name: 'Standard Quantum Algorithm Course Modules',
      category: 'Pedagogy',
      description: 'Step-by-step interactive modules covering Quantum Math Foundations, Superposition & Entanglement, Deutsch-Jozsa, Grover Search, Shor Factoring, Quantum Teleportation, and VQE.',
      techStack: 'Markdown / MDX, Interactive Code Runners, Embedded Checkpoints',
      status: 'Complete',
    },
    {
      id: 'DEL-07',
      name: 'Interactive Assessment & Coding Challenge Suite',
      category: 'Pedagogy',
      description: 'Self-grading quantum code assignments, unitary verification tests, circuit optimization challenges, and module mastery quizzes with real-time feedback.',
      techStack: 'Pytest Backend Sandbox, Isolated Docker Container Runner, Redux State',
      status: 'Planned',
    },
    {
      id: 'DEL-08',
      name: 'Instructor Dashboard & Cohort Analytics',
      category: 'Analytics',
      description: 'Comprehensive administrative dashboard for educators to monitor student pacing, identify common conceptual sticking points, review submission telemetry, and assign custom problem sets.',
      techStack: 'FastAPI Analytics API, Recharts Data Visualization, Role-Based Access Control (RBAC)',
      status: 'Planned',
    },
  ];

  const categories = ['All', 'Core System', 'Simulation', 'AI Intelligence', 'Pedagogy', 'Analytics'];

  const filtered = filter === 'All' 
    ? deliverables 
    : deliverables.filter(d => d.category === filter);

  return (
    <section id="deliverables" className="py-20 border-b border-white/10 bg-[#07090e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-3">
            <span>EXPECTED DELIVERABLES MATRIX</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Delivery Table (Expected Deliverables)
          </h2>
          <p className="mt-3 text-slate-300 text-base">
            Systematic roadmap and technical milestones delivering a scalable, end-to-end quantum computing learning solution.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                filter === cat
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Deliverables Table Container */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-md overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-xs font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">ID & Deliverable Name</th>
                  <th className="py-4 px-6 hidden sm:table-cell">Category</th>
                  <th className="py-4 px-6">Scope & Technical Description</th>
                  <th className="py-4 px-6 hidden md:table-cell">Target Tech Stack</th>
                  <th className="py-4 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 align-top">
                      <div className="font-mono text-xs text-cyan-400 font-bold mb-1">{item.id}</div>
                      <div className="font-heading font-semibold text-white">{item.name}</div>
                      <span className="sm:hidden inline-block mt-2 px-2 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-300 rounded">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 align-top hidden sm:table-cell">
                      <span className="inline-block px-2.5 py-1 text-xs font-mono bg-slate-800/80 border border-slate-700 text-slate-300 rounded-md">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 align-top text-slate-300 leading-relaxed max-w-md">
                      {item.description}
                      <div className="md:hidden mt-2 font-mono text-xs text-slate-400">
                        <strong className="text-slate-500">Tech: </strong>{item.techStack}
                      </div>
                    </td>
                    <td className="py-4 px-6 align-top hidden md:table-cell text-xs font-mono text-slate-400 leading-relaxed max-w-xs">
                      {item.techStack}
                    </td>
                    <td className="py-4 px-6 align-top text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium font-mono ${
                          item.status === 'Complete'
                            ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300'
                            : item.status === 'In Development'
                            ? 'bg-cyan-950/80 border border-cyan-500/40 text-cyan-300'
                            : 'bg-slate-800 border border-slate-700 text-slate-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

