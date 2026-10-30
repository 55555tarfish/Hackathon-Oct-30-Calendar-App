import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Sun,
  Moon,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  Sparkles,
  Hammer
} from 'lucide-react';
import { ViewMode, Category } from '../types';
import { formatDisplayDate } from '../utils/dateUtils';

interface NavbarProps {
  currentDate: Date;
  onPrevDate: () => void;
  onNextDate: () => void;
  onToday: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  categories: Category[];
  onOpenNewTaskModal: () => void;
  onOpenExportModal: () => void;
  onOpenAIBriefing: () => void;
  completionRate: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentDate,
  onPrevDate,
  onNextDate,
  onToday,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories,
  onOpenNewTaskModal,
  onOpenExportModal,
  onOpenAIBriefing,
  completionRate,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-peach-200/95 backdrop-blur-md border-b-2 border-dark-brown shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & App Name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-none border-2 border-dark-brown bg-white flex items-center justify-center text-peach-700 shadow-sm shrink-0">
              <Hammer className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-roboto font-black text-base sm:text-lg tracking-normal text-dark-brown">
                  Create Your <span className="text-peach-700">Day</span>
                </span>
              </div>
              <p className="hidden sm:block text-xs font-roboto font-bold italic text-dark-brown-muted">
                Seize the Day
              </p>
            </div>
          </div>

          {/* Date Navigator */}
          <div className="flex items-center gap-1 sm:gap-2 bg-peach-100 p-1 rounded-none border-2 border-dark-brown">
            <button
              onClick={onPrevDate}
              title="Previous"
              className="p-1.5 rounded-none border-2 border-transparent hover:border-dark-brown hover:bg-white text-dark-brown hover:text-black transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onToday}
              className="px-2.5 py-1 text-xs font-bold rounded-none border-2 border-dark-brown bg-white hover:bg-peach-50 text-black transition-colors"
            >
              Today
            </button>
            <button
              onClick={onNextDate}
              title="Next"
              className="p-1.5 rounded-none border-2 border-transparent hover:border-dark-brown hover:bg-white text-dark-brown hover:text-black transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="h-4 w-[2px] bg-dark-brown-border mx-1 hidden sm:block" />
            <span className="text-xs sm:text-sm font-bold text-dark-brown px-2 select-none whitespace-nowrap">
              {formatDisplayDate(
                currentDate,
                viewMode === 'month' ? 'MMMM yyyy' : 'EEE, MMM d, yyyy'
              )}
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Mode Toggle */}
            <div className="hidden lg:flex items-center bg-peach-100 p-1 rounded-none border-2 border-dark-brown">
              {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onViewModeChange(mode)}
                  className={`px-3 py-1 rounded-none border-2 text-xs font-bold capitalize transition-all ${
                    viewMode === mode
                      ? 'bg-white text-black border-dark-brown shadow-sm font-black ring-1 ring-dark-brown'
                      : 'border-transparent text-dark-brown-muted hover:text-dark-brown'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Quick Completion Pill */}
            <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-white border-2 border-dark-brown text-xs font-extrabold text-black">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
              <span>{Math.round(completionRate)}% Done</span>
            </div>

            {/* Backup / Export */}
            <button
              onClick={onOpenExportModal}
              title="Backup & Restore Data"
              className="p-2 rounded-none bg-white text-black hover:bg-peach-50 transition-colors border-2 border-dark-brown"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* AI Briefing Button */}
            <button
              onClick={onOpenAIBriefing}
              title="Google Gemini AI Daily/Weekly Briefing"
              className="flex items-center gap-1.5 px-3 py-2 rounded-none border-2 border-dark-brown bg-white hover:bg-peach-50 active:scale-95 text-black font-bold text-xs sm:text-sm shadow-xs transition-all group"
            >
              <Sparkles className="w-4 h-4 text-peach-700 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">AI Briefing</span>
            </button>

            {/* New Task Button */}
            <button
              onClick={onOpenNewTaskModal}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-none border-2 border-dark-brown bg-white hover:bg-peach-50 active:scale-95 text-black font-black text-xs sm:text-sm shadow-xs transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5] text-peach-700" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Sub-bar: Search, Category Filters & View mode mobile */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-2.5 border-t-2 border-dark-brown">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-peach-700" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks, meetings, notes..."
              className="w-full pl-9 pr-4 py-1.5 rounded-none bg-white border-2 border-dark-brown text-xs sm:text-sm text-black placeholder-dark-brown/60 focus:outline-none focus:border-dark-brown transition-all font-semibold"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-black"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <button
              onClick={() => onSelectCategory(null)}
              className={`px-2.5 py-1 rounded-none border-2 font-bold whitespace-nowrap transition-colors ${
                selectedCategory === null
                  ? 'bg-white text-black border-dark-brown font-black shadow-xs ring-2 ring-dark-brown'
                  : 'bg-white text-black border-dark-brown hover:bg-peach-50'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(isSelected ? null : cat.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-none border-2 font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'border-dark-brown bg-white text-black shadow-xs ring-2 ring-dark-brown'
                      : 'bg-white border-dark-brown text-black hover:bg-peach-50'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-none"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile View Mode Switcher */}
          <div className="flex lg:hidden items-center bg-peach-100 p-0.5 rounded-none border-2 border-dark-brown">
            {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => onViewModeChange(mode)}
                className={`px-2.5 py-0.5 rounded-none border-2 text-xs font-bold capitalize transition-all ${
                  viewMode === mode
                    ? 'bg-white text-black border-dark-brown shadow-xs font-black'
                    : 'border-transparent text-dark-brown-muted hover:text-dark-brown'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
