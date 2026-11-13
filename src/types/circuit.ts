// Canonical Circuit IR, Mathematical Foundation, and Multi-Backend Types

export type GateCategory = 'single' | 'multi' | 'phase' | 'measurement' | 'utility';

export interface Complex {
  real: number;
  imag: number;
}

export interface GateDefinition {
  id: string; // e.g. "H", "X", "CX", "Rx"
  name: string; // "Hadamard", "Pauli-X", etc.
  symbol: string; // "H", "X", "⊕", etc.
  category: GateCategory;
  qubits: number; // number of target qubits (1 or 2)
  controls: number; // default number of controls (0, 1, 2)
  isControlled?: boolean;
  hasParams?: boolean;
  paramNames?: string[]; // e.g. ["θ"]
  defaultParams?: number[]; // in radians
  defaultExpressions?: string[]; // e.g. ["π/2"]
  description: string;
  mathFormula?: string;
  matrixDisplay?: string; // string-formatted 2x2 or 4x4 matrix
  matrix: (params?: number[]) => Complex[][];
  exampleUsage: string;
  color: {
    bg: string;
    border: string;
    text: string;
    glow?: string;
  };
}

export interface Operation {
  id: string; // unique ID for React rendering and tracking
  gate: string; // Gate ID from registry
  targets: number[]; // Target qubit indices (0-indexed)
  controls?: number[]; // Control qubit indices (0-indexed)
  params?: number[]; // Parameter values in radians
  paramExpressions?: string[]; // Human expressions: "pi/2", "0.785"
  metadata?: {
    classicalTarget?: number; // For measurement, classical bit index
    label?: string;
    [key: string]: unknown;
  };
}

export interface Moment {
  id?: string;
  operations: Operation[];
}

export interface Circuit {
  id?: string;
  name: string;
  qubits: number;
  qubitLabels: string[];
  classicalBits: number;
  classicalBitLabels: string[];
  moments: Moment[];
}

export type QuantumBackendId = 'client' | 'qiskit_aer' | 'cirq' | 'pennylane' | 'qbraid';

export interface QuantumBackendInfo {
  id: QuantumBackendId;
  name: string;
  provider: string;
  framework: string;
  status: 'available' | 'ready' | 'maintenance' | 'unavailable';
  version?: string;
  description: string;
  max_qubits: number;
  is_cloud?: boolean;
  badge_color: string;
  icon: string;
  features?: string[];
}

export interface BlochVector {
  qubit: number;
  x: number;
  y: number;
  z: number;
}

export interface StatevectorItem {
  basisState: string;
  index: number;
  real: number;
  imag: number;
  magnitude: number;
  probability: number;
  phaseRadians: number;
  phaseDegrees: number;
}

export interface SimulationResult {
  backend?: QuantumBackendId | string;
  backendName?: string;
  framework?: string;
  frameworkVersion?: string;
  statevector?: StatevectorItem[];
  probabilities: Record<string, number>;
  counts: Record<string, number>;
  shots: number;
  qubits: number;
  executionTimeMs: number;
  blochVectors?: BlochVector[];
  circuitDiagram?: string;
  transpiledCode?: string;
  metadata?: Record<string, unknown>;
}

export interface CircuitValidationError {
  momentIndex?: number;
  operationId?: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface CanonicalOperation {
  gate: string;
  targets: number[];
  controls?: number[];
  params?: number[];
  metadata?: Record<string, unknown>;
}

export interface CanonicalMoment {
  operations: CanonicalOperation[];
}

export interface CanonicalCircuit {
  name?: string;
  qubits: number;
  classicalBits?: number;
  qubitLabels?: string[];
  classicalBitLabels?: string[];
  moments: CanonicalMoment[];
}

export interface SimulationResponse {
  backend: string;
  backend_name: string;
  execution_time_ms: number;
  shots: number;
  statevector?: unknown;
  probabilities: Record<string, number>;
  counts: Record<string, number>;
  bloch_vectors?: unknown;
  success: boolean;
  error_message?: string;
  framework?: string;
  framework_version?: string;
  qubits?: number;
  executionTimeMs?: number;
  blochVectors?: unknown;
}

