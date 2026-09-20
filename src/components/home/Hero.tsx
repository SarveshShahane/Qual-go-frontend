import React from 'react';

export const Hero: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-white/10">
      {/* Background radial glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[400px] h-[300px] bg-indigo-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Organization / Category Meta Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-6 shadow-inner backdrop-blur-md">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="font-semibold text-slate-200">Egreen Quanta</span>
          <span className="text-slate-500">•</span>
          <span>Category: Software</span>
          <span className="text-slate-500">•</span>
          <span className="text-emerald-400 font-medium">Theme: Smart Education</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.15]">
          AI-Based Interactive{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Quantum Algorithm
          </span>{' '}
          Learning Platform
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-sans leading-relaxed">
          Democratizing quantum education with visual circuit design, real-time multi-backend simulation, 
          rich state & Bloch sphere visualization, and personalized AI-assisted tutoring for students, 
          researchers, and future quantum engineers.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => scrollTo('circuit-demo')}
            className="px-6 py-3.5 rounded-xl font-heading font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center gap-2 group cursor-pointer"
          >
            <span>Launch Interactive Studio</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          <button
            onClick={() => scrollTo('curriculum')}
            className="px-6 py-3.5 rounded-xl font-heading font-medium text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 transition-all flex items-center gap-2 cursor-pointer backdrop-blur-md"
          >
            <span>Explore Curriculum</span>
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </button>

          <button
            onClick={() => scrollTo('deliverables')}
            className="px-6 py-3.5 rounded-xl font-heading font-medium text-slate-300 hover:text-cyan-300 bg-transparent hover:bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all cursor-pointer"
          >
            Delivery Matrix
          </button>
        </div>

        {/* Feature Pills */}
        <div className="mt-14 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-3.5 rounded-lg bg-slate-900/40 border border-white/5">
            <div className="text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider">01 • Backends</div>
            <div className="text-sm font-medium text-slate-200 mt-1">Qiskit, Cirq, PennyLane & qBraid</div>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900/40 border border-white/5">
            <div className="text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider">02 • Design Modes</div>
            <div className="text-sm font-medium text-slate-200 mt-1">Visual Drag-and-Drop + Code Sync</div>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900/40 border border-white/5">
            <div className="text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider">03 • AI Copilot</div>
            <div className="text-sm font-medium text-slate-200 mt-1">Live Tutoring & Error Detection</div>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-900/40 border border-white/5">
            <div className="text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider">04 • Visualizations</div>
            <div className="text-sm font-medium text-slate-200 mt-1">Bloch Spheres & Statevectors</div>
          </div>
        </div>
      </div>
    </section>
  );
};

