import React from 'react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: 'Delete / Backspace', desc: 'Delete currently selected gate' },
  { key: 'Ctrl / Cmd + Z', desc: 'Undo previous circuit modification' },
  { key: 'Ctrl / Cmd + Shift + Z', desc: 'Redo previously undone modification' },
  { key: 'Ctrl / Cmd + D', desc: 'Duplicate selected gate' },
  { key: 'Ctrl / Cmd + Enter', desc: 'Re-run quantum state simulation' },
  { key: 'Escape', desc: 'Deselect gate or close active modal' },
  { key: '?', desc: 'Open this keyboard shortcuts cheatsheet' },
  { key: 'Drag & Drop', desc: 'Drag gates from palette to place, or drag placed gates to reposition' },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#413333]/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#413333]/15 rounded-xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#413333]/15 bg-[#FAF4EC] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#315B8C]/15 border border-[#315B8C]/30 text-[#315B8C] flex items-center justify-center font-mono font-bold text-xs">
              ⌨
            </div>
            <h3 className="font-heading font-bold text-[#413333] text-base">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#413333]/60 hover:text-[#413333] p-1 rounded transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 space-y-3 bg-white">
          {SHORTCUTS.map((sc, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-[#413333] font-medium">{sc.desc}</span>
              <kbd className="px-2 py-1 bg-[#FAF4EC] border border-[#413333]/20 rounded font-mono text-[#315B8C] font-semibold shadow-sm shrink-0">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#FAF4EC] border-t border-[#413333]/15 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-mono bg-[#F2765E] hover:bg-[#e0634b] text-white rounded-lg transition-colors cursor-pointer font-medium shadow-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
