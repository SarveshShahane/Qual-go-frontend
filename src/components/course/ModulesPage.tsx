import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchModules, navigateToModule } from '../../store/slices/courseSlice';

export const ModulesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { modules, loading, error } = useAppSelector((state) => state.course);

  useEffect(() => {
    dispatch(fetchModules());
  }, [dispatch]);

  const handleModuleClick = (moduleId: string) => {
    dispatch(navigateToModule(moduleId));
  };

  if (loading && modules.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3 text-[#413333]/70">
          <svg className="w-5 h-5 animate-spin text-[#F2765E]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="font-mono text-sm">Loading modules…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F2765E]/10 border border-[#F2765E]/30 text-[#F2765E] rounded-lg text-sm font-mono">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            {error}
          </div>
          <button
            onClick={() => dispatch(fetchModules())}
            className="mt-4 px-4 py-2 text-xs font-mono text-[#315B8C] hover:text-[#413333] bg-white border border-[#413333]/20 hover:border-[#315B8C] rounded-lg transition-all cursor-pointer shadow-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-wider bg-[#EDE0CF] border border-[#413333]/20 text-[#315B8C] font-semibold rounded mb-3">
          Learning Modules
        </span>
        <h1 className="text-2xl font-heading font-bold text-[#413333] mt-3">Course Modules</h1>
        <p className="text-sm text-[#413333]/70 mt-2">
          Select a module to explore its chapters and topics.
        </p>
      </div>

      {/* Module grid */}
      {modules.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex flex-col items-center gap-3 text-[#413333]/50">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="font-mono text-sm">No modules available yet.</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => {
            const progress =
              mod.total_chapters > 0
                ? Math.round((mod.completed_chapters / mod.total_chapters) * 100)
                : 0;

            return (
              <button
                key={mod.id}
                onClick={() => handleModuleClick(mod.id)}
                className="group text-left bg-white hover:border-[#F2765E]/50 rounded-xl p-5 border border-[#413333]/15 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                {/* Module icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#315B8C]/10 border border-[#315B8C]/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#315B8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  {progress === 100 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] uppercase font-mono tracking-wider bg-[#315B8C]/10 border border-[#315B8C]/25 text-[#315B8C] font-semibold rounded">
                      Complete
                    </span>
                  )}
                </div>

                {/* Module name */}
                <h3 className="text-base font-heading font-semibold text-[#413333] group-hover:text-[#F2765E] transition-colors mb-2">
                  {mod.name}
                </h3>

                {/* Stats */}
                <div className="flex items-center gap-3 text-xs text-[#413333]/70 mb-4">
                  <span className="font-mono">{mod.total_chapters} chapters</span>
                  <span className="w-1 h-1 rounded-full bg-[#413333]/30" />
                  <span className="font-mono">{mod.completed_chapters} completed</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#EDE0CF] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${progress}%`,
                      background:
                        progress === 100
                          ? '#315B8C'
                          : 'linear-gradient(to right, #F2765E, #315B8C)',
                    }}
                  />
                </div>
                <div className="mt-1.5 text-right">
                  <span className="text-[11px] font-mono text-[#413333]/60">{progress}%</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

