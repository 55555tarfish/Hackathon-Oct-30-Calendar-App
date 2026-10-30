import React, { useState } from 'react';
import {
  Check,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  ChevronDown,
  ChevronRight,
  ListTodo,
  CheckCircle2
} from 'lucide-react';
import { Task, Category, Priority } from '../../types';
import { PRIORITY_CONFIG } from '../../constants/categories';
import { formatTimeDisplay } from '../../utils/dateUtils';

interface DailyChecklistProps {
  tasks: Task[];
  categories: Category[];
  onToggleComplete: (taskId: string, e?: React.MouseEvent) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string, e: React.MouseEvent) => void;
  onQuickAddTask: (title: string, priority: Priority) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}

export const DailyChecklist: React.FC<DailyChecklistProps> = ({
  tasks,
  categories,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onQuickAddTask,
  onToggleSubtask,
}) => {
  const [quickTitle, setQuickTitle] = useState('');
  const [quickPriority, setQuickPriority] = useState<Priority>('medium');
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [tab, setTab] = useState<'all' | 'floating' | 'completed'>('all');

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    onQuickAddTask(quickTitle.trim(), quickPriority);
    setQuickTitle('');
  };

  const toggleExpand = (taskId: string) => {
    setExpandedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  // Filter tasks based on selected tab
  const filteredTasks = tasks.filter((task) => {
    if (tab === 'floating') return !task.startTime || task.isAllDay;
    if (tab === 'completed') return task.completed;
    return true; // 'all'
  });

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="bg-peach-200 rounded-none border-2 border-dark-brown shadow-sm flex flex-col h-[700px] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b-2 border-dark-brown bg-peach-300">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-peach-800" />
            <h4 className="text-sm font-bold text-dark-brown">
              Daily Action Checklist
            </h4>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-none bg-white text-emerald-800 border-2 border-dark-brown">
            {completedCount}/{tasks.length} Done
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1">
          {(['all', 'floating', 'completed'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-2.5 py-1 rounded-none border-2 text-xs capitalize transition-colors ${
                tab === t
                  ? 'bg-white text-black border-dark-brown font-black shadow-xs ring-2 ring-dark-brown'
                  : 'border-dark-brown text-dark-brown hover:bg-peach-200/80 bg-peach-100 font-bold'
              }`}
            >
              {t === 'floating' ? 'To-Do only' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Add Form */}
      <form onSubmit={handleSubmit} className="p-3 border-b-2 border-dark-brown bg-peach-200">
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-none border-2 border-dark-brown focus-within:border-dark-brown transition-all">
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Quick add task for today + press Enter..."
            className="flex-1 bg-transparent px-2 text-xs sm:text-sm text-black placeholder-peach-900/60 focus:outline-none font-semibold"
          />

          <select
            value={quickPriority}
            onChange={(e) => setQuickPriority(e.target.value as Priority)}
            className="text-xs bg-white text-black rounded-none px-2 py-1 border-2 border-dark-brown focus:outline-none font-bold cursor-pointer"
          >
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button
            type="submit"
            disabled={!quickTitle.trim()}
            className="p-1.5 rounded-none border-2 border-dark-brown bg-white text-dark-brown hover:bg-peach-50 disabled:opacity-40 transition-all shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </form>

      {/* Task List Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-peach-200">
        {filteredTasks.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center p-4">
            <CheckCircle2 className="w-10 h-10 text-dark-brown-muted mb-2" />
            <p className="text-sm font-semibold text-dark-brown">
              No tasks found in this view
            </p>
            <p className="text-xs text-dark-brown-muted mt-0.5 font-medium">
              Type above to add what needs to get done!
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const cat = categoryMap.get(task.category);
            const prio = PRIORITY_CONFIG[task.priority];
            const hasSubtasks = task.subtasks && task.subtasks.length > 0;
            const isExpanded = !!expandedTasks[task.id];

            return (
              <div
                key={task.id}
                className={`group rounded-none border-2 transition-all p-3 ${
                  task.completed
                    ? 'bg-peach-100/90 border-dark-brown opacity-75'
                    : 'bg-white border-dark-brown hover:border-dark-brown shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Completion Checkbox */}
                  <button
                    onClick={() => onToggleComplete(task.id)}
                    className={`w-5 h-5 rounded-none flex items-center justify-center shrink-0 mt-0.5 border-2 transition-all ${
                      task.completed
                        ? 'bg-emerald-600 border-emerald-700 text-white shadow-xs'
                        : 'border-dark-brown hover:border-emerald-500 bg-white'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  {/* Task details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        style={{ color: task.completed ? '#64748b' : '#000000' }}
                        className={`text-xs sm:text-sm font-bold truncate ${
                          task.completed ? 'line-through opacity-70' : ''
                        }`}
                      >
                        {task.title}
                      </span>

                      {/* Priority badge */}
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-none uppercase border-2 ${prio.bgColor} ${prio.color} ${prio.borderColor}`}
                      >
                        {prio.label}
                      </span>

                      {/* Category badge */}
                      {cat && (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-none border-2 ${cat.badge}`}>
                          {cat.name}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {task.description && (
                      <p
                        style={{ color: task.completed ? '#94a3b8' : '#000000' }}
                        className={`text-xs mt-1 line-clamp-2 ${
                          task.completed ? 'opacity-70' : 'font-normal'
                        }`}
                      >
                        {task.description}
                      </p>
                    )}

                    {/* Metadata tags */}
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-peach-900 font-semibold">
                      {task.startTime && task.endTime ? (
                        <span className="flex items-center gap-1 font-bold text-peach-800">
                          <Clock className="w-3 h-3" />
                          {formatTimeDisplay(task.startTime)} - {formatTimeDisplay(task.endTime)}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Anytime today
                        </span>
                      )}

                      {/* Subtasks toggle */}
                      {hasSubtasks && (
                        <button
                          onClick={() => toggleExpand(task.id)}
                          className="flex items-center gap-1 text-peach-900 hover:text-black font-bold"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                          <span>
                            {task.subtasks!.filter((s) => s.completed).length}/{task.subtasks!.length} subtasks
                          </span>
                        </button>
                      )}
                    </div>

                    {/* Expanded Subtasks List */}
                    {hasSubtasks && isExpanded && (
                      <div className="mt-2.5 pt-2 border-t-2 border-dark-brown space-y-1.5 pl-2">
                        {task.subtasks!.map((sub) => (
                          <div
                            key={sub.id}
                            onClick={() => onToggleSubtask(task.id, sub.id)}
                            className="flex items-center gap-2 cursor-pointer text-xs"
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded-none flex items-center justify-center border-2 transition-colors ${
                                sub.completed
                                  ? 'bg-emerald-600 border-emerald-700 text-white'
                                  : 'border-dark-brown bg-white'
                              }`}
                            >
                              {sub.completed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span
                              style={{ color: sub.completed ? '#94a3b8' : '#000000' }}
                              className={`text-xs ${
                                sub.completed ? 'line-through opacity-70' : 'font-medium'
                              }`}
                            >
                              {sub.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEditTask(task)}
                      title="Edit task"
                      className="p-1.5 rounded-none border-2 border-transparent hover:border-dark-brown text-slate-500 hover:text-black hover:bg-peach-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => onDeleteTask(task.id, e)}
                      title="Delete task"
                      className="p-1.5 rounded-none border-2 border-transparent hover:border-red-400 text-slate-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
