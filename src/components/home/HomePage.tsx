import React from 'react';
import { Hero } from './Hero';
import { InteractiveCircuitDemo } from './InteractiveCircuitDemo';
import { ProblemSolution } from './ProblemSolution';
import { ObjectivesSection } from './ObjectivesSection';
import { DeliverablesTable } from './DeliverablesTable';
import { CurriculumPreview } from './CurriculumPreview';
import { MetaInfoSection } from './MetaInfoSection';
import { Footer } from './Footer';

export const HomePage: React.FC = () => {
  return (
    <div className="w-full flex flex-col bg-[#07090e] text-slate-300">
      <Hero />
      <InteractiveCircuitDemo />
      <ProblemSolution />
      <ObjectivesSection />
      <DeliverablesTable />
      <CurriculumPreview />
      <MetaInfoSection />
      <Footer />
    </div>
  );
};

