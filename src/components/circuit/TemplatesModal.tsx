import React from 'react';
import type { Circuit } from '../../types/circuit';
import { CIRCUIT_TEMPLATES, type CircuitTemplate } from '../../core/quantum/templates';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (circuit: Circuit) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#413333]/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#413333]/15 rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#413333]/15 bg-[#FAF4EC] flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-heading font-bold text-[#413333] text-base">
              Quantum Circuit Templates
            </h3>
            <p className="text-xs text-[#413333]/70 mt-0.5">
              Select a pre-built quantum algorithm or state to load into the workspace
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#413333]/60 hover:text-[#413333] p-1 rounded transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 bg-white">
          {CIRCUIT_TEMPLATES.map((tmpl: CircuitTemplate) => (
            <div
              key={tmpl.id}
              className="p-4 rounded-xl border border-[#413333]/15 bg-[#FAF4EC] hover:bg-white hover:border-[#315B8C]/40 transition-all flex items-start justify-between gap-4 group shadow-xs"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <h4 className="font-heading font-bold text-[#413333] text-sm group-hover:text-[#315B8C] transition-colors">
                    {tmpl.name}
                  </h4>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono rounded font-semibold border ${
                      tmpl.difficulty === 'Beginner'
                        ? 'bg-[#315B8C]/10 border-[#315B8C]/30 text-[#315B8C]'
                        : tmpl.difficulty === 'Intermediate'
                        ? 'bg-[#F2765E]/10 border-[#F2765E]/30 text-[#F2765E]'
                        : 'bg-[#413333]/10 border-[#413333]/30 text-[#413333]'
                    }`}
                  >
                    {tmpl.difficulty}
                  </span>
                  <span className="text-[10px] font-mono text-[#413333]/60">
                    {tmpl.circuit.qubits} Qubits
                  </span>
                </div>

                <p className="text-xs text-[#413333]/80 leading-relaxed mb-2.5">
                  {tmpl.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {tmpl.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[9px] font-mono bg-white border border-[#413333]/15 text-[#413333]/70 rounded shadow-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectTemplate(JSON.parse(JSON.stringify(tmpl.circuit)));
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#F2765E] hover:bg-[#e0634b] text-white border border-[#F2765E] transition-all shrink-0 cursor-pointer shadow-sm"
              >
                Load Circuit →
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#FAF4EC] border-t border-[#413333]/15 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-mono text-[#413333]/70 hover:text-[#413333] bg-white border border-[#413333]/15 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
