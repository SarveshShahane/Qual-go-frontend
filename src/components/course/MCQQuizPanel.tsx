import React, { useState, useMemo } from 'react';

interface MCQOption {
  label: string;
  text: string;
}

interface ParsedQuestion {
  num: number;
  question: string;
  options: MCQOption[];
  correctAnswer?: string;
}

interface MCQQuizPanelProps {
  content: string;
  topicId: string;
  onCompleteTopic?: () => void;
}

const DEFAULT_ANSWER_KEY: Record<string, Record<number, string>> = {
  // Module 1 Mastery Quiz
  top_math_12_questions: {
    1: 'A', 2: 'B', 3: 'C', 4: 'B', 5: 'C',
    6: 'B', 7: 'B', 8: 'A', 9: 'B', 10: 'B',
  },
  top_math_12_answers: {
    1: 'A', 2: 'B', 3: 'C', 4: 'B', 5: 'C',
    6: 'B', 7: 'B', 8: 'A', 9: 'B', 10: 'B',
  },

  // Module 2: Qubits Checkpoints & Mastery Quiz
  top_qubits_01_questions: { 1: 'B', 2: 'B', 3: 'B', 4: 'B' },
  top_qubits_02_questions: { 1: 'B', 2: 'B', 3: 'A', 4: 'B' },
  top_qubits_03_questions: { 1: 'A', 2: 'C', 3: 'A', 4: 'A' },
  top_qubits_04_questions: { 1: 'B', 2: 'B', 3: 'B', 4: 'B' },
  top_qubits_05_questions: { 1: 'B', 2: 'B', 3: 'A', 4: 'B' },
  top_qubits_06_questions: {
    1: 'B', 2: 'B', 3: 'C', 4: 'A', 5: 'B',
    6: 'B', 7: 'B', 8: 'B', 9: 'B', 10: 'A',
  },
  top_qubits_06_answers: {
    1: 'B', 2: 'B', 3: 'C', 4: 'A', 5: 'B',
    6: 'B', 7: 'B', 8: 'B', 9: 'B', 10: 'A',
  },

  // Module 3: Superposition & Measurement Checkpoints & Mastery Assessment
  top_superpos_01_questions: { 1: 'C', 2: 'B', 3: 'B', 4: 'A' },
  top_superpos_02_questions: { 1: 'C', 2: 'D', 3: 'B', 4: 'B', 5: 'A' },
  top_superpos_03_questions: { 1: 'C', 2: 'A', 3: 'B', 4: 'B' },
  top_superpos_04_questions: { 1: 'B', 2: 'B', 3: 'A', 4: 'B' },
  top_superpos_05_questions: { 1: 'B', 2: 'B', 3: 'B', 4: 'B' },
  top_superpos_06_questions: { 1: 'C', 2: 'A', 3: 'B', 4: 'B' },
  top_superpos_07_questions: {
    1: 'C', 2: 'B', 3: 'B', 4: 'C', 5: 'A', 6: 'A', 7: 'B', 8: 'B',
  },
  top_superpos_07_answers: {
    1: 'C', 2: 'B', 3: 'B', 4: 'C', 5: 'A', 6: 'A', 7: 'B', 8: 'B',
  },
};

