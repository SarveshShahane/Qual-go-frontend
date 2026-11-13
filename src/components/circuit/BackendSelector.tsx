import React from 'react';
import type { QuantumBackendId, QuantumBackendInfo } from '../../types/circuit';

interface BackendSelectorProps {
  backends: QuantumBackendInfo[];
  activeBackend: QuantumBackendId;
  onSelectBackend: (backendId: QuantumBackendId) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const BackendSelector: React.FC<BackendSelectorProps> = ({
  backends,
  activeBackend,
  onSelectBackend,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#413333]/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-white border border-[#413333]/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#413333]/15 flex items-center justify-between bg-[#FAF4EC]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#315B8C] flex items-center justify-center text-white shadow-md shadow-[#315B8C]/20">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 className="font-heading font-bold text-[#413333] text-base">Select Quantum Execution Backend</h3>
              <p className="text-xs text-[#413333]/70">Choose simulator framework or cloud QPU gateway for circuit execution</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#413333]/60 hover:text-[#413333] hover:bg-[#EDE0CF]/50 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Backends List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 bg-[#FAF4EC]/30">
          {backends.map((b) => {
            const isSelected = activeBackend === b.id;

            return (
              <div
                key={b.id}
                onClick={() => {
                  onSelectBackend(b.id);
                  onClose();
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'bg-[#315B8C]/10 border-[#315B8C] shadow-lg shadow-[#315B8C]/10'
                    : 'bg-white border-[#413333]/15 hover:border-[#315B8C]/50 hover:bg-[#FAF4EC]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* Provider badge/icon */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner ${
                        b.id === 'pennylane' || b.id === 'qbraid'
                          ? 'bg-[#F2765E]/15 text-[#F2765E] border border-[#F2765E]/30'
                          : 'bg-[#315B8C]/15 text-[#315B8C] border border-[#315B8C]/30'
                      }`}
                    >
                      {b.id === 'client' && '⚡'}
                      {b.id === 'qiskit_aer' && 'IBM'}
                      {b.id === 'cirq' && 'CIRQ'}
                      {b.id === 'pennylane' && 'XND'}
                      {b.id === 'qbraid' && 'qB'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-semibold text-sm text-[#413333]">{b.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EDE0CF] text-[#413333] border border-[#413333]/15">
                          {b.framework}
                        </span>
                        {b.version && (
                          <span className="text-[10px] font-mono text-[#315B8C] font-semibold">
                            v{b.version.split(' ')[1] || b.version}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#413333]/70 mt-0.5">{b.provider}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#315B8C]/10 border border-[#315B8C]/25 text-[#315B8C]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#315B8C] animate-pulse"></span>
                      Available
                    </span>
                    {isSelected && (
                      <span className="text-xs font-semibold font-mono text-white bg-[#315B8C] px-2 py-0.5 rounded shadow-sm">
                        ACTIVE
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-2.5 text-xs text-[#413333]/80 leading-relaxed font-sans">{b.description}</p>

                {b.features && b.features.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5 pt-2 border-t border-[#413333]/10">
                    {b.features.map((f, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EDE0CF]/60 text-[#413333]/80 border border-[#413333]/10"
                      >
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#413333]/15 bg-[#FAF4EC] flex items-center justify-between text-xs text-[#413333]/70 font-mono">
          <span>Active Backend: <strong className="text-[#315B8C]">{activeBackend.toUpperCase()}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#F2765E] hover:bg-[#e0634b] text-white transition-colors font-sans font-semibold cursor-pointer shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
