import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Task, Habit, Category, ViewMode, DayStats, Priority } from './types';
import {
  loadTasks,
  saveTasks,
  loadHabits,
  saveHabits,
  loadCategories,
} from './utils/storage';
import {
  formatDateKey,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  getTimeInMinutes,
  getDurationMinutes
} from './utils/dateUtils';
import { Navbar } from './components/Navbar';
import { DayView } from './components/DayView/DayView';
import { WeekView } from './components/WeekView/WeekView';
import { MonthView } from './components/MonthView/MonthView';
import { TaskModal } from './components/Modals/TaskModal';
import { HabitModal } from './components/Modals/HabitModal';
import { ImportExportModal } from './components/Modals/ImportExportModal';
import { AIBriefingModal } from './components/AI/AIBriefingModal';

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [habits, setHabits] = useState<Habit[]>(loadHabits);
  const [categories, setCategories] = useState<Category[]>(loadCategories);

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Ensure clean light peach theme (prevent any stale dark-mode class from causing white text)
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('dayplan_theme');
  }, []);

  // Modals state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskModalHour, setTaskModalHour] = useState<number | undefined>(undefined);
  const [taskModalDateKey, setTaskModalDateKey] = useState<string>(formatDateKey(new Date()));

  const [habitModalOpen, setHabitModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [aiBriefingOpen, setAiBriefingOpen] = useState(false);
  const [aiBriefingMode, setAiBriefingMode] = useState<'day' | 'week'>('day');

  // Sync state to storage
  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const updateHabits = (newHabits: Habit[]) => {
    setHabits(newHabits);
    saveHabits(newHabits);
  };

  // Filter tasks by search query & category
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query) || false;
        if (!matchesTitle && !matchesDesc) return false;
      }
      if (selectedCategory && task.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [tasks, searchQuery, selectedCategory]);

  const currentDateKey = formatDateKey(currentDate);

  // Day specific tasks
  const dayTasks = useMemo(() => {
    return filteredTasks.filter((t) => t.date === currentDateKey);
  }, [filteredTasks, currentDateKey]);

  // Day Stats & Streak
  const dayStats: DayStats = useMemo(() => {
    const totalTasks = dayTasks.length;
    const completedTasks = dayTasks.filter((t) => t.completed).length;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const totalHabits = habits.length;
    const completedHabits = habits.filter((h) => h.completedDates.includes(currentDateKey)).length;

    let totalMinutesScheduled = 0;
    dayTasks.forEach((t) => {
      if (t.startTime && t.endTime && !t.isAllDay) {
        totalMinutesScheduled += getDurationMinutes(t.startTime, t.endTime);
      }
    });

    return {
      totalTasks,
      completedTasks,
      completionPercentage,
      totalHabits,
      completedHabits,
      totalMinutesScheduled,
    };
  }, [dayTasks, habits, currentDateKey]);

  const currentStreak = useMemo(() => {
    if (habits.length === 0) return 0;
    return Math.max(...habits.map((h) => h.streak), 0);
  }, [habits]);

  // Confetti effect when day tasks are completed
  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#466bfb', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
    });
  };

  // Task actions
  const handleToggleTaskComplete = (taskId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let justCompletedAll = false;

    const newTasks = tasks.map((t) => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        return {
          ...t,
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });

    updateTasks(newTasks);

    // Check if day was completed
    const currentDayTasks = newTasks.filter((t) => t.date === currentDateKey);
    if (currentDayTasks.length > 0 && currentDayTasks.every((t) => t.completed)) {
      triggerCelebration();
    }
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const newTasks = tasks.map((t) => {
      if (t.id === taskId && t.subtasks) {
        return {
          ...t,
          subtasks: t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          ),
        };
      }
      return t;
    });
    updateTasks(newTasks);
  };

  const handleSaveTask = (task: Task) => {
    const exists = tasks.some((t) => t.id === task.id);
    if (exists) {
      updateTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    } else {
      updateTasks([task, ...tasks]);
    }
  };

  const handleDeleteTask = (taskId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    updateTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleQuickAddTask = (title: string, priority: Priority) => {
    const newTask: Task = {
      id: 'task-' + Date.now(),
      title,
      date: currentDateKey,
      category: categories[0]?.id || 'work',
      priority,
      completed: false,
      isAllDay: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    updateTasks([newTask, ...tasks]);
  };

  const handleQuickAddAtHour = (hour: number) => {
    setEditingTask(null);
    setTaskModalHour(hour);
    setTaskModalDateKey(currentDateKey);
    setTaskModalOpen(true);
  };

  const handleOpenNewTask = (dateKey?: string) => {
    setEditingTask(null);
    setTaskModalHour(undefined);
    setTaskModalDateKey(dateKey || currentDateKey);
    setTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskModalHour(undefined);
    setTaskModalDateKey(task.date);
    setTaskModalOpen(true);
  };

  // Habit actions
  const handleToggleHabit = (habitId: string) => {
    const newHabits = habits.map((h) => {
      if (h.id === habitId) {
        const isCompletedToday = h.completedDates.includes(currentDateKey);
        let newDates = [...h.completedDates];
        let newStreak = h.streak;

        if (isCompletedToday) {
          newDates = newDates.filter((d) => d !== currentDateKey);
          newStreak = Math.max(0, newStreak - 1);
        } else {
          newDates.push(currentDateKey);
          newStreak += 1;
        }

        return {
          ...h,
          completedDates: newDates,
          streak: newStreak,
        };
      }
      return h;
    });

    updateHabits(newHabits);
  };

  const handleAddHabit = (habit: Habit) => {
    updateHabits([...habits, habit]);
  };

  const handleDeleteHabit = (habitId: string) => {
    updateHabits(habits.filter((h) => h.id !== habitId));
  };

  // Date Navigation
  const handlePrevDate = () => {
    if (viewMode === 'day') setCurrentDate((d) => subDays(d, 1));
    else if (viewMode === 'week') setCurrentDate((d) => subWeeks(d, 1));
    else if (viewMode === 'month') setCurrentDate((d) => subMonths(d, 1));
  };

  const handleNextDate = () => {
    if (viewMode === 'day') setCurrentDate((d) => addDays(d, 1));
    else if (viewMode === 'week') setCurrentDate((d) => addWeeks(d, 1));
    else if (viewMode === 'month') setCurrentDate((d) => addMonths(d, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleSelectDate = (date: Date) => {
    setCurrentDate(date);
    setViewMode('day');
  };

  const handleDataReset = (newTasks: Task[], newHabits: Habit[]) => {
    setTasks(newTasks);
    setHabits(newHabits);
  };

  const handleOpenAIBriefing = (mode?: 'day' | 'week') => {
    if (mode) {
      setAiBriefingMode(mode);
    } else {
      setAiBriefingMode(viewMode === 'week' ? 'week' : 'day');
    }
    setAiBriefingOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-warm-gradient text-dark-brown transition-colors">
      {/* Top Navigation */}
      <Navbar
        currentDate={currentDate}
        onPrevDate={handlePrevDate}
        onNextDate={handleNextDate}
        onToday={handleToday}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categories}
        onOpenNewTaskModal={() => handleOpenNewTask()}
        onOpenExportModal={() => setExportModalOpen(true)}
        onOpenAIBriefing={() => handleOpenAIBriefing()}
        completionRate={dayStats.completionPercentage}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {viewMode === 'day' && (
          <DayView
            currentDate={currentDate}
            tasks={dayTasks}
            habits={habits}
            categories={categories}
            stats={dayStats}
            streak={currentStreak}
            onToggleComplete={handleToggleTaskComplete}
            onToggleHabit={handleToggleHabit}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onQuickAddAtHour={handleQuickAddAtHour}
            onQuickAddTask={handleQuickAddTask}
            onToggleSubtask={handleToggleSubtask}
            onOpenHabitModal={() => setHabitModalOpen(true)}
            onOpenAIBriefing={() => handleOpenAIBriefing('day')}
          />
        )}

        {viewMode === 'week' && (
          <WeekView
            currentDate={currentDate}
            tasks={filteredTasks}
            categories={categories}
            onSelectDate={handleSelectDate}
            onEditTask={handleEditTask}
            onToggleComplete={handleToggleTaskComplete}
            onAddTaskForDate={(dateKey) => handleOpenNewTask(dateKey)}
            onOpenAIBriefing={() => handleOpenAIBriefing('week')}
          />
        )}

        {viewMode === 'month' && (
          <MonthView
            currentDate={currentDate}
            tasks={filteredTasks}
            categories={categories}
            onSelectDate={handleSelectDate}
            onEditTask={handleEditTask}
            onAddTaskForDate={(dateKey) => handleOpenNewTask(dateKey)}
          />
        )}
      </main>

      {/* Modals */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSaveTask={handleSaveTask}
        onDeleteTask={handleDeleteTask}
        editingTask={editingTask}
        defaultDateKey={taskModalDateKey}
        defaultHour={taskModalHour}
        categories={categories}
      />

      <HabitModal
        isOpen={habitModalOpen}
        onClose={() => setHabitModalOpen(false)}
        habits={habits}
        onAddHabit={handleAddHabit}
        onDeleteHabit={handleDeleteHabit}
        categories={categories}
      />

      <ImportExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onDataReset={handleDataReset}
      />

      <AIBriefingModal
        isOpen={aiBriefingOpen}
        onClose={() => setAiBriefingOpen(false)}
        currentDate={currentDate}
        tasks={tasks}
        habits={habits}
        categories={categories}
        initialMode={aiBriefingMode}
      />
    </div>
  );
};
export default App;
