import React, { useState } from 'react';
import type { Circuit, QuantumBackendId, SimulationResult } from '../../types/circuit';
import { StatevectorInspector } from './StatevectorInspector';
import { BlochSphereViewer } from './BlochSphereViewer';

interface SimulationPanelProps {
  circuit: Circuit;
  result: SimulationResult | null;
  isRunning: boolean;
  shots: number;
  onShotsChange: (shots: number) => void;
  onRunSimulation: () => void;
  activeBackend: QuantumBackendId;
  onOpenBackendSelector: () => void;
  onOpenBackendComparison: () => void;
}

export const SimulationPanel: React.FC<SimulationPanelProps> = ({
  circuit: _circuit,
  result,
  isRunning,
  shots,
  onShotsChange,
  onRunSimulation,
  activeBackend,
  onOpenBackendSelector,
  onOpenBackendComparison,
}) => {
  const [activeTab, setActiveTab] = useState<'histogram' | 'bloch' | 'statevector' | 'diagram'>('histogram');

  const backendName =
    activeBackend === 'client'
      ? 'Local In-Browser'
      : activeBackend === 'qiskit_aer'
      ? 'Qiskit Aer'
      : activeBackend === 'cirq'
      ? 'Google Cirq'
      : activeBackend === 'pennylane'
      ? 'PennyLane'
      : 'qBraid Cloud';

  const backendColor =
    activeBackend === 'client'
      ? 'text-[#315B8C] bg-[#315B8C]/10 border-[#315B8C]/30'
      : activeBackend === 'qiskit_aer'
      ? 'text-[#315B8C] bg-[#315B8C]/15 border-[#315B8C]/35 font-bold'
      : activeBackend === 'cirq'
      ? 'text-[#315B8C] bg-[#315B8C]/10 border-[#315B8C]/30'
      : activeBackend === 'pennylane'
      ? 'text-[#F2765E] bg-[#F2765E]/10 border-[#F2765E]/30'
      : 'text-[#F2765E] bg-[#F2765E]/15 border-[#F2765E]/35';

  // Sort histogram outcomes
  const outcomes = result?.counts
    ? Object.entries(result.counts).sort((a, b) => b[1] - a[1])
    : [];

  const maxCount = outcomes.length > 0 ? Math.max(...outcomes.map((o) => o[1])) : 1;

  return (
    <div className="flex flex-col h-full bg-[#FAF4EC] border-t border-[#413333]/15 select-none">
      {/* Simulation Controls & Tab Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 border-b border-[#413333]/15 bg-[#EDE0CF]/50 gap-3">
        {/* Left: View Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('histogram')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'histogram'
                ? 'bg-white text-[#315B8C] border border-[#315B8C]/30 shadow-sm font-semibold'
                : 'text-[#413333]/70 hover:text-[#413333] hover:bg-white/60'
            }`}
          >
            <span>📊 Histogram</span>
            {result?.counts && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#413333]/10 text-[#413333] rounded-full">
                {Object.keys(result.counts).length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('bloch')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bloch'
                ? 'bg-white text-[#315B8C] border border-[#315B8C]/30 shadow-sm font-semibold'
                : 'text-[#413333]/70 hover:text-[#413333] hover:bg-white/60'
            }`}
          >
            <span>🔮 Bloch Sphere</span>
          </button>

          <button
            onClick={() => setActiveTab('statevector')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'statevector'
                ? 'bg-white text-[#315B8C] border border-[#315B8C]/30 shadow-sm font-semibold'
                : 'text-[#413333]/70 hover:text-[#413333] hover:bg-white/60'
            }`}
          >
            <span>📐 Statevector & Phases</span>
          </button>

          {result?.circuitDiagram && (
            <button
              onClick={() => setActiveTab('diagram')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'diagram'
                  ? 'bg-white text-[#315B8C] border border-[#315B8C]/30 shadow-sm font-semibold'
                  : 'text-[#413333]/70 hover:text-[#413333] hover:bg-white/60'
              }`}
            >
              <span>📜 Backend Diagram</span>
            </button>
          )}
        </div>

        {/* Right: Backend Switcher, Compare button, Shots & Run */}
        <div className="flex items-center gap-2">
          {/* Active Backend Selector Trigger */}
          <button
            onClick={onOpenBackendSelector}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold border flex items-center gap-1.5 transition-all hover:scale-102 cursor-pointer shadow-sm ${backendColor}`}
            title="Click to switch quantum execution backend"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
            <span>{backendName}</span>
            <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Multi-Backend Comparison Button */}
          <button
            onClick={onOpenBackendComparison}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white hover:bg-[#315B8C]/10 text-[#315B8C] border border-[#315B8C]/20 shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
            title="Run circuit across Qiskit Aer, Cirq, and PennyLane side-by-side"
          >
            <span>⚖️ Compare</span>
          </button>

          {/* Shots Selector */}
          <div className="flex items-center gap-1 bg-white border border-[#413333]/20 rounded-lg px-2 py-0.5 shadow-sm">
            <span className="text-[11px] font-mono text-[#413333]/70">Shots:</span>
            <select
              value={shots}
              onChange={(e) => onShotsChange(Number(e.target.value))}
              className="bg-transparent text-xs font-mono text-[#413333] focus:outline-none cursor-pointer"
            >
              <option value={100} className="bg-white text-[#413333]">100</option>
              <option value={500} className="bg-white text-[#413333]">500</option>
              <option value={1024} className="bg-white text-[#413333]">1,024</option>
              <option value={2048} className="bg-white text-[#413333]">2,048</option>
              <option value={4096} className="bg-white text-[#413333]">4,096</option>
              <option value={8192} className="bg-white text-[#413333]">8,192</option>
            </select>
          </div>

          {/* Run Button */}
          <button
            onClick={onRunSimulation}
            disabled={isRunning}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#F2765E] hover:bg-[#e0634b] text-white shadow-md shadow-[#F2765E]/20 hover:shadow-[#F2765E]/40 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 font-sans"
          >
            {isRunning ? (
              <>
                <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Execute (Ctrl+Enter)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Telemetry Body */}
      <div className="flex-1 overflow-y-auto p-4">
        {isRunning ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-[#F2765E] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-mono text-[#315B8C]">
              Running simulation on {backendName}...
            </span>
          </div>
        ) : !result ? (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white border border-[#413333]/15 flex items-center justify-center text-[#413333]/60 shadow-sm">
              ⚡
            </div>
            <p className="text-xs font-mono text-[#413333]/70">
              Circuit ready. Click &quot;Execute&quot; or press Ctrl+Enter to simulate on {backendName}.
            </p>
          </div>
        ) : activeTab === 'histogram' ? (
          <div className="space-y-4">
            {/* Meta bar */}
            <div className="flex items-center justify-between text-xs font-mono text-[#413333]/70 pb-2 border-b border-[#413333]/10">
              <div className="flex items-center gap-4">
                <span>
                  Runtime: <strong className="text-[#315B8C]">{result.executionTimeMs.toFixed(2)} ms</strong>
                </span>
                <span>
                  Total Shots: <strong className="text-[#413333]">{result.shots}</strong>
                </span>
                <span>
                  Qubits: <strong className="text-[#413333]">{result.qubits}</strong>
                </span>
              </div>
              <div>
                Backend: <strong className="text-[#413333]">{result.backendName || backendName}</strong>
              </div>
            </div>

            {/* Histogram Bars */}
            <div className="space-y-2.5">
              {outcomes.map(([bitstr, count]) => {
                const prob = result.probabilities[bitstr] !== undefined ? result.probabilities[bitstr] : count / result.shots;
                const pct = (prob * 100).toFixed(1);
                const barWidth = Math.max(2, (count / maxCount) * 100);

                return (
                  <div key={bitstr} className="flex items-center gap-3 font-mono text-xs">
                    {/* Bitstring Label */}
                    <div className="w-14 text-[#315B8C] font-bold text-right">
                      |{bitstr}⟩
                    </div>

                    {/* Animated Bar */}
                    <div className="flex-1 h-6 bg-[#EDE0CF]/60 rounded-lg overflow-hidden relative border border-[#413333]/10 flex items-center">
                      <div
                        className="h-full bg-gradient-to-r from-[#315B8C] to-[#315B8C]/80 rounded-lg transition-all duration-300 shadow-sm shadow-[#315B8C]/20"
                        style={{ width: `${barWidth}%` }}
                      />
                      <span className="absolute left-3 text-[11px] font-semibold text-white drop-shadow-sm">
                        {count} shots ({pct}%)
                      </span>
                    </div>

                    {/* Exact Probability Badge */}
                    <div className="w-16 text-right text-[#413333]/70">
                      {prob.toFixed(4)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : activeTab === 'bloch' ? (
          <BlochSphereViewer blochVectors={result.blochVectors} qubits={result.qubits} />
        ) : activeTab === 'statevector' ? (
          <StatevectorInspector
            statevector={result.statevector || []}
            qubits={result.qubits}
            executionTimeMs={result.executionTimeMs}
          />
        ) : (
          <div className="p-4 rounded-xl bg-white font-mono text-xs text-[#315B8C] overflow-x-auto whitespace-pre border border-[#413333]/15 shadow-sm">
            {result.circuitDiagram || 'No text diagram returned by backend.'}
          </div>
        )}
      </div>
    </div>
  );
};
