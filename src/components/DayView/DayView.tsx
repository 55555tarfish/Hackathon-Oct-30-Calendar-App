import React from 'react';
import { Task, Habit, Category, DayStats, Priority } from '../../types';
import { formatDateKey } from '../../utils/dateUtils';
import { DailyProgress } from './DailyProgress';
import { AIBriefingWidget } from './AIBriefingWidget';
import { HabitsTracker } from './HabitsTracker';
import { HourlyTimeline } from './HourlyTimeline';
import { DailyChecklist } from './DailyChecklist';

interface DayViewProps {
  currentDate: Date;
  tasks: Task[];
  habits: Habit[];
  categories: Category[];
  stats: DayStats;
  streak: number;
  onToggleComplete: (taskId: string, e?: React.MouseEvent) => void;
  onToggleHabit: (habitId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string, e: React.MouseEvent) => void;
  onQuickAddAtHour: (hour: number) => void;
  onQuickAddTask: (title: string, priority: Priority) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onOpenHabitModal: () => void;
  onOpenAIBriefing: () => void;
}

export const DayView: React.FC<DayViewProps> = ({
  currentDate,
  tasks,
  habits,
  categories,
  stats,
  streak,
  onToggleComplete,
  onToggleHabit,
  onEditTask,
  onDeleteTask,
  onQuickAddAtHour,
  onQuickAddTask,
  onToggleSubtask,
  onOpenHabitModal,
  onOpenAIBriefing,
}) => {
  const currentDateKey = formatDateKey(currentDate);

  return (
    <div className="space-y-5">
      {/* Top Banner: Daily Progress & Focus */}
      <DailyProgress stats={stats} streak={streak} />

      {/* AI Daily Briefing Banner */}
      <AIBriefingWidget
        stats={stats}
        tasks={tasks}
        onOpenAIBriefing={onOpenAIBriefing}
      />

      {/* Daily Habits Bar */}
      <HabitsTracker
        habits={habits}
        currentDateKey={currentDateKey}
        onToggleHabit={onToggleHabit}
        onOpenHabitModal={onOpenHabitModal}
      />

      {/* Main Grid: Hourly Timeline (Left) + Daily Checklist (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 xl:col-span-8">
          <HourlyTimeline
            currentDate={currentDate}
            tasks={tasks}
            categories={categories}
            onToggleComplete={onToggleComplete}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onQuickAddAtHour={onQuickAddAtHour}
          />
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <DailyChecklist
            tasks={tasks}
            categories={categories}
            onToggleComplete={onToggleComplete}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onQuickAddTask={onQuickAddTask}
            onToggleSubtask={onToggleSubtask}
          />
        </div>
      </div>
    </div>
  );
};
