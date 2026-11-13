import React, { useState } from 'react';
import type { Circuit, QuantumBackendId } from '../../types/circuit';

interface CircuitToolbarProps {
  circuit: Circuit;
  onUpdateCircuitName: (name: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onAddQubit: () => void;
  onAddMoment: () => void;
  onClearCircuit: () => void;
  viewMode: 'split' | 'canvas' | 'code';
  onViewModeChange: (mode: 'split' | 'canvas' | 'code') => void;
  onRunSimulation: () => void;
  isSimulating: boolean;
  onOpenTemplates: () => void;
  onOpenShortcuts: () => void;
  activeBackend: QuantumBackendId;
  onOpenBackendSelector: () => void;
  onOpenBackendComparison: () => void;
  onExportCode: (format: 'qiskit' | 'qasm' | 'json') => void;
  onOpenAITutor?: () => void;
}

export const CircuitToolbar: React.FC<CircuitToolbarProps> = ({
  circuit,
  onUpdateCircuitName,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onAddQubit,
  onAddMoment,
  onClearCircuit,
  viewMode,
  onViewModeChange,
  onRunSimulation,
  isSimulating,
  onOpenTemplates,
  onOpenShortcuts,
  activeBackend,
  onOpenBackendSelector,
  onOpenBackendComparison,
  onExportCode,
  onOpenAITutor,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(circuit.name);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const handleNameSubmit = () => {
    if (nameInput.trim()) {
      onUpdateCircuitName(nameInput.trim());
    }
    setIsEditingName(false);
  };

  const backendName =
    activeBackend === 'client'
      ? 'In-Browser'
      : activeBackend === 'qiskit_aer'
      ? 'Qiskit Aer'
      : activeBackend === 'cirq'
      ? 'Google Cirq'
      : activeBackend === 'pennylane'
      ? 'PennyLane'
      : 'qBraid Cloud';

  const backendPillColor = 'text-[#315B8C] bg-white border-[#315B8C]/40 shadow-sm';

  return (
    <div className="h-14 border-b border-[#413333]/15 bg-[#FAF4EC] px-4 flex items-center justify-between gap-4 select-none shrink-0 z-30">
      {/* Left: Circuit Name & Undo/Redo */}
      <div className="flex items-center gap-3">
        {/* Circuit Title */}
        <div className="flex items-center gap-2">
          {isEditingName ? (
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
              autoFocus
              className="bg-white text-[#413333] font-heading font-semibold text-sm px-2 py-1 rounded border border-[#315B8C] focus:outline-none shadow-sm"
            />
          ) : (
            <div
              onClick={() => {
                setNameInput(circuit.name);
                setIsEditingName(true);
              }}
              className="group flex items-center gap-1.5 cursor-pointer"
              title="Click to rename circuit"
            >
              <span className="font-heading font-bold text-sm text-[#413333] group-hover:text-[#F2765E] transition-colors">
                {circuit.name}
              </span>
              <svg className="w-3.5 h-3.5 text-[#413333]/40 group-hover:text-[#F2765E] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-[#413333]/15 mx-1"></div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded-lg text-[#413333]/70 hover:text-[#413333] hover:bg-[#EDE0CF] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 015 5v2a5 5 0 01-5 5H6" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 6L3 10l4 4" />
            </svg>
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded-lg text-[#413333]/70 hover:text-[#413333] hover:bg-[#EDE0CF] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
            title="Redo (Ctrl+Shift+Z)"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a5 5 0 00-5 5v2a5 5 0 005 5h7" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 6l4 4-4 4" />
            </svg>
          </button>
        </div>

        <div className="h-4 w-px bg-[#413333]/15 mx-1"></div>

        {/* Add Qubit & Moment Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onAddQubit}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-[#413333]/15 hover:border-[#315B8C] text-[#413333] transition-all flex items-center gap-1 cursor-pointer shadow-sm"
            title="Add Qubit wire"
          >
            <span className="text-[#315B8C] font-bold">+</span> Qubit
          </button>
          <button
            onClick={onAddMoment}
            className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white border border-[#413333]/15 hover:border-[#315B8C] text-[#413333] transition-all flex items-center gap-1 cursor-pointer shadow-sm"
            title="Add Timeline Column"
          >
            <span className="text-[#315B8C] font-bold">+</span> Step
          </button>
        </div>
      </div>

      {/* Center: Multi-Backend Pill & View Mode Switcher */}
      <div className="flex items-center gap-2">
        {/* Active Quantum Backend Pill */}
        <button
          onClick={onOpenBackendSelector}
          className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold border flex items-center gap-2 transition-all hover:scale-102 cursor-pointer shadow-sm ${backendPillColor}`}
          title="Click to change quantum backend (Qiskit Aer, Cirq, PennyLane, qBraid)"
        >
          <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
          <span>Backend: {backendName}</span>
          <svg className="w-3 h-3 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <button
          onClick={onOpenBackendComparison}
          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white border border-[#413333]/15 hover:border-[#315B8C] text-[#413333] hover:text-[#315B8C] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          title="Cross-verify execution across Qiskit Aer, Cirq, and PennyLane"
        >
          <span>⚖️ Compare</span>
        </button>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-[#EDE0CF] border border-[#413333]/15 rounded-lg p-0.5">
          <button
            onClick={() => onViewModeChange('canvas')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              viewMode === 'canvas'
                ? 'bg-white text-[#F2765E] border border-[#F2765E]/30 font-semibold shadow-sm'
                : 'text-[#413333]/70 hover:text-[#413333]'
            }`}
          >
            Canvas
          </button>
          <button
            onClick={() => onViewModeChange('split')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              viewMode === 'split'
                ? 'bg-white text-[#F2765E] border border-[#F2765E]/30 font-semibold shadow-sm'
                : 'text-[#413333]/70 hover:text-[#413333]'
            }`}
          >
            Split
          </button>
          <button
            onClick={() => onViewModeChange('code')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
              viewMode === 'code'
                ? 'bg-white text-[#F2765E] border border-[#F2765E]/30 font-semibold shadow-sm'
                : 'text-[#413333]/70 hover:text-[#413333]'
            }`}
          >
            Code
          </button>
        </div>
      </div>

      {/* Right: AI Mentor, Templates, Export, Clear, Help & Simulate */}
      <div className="flex items-center gap-2">
        {/* AI Quantum Mentor CTA */}
        {onOpenAITutor && (
          <button
            onClick={onOpenAITutor}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#315B8C]/40 text-[#315B8C] hover:border-[#F2765E] hover:text-[#F2765E] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Open AI Quantum Mentor (Explain, Debug, Generate, Hints)"
          >
            <span className="text-sm">🤖</span>
            <span>AI Tutor</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F2765E] animate-pulse" />
          </button>
        )}

        {/* Templates */}
        <button
          onClick={onOpenTemplates}
          className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white hover:bg-[#FAF4EC] border border-[#413333]/15 text-[#413333] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          title="Load educational quantum circuit templates"
        >
          <svg className="w-3.5 h-3.5 text-[#315B8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>Templates</span>
        </button>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setExportMenuOpen(!exportMenuOpen)}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white hover:bg-[#FAF4EC] border border-[#413333]/15 text-[#413333] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <svg className="w-3.5 h-3.5 text-[#413333]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export</span>
          </button>

          {exportMenuOpen && (
            <div className="absolute right-0 mt-1 w-44 rounded-xl bg-white border border-[#413333]/15 shadow-xl py-1 z-50">
              <button
                onClick={() => {
                  onExportCode('qiskit');
                  setExportMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-[#413333] hover:bg-[#FAF4EC] hover:text-[#F2765E] transition-colors flex items-center gap-2 cursor-pointer font-mono"
              >
                <span>🐍</span>
                <span>Qiskit Python</span>
              </button>
              <button
                onClick={() => {
                  onExportCode('qasm');
                  setExportMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-[#413333] hover:bg-[#FAF4EC] hover:text-[#F2765E] transition-colors flex items-center gap-2 cursor-pointer font-mono"
              >
                <span>📜</span>
                <span>OpenQASM 2.0</span>
              </button>
              <button
                onClick={() => {
                  onExportCode('json');
                  setExportMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-[#413333] hover:bg-[#FAF4EC] hover:text-[#F2765E] transition-colors flex items-center gap-2 cursor-pointer font-mono"
              >
                <span>📦</span>
                <span>Circuit IR JSON</span>
              </button>
            </div>
          )}
        </div>

        {/* Clear */}
        <button
          onClick={onClearCircuit}
          className="p-1.5 rounded-lg text-[#413333]/60 hover:text-[#F2765E] hover:bg-[#EDE0CF] transition-colors cursor-pointer"
          title="Clear circuit"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        {/* Keyboard Shortcuts */}
        <button
          onClick={onOpenShortcuts}
          className="p-1.5 rounded-lg text-[#413333]/60 hover:text-[#413333] hover:bg-[#EDE0CF] transition-colors cursor-pointer font-mono text-xs font-bold"
          title="Keyboard shortcuts (?)"
        >
          ?
        </button>

        {/* Run Simulation Primary CTA */}
        <button
          onClick={onRunSimulation}
          disabled={isSimulating}
          className="px-3.5 py-1.5 rounded-lg font-heading font-semibold text-xs text-white bg-[#F2765E] hover:bg-[#e0634b] shadow-md shadow-[#F2765E]/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          {isSimulating ? (
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
          <span>Simulate</span>
        </button>
      </div>
    </div>
  );
};

