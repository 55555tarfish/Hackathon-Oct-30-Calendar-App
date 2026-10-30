import { Task, Habit, Category } from '../types';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import { formatDateKey, addDays } from './dateUtils';

const TASKS_STORAGE_KEY = 'dayplan_tasks_v1';
const HABITS_STORAGE_KEY = 'dayplan_habits_v1';
const CATEGORIES_STORAGE_KEY = 'dayplan_categories_v1';

export const generateStarterData = (): { tasks: Task[]; habits: Habit[] } => {
  const today = new Date();
  const todayKey = formatDateKey(today);
  const tomorrowKey = formatDateKey(addDays(today, 1));
  const yesterdayKey = formatDateKey(addDays(today, -1));

  const tasks: Task[] = [
    {
      id: 'demo-task-1',
      title: 'Morning Team Standup & Priorities',
      description: 'Review project milestones, daily blockers, and set sprint goals.',
      date: todayKey,
      startTime: '09:00',
      endTime: '09:45',
      category: 'meeting',
      priority: 'high',
      completed: true,
      completedAt: new Date().toISOString(),
      recurrence: 'weekdays',
      subtasks: [
        { id: 'st-1', title: 'Share sprint progress', completed: true },
        { id: 'st-2', title: 'Highlight calendar app launch', completed: true },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-task-2',
      title: 'Focus Block: Core Feature Development',
      description: 'Build schedule calendar timeline, drag & drop slotting, and task views.',
      date: todayKey,
      startTime: '10:30',
      endTime: '12:30',
      category: 'work',
      priority: 'urgent',
      completed: true,
      completedAt: new Date().toISOString(),
      subtasks: [
        { id: 'st-3', title: 'Setup interactive time grid', completed: true },
        { id: 'st-4', title: 'Implement daily to-do checklist', completed: true },
        { id: 'st-5', title: 'Add local persistence and export', completed: true },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-task-3',
      title: 'Healthy Lunch & 20-min Walk',
      description: 'Step away from screens, eat a balanced meal, stretch outside.',
      date: todayKey,
      startTime: '13:00',
      endTime: '14:00',
      category: 'health',
      priority: 'medium',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-task-4',
      title: 'UI Design Review & Polish',
      description: 'Inspect typography, contrast, dark mode colors, and mobile responsiveness.',
      date: todayKey,
      startTime: '14:30',
      endTime: '16:00',
      category: 'work',
      priority: 'high',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-task-5',
      title: 'Review weekly budget and expenses',
      description: 'Check subscription invoices and monthly savings target.',
      date: todayKey,
      category: 'personal',
      priority: 'medium',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-task-6',
      title: 'Read 2 chapters of System Architecture book',
      description: 'Take notes on distributed event scheduling and caching.',
      date: todayKey,
      category: 'study',
      priority: 'low',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-task-7',
      title: 'Gym Workout - Upper Body & Cardio',
      description: 'Bench press, pull-ups, dumbbell rows, 15m treadmill interval.',
      date: tomorrowKey,
      startTime: '08:00',
      endTime: '09:15',
      category: 'health',
      priority: 'high',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-task-8',
      title: 'Quarterly Planning Workshop',
      description: 'Cross-functional alignment with engineering & design leads.',
      date: tomorrowKey,
      startTime: '11:00',
      endTime: '12:30',
      category: 'meeting',
      priority: 'urgent',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const habits: Habit[] = [
    {
      id: 'habit-1',
      title: 'Morning Hydration (500ml water)',
      category: 'health',
      frequency: 'daily',
      completedDates: [yesterdayKey, todayKey],
      streak: 5,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'habit-2',
      title: '30-minute Exercise / Movement',
      category: 'health',
      frequency: 'daily',
      completedDates: [yesterdayKey],
      streak: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'habit-3',
      title: 'Plan & Review Daily Schedule',
      category: 'work',
      frequency: 'daily',
      completedDates: [yesterdayKey, todayKey],
      streak: 7,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'habit-4',
      title: 'Read 20 pages',
      category: 'study',
      frequency: 'daily',
      completedDates: [yesterdayKey],
      streak: 2,
      createdAt: new Date().toISOString(),
    },
  ];

  return { tasks, habits };
};

export const loadTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) {
      const { tasks } = generateStarterData();
      saveTasks(tasks);
      return tasks;
    }
    const tasks: Task[] = JSON.parse(raw);
    let changed = false;
    const migrated = tasks.map((t) => {
      if (t.category === 'urgent') {
        changed = true;
        return { ...t, category: 'miscellaneous' };
      }
      return t;
    });
    if (changed) {
      saveTasks(migrated);
    }
    return migrated;
  } catch (e) {
    console.error('Failed to load tasks from localStorage', e);
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks to localStorage', e);
  }
};

export const loadHabits = (): Habit[] => {
  try {
    const raw = localStorage.getItem(HABITS_STORAGE_KEY);
    if (!raw) {
      const { habits } = generateStarterData();
      saveHabits(habits);
      return habits;
    }
    const habits: Habit[] = JSON.parse(raw);
    let changed = false;
    const migrated = habits.map((h) => {
      if (h.category === 'urgent') {
        changed = true;
        return { ...h, category: 'miscellaneous' };
      }
      return h;
    });
    if (changed) {
      saveHabits(migrated);
    }
    return migrated;
  } catch (e) {
    console.error('Failed to load habits from localStorage', e);
    return [];
  }
};

export const saveHabits = (habits: Habit[]): void => {
  try {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
  } catch (e) {
    console.error('Failed to save habits to localStorage', e);
  }
};

export const loadCategories = (): Category[] => {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!raw) {
      saveCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    const categories: Category[] = JSON.parse(raw);
    let changed = false;
    const migrated = categories.map((cat) => {
      if (cat.id === 'urgent' || cat.name.toLowerCase() === 'urgent') {
        changed = true;
        return {
          ...cat,
          id: 'miscellaneous',
          name: 'Miscellaneous',
          color: cat.color === '#ef4444' ? '#64748b' : cat.color,
          bgLight: 'bg-slate-50 dark:bg-slate-950/40',
          borderLight: 'border-slate-200 dark:border-slate-800',
          textLight: 'text-slate-700 dark:text-slate-300',
          badge: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20',
        };
      }
      return cat;
    });
    if (changed) {
      saveCategories(migrated);
    }
    return migrated;
  } catch (e) {
    console.error('Failed to load categories', e);
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategories = (categories: Category[]): void => {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories', e);
  }
};

export const exportAllData = (): string => {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    tasks: loadTasks(),
    habits: loadHabits(),
    categories: loadCategories(),
  };
  return JSON.stringify(data, null, 2);
};

export const importAllData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString);
    if (data.tasks && Array.isArray(data.tasks)) {
      saveTasks(data.tasks);
    }
    if (data.habits && Array.isArray(data.habits)) {
      saveHabits(data.habits);
    }
    if (data.categories && Array.isArray(data.categories)) {
      saveCategories(data.categories);
    }
    return true;
  } catch (e) {
    console.error('Failed to import data', e);
    return false;
  }
};
