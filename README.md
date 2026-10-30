# DayPlan - Daily Schedule & Calendar App

A modern, responsive daily scheduling and calendar web application designed to help you organize what you need to get done every day, stay focused with time-blocking, track recurring habits, and maintain productive streaks.

---

## 🚀 Quick Start

To launch the app locally:

```bash
npm run dev
```

Then open your browser at `http://localhost:3000`.

To create a production build:

```bash
npm run build
```

---

## ✨ Key Features

### 1. Hybrid Day View (Time-Blocking + Action Checklist)
- **Hourly Timeline (6:00 AM – 11:00 PM)**: Visual time-blocking grid. Click on any hour slot to instantly schedule a focus block.
- **Current Time Marker**: Live red indicator line marking the exact time of day with real-time updates.
- **Floating Daily Checklist**: For tasks and to-dos that don't need a rigid time slot. Features one-click quick addition by typing and pressing `Enter`.
- **Subtasks & Steps**: Expandable checklist items to break complex tasks down into manageable milestones.

### 2. 🧠 Google Gemini AI Productivity Coach & Executive Briefing
- **Daily Focus Briefing**: Synthesizes the day's scheduled blocks, identifies the top 2-3 most critical tasks, highlights sequencing risks, and provides concrete tips on how to accomplish them without burnout.
- **Weekly Strategic Analysis**: Evaluates 7-day workload distribution, helps avoid scheduling bottlenecks, and plans ahead.
- **Custom Strategic Q&A**: Ask specific questions like *"I only have 3 hours today, what must I tackle first?"* or *"How do I overcome procrastination on this design task?"*.
- **API Key Security**: Enter your Google Gemini API key directly in the UI (stored securely in your browser's local storage) or configure via `.env` (`VITE_GEMINI_API_KEY`). Get a free key at [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. Multi-View Calendar
- **Day View**: Deep focus on today's schedule, timeline, and habits.
- **Week View**: 7-day schedule overview to plan and balance your week's workload.
- **Month View**: Complete monthly calendar grid showing scheduled event pills, completion dots, and date navigation.

### 3. Habits & Routines Tracker
- Recurring daily habits (e.g. Morning hydration, Exercise, Reading, Daily planning).
- One-click checkmark toggling with streak calculation (flame badge).
- Add custom habits with daily, weekday, or weekly recurrence.

### 4. Daily Progress & Gamification
- Live progress card showing completion percentage, finished vs total tasks, scheduled hours, and streak.
- Celebration confetti animation triggered when you complete all tasks planned for the day!

### 5. Categories & Priorities
- Pre-configured color-coded categories: **Work**, **Personal**, **Health & Fitness**, **Study & Learning**, **Meetings**, and **Urgent**.
- Filter by category with one click from the navigation bar.
- Priority levels: **Urgent**, **High**, **Medium**, and **Low**.

### 6. Persistence & Data Portability
- **Automatic Local Storage**: All changes save instantly to browser storage.
- **Backup & Restore**: Export your entire schedule to a `.json` backup file or clipboard, and restore anytime.
- **Sample Schedule Demo**: Easily reset or reload starter data anytime from the Backup dialog.

### 7. Themes & Responsive Design
- Clean, aesthetic UI built with Tailwind CSS.
- One-click Dark / Light mode toggle with system preference detection.
- Fully responsive on desktop, tablet, and mobile browsers.
