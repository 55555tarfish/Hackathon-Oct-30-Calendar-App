import React from 'react';
import { Check, Flame, Plus, Sparkles } from 'lucide-react';
import { Habit } from '../../types';

interface HabitsTrackerProps {
  habits: Habit[];
  currentDateKey: string;
  onToggleHabit: (habitId: string) => void;
  onOpenHabitModal: () => void;
}

export const HabitsTracker: React.FC<HabitsTrackerProps> = ({
  habits,
  currentDateKey,
  onToggleHabit,
  onOpenHabitModal,
}) => {
  return (
    <div className="bg-peach-200 rounded-none p-4 sm:p-5 border-2 border-dark-brown shadow-xs transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-peach-700" />
          <h4 className="text-sm font-bold text-dark-brown">
            Daily Habits & Routines
          </h4>
        </div>
        <button
          onClick={onOpenHabitModal}
          className="flex items-center gap-1 text-xs font-bold text-dark-brown-muted hover:text-dark-brown transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Habit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
        {habits.map((habit) => {
          const isDone = habit.completedDates.includes(currentDateKey);
          return (
            <button
              key={habit.id}
              onClick={() => onToggleHabit(habit.id)}
              className={`flex items-center justify-between p-2.5 rounded-none border-2 text-left transition-all ${
                isDone
                  ? 'bg-peach-100 border-dark-brown shadow-xs'
                  : 'bg-white border-dark-brown hover:border-dark-brown shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <div
                  className={`w-6 h-6 rounded-none flex items-center justify-center shrink-0 border-2 transition-all ${
                    isDone
                      ? 'bg-peach-600 border-dark-brown text-white shadow-xs'
                      : 'border-dark-brown bg-white hover:border-dark-brown'
                  }`}
                >
                  {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <div className="truncate">
                  <p
                    className={`text-xs font-bold truncate ${
                      isDone
                        ? 'text-dark-brown-muted/70 line-through'
                        : 'text-black'
                    }`}
                  >
                    {habit.title}
                  </p>
                  <p className="text-[10px] text-dark-brown-muted font-semibold">
                    {habit.frequency}
                  </p>
                </div>
              </div>

              {habit.streak > 0 && (
                <div className="flex items-center gap-0.5 shrink-0 px-1.5 py-0.5 rounded-none border-2 border-dark-brown bg-white text-amber-700 text-[10px] font-bold">
                  <Flame className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                  <span>{habit.streak}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
