import React from 'react';
import { useAppSelector } from '../../store';
import { ModulesPage } from './ModulesPage';
import { ChapterPage } from './ChapterPage';
import { TopicPage } from './TopicPage';

interface CoursesContainerProps {
  onNavigateAuth?: () => void;
}

export const CoursesContainer: React.FC<CoursesContainerProps> = ({ onNavigateAuth }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { navigation } = useAppSelector((state) => state.course);

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full rounded-2xl p-8 bg-white border border-[#413333]/15 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F2765E]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#315B8C]/10 border border-[#315B8C]/30 flex items-center justify-center text-[#315B8C]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h2 className="text-xl font-heading font-bold text-[#413333] mb-2">
            Sign In to Access Learning Modules
          </h2>
          <p className="text-xs text-[#413333]/70 mb-6 leading-relaxed">
            Access our structured Quantum Computing curriculum, review step-by-step mathematical expositions, execute code in the editor, and sync your course mastery progress.
          </p>

          <button
            onClick={onNavigateAuth}
            className="w-full py-2.5 text-sm font-semibold text-white bg-[#F2765E] hover:bg-[#e0634b] rounded-lg shadow-md shadow-[#F2765E]/20 transition-all cursor-pointer font-sans"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  // Topic view — split layout
  if (navigation.moduleId && navigation.chapterId && navigation.topicId) {
    return (
      <TopicPage
        moduleId={navigation.moduleId}
        chapterId={navigation.chapterId}
        topicId={navigation.topicId}
      />
    );
  }

  // Chapter / Module detail view
  if (navigation.moduleId) {
    return <ChapterPage moduleId={navigation.moduleId} />;
  }

  // Default — module listing
  return <ModulesPage />;
};
