import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchTopicContent,
  fetchChapterTopics,
  markTopicComplete,
  navigateToModule,
  navigateToTopic,
} from '../../store/slices/courseSlice';
import { MarkdownRenderer } from './MarkdownRenderer';
import { MCQQuizPanel } from './MCQQuizPanel';

interface TopicPageProps {
  moduleId: string;
  chapterId: string;
  topicId: string;
}

export const TopicPage: React.FC<TopicPageProps> = ({ moduleId, chapterId, topicId }) => {
  const dispatch = useAppDispatch();
  const { currentTopicContent, currentTopicQuestionType, currentChapter, loading } = useAppSelector(
    (state) => state.course
  );
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState<'mcq' | 'code'>('code');

  // Find current topic in the chapter topics list
  const currentTopicItem = currentChapter?.topics.find((t) => t.id === topicId);
  const currentTopicIndex = currentChapter?.topics.findIndex((t) => t.id === topicId) ?? -1;
  const prevTopic = currentTopicIndex > 0 ? currentChapter?.topics[currentTopicIndex - 1] : null;
  const nextTopic =
    currentChapter && currentTopicIndex < currentChapter.topics.length - 1
      ? currentChapter.topics[currentTopicIndex + 1]
      : null;

  // Resolve question type from topic or fetched response
  const questionType = currentTopicQuestionType || currentTopicItem?.question_type || 'code';

  // Fetch topic content on mount or when topic changes
  useEffect(() => {
    dispatch(fetchTopicContent({ moduleId, chapterId, topicId }));
    if (!currentChapter || currentChapter.chapter_id !== chapterId) {
      dispatch(fetchChapterTopics({ moduleId, chapterId }));
    }
  }, [dispatch, moduleId, chapterId, topicId, currentChapter?.chapter_id]);

  // Set default tab when questionType changes
  useEffect(() => {
    if (questionType === 'mcq') {
      setActiveTab('mcq');
    } else {
      setActiveTab('code');
    }
  }, [questionType, topicId]);

  const handleMarkComplete = () => {
    const isCompleted = currentTopicItem?.completed ?? false;
    dispatch(
      markTopicComplete({
        moduleId,
        chapterId,
        topicId,
        completed: !isCompleted,
      })
    );
  };

  const handleNavigateTopic = (newTopicId: string) => {
    dispatch(navigateToTopic({ moduleId, chapterId, topicId: newTopicId }));
  };

  const handleBack = () => {
    dispatch(navigateToModule(moduleId));
  };

  if (loading && !currentTopicContent) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3 text-slate-400">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="font-mono text-sm">Loading topic…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#413333]/15 bg-[#FAF4EC] backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs font-mono text-[#315B8C] hover:text-[#F2765E] transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Module
          </button>
          <div className="w-px h-5 bg-[#413333]/15" />
          <h2 className="text-sm font-heading font-semibold text-[#413333] truncate max-w-sm sm:max-w-md">
            {currentTopicItem?.name || 'Topic'}
          </h2>

          {/* Question Type Badge */}
          {questionType === 'mcq' && (
            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-[#EDE0CF] border border-[#315B8C]/30 text-[#315B8C] font-semibold">
              MCQ Assessment
            </span>
          )}
          {questionType === 'code' && (
            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-[#EDE0CF] border border-[#F2765E]/30 text-[#F2765E] font-semibold">
              Code Problem
            </span>
          )}
          {questionType === 'reading' && (
            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-[#EDE0CF] border border-[#413333]/30 text-[#413333] font-semibold">
              Concept / Theory
            </span>
          )}
        </div>

        <button
          onClick={handleMarkComplete}
          className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
            currentTopicItem?.completed
              ? 'border-[#315B8C]/50 bg-[#315B8C]/10 text-[#315B8C] hover:bg-[#315B8C]/20 font-semibold'
              : 'border-[#413333]/20 bg-white text-[#413333] hover:border-[#F2765E] hover:text-[#F2765E] shadow-sm'
          }`}
        >
          {currentTopicItem?.completed ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Completed
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth={2} />
              </svg>
              Mark Complete
            </>
          )}
        </button>
      </div>

      {/* Split layout */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left panel — Content */}
        <div className="w-1/2 border-r border-[#413333]/15 overflow-y-auto bg-[#F5EBDD]">
          <div className="p-6">
            <div className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-wider bg-[#EDE0CF] border border-[#413333]/20 text-[#315B8C] font-semibold rounded">
                Content & Exposition
              </span>
            </div>
            <div className="prose max-w-none text-[#413333]">
              <MarkdownRenderer content={currentTopicContent || ''} />
            </div>
          </div>
        </div>

        {/* Right panel — Code Editor or MCQ Assessment */}
        <div className="w-1/2 flex flex-col bg-[#FAF4EC]">
          {/* Header with Switcher Tabs */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#413333]/15 bg-[#EDE0CF]">
            <div className="flex items-center gap-1.5">
              {questionType === 'mcq' && (
                <button
                  onClick={() => setActiveTab('mcq')}
                  className={`px-3 py-1 text-xs font-mono rounded-md transition-colors cursor-pointer ${
                    activeTab === 'mcq'
                      ? 'bg-white text-[#315B8C] border border-[#315B8C]/40 shadow-sm font-semibold'
                      : 'text-[#413333]/70 hover:text-[#413333]'
                  }`}
                >
                  MCQ Quiz
                </button>
              )}
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 text-xs font-mono rounded-md transition-colors cursor-pointer ${
                  activeTab === 'code'
                    ? 'bg-white text-[#F2765E] border border-[#F2765E]/40 shadow-sm font-semibold'
                    : 'text-[#413333]/70 hover:text-[#413333]'
                }`}
              >
                {questionType === 'mcq' ? 'Code Scratchpad' : 'Code Editor'}
              </button>
            </div>

            {activeTab === 'code' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCode('')}
                  className="px-2 py-1 text-[11px] font-mono text-[#413333]/70 hover:text-[#413333] bg-white border border-[#413333]/20 rounded transition-colors cursor-pointer shadow-sm"
                >
                  Clear
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(code)}
                  className="px-2 py-1 text-[11px] font-mono text-[#413333]/70 hover:text-[#413333] bg-white border border-[#413333]/20 rounded transition-colors cursor-pointer shadow-sm"
                >
                  Copy
                </button>
              </div>
            )}
          </div>

          {/* Body: MCQ Panel or Code Editor */}
          {activeTab === 'mcq' ? (
            <MCQQuizPanel
              content={currentTopicContent || ''}
              topicId={topicId}
              onCompleteTopic={handleMarkComplete}
            />
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Textarea */}
              <div className="flex-1 p-4 min-h-0">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={
                    questionType === 'code'
                      ? '# Write your code solution here\nimport numpy as np\n\n# Calculate / simulate:\n'
                      : '# Use this code workspace for calculations\nimport numpy as np\n'
                  }
                  spellCheck={false}
                  className="w-full h-full resize-none bg-white text-[#413333] font-mono text-sm leading-relaxed p-4 rounded-lg border border-[#413333]/15 focus:border-[#315B8C] focus:outline-none focus:ring-1 focus:ring-[#315B8C]/20 placeholder-[#413333]/40 selection:bg-[#F2765E]/20"
                />
              </div>

              {/* Run button */}
              <div className="px-4 py-3 border-t border-[#413333]/15 bg-[#EDE0CF]">
                <button
                  onClick={() => {
                    alert('Code submitted! Simulated environment ready for quantum matrix & circuit operations.');
                  }}
                  className="w-full py-2 text-sm font-mono font-medium text-white bg-[#F2765E] hover:bg-[#e0634b] rounded-lg shadow-md shadow-[#F2765E]/20 transition-all cursor-pointer"
                >
                  ▶ Run Code Solution
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom nav — Prev / Next */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-[#413333]/15 bg-[#FAF4EC] shrink-0">
        {prevTopic ? (
          <button
            onClick={() => handleNavigateTopic(prevTopic.id)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-[#413333] hover:text-[#F2765E] bg-white hover:bg-[#FAF4EC] border border-[#413333]/15 hover:border-[#F2765E]/40 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {prevTopic.name}
          </button>
        ) : (
          <div />
        )}
        {nextTopic ? (
          <button
            onClick={() => handleNavigateTopic(nextTopic.id)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-[#413333] hover:text-[#F2765E] bg-white hover:bg-[#FAF4EC] border border-[#413333]/15 hover:border-[#F2765E]/40 rounded-lg shadow-sm transition-all cursor-pointer"
          >
            {nextTopic.name}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};
