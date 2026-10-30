import React from 'react';
import { Plus, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { Task, Category } from '../../types';
import { getWeekDays, formatDateKey, format, isToday, formatTimeDisplay } from '../../utils/dateUtils';

interface WeekViewProps {
  currentDate: Date;
  tasks: Task[];
  categories: Category[];
  onSelectDate: (date: Date) => void;
  onEditTask: (task: Task) => void;
  onToggleComplete: (taskId: string, e: React.MouseEvent) => void;
  onAddTaskForDate: (dateKey: string) => void;
  onOpenAIBriefing?: () => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  tasks,
  categories,
  onSelectDate,
  onEditTask,
  onToggleComplete,
  onAddTaskForDate,
  onOpenAIBriefing,
}) => {
  const weekDays = getWeekDays(currentDate);
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  return (
    <div className="space-y-4">
      {/* Top Banner for Week View with AI Strategy button */}
      {onOpenAIBriefing && (
        <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-none bg-peach-200 border-2 border-dark-brown shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-none bg-white text-peach-700 flex items-center justify-center border-2 border-dark-brown shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-dark-brown">
                Weekly Strategic Overview
              </h4>
              <p className="text-[11px] text-dark-brown-muted font-medium">
                Let Google Gemini review your 7-day workload distribution & identify focus areas
              </p>
            </div>
          </div>
          <button
            onClick={onOpenAIBriefing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-white hover:bg-peach-50 text-black text-xs font-black transition-all border-2 border-dark-brown shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-peach-700" />
            <span>AI Weekly Strategy</span>
          </button>
        </div>
      )}

      <div className="bg-peach-200 rounded-none border-2 border-dark-brown shadow-sm overflow-hidden">
      {/* 7-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 divide-y-2 md:divide-y-0 md:divide-x-2 divide-dark-brown bg-peach-100">
        {weekDays.map((day) => {
          const dateKey = formatDateKey(day);
          const dayTasks = tasks.filter((t) => t.date === dateKey);
          const isCurrentDay = isToday(day);
          const completedCount = dayTasks.filter((t) => t.completed).length;

          return (
            <div
              key={dateKey}
              className={`flex flex-col min-h-[550px] transition-colors ${
                isCurrentDay ? 'bg-peach-200/80' : 'bg-peach-100'
              }`}
            >
              {/* Day Header */}
              <div
                onClick={() => onSelectDate(day)}
                className="p-3 border-b-2 border-dark-brown cursor-pointer hover:bg-peach-200/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-dark-brown">
                    {format(day, 'EEE')}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddTaskForDate(dateKey);
                    }}
                    title="Add task for this day"
                    className="p-1 rounded-none border-2 border-transparent hover:border-dark-brown text-dark-brown-muted hover:text-dark-brown hover:bg-peach-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-baseline justify-between mt-1">
                  <div
                    className={`text-lg font-extrabold w-8 h-8 rounded-none border-2 flex items-center justify-center ${
                      isCurrentDay
                        ? 'bg-white text-black border-dark-brown font-black shadow-xs ring-2 ring-dark-brown'
                        : 'bg-white text-black border-dark-brown'
                    }`}
                  >
                    {format(day, 'd')}
                  </div>

                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold text-dark-brown-muted">
                      {completedCount}/{dayTasks.length} done
                    </span>
                  )}
                </div>
              </div>

              {/* Tasks for the day */}
              <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[600px]">
                {dayTasks.length === 0 ? (
                  <div className="h-28 flex items-center justify-center">
                    <button
                      onClick={() => onAddTaskForDate(dateKey)}
                      className="text-[11px] font-bold text-dark-brown hover:text-black flex items-center gap-1 p-2 rounded-none border-2 border-dashed border-dark-brown bg-white hover:bg-peach-50 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Plan task</span>
                    </button>
                  </div>
                ) : (
                  dayTasks.map((task) => {
                    const cat = categoryMap.get(task.category);
                    return (
                      <div
                        key={task.id}
                        onClick={() => onEditTask(task)}
                        className={`p-2 rounded-none border-2 text-left cursor-pointer transition-all hover:shadow-xs ${
                          task.completed
                            ? 'bg-peach-50 border-dark-brown opacity-70'
                            : 'bg-white border-dark-brown hover:border-dark-brown shadow-xs'
                        }`}
                      >
                        <div className="flex items-start gap-1.5">
                          <button
                            onClick={(e) => onToggleComplete(task.id, e)}
                            className={`w-3.5 h-3.5 rounded-none border-2 mt-0.5 shrink-0 flex items-center justify-center transition-colors ${
                              task.completed
                                ? 'bg-emerald-600 border-emerald-700 text-white'
                                : 'border-dark-brown bg-white'
                            }`}
                          >
                            {task.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </button>

                          <div className="min-w-0 flex-1">
                            <p
                              style={{ color: task.completed ? '#64748b' : '#000000' }}
                              className={`text-xs font-bold truncate leading-tight ${
                                task.completed
                                  ? 'line-through'
                                  : ''
                              }`}
                            >
                              {task.title}
                            </p>

                            {task.startTime && (
                              <div className="flex items-center gap-1 text-[10px] text-peach-800 font-bold mt-1">
                                <Clock className="w-2.5 h-2.5" />
                                <span>{formatTimeDisplay(task.startTime)}</span>
                              </div>
                            )}

                            {cat && (
                              <span
                                className="inline-block w-2 h-2 rounded-none mt-1.5"
                                style={{ backgroundColor: cat.color }}
                                title={cat.name}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);
};
