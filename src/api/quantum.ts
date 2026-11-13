import { apiClient } from './axios';
import type {
  Circuit,
  QuantumBackendId,
  QuantumBackendInfo,
  SimulationResult,
} from '../types/circuit';
import { quantumSimulator } from '../core/quantum/simulator';

export const FALLBACK_BACKENDS: QuantumBackendInfo[] = [
  {
    id: 'client',
    name: 'Local In-Browser Engine',
    provider: 'Qual.dev Client',
    framework: 'Pure Vector Unitary',
    status: 'available',
    version: '2.0.0',
    description: 'Real-time in-browser statevector simulation running with zero server latency.',
    max_qubits: 10,
    is_cloud: false,
    badge_color: 'cyan',
    icon: 'zap',
    features: ['Zero latency', 'Real-time sync', 'Continuous Bloch coordinates'],
  },
  {
    id: 'qiskit_aer',
    name: 'Qiskit Aer Simulator',
    provider: 'IBM Quantum',
    framework: 'Qiskit Aer',
    status: 'available',
    version: 'Qiskit 2.5.2 / Aer 0.17.2',
    description: 'High-performance C++ simulator supporting statevector evolution and noisy Clifford/unitary shot sampling.',
    max_qubits: 24,
    is_cloud: false,
    badge_color: 'sky',
    icon: 'qiskit',
    features: ['Statevector simulation', 'Shot sampling up to 100k', 'Bloch vector extraction'],
  },
  {
    id: 'cirq',
    name: 'Google Cirq Simulator',
    provider: 'Google Quantum AI',
    framework: 'Cirq',
    status: 'available',
    version: 'Cirq 1.7.0',
    description: 'Google Quantum AI framework optimized for NISQ quantum computer architectures and wavefunction simulations.',
    max_qubits: 20,
    is_cloud: false,
    badge_color: 'emerald',
    icon: 'cirq',
    features: ['Wavefunction simulation', 'LineQubit topology', 'NISQ architecture mapping'],
  },
  {
    id: 'pennylane',
    name: 'PennyLane Differentiable Simulator',
    provider: 'Xanadu',
    framework: 'PennyLane',
    status: 'available',
    version: 'PennyLane 0.45.1',
    description: 'Quantum machine learning and differentiable quantum computing platform supporting analytic gradients.',
    max_qubits: 24,
    is_cloud: false,
    badge_color: 'rose',
    icon: 'pennylane',
    features: ['Differentiable quantum computing', 'Hybrid pipelines', 'Full statevector inspection'],
  },
  {
    id: 'qbraid',
    name: 'qBraid Multi-Cloud Adapter',
    provider: 'qBraid Platform',
    framework: 'qBraid',
    status: 'available',
    version: 'qBraid 0.12.2',
    description: 'Universal quantum cloud gateway providing seamless transpilation and execution across IBM Quantum, AWS Braket, Rigetti, and IonQ.',
    max_qubits: 24,
    is_cloud: true,
    badge_color: 'purple',
    icon: 'qbraid',
    features: ['Universal cross-framework transpiler', 'Cloud QPU access', 'Multi-cloud device gateway'],
  },
];

/**
 * Fetch available quantum execution backends from API (with local fallback)
 */
export async function getQuantumBackends(): Promise<QuantumBackendInfo[]> {
  try {
    const res = await apiClient.get<QuantumBackendInfo[]>('/api/v1/quantum/backends', { timeout: 3000 });
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch (error) {
    console.warn('Could not fetch backend list from server, using default backends catalog:', error);
  }
  return FALLBACK_BACKENDS;
}

/**
 * Executes quantum circuit simulation on specified backend
 */
export async function executeQuantumSimulation(
  circuit: Circuit,
  backend: QuantumBackendId = 'client',
  shots: number = 1024
): Promise<SimulationResult> {
  // If client-side simulator selected, run immediately locally
  if (backend === 'client') {
    const localResult = await quantumSimulator.simulate(circuit, shots);
    return {
      ...localResult,
      backend: 'client',
      backendName: 'Local In-Browser Engine',
      framework: 'Web Unitary Engine',
      frameworkVersion: '2.0.0',
    };
  }

  // Server-side backend execution (Qiskit Aer, Cirq, PennyLane, qBraid)
  try {
    const res = await apiClient.post<SimulationResult>('/api/v1/quantum/simulate', {
      circuit,
      backend,
      shots,
    }, { timeout: 15000 });

    return res.data;
  } catch (error) {
    console.warn(`Execution failed on server backend '${backend}', falling back to local simulator:`, error);
    const fallbackRes = await quantumSimulator.simulate(circuit, shots);
    return {
      ...fallbackRes,
      backend,
      backendName: `${backend.toUpperCase()} (Offline Fallback)`,
      framework: 'Local Emulator',
      metadata: { fallback: true, originalBackend: backend },
    };
  }
}

/**
 * Transpile circuit to target framework code
 */
export async function transpileCircuit(
  circuit: Circuit,
  targetFramework: 'qiskit' | 'cirq' | 'pennylane' | 'qbraid'
): Promise<string> {
  try {
    const res = await apiClient.post<{ code: string }>('/api/v1/quantum/transpile', {
      circuit,
      target_framework: targetFramework,
    });
    return res.data.code;
  } catch (error) {
    console.warn('Transpilation API error:', error);
    return `# Transpilation service temporarily unreachable\n# Target: ${targetFramework}`;
  }
}

/**
 * Multi-Backend Comparison Execution
 */
export async function compareBackends(
  circuit: Circuit,
  backends: string[] = ['qiskit_aer', 'cirq', 'pennylane'],
  shots: number = 1024
): Promise<Record<string, SimulationResult>> {
  try {
    const res = await apiClient.post<{ results: Record<string, SimulationResult> }>('/api/v1/quantum/compare', {
      circuit,
      backends,
      shots,
    }, { timeout: 20000 });

    return res.data.results;
  } catch (error) {
    console.warn('Backend comparison failed:', error);
    // Return simulated client comparison
    const clientRes = await quantumSimulator.simulate(circuit, shots);
    return {
      client: { ...clientRes, backend: 'client', backendName: 'Local Engine' },
    };
  }
}