export const MCQQuizPanel: React.FC<MCQQuizPanelProps> = ({ content, topicId, onCompleteTopic }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Parse MCQs from markdown
  const questions: ParsedQuestion[] = useMemo(() => {
    if (!content) return [];
    const parsed: ParsedQuestion[] = [];
    const qBlocks = content.split(/### Question\s+(\d+)/gi);

    if (qBlocks.length > 1) {
      for (let i = 1; i < qBlocks.length; i += 2) {
        const qNum = parseInt(qBlocks[i], 10);
        const blockText = qBlocks[i + 1] || '';

        // Extract options
        const options: MCQOption[] = [];
        const optMatches = blockText.matchAll(/-\s*\*\*([A-D])\.\*\*\s*([^\n\r]+)/g);
        for (const match of optMatches) {
          options.push({
            label: match[1],
            text: match[2].trim(),
          });
        }

        // Get question text before first option
        const firstOptIndex = blockText.indexOf('- **A.');
        const qText = firstOptIndex !== -1 ? blockText.slice(0, firstOptIndex).trim() : blockText.trim();

        // Check if answer is embedded
        const ansMatch = blockText.match(/\*\*Answer:\s*([A-D])\*\*/i);
        const knownAnswer =
          ansMatch?.[1]?.toUpperCase() ||
          DEFAULT_ANSWER_KEY[topicId]?.[qNum];

        if (options.length > 0) {
          parsed.push({
            num: qNum,
            question: qText,
            options,
            correctAnswer: knownAnswer,
          });
        }
      }
    }

    // Fallback: If no structured blocks were parsed, create a default 10-question answering sheet
    if (parsed.length === 0) {
      for (let i = 1; i <= 10; i++) {
        parsed.push({
          num: i,
          question: `Question ${i}`,
          options: [
            { label: 'A', text: 'Option A' },
            { label: 'B', text: 'Option B' },
            { label: 'C', text: 'Option C' },
            { label: 'D', text: 'Option D' },
          ],
          correctAnswer: DEFAULT_ANSWER_KEY[topicId]?.[i],
        });
      }
    }

    return parsed;
  }, [content, topicId]);

  const handleSelectOption = (qNum: number, label: string) => {
    if (submitted) return; // Prevent changing after submission
    setSelectedAnswers((prev) => ({
      ...prev,
      [qNum]: label,
    }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalCount = questions.length;

  const score = useMemo(() => {
    if (!submitted) return 0;
    let correct = 0;
    for (const q of questions) {
      if (q.correctAnswer && selectedAnswers[q.num] === q.correctAnswer) {
        correct++;
      }
    }
    return correct;
  }, [submitted, questions, selectedAnswers]);

  const percentage = totalCount > 0 ? Math.round((score / totalCount) * 100) : 0;

  const handleSubmit = () => {
    setSubmitted(true);
    if (onCompleteTopic && percentage >= 80) {
      onCompleteTopic();
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#FAF4EC]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#413333]/15 bg-[#EDE0CF]">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider bg-white border border-[#315B8C]/30 text-[#315B8C] font-semibold rounded">
            MCQ Assessment
          </span>
          <span className="text-xs font-mono text-[#413333]/70">
            {answeredCount} of {totalCount} answered
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-2 py-1 text-[11px] font-mono text-[#413333]/70 hover:text-[#413333] bg-white hover:bg-[#FAF4EC] border border-[#413333]/20 rounded transition-colors cursor-pointer shadow-sm"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Score Banner (when submitted) */}
      {submitted && (
        <div
          className={`p-4 border-b ${
            percentage >= 80
              ? 'bg-[#315B8C]/15 border-[#315B8C]/30 text-[#315B8C]'
              : 'bg-[#F2765E]/15 border-[#F2765E]/30 text-[#F2765E]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-heading font-bold text-base">
                {percentage >= 80 ? 'Mastery Achieved! 🎉' : 'Keep Practicing!'}
              </div>
              <p className="text-xs font-mono mt-0.5 opacity-90">
                Score: {score}/{totalCount} ({percentage}%) — {percentage >= 80 ? 'Ready to advance!' : 'Target is 80% (8/10). Review the questions and retry.'}
              </p>
            </div>
            <div className="text-2xl font-bold font-mono">
              {percentage}%
            </div>
          </div>
        </div>
      )}

      {/* Questions list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {questions.map((q) => {
          const selected = selectedAnswers[q.num];
          const isCorrect = submitted && q.correctAnswer && selected === q.correctAnswer;
          const isWrong = submitted && q.correctAnswer && selected && selected !== q.correctAnswer;

          return (
            <div
              key={q.num}
              className={`p-4 rounded-xl border transition-all ${
                submitted
                  ? isCorrect
                    ? 'bg-[#315B8C]/10 border-[#315B8C]'
                    : isWrong
                    ? 'bg-[#F2765E]/10 border-[#F2765E]'
                    : 'bg-white border-[#413333]/15'
                  : selected
                  ? 'bg-white border-[#315B8C] shadow-sm'
                  : 'bg-white border-[#413333]/15'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-xs font-mono text-[#315B8C] font-semibold">
                  Question {q.num}
                </span>
                {submitted && q.correctAnswer && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      isCorrect
                        ? 'bg-[#315B8C]/15 text-[#315B8C] border border-[#315B8C]/30'
                        : 'bg-[#F2765E]/15 text-[#F2765E] border border-[#F2765E]/30'
                    }`}
                  >
                    {isCorrect ? 'Correct' : `Answer: ${q.correctAnswer}`}
                  </span>
                )}
              </div>

              {q.question && q.question !== `Question ${q.num}` && (
                <p className="text-xs text-[#413333] mb-3 leading-relaxed">
                  {q.question}
                </p>
              )}

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isSelected = selected === opt.label;
                  const isThisCorrect = submitted && q.correctAnswer === opt.label;

                  let optStyles = 'bg-[#FAF4EC] border-[#413333]/15 text-[#413333] hover:border-[#315B8C]/40';
                  if (isSelected) {
                    optStyles = 'bg-[#315B8C]/10 border-[#315B8C] text-[#413333] font-medium shadow-sm';
                  }
                  if (submitted) {
                    if (isThisCorrect) {
                      optStyles = 'bg-[#315B8C]/20 border-[#315B8C] text-[#315B8C] font-semibold';
                    } else if (isSelected && !isThisCorrect) {
                      optStyles = 'bg-[#F2765E]/20 border-[#F2765E] text-[#F2765E]';
                    } else {
                      optStyles = 'bg-[#EDE0CF]/30 border-[#413333]/10 text-[#413333]/50';
                    }
                  }

                  return (
                    <button
                      key={opt.label}
                      onClick={() => handleSelectOption(q.num, opt.label)}
                      disabled={submitted}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-left text-xs transition-all cursor-pointer ${optStyles}`}
                    >
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center font-mono text-[11px] font-bold shrink-0 ${
                          isSelected
                            ? 'bg-[#315B8C] text-white'
                            : 'bg-[#EDE0CF] text-[#413333]/70'
                        }`}
                      >
                        {opt.label}
                      </span>
                      <span className="flex-1">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Submit Button */}
      <div className="px-4 py-3 border-t border-[#413333]/15 bg-[#EDE0CF]">
        {submitted ? (
          <button
            onClick={handleReset}
            className="w-full py-2 text-xs font-mono font-medium text-[#413333] bg-white hover:bg-[#FAF4EC] rounded-lg border border-[#413333]/20 shadow-sm transition-all cursor-pointer"
          >
            Retry Quiz
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={answeredCount === 0}
            className={`w-full py-2 text-xs font-mono font-semibold rounded-lg shadow-md transition-all cursor-pointer ${
              answeredCount === totalCount
                ? 'bg-[#F2765E] hover:bg-[#e0634b] text-white shadow-[#F2765E]/20'
                : 'bg-white text-[#413333]/60 border border-[#413333]/20 hover:text-[#413333]'
            }`}
          >
            {answeredCount === totalCount
              ? `Submit All Answers (${totalCount}/${totalCount})`
              : `Submit Answers (${answeredCount}/${totalCount} Answered)`}
          </button>
        )}
      </div>
    </div>
  );
};
