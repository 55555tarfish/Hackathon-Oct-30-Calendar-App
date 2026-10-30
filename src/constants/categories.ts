import { Category } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'work',
    name: 'Work',
    color: '#3b82f6', // blue
    bgLight: 'bg-blue-50 dark:bg-blue-950/40',
    borderLight: 'border-blue-200 dark:border-blue-800',
    textLight: 'text-blue-700 dark:text-blue-300',
    badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
  },
  {
    id: 'personal',
    name: 'Personal',
    color: '#10b981', // emerald
    bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
    borderLight: 'border-emerald-200 dark:border-emerald-800',
    textLight: 'text-emerald-700 dark:text-emerald-300',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    color: '#ec4899', // pink
    bgLight: 'bg-pink-50 dark:bg-pink-950/40',
    borderLight: 'border-pink-200 dark:border-pink-800',
    textLight: 'text-pink-700 dark:text-pink-300',
    badge: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20',
  },
  {
    id: 'study',
    name: 'Study & Learning',
    color: '#8b5cf6', // purple
    bgLight: 'bg-purple-50 dark:bg-purple-950/40',
    borderLight: 'border-purple-200 dark:border-purple-800',
    textLight: 'text-purple-700 dark:text-purple-300',
    badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
  },
  {
    id: 'meeting',
    name: 'Meetings',
    color: '#f59e0b', // amber
    bgLight: 'bg-amber-50 dark:bg-amber-950/40',
    borderLight: 'border-amber-200 dark:border-amber-800',
    textLight: 'text-amber-700 dark:text-amber-300',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
  },
  {
    id: 'miscellaneous',
    name: 'Miscellaneous',
    color: '#64748b', // slate
    bgLight: 'bg-slate-50 dark:bg-slate-950/40',
    borderLight: 'border-slate-200 dark:border-slate-800',
    textLight: 'text-slate-700 dark:text-slate-300',
    badge: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20',
  },
];

export const PRIORITY_CONFIG = {
  urgent: {
    label: 'Urgent',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
  },
  high: {
    label: 'High',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
  },
  medium: {
    label: 'Medium',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
  },
  low: {
    label: 'Low',
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/30',
  },
};
