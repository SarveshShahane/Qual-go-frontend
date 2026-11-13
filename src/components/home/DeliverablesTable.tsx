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
    <section id="deliverables" className="py-20 border-b border-rule bg-paper relative">
      <div className="academic-container">
        <div className="max-w-3xl mb-10">
          <p className="text-xs text-muted mb-2">Section 04 · Architecture Roadmap</p>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-ink tracking-tight">
            System deliverables and milestone register
          </h2>
          <p className="mt-2 text-sm text-muted">
            Technical milestones delivering an end-to-end quantum computing instructional platform with rigorous multi-engine verification.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-6" role="tablist" aria-label="Deliverable category filters">
          {categories.map((cat) => {
            const isActive = filter === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 text-xs font-body border cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 active:bg-paper-3 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isActive
                    ? 'bg-ink text-sheet border-ink font-medium'
                    : 'bg-sheet text-ink-2 border-rule hover:border-ink hover:text-ink'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Deliverables Table */}
        <div className="border border-rule bg-sheet overflow-hidden">
          <div className="overflow-x-auto">
            <table className="academic-table" aria-label="Deliverables register">
              <thead>
                <tr>
                  <th scope="col" className="w-24">Identifier</th>
                  <th scope="col" className="w-64">Milestone</th>
                  <th scope="col" className="hidden sm:table-cell w-36">Domain</th>
                  <th scope="col">Scope and technical specification</th>
                  <th scope="col" className="hidden lg:table-cell w-56">Implementation stack</th>
                  <th scope="col" className="text-right w-32">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-paper/40">
                    <td className="font-mono text-xs text-muted font-medium py-3.5">
                      {item.id}
                    </td>
                    <td className="py-3.5 font-medium text-ink">
                      {item.name}
                      <span className="sm:hidden block mt-1 text-[11px] font-mono text-muted">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 hidden sm:table-cell">
                      <span className="tag-academic">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 text-xs sm:text-sm text-ink-2 leading-relaxed">
                      {item.description}
                      <div className="lg:hidden mt-1.5 text-xs text-muted">
                        <span className="font-semibold text-ink-2">Stack: </span>
                        <span className="font-mono">{item.techStack}</span>
                      </div>
                    </td>
                    <td className="py-3.5 hidden lg:table-cell text-xs font-mono text-muted leading-relaxed">
                      {item.techStack}
                    </td>
                    <td className="py-3.5 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-mono border ${
                          item.status === 'Complete'
                            ? 'text-navy border-navy/30 bg-navy/5'
                            : item.status === 'In Development'
                            ? 'text-accent border-accent/30 bg-accent-soft'
                            : 'text-muted border-rule bg-paper-2'
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

        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <span>Showing <span className="num font-mono">{filtered.length}</span> of <span className="num font-mono">{deliverables.length}</span> system deliverables</span>
          <span>Register updated: February 2026</span>
        </div>
      </div>
    </section>
  );
};
