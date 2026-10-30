export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type RecurrenceType = 'none' | 'daily' | 'weekdays' | 'weekly';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime?: string; // HH:mm (24-hour, e.g., '09:30')
  endTime?: string; // HH:mm (24-hour, e.g., '10:30')
  isAllDay?: boolean;
  category: string; // Category id or name
  priority: Priority;
  completed: boolean;
  completedAt?: string; // ISO string
  recurrence?: RecurrenceType;
  subtasks?: Subtask[];
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  title: string;
  icon?: string;
  category: string;
  frequency: 'daily' | 'weekdays' | 'weekly';
  completedDates: string[]; // List of YYYY-MM-DD
  streak: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind color class or hex
  bgLight: string;
  borderLight: string;
  textLight: string;
  badge: string;
}

export type ViewMode = 'day' | 'week' | 'month';

export interface DayStats {
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
  totalHabits: number;
  completedHabits: number;
  totalMinutesScheduled: number;
}
