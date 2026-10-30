import React from 'react';
import { Check, Clock, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { Task, Category } from '../../types';
import { formatTimeDisplay, getTimeInMinutes, getDurationMinutes } from '../../utils/dateUtils';
import { PRIORITY_CONFIG } from '../../constants/categories';

interface TimeBlockCardProps {
  task: Task;
  category?: Category;
  startHour: number; // e.g. 6 (6 AM)
  hourHeight: number; // e.g. 64px
  onToggleComplete: (taskId: string, e: React.MouseEvent) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string, e: React.MouseEvent) => void;
}

export const TimeBlockCard: React.FC<TimeBlockCardProps> = ({
  task,
  category,
  startHour,
  hourHeight,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
}) => {
  if (!task.startTime || !task.endTime) return null;

  const startMinutes = getTimeInMinutes(task.startTime);
  const duration = getDurationMinutes(task.startTime, task.endTime);
  const timelineStartMinutes = startHour * 60;

  // Calculate top & height
  const top = ((startMinutes - timelineStartMinutes) / 60) * hourHeight;
  const height = Math.max(32, (duration / 60) * hourHeight);

  const priorityStyle = PRIORITY_CONFIG[task.priority];
  const catColor = category?.color || '#3b82f6';

  return (
    <div
      onClick={() => onEditTask(task)}
      style={{
        top: `${Math.max(0, top)}px`,
        height: `${height}px`,
        borderLeftColor: catColor,
      }}
      className={`group absolute left-14 sm:left-20 right-2 rounded-none p-2 sm:p-2.5 border-l-4 border-2 shadow-sm cursor-pointer transition-all hover:shadow-md hover:z-20 overflow-hidden flex flex-col justify-between ${
        task.completed
          ? 'bg-peach-100/90 border-dark-brown opacity-75'
          : 'bg-white border-dark-brown'
      }`}
    >
      <div className="flex items-start justify-between gap-1.5 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={(e) => onToggleComplete(task.id, e)}
            title={task.completed ? 'Mark incomplete' : 'Mark completed'}
            className={`w-4 h-4 sm:w-5 sm:h-5 rounded-none flex items-center justify-center shrink-0 border-2 transition-colors ${
              task.completed
                ? 'bg-emerald-600 border-emerald-700 text-white'
                : 'border-dark-brown hover:border-emerald-500 bg-white'
            }`}
          >
            {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
          </button>

          <div className="min-w-0">
            <h5
              style={{ color: task.completed ? '#64748b' : '#000000' }}
              className={`text-xs sm:text-sm font-extrabold truncate leading-tight ${
                task.completed ? 'line-through' : ''
              }`}
            >
              {task.title}
            </h5>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-700 mt-0.5 font-semibold">
              <span className="flex items-center gap-0.5">
                <Clock className="w-3 h-3 inline text-slate-500" />
                {formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)}
              </span>
              {task.category && category && (
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded-none font-bold text-[10px]" style={{ color: catColor }}>
                  • {category.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Hover quick action buttons */}
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditTask(task);
            }}
            title="Edit"
            className="p-1 rounded-none border-2 border-transparent hover:border-dark-brown text-slate-500 hover:text-black hover:bg-peach-100"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => onDeleteTask(task.id, e)}
            title="Delete"
            className="p-1 rounded-none border-2 border-transparent hover:border-red-400 text-slate-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Subtasks summary if available and space allows */}
      {height > 60 && task.subtasks && task.subtasks.length > 0 && (
        <div className="text-[10px] text-slate-700 font-bold truncate mt-1">
          {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length} subtasks done
        </div>
      )}
    </div>
  );
};
