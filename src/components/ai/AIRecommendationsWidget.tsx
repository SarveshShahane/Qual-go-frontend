import React from 'react';
import type { AIRecommendation, TopicMastery } from '../../types/ai';

interface AIRecommendationsWidgetProps {
  recommendations: AIRecommendation[];
  mastery?: TopicMastery | null;
  onSelectRecommendation?: (rec: AIRecommendation) => void;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const AIRecommendationsWidget: React.FC<AIRecommendationsWidgetProps> = ({
  recommendations,
  mastery,
  onSelectRecommendation,
  onRefresh,
  isLoading = false,
}) => {
  return (
    <div className="bg-white border border-[#413333]/15 rounded-xl p-4 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-[#413333]/10 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <div>
            <h4 className="text-sm font-semibold text-[#413333] tracking-wide">Personalized Pathway</h4>
            <p className="text-xs text-[#413333]/70">Adaptive curriculum recommendations</p>
          </div>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="text-xs text-[#315B8C] hover:text-[#F2765E] disabled:opacity-50 transition-colors flex items-center gap-1 cursor-pointer"
            title="Refresh recommendations"
          >
            <span>🔄</span>
            <span>Refresh</span>
          </button>
        )}
      </div>

      {/* Active Mastery Overview */}
      {mastery && (
        <div className="mb-3 p-2.5 rounded-lg bg-[#FAF4EC] border border-[#413333]/10">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[#413333] font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F2765E] animate-pulse" />
              Focus: {mastery.topic_name}
            </span>
            <span className="font-mono text-[#315B8C] font-bold">
              {Math.round(mastery.score * 100)}% Mastery
            </span>
          </div>
          <div className="w-full bg-[#EDE0CF] rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 bg-[#315B8C]"
              style={{ width: `${Math.max(5, Math.min(100, mastery.score * 100))}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1 text-[10px] text-[#413333]/70">
            <span>Status: <span className="capitalize text-[#413333] font-medium">{mastery.status.replace('_', ' ')}</span></span>
            <span>Confidence: {Math.round(mastery.confidence * 100)}%</span>
          </div>
        </div>
      )}

      {/* Recommended Topics List */}
      {isLoading ? (
        <div className="py-6 flex flex-col items-center justify-center gap-2 text-[#413333]/70 text-xs">
          <div className="w-6 h-6 border-2 border-[#F2765E] border-t-transparent rounded-full animate-spin" />
          <span>Analyzing quantum skill profile...</span>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-4 text-xs text-[#413333]/50">
          No pending recommendations. Keep exploring modules!
        </div>
      ) : (
        <div className="space-y-2">
          {recommendations.slice(0, 3).map((rec) => (
            <div
              key={rec.id}
              onClick={() => onSelectRecommendation?.(rec)}
              className="group p-2.5 rounded-lg bg-[#FAF4EC] border border-[#413333]/15 hover:border-[#F2765E]/50 hover:bg-white transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs font-semibold text-[#413333] group-hover:text-[#F2765E] transition-colors">
                      {rec.title}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-medium bg-[#EDE0CF] text-[#315B8C] border border-[#315B8C]/30">
                      {rec.difficulty}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#413333]/70 line-clamp-2 leading-relaxed">
                    {rec.reason}
                  </p>
                </div>
                <button
                  type="button"
                  className="mt-0.5 text-xs text-[#315B8C] opacity-70 group-hover:opacity-100 group-hover:text-[#F2765E] group-hover:translate-x-0.5 transition-all"
                  aria-label="Proceed to recommendation"
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
