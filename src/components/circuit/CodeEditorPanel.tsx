import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { Circuit } from '../../types/circuit';
import { generateQiskitCode, generateOpenQASM } from '../../core/quantum/generator';
import { parseQiskitCode } from '../../core/quantum/parser';
import { transpileCircuit } from '../../api/quantum';

interface CodeEditorPanelProps {
  circuit: Circuit;
  onCircuitCodeChange: (updatedCircuit: Circuit) => void;
  onOpenAITutor?: () => void;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  circuit,
  onCircuitCodeChange,
  onOpenAITutor,
}) => {
  const [format, setFormat] = useState<'qiskit' | 'cirq' | 'pennylane' | 'qbraid' | 'qasm'>('qiskit');
  const [editorContent, setEditorContent] = useState<string>('');
  const [errors, setErrors] = useState<{ line: number; message: string }[]>([]);
  const [copied, setCopied] = useState(false);
  const [transpiling, setTranspiling] = useState(false);

  // Guard flag to prevent circular echo
  const isInternalChange = useRef(false);

  // Sync canvas circuit into editor code when circuit changes externally
  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    if (format === 'qiskit') {
      const code = generateQiskitCode(circuit);
      setEditorContent(code);
      setErrors([]);
    } else if (format === 'qasm') {
      const qasm = generateOpenQASM(circuit);
      setEditorContent(qasm);
      setErrors([]);
    } else {
      // Fetch transpiled code from backend
      setTranspiling(true);
      transpileCircuit(circuit, format as any)
        .then((code) => {
          setEditorContent(code);
          setErrors([]);
        })
        .finally(() => setTranspiling(false));
    }
  }, [circuit, format]);

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || '';
    setEditorContent(newCode);

    // Only Qiskit mode supports live 2-way graph synchronization
    if (format !== 'qiskit') return;

    const parseResult = parseQiskitCode(newCode);
    if (parseResult.success && parseResult.circuit) {
      setErrors([]);
      isInternalChange.current = true;
      onCircuitCodeChange(parseResult.circuit);
    } else {
      setErrors(parseResult.errors);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editorContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = format === 'qasm' ? 'qasm' : 'py';
    const blob = new Blob([editorContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${circuit.name.toLowerCase().replace(/\s+/g, '_')}_${format}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF4EC] border-l border-[#413333]/15 select-none">
      {/* Editor Tab Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 border-b border-[#413333]/15 bg-[#EDE0CF]/60 gap-2">
        {/* Framework Switcher Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFormat('qiskit')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              format === 'qiskit'
                ? 'bg-white text-[#315B8C] border border-[#315B8C]/40 shadow-sm font-semibold'
                : 'text-[#413333]/70 hover:text-[#413333] hover:bg-white/60'
            }`}
          >
            <span>🐍</span>
            <span>Qiskit</span>
            <span className="text-[9px] bg-[#315B8C]/15 text-[#315B8C] px-1 py-0.2 rounded font-sans font-semibold">
              2-Way Sync
            </span>
          </button>

          <button
            onClick={() => setFormat('cirq')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              format === 'cirq'
                ? 'bg-white text-[#315B8C] border border-[#315B8C]/40 shadow-sm font-semibold'
                : 'text-[#413333]/70 hover:text-[#413333] hover:bg-white/60'
            }`}
          >
            <span>🌐</span>
            <span>Cirq</span>
          </button>

          <button
            onClick={() => setFormat('pennylane')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              format === 'pennylane'
                ? 'bg-white text-[#315B8C] border border-[#315B8C]/40 shadow-sm font-semibold'
                : 'text-[#413333]/70 hover:text-[#413333] hover:bg-white/60'
            }`}
          >
            <span>🔬</span>
            <span>PennyLane</span>
          </button>

          <button
            onClick={() => setFormat('qbraid')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              format === 'qbraid'
                ? 'bg-white text-[#315B8C] border border-[#315B8C]/40 shadow-sm font-semibold'
                : 'text-[#413333]/70 hover:text-[#413333] hover:bg-white/60'
            }`}
          >
            <span>🚀</span>
            <span>qBraid</span>
          </button>

          <button
            onClick={() => setFormat('qasm')}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              format === 'qasm'
                ? 'bg-white text-[#315B8C] border border-[#315B8C]/40 shadow-sm font-semibold'
                : 'text-[#413333]/70 hover:text-[#413333] hover:bg-white/60'
            }`}
          >
            <span>📜</span>
            <span>OpenQASM</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          {onOpenAITutor && (
            <button
              onClick={onOpenAITutor}
              className="px-2.5 py-1 rounded text-xs font-mono text-[#F2765E] hover:text-white bg-white hover:bg-[#F2765E] border border-[#F2765E]/40 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Open AI Quantum Mentor to explain or debug code"
            >
              <span>🤖</span>
              <span>AI Tutor</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded text-xs font-mono text-[#413333] hover:text-[#315B8C] bg-white hover:bg-[#FAF4EC] border border-[#413333]/15 shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-[#315B8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[#315B8C] font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-[#413333]/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="p-1 rounded text-[#413333]/70 hover:text-[#413333] bg-white hover:bg-[#FAF4EC] border border-[#413333]/15 shadow-sm transition-colors cursor-pointer"
            title="Download script file"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Non-Destructive Parser Warning Banner */}
      {errors.length > 0 && (
        <div className="bg-[#F2765E]/15 border-b border-[#F2765E]/30 px-3 py-2 flex items-start gap-2 text-xs font-mono text-[#413333]">
          <svg className="w-4 h-4 text-[#F2765E] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1 space-y-0.5">
            <div className="font-semibold text-[#413333]">Syntax / Circuit Warning:</div>
            {errors.slice(0, 2).map((err, i) => (
              <div key={i} className="text-[11px] text-[#413333]/90">
                Line {err.line}: {err.message}
              </div>
            ))}
            <div className="text-[10px] text-[#F2765E] font-medium">Canvas circuit remains intact until code is corrected.</div>
          </div>
        </div>
      )}

      {/* Monaco Code Editor */}
      <div className="flex-1 relative">
        {transpiling ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#F5EBDD]/60 backdrop-blur-xs z-10">
            <div className="flex items-center gap-2 text-xs font-mono text-[#315B8C]">
              <div className="w-4 h-4 border-2 border-[#315B8C] border-t-transparent rounded-full animate-spin"></div>
              <span>Transpiling to {format.toUpperCase()}...</span>
            </div>
          </div>
        ) : null}

        <Editor
          height="100%"
          language={format === 'qasm' ? 'c' : 'python'}
          theme="vs"
          value={editorContent}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            readOnly: format !== 'qiskit', // Qiskit is live 2-way editable; other backends are transpiled targets
            renderLineHighlight: 'all',
            padding: { top: 8, bottom: 8 },
            fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="px-3 py-1.5 border-t border-[#413333]/15 bg-[#EDE0CF]/60 flex items-center justify-between text-[11px] font-mono text-[#413333]/70">
        <div className="flex items-center gap-3">
          <span>Mode: <strong className="text-[#413333] uppercase">{format}</strong></span>
          <span>{format === 'qiskit' ? '⚡ Bidirectional Live Sync' : '🔄 Auto-Transpiled'}</span>
        </div>
        <span>{circuit.qubits} Qubits • {circuit.classicalBits} Classical Bits</span>
      </div>
    </div>
  );
};

