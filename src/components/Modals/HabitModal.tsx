import React, { useState } from 'react';
import { X, Sparkles, Trash2, Plus } from 'lucide-react';
import { Habit, Category } from '../../types';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habits: Habit[];
  onAddHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
  categories: Category[];
}

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  onClose,
  habits,
  onAddHabit,
  onDeleteHabit,
  categories,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || 'health');
  const [frequency, setFrequency] = useState<'daily' | 'weekdays' | 'weekly'>('daily');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newHabit: Habit = {
      id: 'habit-' + Date.now(),
      title: title.trim(),
      category,
      frequency,
      completedDates: [],
      streak: 0,
      createdAt: new Date().toISOString(),
    };

    onAddHabit(newHabit);
    setTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-peach-100 rounded-none max-w-md w-full border-2 border-dark-brown shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-dark-brown bg-peach-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-peach-700" />
            <h3 className="text-base font-bold text-dark-brown">
              Manage Daily Habits
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-none border-2 border-dark-brown text-dark-brown-muted hover:text-dark-brown hover:bg-peach-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1 bg-peach-100">
          {/* New Habit Form */}
          <form onSubmit={handleSubmit} className="space-y-3 bg-peach-200 p-3.5 rounded-none border-2 border-dark-brown">
            <h4 className="text-xs font-bold uppercase tracking-wider text-dark-brown">
              Create New Habit
            </h4>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 15-minute meditation, Drink 2L water..."
              className="w-full px-3 py-2 rounded-none bg-white border-2 border-dark-brown text-xs sm:text-sm text-black focus:outline-none focus:border-dark-brown font-semibold placeholder-dark-brown/40"
            />

            <div className="grid grid-cols-2 gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-none bg-white border-2 border-dark-brown text-xs text-black font-bold focus:outline-none focus:border-dark-brown"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full px-2.5 py-1.5 rounded-none bg-white border-2 border-dark-brown text-xs text-black font-bold focus:outline-none focus:border-dark-brown"
              >
                <option value="daily">Daily</option>
                <option value="weekdays">Weekdays</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={!title.trim()}
              className="w-full py-2 rounded-none bg-white hover:bg-peach-50 disabled:opacity-50 text-black text-xs font-black flex items-center justify-center gap-1.5 border-2 border-dark-brown transition-all shadow-xs"
            >
              <Plus className="w-4 h-4 text-peach-700" />
              <span>Add Habit</span>
            </button>
          </form>

          {/* Existing Habits List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-dark-brown mb-2">
              Active Habits ({habits.length})
            </h4>
            <div className="space-y-2">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between p-3 rounded-none bg-white border-2 border-dark-brown shadow-xs"
                >
                  <div>
                    <p className="text-xs font-bold text-black">
                      {habit.title}
                    </p>
                    <p className="text-[10px] text-slate-600 font-semibold">
                      {habit.frequency} • {habit.streak} day streak
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteHabit(habit.id)}
                    className="p-1.5 rounded-none border-2 border-transparent hover:border-red-400 text-slate-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t-2 border-dark-brown bg-peach-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-none border-2 border-dark-brown bg-white text-xs font-bold text-dark-brown hover:bg-peach-50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
