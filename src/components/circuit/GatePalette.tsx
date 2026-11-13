import React, { useState } from 'react';
import type { GateCategory, GateDefinition } from '../../types/circuit';
import { getAllGates, getGatesByCategory } from '../../core/quantum/gateRegistry';

interface GatePaletteProps {
  onDragStartGate?: (gateId: string) => void;
  onSelectGateToAdd?: (gateId: string) => void;
}

const CATEGORIES: { id: GateCategory; label: string }[] = [
  { id: 'single', label: 'Single-Qubit' },
  { id: 'multi', label: 'Multi-Qubit' },
  { id: 'phase', label: 'Rotations & Phase' },
  { id: 'measurement', label: 'Measurement' },
  { id: 'utility', label: 'Utility' },
];

export const GatePalette: React.FC<GatePaletteProps> = ({ onDragStartGate, onSelectGateToAdd }) => {
  const [activeCategory, setActiveCategory] = useState<GateCategory | 'all'>('all');
  const [hoveredGate, setHoveredGate] = useState<GateDefinition | null>(null);

  const displayedGates =
    activeCategory === 'all' ? getAllGates() : getGatesByCategory(activeCategory);

  return (
    <aside className="w-64 bg-[#FAF4EC] border-r border-[#413333]/15 flex flex-col shrink-0 select-none">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-[#413333]/15 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-mono uppercase tracking-wider text-[#413333] font-semibold">
            Gate Library
          </h2>
          <p className="text-[11px] text-[#413333]/60 mt-0.5">Drag onto circuit wires</p>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 bg-[#EDE0CF] border border-[#315B8C]/30 text-[#315B8C] font-semibold rounded">
          {displayedGates.length} Gates
        </span>
      </div>

      {/* Category Pills */}
      <div className="px-3 pt-3 pb-1 flex flex-wrap gap-1 border-b border-[#413333]/10">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-white text-[#F2765E] border border-[#F2765E]/40 font-semibold shadow-sm'
              : 'text-[#413333]/70 hover:text-[#413333] hover:bg-white/40'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-white text-[#F2765E] border border-[#F2765E]/40 font-semibold shadow-sm'
                : 'text-[#413333]/70 hover:text-[#413333] hover:bg-white/40'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gate Grid */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {displayedGates.map((gate) => {
            return (
              <div
                key={gate.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', gate.id);
                  onDragStartGate?.(gate.id);
                }}
                onClick={() => onSelectGateToAdd?.(gate.id)}
                onMouseEnter={() => setHoveredGate(gate)}
                onMouseLeave={() => setHoveredGate(null)}
                className={`relative group p-2.5 rounded-lg border bg-white hover:bg-[#FAF4EC] transition-all cursor-grab active:cursor-grabbing flex flex-col items-center justify-center text-center shadow-sm ${gate.color.border} hover:shadow-md ${gate.color.glow}`}
              >
                {/* Gate Symbol Badge */}
                <div
                  className={`w-9 h-9 rounded-md flex items-center justify-center font-mono font-bold text-base mb-1.5 border ${gate.color.bg} ${gate.color.border} ${gate.color.text}`}
                >
                  {gate.symbol}
                </div>

                {/* Gate Name */}
                <span className="text-xs font-medium text-[#413333] truncate w-full">
                  {gate.name}
                </span>

                {/* Meta info badge */}
                <div className="flex items-center gap-1 mt-1 text-[9px] font-mono text-[#413333]/60">
                  <span>
                    {gate.qubits + (gate.controls || 0)}Q
                  </span>
                  {gate.hasParams && (
                    <span className="text-[#F2765E] font-bold">• param</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Educational Hover Tooltip */}
      <div className="p-3 border-t border-[#413333]/15 bg-[#EDE0CF]/60 min-h-[110px] flex flex-col justify-center">
        {hoveredGate ? (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-1.5 py-0.5 text-xs font-mono font-bold rounded border ${hoveredGate.color.bg} ${hoveredGate.color.border} ${hoveredGate.color.text}`}>
                {hoveredGate.symbol}
              </span>
              <span className="text-xs font-semibold text-[#413333] truncate">
                {hoveredGate.name}
              </span>
            </div>
            <p className="text-[11px] text-[#413333]/70 line-clamp-2 leading-relaxed">
              {hoveredGate.description}
            </p>
            {hoveredGate.exampleUsage && (
              <p className="text-[10px] font-mono text-[#315B8C] mt-1 truncate">
                {hoveredGate.exampleUsage}
              </p>
            )}
          </div>
        ) : (
          <div className="text-center text-[#413333]/60 text-xs py-2">
            <span className="block font-mono text-[11px] text-[#413333] font-semibold mb-0.5">Quick Tip</span>
            Drag a gate onto any qubit wire or click to append to circuit.
          </div>
        )}
      </div>
    </aside>
  );
};
