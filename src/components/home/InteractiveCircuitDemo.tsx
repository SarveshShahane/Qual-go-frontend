import React, { useState, useMemo } from 'react';

type GateType = 'I' | 'H' | 'X' | 'Z' | 'CNOT';

export const InteractiveCircuitDemo: React.FC = () => {
  // Simple 2-qubit circuit with 3 timesteps
  const [q0Gates, setQ0Gates] = useState<GateType[]>(['H', 'I', 'I']);
  const [q1Gates, setQ1Gates] = useState<GateType[]>(['I', 'CNOT', 'I']);
  const [backendTab, setBackendTab] = useState<'qiskit' | 'cirq' | 'pennylane' | 'qasm'>('qiskit');
  const [copied, setCopied] = useState(false);

  // Compute quantum statevector & probabilities based on gates
  const stateResult = useMemo(() => {
    // Initial state |00>
    // State order: |00>, |01>, |10>, |11> (q0 = first digit, q1 = second digit)
    let p00 = 1.0;
    let p01 = 0.0;
    let p10 = 0.0;
    let p11 = 0.0;
    let diracString = '|00⟩';
    let blochTheta = 0; // for q0: 0 is North Pole (|0>), PI is South Pole (|1>), PI/2 is Equator
    let blochPhi = 0;
    let aiExplanation = 'Ground state |00⟩ initialized. Both qubits are deterministic with 100% probability in state 0.';

    const hasH0 = q0Gates.includes('H');
    const hasX0 = q0Gates.includes('X');
    const hasZ0 = q0Gates.includes('Z');
    const hasX1 = q1Gates.includes('X');
    const hasCNOT = q1Gates.includes('CNOT');

    if (hasH0 && hasCNOT) {
      // Bell State (|00> + |11>) / sqrt(2)
      p00 = 0.5;
      p01 = 0.0;
      p10 = 0.0;
      p11 = 0.5;
      diracString = '0.707 |00⟩ + 0.707 |11⟩';
      blochTheta = 90;
      blochPhi = 0;
      aiExplanation = '⚡ Maximally Entangled Bell State |Φ⁺⟩: Measuring q₀ as |0⟩ collapses q₁ into |0⟩ with 100% correlation. Neither qubit has a definite state on its own.';
    } else if (hasH0 && hasX1) {
      p00 = 0.0;
      p01 = 0.5;
      p10 = 0.0;
      p11 = 0.5;
      diracString = '0.707 |01⟩ + 0.707 |11⟩';
      blochTheta = 90;
      blochPhi = 0;
      aiExplanation = 'Superposition on q₀ combined with bit-flip X on q₁. Measurement yields |01⟩ or |11⟩ with equal 50% probability.';
    } else if (hasH0) {
      p00 = 0.5;
      p01 = 0.0;
      p10 = 0.5;
      p11 = 0.0;
      diracString = '0.707 |00⟩ + 0.707 |10⟩';
      blochTheta = 90;
      blochPhi = hasZ0 ? 180 : 0;
      aiExplanation = '✨ Superposition State (|0⟩ + |1⟩)/√2 on q₀: The qubit exists in a simultaneous combination of 0 and 1 until measured. Qubit q₁ remains in |0⟩.';
    } else if (hasX0 && hasX1) {
      p00 = 0.0;
      p01 = 0.0;
      p10 = 0.0;
      p11 = 1.0;
      diracString = '|11⟩';
      blochTheta = 180;
      blochPhi = 0;
      aiExplanation = 'Both qubits flipped to |1⟩ via Pauli-X NOT gates. 100% probability of observing |11⟩.';
    } else if (hasX0) {
      p00 = 0.0;
      p01 = 0.0;
      p10 = 1.0;
      p11 = 0.0;
      diracString = '|10⟩';
      blochTheta = 180;
      blochPhi = 0;
      aiExplanation = 'Pauli-X applied to q₀, flipping state from |0⟩ to |1⟩. Output is deterministic |10⟩.';
    } else if (hasX1) {
      p00 = 0.0;
      p01 = 1.0;
      p10 = 0.0;
      p11 = 0.0;
      diracString = '|01⟩';
      blochTheta = 0;
      blochPhi = 0;
      aiExplanation = 'Pauli-X applied to q₁, flipping state from |0⟩ to |1⟩. Output is deterministic |01⟩.';
    }

    return { p00, p01, p10, p11, diracString, blochTheta, blochPhi, aiExplanation };
  }, [q0Gates, q1Gates]);

  // Apply a preset
  const applyPreset = (preset: 'ground' | 'superposition' | 'bell' | 'bitflip') => {
    if (preset === 'ground') {
      setQ0Gates(['I', 'I', 'I']);
      setQ1Gates(['I', 'I', 'I']);
    } else if (preset === 'superposition') {
      setQ0Gates(['H', 'I', 'I']);
      setQ1Gates(['I', 'I', 'I']);
    } else if (preset === 'bell') {
      setQ0Gates(['H', 'I', 'I']);
      setQ1Gates(['I', 'CNOT', 'I']);
    } else if (preset === 'bitflip') {
      setQ0Gates(['H', 'I', 'I']);
      setQ1Gates(['X', 'I', 'I']);
    }
  };

  // Toggle or cycle gate in a slot
  const cycleGate = (qubit: 0 | 1, index: number) => {
    const list = qubit === 0 ? [...q0Gates] : [...q1Gates];
    const current = list[index];
    let next: GateType = 'I';
    if (qubit === 0) {
      if (current === 'I') next = 'H';
      else if (current === 'H') next = 'X';
      else if (current === 'X') next = 'Z';
      else next = 'I';
      list[index] = next;
      setQ0Gates(list);
    } else {
      if (current === 'I') next = 'CNOT';
      else if (current === 'CNOT') next = 'X';
      else if (current === 'X') next = 'H';
      else next = 'I';
      list[index] = next;
      setQ1Gates(list);
    }
  };

  // Generate multi-backend code snippets
  const getBackendCode = () => {
    const hasH0 = q0Gates.includes('H');
    const hasX0 = q0Gates.includes('X');
    const hasZ0 = q0Gates.includes('Z');
    const hasX1 = q1Gates.includes('X');
    const hasCNOT = q1Gates.includes('CNOT');

    if (backendTab === 'qiskit') {
      return `# Qiskit Aer Simulation Backend
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

qc = QuantumCircuit(2, 2)
${hasH0 ? 'qc.h(0)\n' : ''}${hasX0 ? 'qc.x(0)\n' : ''}${hasZ0 ? 'qc.z(0)\n' : ''}${hasX1 ? 'qc.x(1)\n' : ''}${hasCNOT ? 'qc.cx(0, 1)\n' : ''}qc.measure([0, 1], [0, 1])

simulator = AerSimulator()
job = simulator.run(qc, shots=1024)
counts = job.result().get_counts()
print("Simulation counts:", counts)`;
    } else if (backendTab === 'cirq') {
      return `# Cirq Multi-Simulator Execution
import cirq

q0, q1 = cirq.LineQubit.range(2)
circuit = cirq.Circuit(
${hasH0 ? '    cirq.H(q0),\n' : ''}${hasX0 ? '    cirq.X(q0),\n' : ''}${hasZ0 ? '    cirq.Z(q0),\n' : ''}${hasX1 ? '    cirq.X(q1),\n' : ''}${hasCNOT ? '    cirq.CNOT(q0, q1),\n' : ''}    cirq.measure(q0, q1, key='result')
)

simulator = cirq.Simulator()
result = simulator.run(circuit, repetitions=1024)
print(result.histogram(key='result'))`;
    } else if (backendTab === 'pennylane') {
      return `# PennyLane Quantum Differentiable Circuit
import pennylane as qml

dev = qml.device('default.qubit', wires=2, shots=1024)

@qml.qnode(dev)
def circuit():
${hasH0 ? '    qml.Hadamard(wires=0)\n' : ''}${hasX0 ? '    qml.PauliX(wires=0)\n' : ''}${hasZ0 ? '    qml.PauliZ(wires=0)\n' : ''}${hasX1 ? '    qml.PauliX(wires=1)\n' : ''}${hasCNOT ? '    qml.CNOT(wires=[0, 1])\n' : ''}    return qml.probs(wires=[0, 1])

print("Probabilities:", circuit())`;
    } else {
      return `// OpenQASM 3.0 Standard Representation
OPENQASM 3.0;
include "stdgates.inc";

qubit[2] q;
bit[2] c;

${hasH0 ? 'h q[0];\n' : ''}${hasX0 ? 'x q[0];\n' : ''}${hasZ0 ? 'z q[0];\n' : ''}${hasX1 ? 'x q[1];\n' : ''}${hasCNOT ? 'cx q[0], q[1];\n' : ''}c[0] = measure q[0];
c[1] = measure q[1];`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getBackendCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="circuit-demo" className="py-20 border-b border-white/10 bg-[#07090e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            LIVE INTERACTIVE PREVIEW
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Quantum Circuit Studio & Real-Time Simulator
          </h2>
          <p className="mt-3 text-slate-300 text-base">
            Click gates or choose presets to manipulate qubits in real time. Watch quantum statevectors, 
            probabilities, and Bloch coordinates respond instantly with AI guidance.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mr-2">Presets:</span>
          <button
            onClick={() => applyPreset('bell')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 transition-colors cursor-pointer"
          >
            ⚡ Bell State (|Φ⁺⟩)
          </button>
          <button
            onClick={() => applyPreset('superposition')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:border-cyan-500/30 hover:text-white transition-colors cursor-pointer"
          >
            ✨ Superposition (H on q₀)
          </button>
          <button
            onClick={() => applyPreset('bitflip')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:border-cyan-500/30 hover:text-white transition-colors cursor-pointer"
          >
            🔄 Bit-Flip Superposition
          </button>
          <button
            onClick={() => applyPreset('ground')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:border-cyan-500/30 hover:text-white transition-colors cursor-pointer"
          >
            Reset (|00⟩)
          </button>
        </div>

        {/* Main Interactive Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 cols: Circuit Canvas + AI Tutor Box */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Visual Circuit Canvas */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md shadow-xl">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <span className="font-heading font-semibold text-sm text-white">Quantum Wire Canvas</span>
                </div>
                <span className="text-xs font-mono text-slate-400">Click any gate slot to cycle</span>
              </div>

              {/* Qubit 0 Line */}
              <div className="flex items-center gap-4 py-4 border-b border-slate-800/80">
                <div className="w-16 flex items-center gap-2 font-mono text-sm text-cyan-300">
                  <span className="font-bold">|q₀⟩</span>
                  <span className="text-xs text-slate-500">|0⟩</span>
                </div>
                <div className="flex-1 flex items-center gap-3 relative">
                  {/* Wire line */}
                  <div className="absolute inset-x-0 h-0.5 bg-slate-700/80 z-0"></div>
                  {q0Gates.map((gate, idx) => (
                    <button
                      key={`q0-${idx}`}
                      onClick={() => cycleGate(0, idx)}
                      className={`relative z-10 w-12 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-sm transition-all cursor-pointer ${
                        gate === 'H'
                          ? 'bg-cyan-500/20 text-cyan-300 border-2 border-cyan-400 shadow-md shadow-cyan-500/20'
                          : gate === 'X'
                          ? 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-400 shadow-md shadow-emerald-500/20'
                          : gate === 'Z'
                          ? 'bg-amber-500/20 text-amber-300 border-2 border-amber-400 shadow-md shadow-amber-500/20'
                          : 'bg-slate-800/90 text-slate-500 border border-slate-700 hover:border-slate-500'
                      }`}
                      title="Click to cycle gate"
                    >
                      {gate === 'I' ? '—' : gate}
                    </button>
                  ))}
                  <div className="relative z-10 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-[11px] font-mono text-slate-400 ml-auto">
                    Measure [0]
                  </div>
                </div>
              </div>

              {/* Qubit 1 Line */}
              <div className="flex items-center gap-4 py-4">
                <div className="w-16 flex items-center gap-2 font-mono text-sm text-cyan-300">
                  <span className="font-bold">|q₁⟩</span>
                  <span className="text-xs text-slate-500">|0⟩</span>
                </div>
                <div className="flex-1 flex items-center gap-3 relative">
                  {/* Wire line */}
                  <div className="absolute inset-x-0 h-0.5 bg-slate-700/80 z-0"></div>
                  {q1Gates.map((gate, idx) => (
                    <button
                      key={`q1-${idx}`}
                      onClick={() => cycleGate(1, idx)}
                      className={`relative z-10 w-12 h-12 rounded-lg flex items-center justify-center font-mono font-bold text-sm transition-all cursor-pointer ${
                        gate === 'CNOT'
                          ? 'bg-indigo-500/20 text-indigo-300 border-2 border-indigo-400 shadow-md shadow-indigo-500/20'
                          : gate === 'X'
                          ? 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-400 shadow-md shadow-emerald-500/20'
                          : gate === 'H'
                          ? 'bg-cyan-500/20 text-cyan-300 border-2 border-cyan-400'
                          : 'bg-slate-800/90 text-slate-500 border border-slate-700 hover:border-slate-500'
                      }`}
                      title="Click to cycle gate"
                    >
                      {gate === 'I' ? '—' : gate === 'CNOT' ? '⊕' : gate}
                    </button>
                  ))}
                  <div className="relative z-10 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-[11px] font-mono text-slate-400 ml-auto">
                    Measure [1]
                  </div>
                </div>
              </div>

              {/* Gate Palette Hint */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-cyan-400"></span> H: Hadamard</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-emerald-400"></span> X: Pauli-X (NOT)</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-amber-400"></span> Z: Pauli-Z</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-indigo-400"></span> ⊕: CNOT Target</span>
                </div>
                <span className="font-mono text-cyan-400/80">Simulator: Qiskit Aer (1024 shots)</span>
              </div>
            </div>

            {/* AI Quantum Copilot Live Insight */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 border border-cyan-500/20 relative overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                      Qual AI Copilot • Live Pedagogical Insight
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-emerald-950 border border-emerald-500/30 text-emerald-400 rounded">
                      Real-time
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-200 leading-relaxed font-sans">
                    {stateResult.aiExplanation}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 cols: Probability Distribution & Multi-Backend Code */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Probability & Statevector Readout */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md shadow-xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/5">
                <span className="font-heading font-semibold text-sm text-white">Measurement Probabilities</span>
                <span className="text-xs font-mono text-cyan-400">
                  |ψ⟩ = {stateResult.diracString}
                </span>
              </div>

              {/* Probability Bars */}
              <div className="space-y-3">
                {[
                  { state: '|00⟩', prob: stateResult.p00 },
                  { state: '|01⟩', prob: stateResult.p01 },
                  { state: '|10⟩', prob: stateResult.p10 },
                  { state: '|11⟩', prob: stateResult.p11 },
                ].map((item) => (
                  <div key={item.state} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-300 font-bold">{item.state}</span>
                      <span className="text-cyan-400">{(item.prob * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${item.prob * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bloch Sphere Coordinates for q0 */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">q₀ Bloch Angles:</span>
                <span className="text-slate-200">
                  θ = {stateResult.blochTheta}°, φ = {stateResult.blochPhi}°
                </span>
              </div>
            </div>

            {/* Multi-Backend Code Tabs */}
            <div className="p-5 rounded-2xl bg-[#090d16] border border-white/10 shadow-xl flex-1 flex flex-col">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setBackendTab('qiskit')}
                    className={`px-2.5 py-1 text-xs font-mono rounded ${
                      backendTab === 'qiskit' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Qiskit
                  </button>
                  <button
                    onClick={() => setBackendTab('cirq')}
                    className={`px-2.5 py-1 text-xs font-mono rounded ${
                      backendTab === 'cirq' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Cirq
                  </button>
                  <button
                    onClick={() => setBackendTab('pennylane')}
                    className={`px-2.5 py-1 text-xs font-mono rounded ${
                      backendTab === 'pennylane' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    PennyLane
                  </button>
                  <button
                    onClick={() => setBackendTab('qasm')}
                    className={`px-2.5 py-1 text-xs font-mono rounded ${
                      backendTab === 'qasm' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    OpenQASM
                  </button>
                </div>
                <button
                  onClick={handleCopy}
                  className="text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              {/* Code display */}
              <pre className="text-xs text-slate-300 font-mono overflow-x-auto leading-relaxed flex-1 p-2 bg-slate-950/60 rounded-lg border border-slate-800/60">
                {getBackendCode()}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

