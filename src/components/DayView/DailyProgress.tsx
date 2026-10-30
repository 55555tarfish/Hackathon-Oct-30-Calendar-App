import React from 'react';
import { CheckCircle, Flame, Clock, Target, Award } from 'lucide-react';
import { DayStats } from '../../types';

interface DailyProgressProps {
  stats: DayStats;
  streak: number;
}

export const DailyProgress: React.FC<DailyProgressProps> = ({ stats, streak }) => {
  const { totalTasks, completedTasks, completionPercentage, totalHabits, completedHabits, totalMinutesScheduled } = stats;

  const scheduledHours = (totalMinutesScheduled / 60).toFixed(1);

  const getMessage = () => {
    if (totalTasks === 0) return 'No tasks planned yet. Add a few to start your day!';
    if (completionPercentage === 100) return 'Incredible! You completed everything planned for today! 🏆';
    if (completionPercentage >= 75) return 'Almost there! Just a few more to wrap up strong! 💪';
    if (completionPercentage >= 50) return 'Over halfway through! Keep that momentum going! ⚡';
    if (completionPercentage > 0) return 'Great progress! One step at a time. ✨';
    return "Ready to make today productive? Check off your first task! 🚀";
  };

  return (
    <div className="bg-peach-200 rounded-none p-4 sm:p-5 border-2 border-dark-brown shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Progress info & motivational status */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-dark-brown-muted">
              Daily Focus & Progress
            </span>
            {streak > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-xs font-bold bg-white text-amber-700 border-2 border-dark-brown">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{streak} day streak</span>
              </span>
            )}
          </div>
          <h3 className="text-lg font-extrabold text-dark-brown">
            {completionPercentage}% Completed
          </h3>
          <p className="text-xs sm:text-sm text-dark-brown mt-0.5 font-medium">
            {getMessage()}
          </p>

          {/* Progress bar */}
          <div className="w-full bg-peach-300 h-3 rounded-none mt-3 overflow-hidden border-2 border-dark-brown">
            <div
              className="h-full rounded-none transition-all duration-500 ease-out bg-gradient-to-r from-peach-500 via-peach-600 to-amber-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Right: Quick Stats pills */}
        <div className="grid grid-cols-3 sm:flex sm:items-center gap-2 pt-2 sm:pt-0 border-t-2 sm:border-t-0 border-dark-brown">
          <div className="flex flex-col items-center justify-center px-3 py-2 rounded-none bg-white border-2 border-dark-brown shadow-xs">
            <div className="flex items-center gap-1 text-slate-700 text-xs font-bold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
              <span>Tasks</span>
            </div>
            <span className="text-sm font-extrabold text-black mt-0.5">
              {completedTasks}/{totalTasks}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center px-3 py-2 rounded-none bg-white border-2 border-dark-brown shadow-xs">
            <div className="flex items-center gap-1 text-slate-700 text-xs font-bold">
              <Target className="w-3.5 h-3.5 text-peach-700 stroke-[2.5]" />
              <span>Habits</span>
            </div>
            <span className="text-sm font-extrabold text-black mt-0.5">
              {completedHabits}/{totalHabits}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center px-3 py-2 rounded-none bg-white border-2 border-dark-brown shadow-xs">
            <div className="flex items-center gap-1 text-slate-700 text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-indigo-600 stroke-[2.5]" />
              <span>Time</span>
            </div>
            <span className="text-sm font-extrabold text-black mt-0.5">
              {scheduledHours}h
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
