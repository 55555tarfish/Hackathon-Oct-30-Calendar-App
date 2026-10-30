import React, { useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { Task, Category } from '../../types';
import { isToday, formatMinutesToTime } from '../../utils/dateUtils';
import { TimeBlockCard } from './TimeBlockCard';

interface HourlyTimelineProps {
  currentDate: Date;
  tasks: Task[];
  categories: Category[];
  onToggleComplete: (taskId: string, e: React.MouseEvent) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string, e: React.MouseEvent) => void;
  onQuickAddAtHour: (hour: number) => void;
}

const START_HOUR = 6; // 6:00 AM
const END_HOUR = 23; // 11:00 PM
const HOUR_HEIGHT = 64; // pixels per hour

export const HourlyTimeline: React.FC<HourlyTimelineProps> = ({
  currentDate,
  tasks,
  categories,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onQuickAddAtHour,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentMinutes, setCurrentMinutes] = useState<number | null>(null);

  // Update current time indicator
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      if (isToday(currentDate)) {
        const mins = now.getHours() * 60 + now.getMinutes();
        setCurrentMinutes(mins);
      } else {
        setCurrentMinutes(null);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [currentDate]);

  // Initial scroll to current time or 8 AM
  useEffect(() => {
    if (containerRef.current) {
      const now = new Date();
      const targetHour = isToday(currentDate) ? Math.max(START_HOUR, now.getHours() - 1) : 8;
      const scrollPos = (targetHour - START_HOUR) * HOUR_HEIGHT;
      containerRef.current.scrollTop = scrollPos;
    }
  }, [currentDate]);

  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  // Filter tasks that have start and end time
  const scheduledTasks = tasks.filter((t) => t.startTime && t.endTime && !t.isAllDay);

  const hoursArray = Array.from(
    { length: END_HOUR - START_HOUR + 1 },
    (_, i) => START_HOUR + i
  );

  // Current time line offset
  const nowOffset =
    currentMinutes !== null && currentMinutes >= START_HOUR * 60 && currentMinutes <= (END_HOUR + 1) * 60
      ? ((currentMinutes - START_HOUR * 60) / 60) * HOUR_HEIGHT
      : null;

  return (
    <div className="bg-peach-200 rounded-none border-2 border-dark-brown shadow-sm overflow-hidden flex flex-col h-[700px]">
      {/* Header */}
      <div className="px-5 py-3.5 border-b-2 border-dark-brown flex items-center justify-between bg-peach-300">
        <div>
          <h4 className="text-sm font-bold text-dark-brown">
            Time-Blocked Schedule
          </h4>
          <p className="text-xs text-dark-brown-muted font-medium">
            Click any open hour to schedule a focus block
          </p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-none bg-white text-dark-brown border-2 border-dark-brown">
          {scheduledTasks.length} Scheduled
        </span>
      </div>

      {/* Timeline Scroll Area */}
      <div ref={containerRef} className="relative flex-1 overflow-y-auto overflow-x-hidden bg-peach-200">
        <div
          className="relative min-w-full"
          style={{ height: `${hoursArray.length * HOUR_HEIGHT}px` }}
        >
          {/* Current time marker */}
          {nowOffset !== null && (
            <div
              style={{ top: `${nowOffset}px` }}
              className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
            >
              <div className="w-2.5 h-2.5 rounded-none bg-red-500 border border-white shadow-sm ml-12 sm:ml-18 -mr-1 animate-pulse" />
              <div className="flex-1 h-[2px] bg-red-500 shadow-sm shadow-red-500/50" />
            </div>
          )}

          {/* Hour grid rows */}
          {hoursArray.map((hour) => {
            const displayTime =
              hour === 12
                ? '12 PM'
                : hour > 12
                ? `${hour - 12} PM`
                : `${hour} AM`;

            return (
              <div
                key={hour}
                style={{ height: `${HOUR_HEIGHT}px` }}
                className="group relative flex border-b border-dark-brown/40 hover:bg-peach-100/80 transition-colors"
              >
                {/* Time Label */}
                <div className="w-14 sm:w-20 shrink-0 text-right pr-3 -mt-2.5 text-[11px] font-bold text-dark-brown select-none">
                  {displayTime}
                </div>

                {/* Slot Click area */}
                <div
                  onClick={() => onQuickAddAtHour(hour)}
                  className="flex-1 cursor-pointer relative"
                >
                  {/* Subtle hover prompt */}
                  <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center pl-4 text-xs font-bold text-dark-brown-muted gap-1.5 pointer-events-none transition-opacity">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Block {displayTime}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Scheduled Task Blocks */}
          {scheduledTasks.map((task) => (
            <TimeBlockCard
              key={task.id}
              task={task}
              category={categoryMap.get(task.category)}
              startHour={START_HOUR}
              hourHeight={HOUR_HEIGHT}
              onToggleComplete={onToggleComplete}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
