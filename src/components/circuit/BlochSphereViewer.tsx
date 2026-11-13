import React, { useState } from 'react';
import type { BlochVector } from '../../types/circuit';

interface BlochSphereViewerProps {
  blochVectors?: BlochVector[];
  qubits: number;
}

export const BlochSphereViewer: React.FC<BlochSphereViewerProps> = ({
  blochVectors = [],
  qubits,
}) => {
  const [selectedQubit, setSelectedQubit] = useState(0);

  // Find vector for selected qubit or default to ground state |0> (z = 1)
  const currentVector = blochVectors.find((bv) => bv.qubit === selectedQubit) || {
    qubit: selectedQubit,
    x: 0,
    y: 0,
    z: 1,
  };

  const { x, y, z } = currentVector;
  const radius = 68;
  const cx = 110;
  const cy = 110;

  // 3D Oblique/Isometric Projection onto 2D SVG canvas
  // X points forward-left, Y points right, Z points upward
  // projection: px = cx + y * R - x * R * 0.4
  //             py = cy - z * R + x * R * 0.25
  const endX = cx + y * radius * 0.85 - x * radius * 0.45;
  const endY = cy - z * radius + x * radius * 0.28;

  // Spherical angles
  const norm = Math.sqrt(x * x + y * y + z * z);
  const thetaRad = norm > 1e-6 ? Math.acos(Math.max(-1, Math.min(1, z / norm))) : 0;
  const phiRad = Math.atan2(y, x);

  const thetaDeg = Math.round((thetaRad * 180) / Math.PI);
  const phiDeg = Math.round((phiRad >= 0 ? phiRad : phiRad + 2 * Math.PI) * (180 / Math.PI));

  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl bg-white border border-[#413333]/15 shadow-sm">
      {/* Qubit Selector Pills */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-[#413333]/80 uppercase tracking-wider font-semibold">
          Bloch Sphere Coordinates
        </span>
        <div className="flex items-center gap-1">
          {Array.from({ length: qubits }, (_, i) => (
            <button
              key={i}
              onClick={() => setSelectedQubit(i)}
              className={`px-2 py-0.5 text-xs font-mono rounded transition-colors cursor-pointer ${
                selectedQubit === i
                  ? 'bg-[#315B8C] text-white border border-[#315B8C] font-semibold shadow-sm'
                  : 'bg-[#EDE0CF] text-[#413333] hover:bg-[#EDE0CF]/80 border border-[#413333]/15'
              }`}
            >
              q{i}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
        {/* SVG Bloch Sphere Graphic */}
        <div className="relative w-[220px] h-[220px] flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 220 220">
            <defs>
              <radialGradient id="sphereGrad" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#315B8C" stopOpacity="0.08" />
                <stop offset="65%" stopColor="#EDE0CF" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#F5EBDD" stopOpacity="0.8" />
              </radialGradient>
              <linearGradient id="vectorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#315B8C" />
                <stop offset="100%" stopColor="#F2765E" />
              </linearGradient>
            </defs>

            {/* Sphere Body */}
            <circle cx={cx} cy={cy} r={radius} fill="url(#sphereGrad)" stroke="#315B8C" strokeOpacity="0.35" strokeWidth="1.5" />

            {/* Equator Ellipse (XY plane) */}
            <ellipse cx={cx} cy={cy} rx={radius} ry={radius * 0.3} fill="none" stroke="#315B8C" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="3 3" />

            {/* Axes */}
            {/* Z axis (|0> to |1>) */}
            <line x1={cx} y1={cy - radius - 14} x2={cx} y2={cy + radius + 14} stroke="#413333" strokeOpacity="0.4" strokeWidth="1.5" />
            <text x={cx} y={cy - radius - 18} textAnchor="middle" fill="#315B8C" fontSize="10" fontFamily="monospace" fontWeight="bold">|0⟩ (+z)</text>
            <text x={cx} y={cy + radius + 24} textAnchor="middle" fill="#413333" fontSize="10" fontFamily="monospace" fontWeight="bold">|1⟩ (-z)</text>

            {/* Y axis (+y to -y) */}
            <line x1={cx - radius - 14} y1={cy} x2={cx + radius + 14} y2={cy} stroke="#413333" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="2 2" />
            <text x={cx + radius + 18} y={cy + 3} textAnchor="start" fill="#413333" opacity="0.7" fontSize="9" fontFamily="monospace">+y</text>

            {/* X axis (forward diagonal) */}
            <line x1={cx + radius * 0.5} y1={cy - radius * 0.3} x2={cx - radius * 0.5} y2={cy + radius * 0.3} stroke="#413333" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="2 2" />
            <text x={cx - radius * 0.5 - 6} y={cy + radius * 0.3 + 12} textAnchor="middle" fill="#413333" opacity="0.7" fontSize="9" fontFamily="monospace">+x</text>

            {/* Center Origin Dot */}
            <circle cx={cx} cy={cy} r="2.5" fill="#413333" opacity="0.6" />

            {/* State Vector Arrow */}
            <line
              x1={cx}
              y1={cy}
              x2={endX}
              y2={endY}
              stroke="url(#vectorGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Vector Tip Glow and Head */}
            <circle cx={endX} cy={endY} r="5" fill="#F2765E" className="animate-pulse shadow-lg" />
            <circle cx={endX} cy={endY} r="2.5" fill="#ffffff" />
          </svg>
        </div>

        {/* Numeric Telemetry Card */}
        <div className="flex-1 flex flex-col gap-2.5 max-w-xs font-mono text-xs">
          <div className="flex items-center justify-between pb-1 border-b border-[#413333]/10">
            <span className="text-[#413333]/70">Target Qubit:</span>
            <span className="text-[#315B8C] font-bold">|q{selectedQubit}⟩</span>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-[#FAF4EC] p-2.5 rounded-lg border border-[#413333]/15 text-center">
            <div>
              <div className="text-[10px] text-[#413333]/60 uppercase">X (Pauli-X)</div>
              <div className="text-[#413333] font-semibold mt-0.5">{x >= 0 ? `+${x.toFixed(3)}` : x.toFixed(3)}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#413333]/60 uppercase">Y (Pauli-Y)</div>
              <div className="text-[#413333] font-semibold mt-0.5">{y >= 0 ? `+${y.toFixed(3)}` : y.toFixed(3)}</div>
            </div>
            <div>
              <div className="text-[10px] text-[#413333]/60 uppercase">Z (Pauli-Z)</div>
              <div className="text-[#315B8C] font-semibold mt-0.5">{z >= 0 ? `+${z.toFixed(3)}` : z.toFixed(3)}</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-[#413333]/70">
            <span>Polar θ (Colatitude):</span>
            <span className="text-[#413333] font-medium">{thetaDeg}° ({thetaRad.toFixed(2)} rad)</span>
          </div>

          <div className="flex items-center justify-between text-[#413333]/70">
            <span>Azimuthal φ (Longitude):</span>
            <span className="text-[#413333] font-medium">{phiDeg}° ({phiRad.toFixed(2)} rad)</span>
          </div>

          <div className="flex items-center justify-between text-[#413333]/70">
            <span>Purity |r|:</span>
            <span className="text-[#315B8C] font-semibold">{norm.toFixed(3)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
