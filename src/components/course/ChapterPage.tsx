import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchModule,
  fetchChapterTopics,
  navigateToModules,
  navigateToTopic,
} from '../../store/slices/courseSlice';

interface ChapterPageProps {
  moduleId: string;
}

export const ChapterPage: React.FC<ChapterPageProps> = ({ moduleId }) => {
  const dispatch = useAppDispatch();
  const { currentModule, currentChapter, loading, error } = useAppSelector(
    (state) => state.course
  );
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentModule || currentModule.id !== moduleId) {
      dispatch(fetchModule(moduleId));
    }
  }, [dispatch, moduleId, currentModule?.id]);

  const handleToggleChapter = (chapterId: string) => {
    if (expandedChapterId === chapterId) {
      setExpandedChapterId(null);
    } else {
      setExpandedChapterId(chapterId);
      dispatch(fetchChapterTopics({ moduleId, chapterId }));
    }
  };

  const handleTopicClick = (chapterId: string, topicId: string) => {
    dispatch(navigateToTopic({ moduleId, chapterId, topicId }));
  };

  const handleBack = () => {
    dispatch(navigateToModules());
  };

  if (loading && !currentModule) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3 text-[#413333]/70">
          <svg className="w-5 h-5 animate-spin text-[#F2765E]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="font-mono text-sm">Loading module…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F2765E]/10 border border-[#F2765E]/30 text-[#F2765E] rounded-lg text-sm font-mono">
            {error}
          </div>
          <button
            onClick={() => dispatch(fetchModule(moduleId))}
            className="mt-4 block mx-auto px-4 py-2 text-xs font-mono text-[#315B8C] hover:text-[#413333] bg-white border border-[#413333]/20 hover:border-[#315B8C] rounded-lg transition-all cursor-pointer shadow-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!currentModule) return null;

  const moduleProgress =
    currentModule.total_topics > 0
      ? Math.round((currentModule.completed_topics / currentModule.total_topics) * 100)
      : 0;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Back button */}
      <button
        onClick={handleBack}
        className="inline-flex items-center gap-2 text-xs font-mono text-[#315B8C] hover:text-[#F2765E] transition-colors mb-6 cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        All Modules
      </button>

      {/* Module header */}
      <div className="bg-white rounded-xl p-6 mb-8 border border-[#413333]/15 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-wider bg-[#EDE0CF] border border-[#413333]/20 text-[#315B8C] font-semibold rounded mb-3">
              Module
            </span>
            <h1 className="text-xl font-heading font-bold text-[#413333] mt-2">{currentModule.name}</h1>
          </div>
          <div className="text-right">
            <span className="text-2xl font-heading font-bold text-[#413333]">{moduleProgress}%</span>
            <p className="text-[11px] font-mono text-[#413333]/60 mt-0.5">complete</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-[#EDE0CF] rounded-full overflow-hidden mb-3">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${moduleProgress}%`,
              background:
                moduleProgress === 100
                  ? '#315B8C'
                  : 'linear-gradient(to right, #F2765E, #315B8C)',
            }}
          />
        </div>

        <div className="flex items-center gap-4 text-xs text-[#413333]/70 font-mono">
          <span>{currentModule.chapters.length} chapters</span>
          <span className="w-1 h-1 rounded-full bg-[#413333]/30" />
          <span>{currentModule.total_topics} topics</span>
          <span className="w-1 h-1 rounded-full bg-[#413333]/30" />
          <span>{currentModule.completed_topics} completed</span>
        </div>
      </div>

      {/* Chapters accordion */}
      <div className="space-y-3">
        {currentModule.chapters.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-sm font-mono text-[#413333]/50">No chapters in this module yet.</span>
          </div>
        ) : (
          currentModule.chapters.map((chapter, index) => {
            const isExpanded = expandedChapterId === chapter.id;
            const chapterTopics =
              isExpanded && currentChapter?.chapter_id === chapter.id
                ? currentChapter
                : null;

            return (
              <div key={chapter.id} className="bg-white rounded-xl overflow-hidden border border-[#413333]/15 shadow-sm">
                {/* Chapter header (clickable) */}
                <button
                  onClick={() => handleToggleChapter(chapter.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#FAF4EC] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-[#FAF4EC] border border-[#413333]/15 flex items-center justify-center text-xs font-mono text-[#315B8C] font-semibold">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-sm font-heading font-semibold text-[#413333]">
                      {chapter.name}
                    </h3>
                  </div>
                  <svg
                    className={`w-4 h-4 text-[#413333]/60 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expanded topics list */}
                {isExpanded && (
                  <div className="border-t border-[#413333]/10 bg-[#FAF4EC]/60">
                    {loading && !chapterTopics ? (
                      <div className="flex items-center justify-center py-6">
                        <svg className="w-4 h-4 animate-spin text-[#F2765E]" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      </div>
                    ) : chapterTopics && chapterTopics.topics.length > 0 ? (
                      <div className="py-2">
                        {/* Chapter progress */}
                        <div className="px-5 py-2 flex items-center gap-3 text-[11px] font-mono text-[#413333]/60">
                          <span>
                            {chapterTopics.completed_topics}/{chapterTopics.total_topics} topics completed
                          </span>
                          <div className="flex-1 h-1 bg-[#EDE0CF] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#315B8C]"
                              style={{
                                width: `${
                                  chapterTopics.total_topics > 0
                                    ? (chapterTopics.completed_topics / chapterTopics.total_topics) * 100
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>

                        {/* Topic items */}
                        {chapterTopics.topics.map((topic) => (
                          <button
                            key={topic.id}
                            onClick={() => handleTopicClick(chapter.id, topic.id)}
                            className="w-full flex items-center gap-3 px-5 py-3 text-left hover:bg-[#EDE0CF]/50 transition-colors cursor-pointer group"
                          >
                            {/* Completion indicator */}
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                topic.completed
                                  ? 'border-[#315B8C] bg-[#315B8C]/15'
                                  : 'border-[#413333]/30 group-hover:border-[#F2765E]'
                              }`}
                            >
                              {topic.completed && (
                                <svg className="w-3 h-3 text-[#315B8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>

                            <span
                              className={`text-sm ${
                                topic.completed
                                  ? 'text-[#413333]/60'
                                  : 'text-[#413333] group-hover:text-[#F2765E]'
                              } transition-colors`}
                            >
                              {topic.name}
                            </span>

                            {topic.question_type === 'mcq' && (
                              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#EDE0CF] border border-[#315B8C]/30 text-[#315B8C] font-semibold">
                                MCQ
                              </span>
                            )}
                            {topic.question_type === 'code' && (
                              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#EDE0CF] border border-[#F2765E]/30 text-[#F2765E] font-semibold">
                                Code
                              </span>
                            )}
                            {topic.question_type === 'reading' && (
                              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-[#EDE0CF] border border-[#413333]/30 text-[#413333] font-semibold">
                                Reading
                              </span>
                            )}

                            <svg
                              className="w-3.5 h-3.5 text-[#413333]/40 group-hover:text-[#F2765E] ml-auto transition-colors"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    ) : chapterTopics ? (
                      <div className="px-5 py-6 text-center text-sm font-mono text-[#413333]/50">
                        No topics in this chapter yet.
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

