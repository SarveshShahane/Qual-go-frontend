import React, { useState, useRef, useEffect } from 'react';
import type { CanonicalCircuit, SimulationResponse } from '../../types/circuit';
import type {
  AIResponse,
  ChatMessage,
  TutorContext,
  TutoringMode,
  UserLevel,
  AIRecommendation,
} from '../../types/ai';
import {
  askAITutor,
  debugAICircuit,
  getAIHint,
  getAIRecommendations,
  analyzeAICircuit,
} from '../../api/ai';
import { AIRecommendationsWidget } from './AIRecommendationsWidget';
import { MarkdownRenderer } from './MarkdownRenderer';

interface AITutorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  circuit?: CanonicalCircuit | null;
  code?: string;
  errorMessage?: string | null;
  simulationResult?: SimulationResponse | null;
  currentModule?: string | null;
  currentChapter?: string | null;
  currentTopic?: string | null;
  onApplyCircuit?: (circuit: CanonicalCircuit) => void;
  onApplyCode?: (code: string) => void;
}

export const AITutorPanel: React.FC<AITutorPanelProps> = ({
  isOpen,
  onClose,
  circuit,
  code,
  errorMessage,
  simulationResult,
  currentModule,
  currentChapter,
  currentTopic,
  onApplyCircuit,
  onApplyCode,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        '👋 **Hello! I am your AI Quantum Mentor.**\n\nI am grounded in QualGo\'s curriculum and connected to your active circuit and code editor.\n\n* Ask me to **explain** concepts or your circuit.\n* Switch to **Hints** for progressive challenge clues without spoilers.\n* Use **Socratic Mode** to work through derivations step-by-step.\n* Ask me to **debug** quantum logic errors or code syntax.\n* Generate runnable Qiskit / Cirq code or validated Circuit diagrams!',
      suggestedFollowups: [
        'Explain my current circuit',
        'How does the Hadamard gate work?',
        'Create a Bell state',
        'Check my circuit for errors',
      ],
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLevel, setUserLevel] = useState<UserLevel>('beginner');
  const [tutoringMode, setTutoringMode] = useState<TutoringMode>('explain');
  const [currentHintLevel, setCurrentHintLevel] = useState(1);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [copiedCodeId, setCopiedCodeId] = useState<number | null>(null);
  const [appliedCircuitId, setAppliedCircuitId] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  // Build active context object to send with each request
  const buildContext = (modeOverride?: TutoringMode): TutorContext => ({
    user_level: userLevel,
    tutoring_mode: modeOverride || tutoringMode,
    current_module: currentModule || 'Quantum Fundamentals',
    current_chapter: currentChapter,
    current_topic: currentTopic,
    circuit: circuit || undefined,
    code: code,
    error_message: errorMessage || undefined,
    simulation_result: simulationResult || undefined,
    hint_level: currentHintLevel,
  });

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt('');
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      const res: AIResponse = await askAITutor({
        prompt,
        context: buildContext(),
        history,
      });

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: res.message,
        code: res.code,
        circuit: res.circuit,
        diagnostics: res.diagnostics,
        hints: res.hints,
        recommendations: res.recommendations,
        sources: res.sources,
        suggestedFollowups: res.suggested_followups,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      if (res.recommendations && res.recommendations.length > 0) {
        setRecommendations(res.recommendations);
      }

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            '⚠️ **Unable to connect to AI Mentor service.** Please ensure the QualGo backend is running on `http://localhost:8000`.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplainCurrentCircuit = async () => {
    if (!circuit || isLoading) return;
    setIsLoading(true);

    const userMsg: ChatMessage = {
      role: 'user',
      content: `Explain my active circuit: "${circuit.name || 'Current Circuit'}" with ${circuit.qubits} qubits.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await analyzeAICircuit(circuit);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.message,
          code: res.code,
          suggestedFollowups: res.suggested_followups,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      await handleSendMessage(`Explain this quantum circuit: ${JSON.stringify(circuit)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDebugCircuit = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const userMsg: ChatMessage = {
      role: 'user',
      content: 'Debug my current circuit and code for errors or quantum logic flaws.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await debugAICircuit({
        circuit: circuit || undefined,
        code: code,
        error_message: errorMessage || undefined,
        simulation_result: simulationResult || undefined,
        context: buildContext('debug'),
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.message,
          code: res.code,
          diagnostics: res.diagnostics,
          sources: res.sources,
          suggestedFollowups: res.suggested_followups,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Failed to run debugger. Verify backend connectivity.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestHint = async (level: number) => {
    if (isLoading) return;
    setIsLoading(true);
    setCurrentHintLevel(level);

    const levelLabels = ['Concept Clue', 'Direction', 'Partial Solution', 'Full Solution'];
    const userMsg: ChatMessage = {
      role: 'user',
      content: `Give me Hint Level ${level} (${levelLabels[level - 1]}) for the current exercise.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await getAIHint({
        hint_level: level,
        challenge_id: currentTopic || 'quantum_gates',
        context: buildContext('hint'),
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.message,
          hints: res.hints,
          sources: res.sources,
          suggestedFollowups: res.suggested_followups,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Failed to retrieve hint.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadRecommendations = async () => {
    setIsLoading(true);
    try {
      const res = await getAIRecommendations({
        context: buildContext('explain'),
      });
      if (res.recommendations) {
        setRecommendations(res.recommendations);
      }
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(idx);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleApplyCircuitSuggestion = (circ: CanonicalCircuit, idx: number) => {
    if (onApplyCircuit) {
      onApplyCircuit(circ);
      setAppliedCircuitId(idx);
      setTimeout(() => setAppliedCircuitId(null), 2500);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] md:w-[540px] z-50 bg-[#F5EBDD] border-l border-[#413333]/20 shadow-2xl flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#413333]/15 bg-[#FAF4EC] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#315B8C]/15 border border-[#315B8C]/30 flex items-center justify-center text-lg shadow-sm">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[#413333] text-sm tracking-wide">QualGo AI Mentor</h3>
              <span className="w-2 h-2 rounded-full bg-[#F2765E] animate-pulse" />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-mono text-[#315B8C] bg-[#EDE0CF] px-1.5 py-0.5 rounded border border-[#315B8C]/30 font-semibold">
                LangChain Groq
              </span>
              <span className="text-[10px] text-[#413333]/70">RAG Grounded</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Level selector */}
          <select
            value={userLevel}
            onChange={(e) => setUserLevel(e.target.value as UserLevel)}
            className="bg-white text-[#413333] text-xs rounded-lg px-2 py-1 border border-[#413333]/20 focus:outline-none focus:border-[#315B8C] font-medium shadow-sm"
            title="Explanation depth level"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1.5 text-[#413333]/70 hover:text-[#413333] rounded-lg hover:bg-[#EDE0CF] transition-colors cursor-pointer"
            title="Close Tutor Panel"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="px-4 py-2 border-b border-[#413333]/15 bg-[#EDE0CF] flex items-center gap-1 overflow-x-auto no-scrollbar">
        {[
          { id: 'explain', label: '💬 Explain' },
          { id: 'hint', label: '💡 Hints' },
          { id: 'socratic', label: '🦉 Socratic' },
          { id: 'debug', label: '🐛 Debug' },
          { id: 'generate', label: '⚡ Generate' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTutoringMode(tab.id as TutoringMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              tutoringMode === tab.id
                ? 'bg-white text-[#F2765E] border border-[#F2765E]/40 shadow-sm font-semibold'
                : 'text-[#413333]/70 hover:text-[#413333] hover:bg-white/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Context Banner */}
      <div className="px-4 py-2 bg-[#FAF4EC] border-b border-[#413333]/10 flex items-center justify-between text-[11px] text-[#413333]/70">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="font-semibold text-[#413333]">Context:</span>
          {circuit ? (
            <span className="text-[#315B8C] font-mono font-semibold">
              {circuit.name} ({circuit.qubits}Q, {circuit.moments.length}M)
            </span>
          ) : (
            <span className="text-[#413333]/50">No active circuit</span>
          )}
          {errorMessage && (
            <span className="text-[#F2765E] font-mono bg-[#F2765E]/10 px-1 rounded border border-[#F2765E]/30 font-semibold">
              Error Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleExplainCurrentCircuit}
            disabled={!circuit || isLoading}
            className="text-[10px] text-[#315B8C] hover:text-[#F2765E] disabled:opacity-40 transition-colors cursor-pointer font-semibold"
          >
            Inspect Circuit
          </button>
        </div>
      </div>

      {/* Messages Transcript */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 font-sans text-sm bg-[#F5EBDD]">
        {recommendations.length > 0 && (
          <div className="mb-3">
            <AIRecommendationsWidget
              recommendations={recommendations}
              onSelectRecommendation={(rec) => handleSendMessage(`Tell me more about ${rec.title}`)}
              onRefresh={handleLoadRecommendations}
            />
          </div>
        )}
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={idx}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
            >
              <div
                className={`max-w-[92%] rounded-2xl p-4 leading-relaxed ${
                  isUser
                    ? 'bg-[#F2765E] text-white rounded-tr-none shadow-md shadow-[#F2765E]/20'
                    : 'bg-white border border-[#413333]/15 text-[#413333] rounded-tl-none shadow-sm'
                }`}
              >
                {/* Rendered Markdown and KaTeX Equations */}
                <MarkdownRenderer
                  content={msg.content}
                  className={isUser ? 'prose-p:text-white prose-strong:text-white text-white' : ''}
                />

                {/* Diagnostics List */}
                {msg.diagnostics && msg.diagnostics.length > 0 && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-[#413333]/10">
                    <span className="text-[11px] font-bold text-[#F2765E] uppercase tracking-wider flex items-center gap-1">
                      <span>⚠️</span> Quantum Diagnostics
                    </span>
                    {msg.diagnostics.map((diag, dIdx) => (
                      <div
                        key={dIdx}
                        className="p-2.5 rounded-lg bg-[#FAF4EC] border border-[#F2765E]/30 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#F2765E]">{diag.problem}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#EDE0CF] text-[#413333] border border-[#413333]/20 font-mono">
                            {diag.category.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#413333]/70">
                          <strong className="text-[#413333]">Cause:</strong> {diag.cause}
                        </div>
                        <div className="text-[11px] text-[#315B8C] bg-[#315B8C]/10 p-1.5 rounded border border-[#315B8C]/30 font-semibold">
                          <strong>Fix:</strong> {diag.suggested_fix}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Code Block Snippet */}
                {msg.code && (
                  <div className="mt-3 rounded-lg overflow-hidden border border-[#413333]/15 bg-white shadow-sm">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-[#EDE0CF] border-b border-[#413333]/10 text-[10px] text-[#413333]/70 font-mono">
                      <span>Python (Qiskit)</span>
                      <div className="flex items-center gap-2">
                        {onApplyCode && (
                          <button
                            onClick={() => onApplyCode(msg.code!)}
                            className="text-[#315B8C] hover:text-[#F2765E] font-medium cursor-pointer"
                          >
                            Insert in Editor
                          </button>
                        )}
                        <button
                          onClick={() => handleCopyCode(msg.code!, idx)}
                          className="hover:text-[#413333] font-medium cursor-pointer"
                        >
                          {copiedCodeId === idx ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    <pre className="p-3 text-xs font-mono text-[#315B8C] bg-[#FAF4EC] overflow-x-auto leading-relaxed">
                      <code>{msg.code}</code>
                    </pre>
                  </div>
                )}

                {/* Circuit Suggestion Card */}
                {msg.circuit && (
                  <div className="mt-3 p-3 rounded-lg bg-[#FAF4EC] border border-[#315B8C]/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#315B8C] text-sm">⚛️</span>
                        <span className="font-semibold text-[#413333]">{msg.circuit.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#315B8C] bg-[#EDE0CF] px-1.5 py-0.5 rounded border border-[#315B8C]/20 font-semibold">
                        {msg.circuit.qubits} Qubits · {msg.circuit.moments.length} Steps
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-[#413333]/70">
                        Validated Canonical IR ready for canvas
                      </span>
                      <button
                        onClick={() => handleApplyCircuitSuggestion(msg.circuit!, idx)}
                        disabled={appliedCircuitId === idx}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                          appliedCircuitId === idx
                            ? 'bg-[#315B8C] text-white'
                            : 'bg-[#F2765E] hover:bg-[#e0634b] text-white font-bold shadow-sm shadow-[#F2765E]/20'
                        }`}
                      >
                        {appliedCircuitId === idx ? '✓ Circuit Applied' : 'Apply Suggestion'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Curriculum Source Reference Citations */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-[#413333]/10">
                    <div className="text-[10px] uppercase font-bold text-[#413333]/70 mb-1 flex items-center gap-1">
                      <span>📚</span> Grounded Curriculum Citations
                    </div>
                    <div className="space-y-1">
                      {msg.sources.map((src, sIdx) => (
                        <div
                          key={sIdx}
                          className="text-[11px] text-[#413333]/70 bg-[#FAF4EC] p-1.5 rounded border border-[#413333]/10"
                        >
                          <span className="font-semibold text-[#315B8C]">{src.module_name}</span>
                          {src.chapter_name && <span> › {src.chapter_name}</span>}
                          <p className="text-[10px] text-[#413333]/60 italic mt-0.5 line-clamp-2">
                            "{src.snippet}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Timestamp */}
              {msg.timestamp && (
                <span className="text-[10px] text-[#413333]/50 px-2">{msg.timestamp}</span>
              )}

              {/* Follow-up Prompts */}
              {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && !isUser && (
                <div className="flex flex-wrap gap-1.5 pt-1 pl-2 max-w-[90%]">
                  {msg.suggestedFollowups.map((followup, fIdx) => (
                    <button
                      key={fIdx}
                      onClick={() => handleSendMessage(followup)}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-[#413333]/20 text-[#315B8C] hover:border-[#F2765E] hover:text-[#F2765E] hover:bg-[#FAF4EC] transition-all text-left shadow-sm cursor-pointer"
                    >
                      {followup} →
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 p-3 text-xs text-[#315B8C] bg-white rounded-xl border border-[#413333]/15 max-w-[70%] shadow-sm animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#F2765E] animate-ping" />
            <span>Consulting QualGo AI Mentor & curriculum knowledge base...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Mode-specific Quick Action Bar */}
      <div className="px-4 py-2 border-t border-[#413333]/15 bg-[#EDE0CF] flex flex-wrap gap-1.5">
        {tutoringMode === 'hint' ? (
          <div className="w-full flex items-center justify-between text-xs">
            <span className="text-[#413333]/70 font-medium">Progressive Clue:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => handleRequestHint(lvl)}
                  disabled={isLoading}
                  className={`px-2 py-1 rounded text-[11px] font-mono font-medium transition-all cursor-pointer ${
                    currentHintLevel === lvl
                      ? 'bg-[#315B8C] text-white font-bold'
                      : 'bg-white text-[#413333] border border-[#413333]/20 hover:bg-[#FAF4EC]'
                  }`}
                >
                  Lvl {lvl}
                </button>
              ))}
            </div>
          </div>
        ) : tutoringMode === 'debug' ? (
          <div className="w-full flex items-center justify-between">
            <span className="text-xs text-[#413333]/70 font-medium">Diagnostic Suite:</span>
            <button
              onClick={handleDebugCircuit}
              disabled={isLoading}
              className="text-xs px-2.5 py-1 rounded-lg bg-[#F2765E]/10 text-[#F2765E] border border-[#F2765E]/30 hover:bg-[#F2765E]/20 transition-all flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>🐛</span> Run Deep Diagnostic
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={handleExplainCurrentCircuit}
              disabled={!circuit || isLoading}
              className="text-[11px] px-2 py-1 rounded-md bg-white text-[#413333] hover:text-[#F2765E] border border-[#413333]/15 hover:border-[#F2765E]/40 transition-colors cursor-pointer shadow-sm"
            >
              🔍 Explain Circuit
            </button>
            <button
              onClick={handleDebugCircuit}
              disabled={isLoading}
              className="text-[11px] px-2 py-1 rounded-md bg-white text-[#413333] hover:text-[#F2765E] border border-[#413333]/15 hover:border-[#F2765E]/40 transition-colors cursor-pointer shadow-sm"
            >
              🐛 Debug
            </button>
            <button
              onClick={() => handleSendMessage('Create a 2-qubit Bell state circuit')}
              disabled={isLoading}
              className="text-[11px] px-2 py-1 rounded-md bg-white text-[#413333] hover:text-[#F2765E] border border-[#413333]/15 hover:border-[#F2765E]/40 transition-colors cursor-pointer shadow-sm"
            >
              ✨ Bell State
            </button>
            <button
              onClick={() => handleSendMessage('Generate Qiskit code for GHZ state')}
              disabled={isLoading}
              className="text-[11px] px-2 py-1 rounded-md bg-white text-[#413333] hover:text-[#F2765E] border border-[#413333]/15 hover:border-[#F2765E]/40 transition-colors cursor-pointer shadow-sm"
            >
              ⚡ Qiskit Code
            </button>
          </>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-[#413333]/15 bg-[#FAF4EC]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={
              tutoringMode === 'socratic'
                ? 'Answer the Socratic question or test a hypothesis...'
                : tutoringMode === 'hint'
                ? 'Ask for a specific hint or clarification...'
                : 'Ask AI Tutor about circuits, quantum math, or algorithms...'
            }
            disabled={isLoading}
            className="flex-1 bg-white text-[#413333] placeholder-[#413333]/40 text-xs rounded-xl px-3.5 py-2.5 border border-[#413333]/20 focus:outline-none focus:border-[#315B8C] focus:ring-1 focus:ring-[#315B8C]/20 shadow-sm transition-all"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-[#F2765E] hover:bg-[#e0634b] disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-[#F2765E]/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Ask</span>
            <span>➤</span>
          </button>
        </form>
      </div>
    </div>
  );
};
