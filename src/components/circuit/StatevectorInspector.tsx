import React from 'react';
import type { SimulationResult } from '../../types/circuit';

interface StatevectorInspectorProps {
  statevector?: SimulationResult['statevector'];
  qubits?: number;
  executionTimeMs?: number;
}

export const StatevectorInspector: React.FC<StatevectorInspectorProps> = ({ statevector = [] }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-[#413333]/10 shadow-sm">
      <table className="w-full text-left text-xs font-mono">
        <thead className="bg-[#EDE0CF] text-[#413333] border-b border-[#413333]/15 uppercase tracking-wider text-[10px]">
          <tr>
            <th className="py-2.5 px-3 font-semibold">State</th>
            <th className="py-2.5 px-3 font-semibold">Probability</th>
            <th className="py-2.5 px-3 font-semibold">Amplitude (Re + Im)</th>
            <th className="py-2.5 px-3 font-semibold">Magnitude</th>
            <th className="py-2.5 px-3 font-semibold text-right">Phase</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#413333]/10">
          {(statevector || []).map((row) => {
            const hasAmplitude = row.probability > 0.0001;

            return (
              <tr
                key={row.basisState}
                className={`hover:bg-[#EDE0CF]/30 transition-colors ${
                  hasAmplitude ? 'text-[#413333]' : 'text-[#413333]/40'
                }`}
              >
                {/* Basis State */}
                <td className="py-2 px-3 font-bold text-[#315B8C]">
                  {row.basisState}
                </td>

                {/* Probability Bar */}
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-right">
                      {(row.probability * 100).toFixed(1)}%
                    </span>
                    <div className="w-24 h-2 bg-[#EDE0CF] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#315B8C] to-[#315B8C]/80 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, row.probability * 100)}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Complex Amplitude */}
                <td className="py-2 px-3">
                  {row.real.toFixed(3)}
                  {row.imag >= 0 ? ' + ' : ' - '}
                  {Math.abs(row.imag).toFixed(3)}i
                </td>

                {/* Magnitude */}
                <td className="py-2 px-3">
                  {row.magnitude.toFixed(3)}
                </td>

                {/* Phase & Mini Phasor Dial */}
                <td className="py-2 px-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <span>{row.phaseDegrees.toFixed(0)}°</span>
                    {/* Visual Phasor Indicator Dial */}
                    <div className="relative w-4 h-4 rounded-full border border-[#413333]/30 bg-white flex items-center justify-center">
                      <div
                        className="absolute w-1.5 h-[1.5px] bg-[#F2765E] origin-left"
                        style={{ transform: `rotate(${-row.phaseDegrees}deg)` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
