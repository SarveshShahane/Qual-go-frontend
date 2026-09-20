import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#05070a] border-t border-white/10 py-12 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-heading font-bold text-xl text-white">
                QUAL<span className="text-cyan-400">.DEV</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                Egreen Quanta
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md leading-relaxed">
              AI-Based Interactive Quantum Algorithm Learning Platform. Empowering students, 
              researchers, and engineers with visual circuit builders, multi-backend quantum simulators, 
              and intelligent pedagogical guidance.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-mono text-slate-500">
              <span>Category: Software</span>
              <span>•</span>
              <span className="text-emerald-400">Smart Education</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h5 className="font-heading font-semibold text-white text-sm mb-4">Supported SDKs</h5>
            <ul className="space-y-2 text-xs font-mono">
              <li className="hover:text-cyan-300 transition-colors">Qiskit Aer Simulator</li>
              <li className="hover:text-cyan-300 transition-colors">Google Cirq Engine</li>
              <li className="hover:text-cyan-300 transition-colors">Xanadu PennyLane</li>
              <li className="hover:text-cyan-300 transition-colors">qBraid Lab Cloud</li>
              <li className="hover:text-cyan-300 transition-colors">OpenQASM 3.0 Standard</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h5 className="font-heading font-semibold text-white text-sm mb-4">Learning Tracks</h5>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-cyan-300 transition-colors">01. Quantum Mathematics</li>
              <li className="hover:text-cyan-300 transition-colors">02. Qubits & Bloch Spheres</li>
              <li className="hover:text-cyan-300 transition-colors">03. Entanglement & Teleportation</li>
              <li className="hover:text-cyan-300 transition-colors">04. Grover & Shor Algorithms</li>
              <li className="hover:text-cyan-300 transition-colors">05. Variational Quantum Eigensolver</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Egreen Quanta. All rights reserved. Developed for Smart Education.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Documentation</span>
            <span className="hover:text-slate-300 cursor-pointer">Open Source</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms & Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

