import React from 'react';
import { Sparkles, ArrowRight, Zap, Target } from 'lucide-react';
import { Task, DayStats } from '../../types';

interface AIBriefingWidgetProps {
  stats: DayStats;
  tasks: Task[];
  onOpenAIBriefing: () => void;
}

export const AIBriefingWidget: React.FC<AIBriefingWidgetProps> = ({
  stats,
  tasks,
  onOpenAIBriefing,
}) => {
  const pendingTasks = tasks.filter((t) => !t.completed);
  const urgentTasks = pendingTasks.filter((t) => t.priority === 'urgent' || t.priority === 'high');

  return (
    <div className="relative overflow-hidden rounded-none border-2 border-dark-brown bg-peach-200 p-4 sm:p-5 shadow-xs">
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none text-[10px] font-extrabold uppercase tracking-wider bg-white text-dark-brown border-2 border-dark-brown">
              <Sparkles className="w-3 h-3 text-peach-700" />
              AI Executive Assistant
            </span>
            {urgentTasks.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-white px-2 py-0.5 border-2 border-red-300">
                <Target className="w-3 h-3 text-red-600" />
                {urgentTasks.length} high priority today
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-black text-dark-brown tracking-tight">
            Get your AI Daily Briefing & Tactical Action Plan
          </h3>

          <p className="text-xs sm:text-sm text-dark-brown-muted max-w-xl font-medium">
            Let Google Gemini analyze your scheduled blocks, rank the top priorities to tackle first, and share actionable tips to accomplish them efficiently.
          </p>
        </div>

        {/* Right CTA Button */}
        <button
          onClick={onOpenAIBriefing}
          className="self-start sm:self-center px-4 py-2.5 rounded-none border-2 border-dark-brown bg-white text-black hover:bg-peach-50 active:scale-95 font-black text-xs sm:text-sm shadow-xs transition-all flex items-center gap-2 shrink-0 group"
        >
          <Sparkles className="w-4 h-4 text-peach-700 group-hover:rotate-12 transition-transform" />
          <span>Get Daily AI Plan</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
