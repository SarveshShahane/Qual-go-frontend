import type { Complex } from '../../types/circuit';

export const C_ZERO: Complex = { real: 0, imag: 0 };
export const C_ONE: Complex = { real: 1, imag: 0 };
export const C_I: Complex = { real: 0, imag: 1 };

export function cAdd(a: Complex, b: Complex): Complex {
  return { real: a.real + b.real, imag: a.imag + b.imag };
}

export function cSub(a: Complex, b: Complex): Complex {
  return { real: a.real - b.real, imag: a.imag - b.imag };
}

export function cMul(a: Complex, b: Complex): Complex {
  return {
    real: a.real * b.real - a.imag * b.imag,
    imag: a.real * b.imag + a.imag * b.real,
  };
}

export function cScale(a: Complex, s: number): Complex {
  return { real: a.real * s, imag: a.imag * s };
}

export function cConj(a: Complex): Complex {
  return { real: a.real, imag: -a.imag };
}

export function cMagSq(a: Complex): number {
  return a.real * a.real + a.imag * a.imag;
}

export function cMag(a: Complex): number {
  return Math.sqrt(cMagSq(a));
}

export function cPhase(a: Complex): number {
  return Math.atan2(a.imag, a.real);
}

export function cExp(theta: number): Complex {
  // e^(i * theta) = cos(theta) + i*sin(theta)
  return { real: Math.cos(theta), imag: Math.sin(theta) };
}

/**
 * Evaluates mathematical angle expressions commonly used in quantum circuits:
 * Supports: "pi", "pi/2", "pi/4", "3pi/4", "2*pi/3", "0.785", "-pi/2", etc.
 */
export function parseAngleExpression(expr: string): number {
  if (!expr || expr.trim() === '') return 0;
  const clean = expr
    .trim()
    .toLowerCase()
    .replace(/π/g, 'pi')
    .replace(/\s+/g, '');

  // Pure number
  if (/^-?\d+(\.\d+)?$/.test(clean)) {
    return parseFloat(clean);
  }

  // Expression with pi
  try {
    let sanitized = clean
      .replace(/(\d+)pi/g, '$1*Math.PI')
      .replace(/pi/g, 'Math.PI');

    // Only allow safe math tokens
    if (/^[0-9+\-*/().MathPI]+$/.test(sanitized)) {
      // Evaluate safely
      const fn = new Function(`return ${sanitized};`);
      const val = Number(fn());
      return isNaN(val) ? 0 : val;
    }
  } catch {
    // fallback
  }

  return 0;
}

/**
 * Format radians into human-readable quantum expressions (e.g. "π/2", "π", "0.785")
 */
export function formatAngle(radians: number): string {
  if (Math.abs(radians) < 1e-6) return '0';
  const pi = Math.PI;

  const standardFractions = [
    { val: pi, str: 'π' },
    { val: -pi, str: '-π' },
    { val: pi / 2, str: 'π/2' },
    { val: -pi / 2, str: '-π/2' },
    { val: pi / 4, str: 'π/4' },
    { val: -pi / 4, str: '-π/4' },
    { val: (3 * pi) / 4, str: '3π/4' },
    { val: -(3 * pi) / 4, str: '-3π/4' },
    { val: pi / 3, str: 'π/3' },
    { val: -pi / 3, str: '-π/3' },
    { val: (2 * pi) / 3, str: '2π/3' },
    { val: -(2 * pi) / 3, str: '-2π/3' },
    { val: pi / 6, str: 'π/6' },
    { val: -pi / 6, str: '-π/6' },
    { val: 2 * pi, str: '2π' },
    { val: -2 * pi, str: '-2π' },
  ];

  for (const { val, str } of standardFractions) {
    if (Math.abs(radians - val) < 1e-4) {
      return str;
    }
  }

  return radians.toFixed(3);
}

/**
 * Formats a number as a binary bitstring with given length
 */
export function toBitstring(value: number, length: number): string {
  return value.toString(2).padStart(length, '0');
}

/**
 * 2x2 Identity Matrix
 */
export const I2: Complex[][] = [
  [{ real: 1, imag: 0 }, { real: 0, imag: 0 }],
  [{ real: 0, imag: 0 }, { real: 1, imag: 0 }],
];

/**
 * Kronecker (Tensor) Product of two matrices
 */
export function kron(A: Complex[][], B: Complex[][]): Complex[][] {
  const aRows = A.length;
  const aCols = A[0].length;
  const bRows = B.length;
  const bCols = B[0].length;

  const result: Complex[][] = Array.from({ length: aRows * bRows }, () =>
    Array.from({ length: aCols * bCols }, () => ({ real: 0, imag: 0 }))
  );

  for (let i = 0; i < aRows; i++) {
    for (let j = 0; j < aCols; j++) {
      for (let k = 0; k < bRows; k++) {
        for (let l = 0; l < bCols; l++) {
          result[i * bRows + k][j * bCols + l] = cMul(A[i][j], B[k][l]);
        }
      }
    }
  }

  return result;
}

/**
 * Matrix multiplication of two complex matrices
 */
export function matMul(A: Complex[][], B: Complex[][]): Complex[][] {
  const rows = A.length;
  const cols = B[0].length;
  const inner = B.length;

  const result: Complex[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ real: 0, imag: 0 }))
  );

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let sum = C_ZERO;
      for (let k = 0; k < inner; k++) {
        sum = cAdd(sum, cMul(A[i][k], B[k][j]));
      }
      result[i][j] = sum;
    }
  }

  return result;
}
