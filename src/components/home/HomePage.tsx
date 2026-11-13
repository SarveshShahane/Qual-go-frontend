import React from 'react';
import { Hero } from './Hero';
import { InteractiveCircuitDemo } from './InteractiveCircuitDemo';
import { ProblemSolution } from './ProblemSolution';
import { ObjectivesSection } from './ObjectivesSection';
import { DeliverablesTable } from './DeliverablesTable';
import { CurriculumPreview } from './CurriculumPreview';
import { MetaInfoSection } from './MetaInfoSection';
import { Footer } from './Footer';

interface HomePageProps {
  onNavigate?: (view: 'home' | 'auth' | 'courses' | 'designer') => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="w-full flex flex-col bg-paper text-ink">
      <Hero onNavigate={onNavigate} />
      <InteractiveCircuitDemo onNavigate={onNavigate} />
      <ProblemSolution />
      <ObjectivesSection />
      <DeliverablesTable />
      <CurriculumPreview />
      <MetaInfoSection />
      <Footer />
    </div>
  );
};
