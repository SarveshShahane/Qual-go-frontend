import React, { useState, useMemo } from 'react';

type GateType = 'I' | 'H' | 'X' | 'Z' | 'CNOT';

interface InteractiveCircuitDemoProps {
  onNavigate?: (view: 'home' | 'auth' | 'courses' | 'designer') => void;
}

export const InteractiveCircuitDemo: React.FC<InteractiveCircuitDemoProps> = ({ onNavigate }) => {
  // Simple 2-qubit circuit with 3 timesteps
  const [q0Gates, setQ0Gates] = useState<GateType[]>(['H', 'I', 'I']);
  const [q1Gates, setQ1Gates] = useState<GateType[]>(['I', 'CNOT', 'I']);
  const [backendTab, setBackendTab] = useState<'qiskit' | 'cirq' | 'pennylane' | 'qasm'>('qiskit');
  const [copied, setCopied] = useState(false);

  // Compute quantum statevector & probabilities based on gates
  const stateResult = useMemo(() => {
    let p00 = 1.0;
    let p01 = 0.0;
    let p10 = 0.0;
    let p11 = 0.0;
    let diracString = '|00⟩';
    let blochTheta = 0;
    let blochPhi = 0;
    let explanation = 'Ground state |00⟩ initialized. Qubits are in deterministic computational zero.';

    const hasH0 = q0Gates.includes('H');
    const hasX0 = q0Gates.includes('X');
    const hasZ0 = q0Gates.includes('Z');
    const hasX1 = q1Gates.includes('X');
    const hasCNOT = q1Gates.includes('CNOT');

    if (hasH0 && hasCNOT) {
      p00 = 0.5;
      p01 = 0.0;
      p10 = 0.0;
      p11 = 0.5;
      diracString = '1/√2 |00⟩ + 1/√2 |11⟩';
      blochTheta = 90;
      blochPhi = 0;
      explanation = 'Maximally entangled Bell state |Φ⁺⟩: measurement on q₀ instantaneously determines q₁ with identical outcome. No product state factorization exists.';
    } else if (hasH0 && hasX1) {
      p00 = 0.0;
      p01 = 0.5;
      p10 = 0.0;
      p11 = 0.5;
      diracString = '1/√2 |01⟩ + 1/√2 |11⟩';
      blochTheta = 90;
      blochPhi = 0;
      explanation = 'Hadamard basis on q₀ combined with Pauli-X on q₁. Measurement produces |01⟩ or |11⟩ with equal probability.';
    } else if (hasH0) {
      p00 = 0.5;
      p01 = 0.0;
      p10 = 0.5;
      p11 = 0.0;
      diracString = '1/√2 |00⟩ + 1/√2 |10⟩';
      blochTheta = 90;
      blochPhi = hasZ0 ? 180 : 0;
      explanation = 'Equally weighted superposition (|0⟩ + |1⟩)/√2 on q₀ while q₁ remains in the |0⟩ ground state.';
    } else if (hasX0 && hasX1) {
      p00 = 0.0;
      p01 = 0.0;
      p10 = 0.0;
      p11 = 1.0;
      diracString = '|11⟩';
      blochTheta = 180;
      blochPhi = 0;
      explanation = 'Both qubits inverted via Pauli-X operators, yielding deterministic state |11⟩.';
    } else if (hasX0) {
      p00 = 0.0;
      p01 = 0.0;
      p10 = 1.0;
      p11 = 0.0;
      diracString = '|10⟩';
      blochTheta = 180;
      blochPhi = 0;
      explanation = 'Pauli-X applied to q₀, inverting computational basis state to deterministic |10⟩.';
    } else if (hasX1) {
      p00 = 0.0;
      p01 = 1.0;
      p10 = 0.0;
      p11 = 0.0;
      diracString = '|01⟩';
      blochTheta = 0;
      blochPhi = 0;
      explanation = 'Pauli-X applied to q₁, producing deterministic computational state |01⟩.';
    }

    return { p00, p01, p10, p11, diracString, blochTheta, blochPhi, explanation };
  }, [q0Gates, q1Gates]);

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
print("Counts:", counts)`;
    } else if (backendTab === 'cirq') {
      return `# Cirq Simulation Backend
import cirq

q0, q1 = cirq.LineQubit.range(2)
circuit = cirq.Circuit(
${hasH0 ? '    cirq.H(q0),\n' : ''}${hasX0 ? '    cirq.X(q0),\n' : ''}${hasZ0 ? '    cirq.Z(q0),\n' : ''}${hasX1 ? '    cirq.X(q1),\n' : ''}${hasCNOT ? '    cirq.CNOT(q0, q1),\n' : ''}    cirq.measure(q0, q1, key='result')
)

simulator = cirq.Simulator()
result = simulator.run(circuit, repetitions=1024)
print(result.histogram(key='result'))`;
    } else if (backendTab === 'pennylane') {
      return `# PennyLane Differentiable Circuit
import pennylane as qml

dev = qml.device('default.qubit', wires=2, shots=1024)

@qml.qnode(dev)
def circuit():
${hasH0 ? '    qml.Hadamard(wires=0)\n' : ''}${hasX0 ? '    qml.PauliX(wires=0)\n' : ''}${hasZ0 ? '    qml.PauliZ(wires=0)\n' : ''}${hasX1 ? '    qml.PauliX(wires=1)\n' : ''}${hasCNOT ? '    qml.CNOT(wires=[0, 1])\n' : ''}    return qml.probs(wires=[0, 1])

print("Probabilities:", circuit())`;
    } else {
      return `// OpenQASM 3.0 Standard
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
    <section id="circuit-demo" className="py-16 md:py-20 border-b border-rule bg-paper">
      <div className="academic-container">
        {/* Section Header */}
        <div className="max-w-2xl mb-10">
          <div className="text-xs font-body text-muted mb-2">
            Section 01 · Interactive Experimentation
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-ink">
            Quantum State Laboratory
          </h2>
          <p className="mt-3 text-muted font-body text-base">
            Configure unitary gate operations along the register lines. The statevector, probability amplitudes, and transpiled code update synchronously.
          </p>
        </div>

        {/* Preset Toolbar */}
        <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-rule">
          <span className="text-xs font-body text-muted mr-2">Configured states:</span>
          <button
            onClick={() => applyPreset('bell')}
            className="px-3 py-1.5 text-xs font-body font-medium rounded-sm border border-rule hover:border-rule-2 active:bg-paper-2 focus-visible:outline-2 focus-visible:outline-focus bg-sheet text-ink transition-colors cursor-pointer"
          >
            Bell State |Φ⁺⟩
          </button>
          <button
            onClick={() => applyPreset('superposition')}
            className="px-3 py-1.5 text-xs font-body font-medium rounded-sm border border-rule hover:border-rule-2 active:bg-paper-2 focus-visible:outline-2 focus-visible:outline-focus bg-sheet text-ink transition-colors cursor-pointer"
          >
            Superposition H(q₀)
          </button>
          <button
            onClick={() => applyPreset('bitflip')}
            className="px-3 py-1.5 text-xs font-body font-medium rounded-sm border border-rule hover:border-rule-2 active:bg-paper-2 focus-visible:outline-2 focus-visible:outline-focus bg-sheet text-ink transition-colors cursor-pointer"
          >
            Bit-Flip State |01⟩
          </button>
          <button
            onClick={() => applyPreset('ground')}
            className="px-3 py-1.5 text-xs font-body font-medium rounded-sm border border-rule hover:border-rule-2 active:bg-paper-2 focus-visible:outline-2 focus-visible:outline-focus bg-sheet text-ink transition-colors cursor-pointer"
          >
            Ground State |00⟩
          </button>

          {onNavigate && (
            <button
              onClick={() => onNavigate('designer')}
              className="ml-auto px-4 py-1.5 text-xs font-body font-semibold rounded-sm bg-accent text-accent-ink hover:opacity-90 active:opacity-95 focus-visible:outline-2 focus-visible:outline-focus transition-opacity cursor-pointer"
            >
              Open Full Circuit Studio
            </button>
          )}
        </div>

        {/* 2-Column Laboratory Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Circuit Wires & Mathematical Formalism */}
          <div className="lg:col-span-7 space-y-6">
            {/* The Circuit Wire Grid */}
            <div className="p-5 border border-rule bg-sheet rounded-sm shadow-sm">
              <div className="flex items-center justify-between border-b border-rule pb-2 mb-4">
                <span className="font-body text-xs font-semibold text-ink">Two-Qubit Register Canvas</span>
                <span className="text-xs text-muted font-body">Select any slot to cycle operator</span>
              </div>

              {/* Wire 0 */}
              <div className="flex items-center gap-4 py-3 border-b border-rule">
                <code className="w-14 flex items-center font-mono text-xs text-ink font-semibold">
                  <span>|q₀⟩</span>
                </code>

                <div className="flex-1 relative flex items-center justify-around">
                  <div className="absolute inset-x-0 h-0.5 bg-rule pointer-events-none" />
                  {q0Gates.map((gate, idx) => (
                    <button
                      key={`q0-${idx}`}
                      onClick={() => cycleGate(0, idx)}
                      className={`relative z-10 w-11 h-11 border font-mono text-xs font-bold active:opacity-90 focus-visible:outline-2 focus-visible:outline-focus transition-colors cursor-pointer flex items-center justify-center ${
                        gate === 'I'
                          ? 'bg-paper-2 border-rule text-muted hover:border-rule-2'
                          : 'bg-navy text-accent-ink border-navy'
                      }`}
                      title={`Slot ${idx + 1}: ${gate === 'I' ? 'Identity (Empty)' : gate} operator`}
                    >
                      {gate === 'I' ? '·' : gate}
                    </button>
                  ))}
                  <code className="relative z-10 px-2 py-1 bg-paper-2 border border-rule font-mono text-[11px] text-muted">
                    M₀
                  </code>
                </div>
              </div>

              {/* Wire 1 */}
              <div className="flex items-center gap-4 py-3">
                <code className="w-14 flex items-center font-mono text-xs text-ink font-semibold">
                  <span>|q₁⟩</span>
                </code>

                <div className="flex-1 relative flex items-center justify-around">
                  <div className="absolute inset-x-0 h-0.5 bg-rule pointer-events-none" />
                  {q1Gates.map((gate, idx) => (
                    <button
                      key={`q1-${idx}`}
                      onClick={() => cycleGate(1, idx)}
                      className={`relative z-10 w-11 h-11 border font-mono text-xs font-bold active:opacity-90 focus-visible:outline-2 focus-visible:outline-focus transition-colors cursor-pointer flex items-center justify-center ${
                        gate === 'I'
                          ? 'bg-paper-2 border-rule text-muted hover:border-rule-2'
                          : gate === 'CNOT'
                          ? 'bg-accent text-accent-ink border-accent'
                          : 'bg-navy text-accent-ink border-navy'
                      }`}
                      title={`Slot ${idx + 1}: ${gate === 'I' ? 'Identity (Empty)' : gate} operator`}
                    >
                      {gate === 'I' ? '·' : gate === 'CNOT' ? 'CX' : gate}
                    </button>
                  ))}
                  <code className="relative z-10 px-2 py-1 bg-paper-2 border border-rule font-mono text-[11px] text-muted">
                    M₁
                  </code>
                </div>
              </div>

              {/* Operators Legend */}
              <div className="mt-4 pt-3 border-t border-rule flex flex-wrap items-center gap-4 text-xs font-body text-muted">
                <span>Operators:</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-navy inline-block" /> H (Hadamard)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-navy inline-block" /> X (Pauli-X)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-accent inline-block" /> CX (Controlled-NOT)
                </span>
              </div>
            </div>

            {/* Formalism Note */}
            <div className="p-4 border border-rule bg-paper-2 rounded-sm">
              <div className="text-xs font-body font-semibold text-ink mb-1">State Formalism Analysis</div>
              <p className="text-sm font-body text-ink-2 leading-relaxed">
                {stateResult.explanation}
              </p>
              <div className="mt-3 pt-3 border-t border-rule/60 text-xs text-muted">
                Current Dirac expansion: <code className="font-mono text-ink font-semibold">{stateResult.diracString}</code>
              </div>
            </div>
          </div>

          {/* Right Column: Probabilities & Multi-Backend Code */}
          <div className="lg:col-span-5 space-y-6">
            {/* Probability Amplitudes */}
            <div className="p-5 border border-rule bg-sheet rounded-sm shadow-sm">
              <div className="flex items-center justify-between border-b border-rule pb-2 mb-4">
                <span className="font-body text-xs font-semibold text-ink">Measurement Probabilities</span>
                <span className="text-xs text-muted font-body"><span className="num font-mono">1024</span> shots</span>
              </div>

              <div className="space-y-3 font-body text-xs">
                {[
                  { state: '|00⟩', prob: stateResult.p00 },
                  { state: '|01⟩', prob: stateResult.p01 },
                  { state: '|10⟩', prob: stateResult.p10 },
                  { state: '|11⟩', prob: stateResult.p11 },
                ].map((item) => (
                  <div key={item.state} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono text-ink font-semibold">{item.state}</span>
                      <span className="font-mono num text-muted">
                        {(item.prob * 100).toFixed(1)}% ({item.prob.toFixed(3)})
                      </span>
                    </div>
                    <div className="h-2 w-full bg-paper-2 overflow-hidden border border-rule">
                      <div
                        className="h-full bg-navy"
                        style={{ width: `${item.prob * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Multi-Backend Code Output */}
            <div className="p-5 border border-rule bg-sheet rounded-sm shadow-sm">
              <div className="flex items-center justify-between border-b border-rule pb-3 mb-3">
                <div className="flex items-center gap-1">
                  {(['qiskit', 'cirq', 'pennylane', 'qasm'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setBackendTab(tab)}
                      className={`px-2.5 py-1 text-xs font-body rounded-sm border active:opacity-90 focus-visible:outline-2 focus-visible:outline-focus transition-colors cursor-pointer ${
                        backendTab === tab
                          ? 'bg-ink text-paper border-ink font-semibold'
                          : 'bg-paper-2 text-ink border-rule hover:border-rule-2'
                      }`}
                    >
                      {tab === 'qiskit' ? 'Qiskit' : tab === 'cirq' ? 'Cirq' : tab === 'pennylane' ? 'PennyLane' : 'QASM'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopy}
                  className="text-xs font-body text-muted hover:text-ink active:opacity-90 focus-visible:outline-2 focus-visible:outline-focus transition-colors cursor-pointer px-2 py-1 border border-rule bg-paper-2 rounded-sm"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <pre className="text-xs text-ink font-mono bg-paper-2 p-3 border border-rule overflow-x-auto max-h-48 leading-relaxed">
                {getBackendCode()}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
