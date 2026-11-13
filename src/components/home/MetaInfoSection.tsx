import React from 'react';

export const MetaInfoSection: React.FC = () => {
  const driveUrl = "https://drive.google.com/file/d/1hfk85X50qOAuUqbmA50PQj1vl_7f7X6W/view?usp=drive_link";

  return (
    <section id="metadata" className="py-20 border-b border-rule bg-paper relative">
      <div className="academic-container">
        <div className="max-w-3xl mb-10">
          <p className="text-xs text-muted mb-2">Section 06 · Institutional Register & Datasets</p>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-ink tracking-tight">
            Institutional affiliation and public resources
          </h2>
          <p className="mt-2 text-sm text-muted">
            Official project credentials, category taxonomy, open dataset repositories, and academic contact coordinates.
          </p>
        </div>

        {/* 2-Column Meta Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Card 1: Core Credentials */}
          <div className="p-6 sm:p-8 bg-sheet border border-rule">
            <h3 className="font-display font-semibold text-lg text-ink mb-6 flex items-center gap-3">
              <span className="w-7 h-7 border border-rule bg-paper flex items-center justify-center text-ink shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
              Organization and taxonomy
            </h3>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-paper border border-rule">
                <dt className="text-xs text-muted">Organization</dt>
                <dd className="text-sm font-medium text-ink mt-0.5">Egreen Quanta</dd>
              </div>

              <div className="p-3 bg-paper border border-rule">
                <dt className="text-xs text-muted">Discipline</dt>
                <dd className="text-sm font-medium text-ink mt-0.5">Quantum Information Science</dd>
              </div>

              <div className="p-3 bg-paper border border-rule">
                <dt className="text-xs text-muted">Category</dt>
                <dd className="text-sm font-medium text-navy mt-0.5">Educational Software</dd>
              </div>

              <div className="p-3 bg-paper border border-rule">
                <dt className="text-xs text-muted">Instructional Theme</dt>
                <dd className="text-sm font-medium text-accent mt-0.5">Smart Pedagogical Systems</dd>
              </div>
            </dl>

            <div className="mt-5 p-3 bg-paper border border-rule flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs text-muted block">Inquiries & Correspondence</span>
                <span className="text-xs font-mono text-ink mt-0.5 block">contact@egreenquanta.org</span>
              </div>
              <span className="tag-academic self-start sm:self-center">
                Open for Collaboration
              </span>
            </div>
          </div>

          {/* Card 2: Resources & Public Links */}
          <div className="p-6 sm:p-8 bg-sheet border border-rule flex flex-col justify-between">
            <div>
              <h3 className="font-display font-semibold text-lg text-ink mb-6 flex items-center gap-3">
                <span className="w-7 h-7 border border-rule bg-paper flex items-center justify-center text-ink shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </span>
                Documentation and dataset repository
              </h3>

              <p className="text-sm text-ink-2 leading-relaxed mb-6">
                Access official problem statement guidelines, benchmark circuit specifications, test evaluation matrices, 
                and pedagogical reference documentation via the public repository.
              </p>

              <div className="p-4 bg-paper border border-rule">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border border-rule bg-sheet flex items-center justify-center text-ink shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-ink text-sm">
                        Public Problem Statement Documentation
                      </div>
                      <div className="text-xs text-muted truncate max-w-xs">
                        Archive: <code className="font-mono text-ink-2">1hfk85X50qOAuUqbmA50PQj1vl_7f7X6W</code>
                      </div>
                    </div>
                  </div>
                  <a
                    href={driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-ink text-sheet text-xs font-medium border border-ink hover:bg-ink-2 transition-colors focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 active:bg-ink-2 shrink-0 inline-flex items-center gap-1.5"
                  >
                    <span>Open archive</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-rule flex items-center justify-between text-xs text-muted">
              <span>Instructional video walkthrough: In production</span>
              <span>Format: 1080p Lecture Capture</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
