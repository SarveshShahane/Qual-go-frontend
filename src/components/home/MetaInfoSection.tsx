import React from 'react';

export const MetaInfoSection: React.FC = () => {
  const driveUrl = "https://drive.google.com/file/d/1hfk85X50qOAuUqbmA50PQj1vl_7f7X6W/view?usp=drive_link";

  return (
    <section id="metadata" className="py-20 border-b border-white/10 bg-[#07090e] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-400 mb-3">
            <span>PROJECT SPECIFICATION & INSTITUTIONAL PROFILE</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Organization & Problem Statement Details
          </h2>
          <p className="mt-3 text-slate-300 text-base">
            Official project credentials, category taxonomy, open dataset resources, and contact coordinates.
          </p>
        </div>

        {/* 2-Column Meta Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Card 1: Core Credentials */}
          <div className="p-8 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-md">
            <h3 className="font-heading font-bold text-xl text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
              Organization & Category Taxonomy
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-xs font-mono text-slate-500 uppercase">Organization</div>
                <div className="text-base font-semibold text-white mt-1">Egreen Quanta</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-xs font-mono text-slate-500 uppercase">Department</div>
                <div className="text-base font-semibold text-white mt-1">Egreen Quanta</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-xs font-mono text-slate-500 uppercase">Category</div>
                <div className="text-base font-semibold text-cyan-400 mt-1">Software</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-xs font-mono text-slate-500 uppercase">Theme</div>
                <div className="text-base font-semibold text-emerald-400 mt-1">Smart Education</div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-slate-500 uppercase">Contact & Inquiries</div>
                <div className="text-sm font-medium text-slate-200 mt-0.5">contact@egreenquanta.org / support@qual.dev</div>
              </div>
              <span className="px-2.5 py-1 text-xs font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded-full">
                Open for Collaboration
              </span>
            </div>
          </div>

          {/* Card 2: Resources & Public Links */}
          <div className="p-8 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-md flex flex-col justify-between">
            <div>
              <h3 className="font-heading font-bold text-xl text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </span>
                PS Documentation & Dataset Access
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Access official problem statement guidelines, benchmark algorithms, test evaluation datasets, 
                and educational reference materials via the public Google Drive repository.
              </p>

              <div className="p-5 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-heading font-semibold text-white text-sm">
                        Public/Open Additional Information Regarding PS
                      </div>
                      <div className="text-xs font-mono text-cyan-400 truncate max-w-xs sm:max-w-sm">
                        drive.google.com/file/d/1hfk85X50qOAuUqbmA50PQj1vl_7f7X6W
                      </div>
                    </div>
                  </div>
                  <a
                    href={driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-heading font-semibold text-xs rounded-lg transition-all shadow-md shadow-cyan-500/20 shrink-0 inline-flex items-center gap-1.5"
                  >
                    <span>Open Drive</span>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Video Demo Link Placeholder */}
            <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>YouTube Demo Walkthrough: Coming soon</span>
              </div>
              <span className="font-mono text-slate-500">Video Walkthrough (HD)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

