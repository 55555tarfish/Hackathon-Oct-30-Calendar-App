import React from 'react';
import { Plus, Check } from 'lucide-react';
import { Task, Category } from '../../types';
import {
  getMonthGridDays,
  formatDateKey,
  format,
  isToday,
  isSameDay,
  formatTimeDisplay
} from '../../utils/dateUtils';

interface MonthViewProps {
  currentDate: Date;
  tasks: Task[];
  categories: Category[];
  onSelectDate: (date: Date) => void;
  onEditTask: (task: Task) => void;
  onAddTaskForDate: (dateKey: string) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  tasks,
  categories,
  onSelectDate,
  onEditTask,
  onAddTaskForDate,
}) => {
  const days = getMonthGridDays(currentDate);
  const currentMonth = currentDate.getMonth();
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="bg-peach-200 rounded-none border-2 border-dark-brown shadow-sm overflow-hidden">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b-2 border-dark-brown bg-peach-300 text-center py-2.5">
        {weekdays.map((w) => (
          <div key={w} className="text-xs font-bold uppercase tracking-wider text-dark-brown">
            {w}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 auto-rows-fr divide-x-2 divide-y-2 divide-dark-brown bg-peach-100">
        {days.map((day) => {
          const dateKey = formatDateKey(day);
          const isCurrentMonth = day.getMonth() === currentMonth;
          const isCurrentDay = isToday(day);
          const isSelected = isSameDay(day, currentDate);
          const dayTasks = tasks.filter((t) => t.date === dateKey);

          return (
            <div
              key={dateKey}
              onClick={() => onSelectDate(day)}
              className={`group min-h-[110px] sm:min-h-[130px] p-2 flex flex-col justify-between cursor-pointer transition-colors relative ${
                !isCurrentMonth
                  ? 'bg-peach-100/40 opacity-40'
                  : isSelected
                  ? 'bg-peach-200/90'
                  : 'hover:bg-peach-200/60'
              }`}
            >
              {/* Day Cell Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold w-6 h-6 rounded-none border-2 flex items-center justify-center ${
                    isCurrentDay
                      ? 'bg-white text-black border-dark-brown font-black shadow-xs ring-2 ring-dark-brown'
                      : 'bg-white text-black border-dark-brown'
                  }`}
                >
                  {format(day, 'd')}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddTaskForDate(dateKey);
                  }}
                  title="Add task"
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-none border-2 border-transparent hover:border-dark-brown text-dark-brown-muted hover:text-dark-brown hover:bg-peach-200 transition-opacity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Day Task Pills */}
              <div className="flex-1 my-1 space-y-1 overflow-hidden">
                {dayTasks.slice(0, 3).map((task) => {
                  const cat = categoryMap.get(task.category);
                  const catColor = cat?.color || '#3b82f6';

                  return (
                    <div
                      key={task.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditTask(task);
                      }}
                      style={{ borderLeftColor: catColor }}
                      className={`px-1.5 py-0.5 rounded-none text-[11px] font-extrabold border-2 border-l-4 truncate flex items-center gap-1 transition-all ${
                        task.completed
                          ? 'bg-peach-50 border-dark-brown text-slate-500 line-through'
                          : 'bg-white border-dark-brown text-black hover:bg-peach-50 shadow-xs'
                      }`}
                    >
                      {task.completed && <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0 stroke-[3]" />}
                      <span className="truncate">{task.title}</span>
                    </div>
                  );
                })}

                {dayTasks.length > 3 && (
                  <div className="text-[10px] font-bold text-dark-brown px-1">
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>

              {/* Bottom day task count dot if applicable */}
              {dayTasks.length > 0 && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-dark-brown-muted">
                  <span className="w-2 h-2 rounded-none bg-emerald-500" />
                  <span>
                    {dayTasks.filter((t) => t.completed).length}/{dayTasks.length} done
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
