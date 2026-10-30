import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Tag,
  Flag,
  RotateCw,
  ListPlus,
  Trash2,
  Check
} from 'lucide-react';
import { Task, Category, Priority, RecurrenceType, Subtask } from '../../types';
import { PRIORITY_CONFIG } from '../../constants/categories';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  editingTask: Task | null;
  defaultDateKey: string;
  defaultHour?: number;
  categories: Category[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  onDeleteTask,
  editingTask,
  defaultDateKey,
  defaultHour,
  categories,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(defaultDateKey);
  const [hasTime, setHasTime] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [category, setCategory] = useState(categories[0]?.id || 'work');
  const [priority, setPriority] = useState<Priority>('medium');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setDate(editingTask.date);
      if (editingTask.startTime && editingTask.endTime && !editingTask.isAllDay) {
        setHasTime(true);
        setStartTime(editingTask.startTime);
        setEndTime(editingTask.endTime);
      } else {
        setHasTime(false);
        setStartTime('09:00');
        setEndTime('10:00');
      }
      setCategory(editingTask.category);
      setPriority(editingTask.priority);
      setRecurrence(editingTask.recurrence || 'none');
      setSubtasks(editingTask.subtasks || []);
    } else {
      // New Task
      setTitle('');
      setDescription('');
      setDate(defaultDateKey);
      if (defaultHour !== undefined) {
        setHasTime(true);
        const startStr = `${defaultHour.toString().padStart(2, '0')}:00`;
        const endHour = defaultHour + 1;
        const endStr = `${endHour.toString().padStart(2, '0')}:00`;
        setStartTime(startStr);
        setEndTime(endStr);
      } else {
        setHasTime(false);
        setStartTime('09:00');
        setEndTime('10:00');
      }
      setCategory(categories[0]?.id || 'work');
      setPriority('medium');
      setRecurrence('none');
      setSubtasks([]);
    }
    setNewSubtaskTitle('');
  }, [editingTask, isOpen, defaultDateKey, defaultHour, categories]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSub: Subtask = {
      id: 'sub-' + Date.now(),
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    setSubtasks([...subtasks, newSub]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(
      subtasks.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleDeleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData: Task = {
      id: editingTask ? editingTask.id : 'task-' + Date.now(),
      title: title.trim(),
      description: description.trim() || undefined,
      date,
      startTime: hasTime ? startTime : undefined,
      endTime: hasTime ? endTime : undefined,
      isAllDay: !hasTime,
      category,
      priority,
      recurrence,
      subtasks,
      completed: editingTask ? editingTask.completed : false,
      completedAt: editingTask ? editingTask.completedAt : undefined,
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveTask(taskData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-peach-100 rounded-none max-w-lg w-full border-2 border-dark-brown shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-dark-brown bg-peach-200">
          <h3 className="text-base sm:text-lg font-bold text-dark-brown">
            {editingTask ? 'Edit Task Schedule' : 'Schedule New Task'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-none border-2 border-dark-brown text-dark-brown-muted hover:text-dark-brown hover:bg-peach-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 bg-peach-100">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sprint Review & Launch Day Planning"
              className="w-full px-3.5 py-2.5 rounded-none bg-white border-2 border-dark-brown text-sm font-semibold text-black focus:outline-none focus:border-dark-brown placeholder-dark-brown/40"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dark-brown mb-1.5">
              Notes & Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key deliverables, meeting links, or context..."
              className="w-full px-3.5 py-2 rounded-none bg-white border-2 border-dark-brown text-xs sm:text-sm text-black focus:outline-none focus:border-dark-brown placeholder-dark-brown/40"
            />
          </div>

          {/* Date & Time slot toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dark-brown mb-1.5">
                <Calendar className="w-3.5 h-3.5 text-peach-700" />
                <span>Date</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-none bg-white border-2 border-dark-brown text-xs sm:text-sm text-black font-semibold focus:outline-none focus:border-dark-brown"
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-dark-brown mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-peach-700" />
                  <span>Time-blocking</span>
                </span>
                <input
                  type="checkbox"
                  checked={hasTime}
                  onChange={(e) => setHasTime(e.target.checked)}
                  className="rounded-none border-2 border-dark-brown text-dark-brown focus:ring-dark-brown cursor-pointer"
                />
              </label>

              {hasTime ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-1/2 px-2 py-2 rounded-none bg-white border-2 border-dark-brown text-xs text-black font-semibold focus:outline-none focus:border-dark-brown"
                  />
                  <span className="text-xs text-dark-brown-muted font-bold">to</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-1/2 px-2 py-2 rounded-none bg-white border-2 border-dark-brown text-xs text-black font-semibold focus:outline-none focus:border-dark-brown"
                  />
                </div>
              ) : (
                <div className="py-2 px-3 rounded-none bg-white text-xs font-bold text-dark-brown text-center border-2 border-dashed border-dark-brown">
                  Anytime / Floating task
                </div>
              )}
            </div>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dark-brown mb-1.5">
                <Tag className="w-3.5 h-3.5 text-peach-700" />
                <span>Category</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-none bg-white border-2 border-dark-brown text-xs sm:text-sm text-black focus:outline-none focus:border-dark-brown font-bold"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dark-brown mb-1.5">
                <Flag className="w-3.5 h-3.5 text-peach-700" />
                <span>Priority</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 rounded-none bg-white border-2 border-dark-brown text-xs sm:text-sm text-black focus:outline-none focus:border-dark-brown font-bold"
              >
                {Object.entries(PRIORITY_CONFIG).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Recurrence Rule */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dark-brown mb-1.5">
              <RotateCw className="w-3.5 h-3.5 text-peach-700" />
              <span>Repeat / Recurring</span>
            </label>
            <select
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
              className="w-full px-3 py-2 rounded-none bg-white border-2 border-dark-brown text-xs sm:text-sm text-black focus:outline-none focus:border-dark-brown font-bold"
            >
              <option value="none">Does not repeat</option>
              <option value="daily">Every day</option>
              <option value="weekdays">Every weekday (Mon - Fri)</option>
              <option value="weekly">Every week on this day</option>
            </select>
          </div>

          {/* Subtasks Section */}
          <div className="pt-2 border-t-2 border-dark-brown">
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dark-brown mb-2">
              <ListPlus className="w-3.5 h-3.5 text-peach-700" />
              <span>Subtasks / Steps ({subtasks.length})</span>
            </label>

            {/* Subtasks items */}
            <div className="space-y-1.5 mb-2 max-h-36 overflow-y-auto">
              {subtasks.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-2 rounded-none bg-white border-2 border-dark-brown text-xs shadow-xs"
                >
                  <div
                    onClick={() => handleToggleSubtask(sub.id)}
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    <div
                      className={`w-4 h-4 rounded-none flex items-center justify-center border-2 ${
                        sub.completed
                          ? 'bg-emerald-600 border-emerald-700 text-white'
                          : 'border-dark-brown bg-white'
                      }`}
                    >
                      {sub.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span
                      className={
                        sub.completed
                          ? 'line-through text-slate-500'
                          : 'text-black font-semibold'
                      }
                    >
                      {sub.title}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteSubtask(sub.id)}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add subtask input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Add subtask step..."
                className="flex-1 px-3 py-1.5 rounded-none bg-white border-2 border-dark-brown text-xs text-black font-semibold focus:outline-none focus:border-dark-brown placeholder-dark-brown/40"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 rounded-none bg-peach-200 hover:bg-peach-300 border-2 border-dark-brown text-xs font-bold text-dark-brown"
              >
                Add
              </button>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-dark-brown">
            {editingTask && onDeleteTask ? (
              <button
                type="button"
                onClick={() => {
                  onDeleteTask(editingTask.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-none border-2 border-red-300 hover:border-red-500 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-none border-2 border-dark-brown bg-white text-xs font-bold text-dark-brown hover:bg-peach-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-none border-2 border-dark-brown bg-white hover:bg-peach-50 text-black text-xs font-black shadow-xs active:scale-95 transition-all"
              >
                {editingTask ? 'Save Changes' : 'Schedule Task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
