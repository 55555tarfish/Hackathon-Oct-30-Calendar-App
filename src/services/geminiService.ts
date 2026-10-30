import { Task, Habit, Category } from '../types';
import { formatDisplayDate, formatTimeDisplay } from '../utils/dateUtils';

const API_KEY_STORAGE_KEY = 'dayplan_gemini_api_key';

export const getGeminiApiKey = (): string => {
  // Check localStorage first, fallback to Vite env
  const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (savedKey && savedKey.trim()) {
    return savedKey.trim();
  }
  return (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
};

export const saveGeminiApiKey = (key: string): void => {
  if (key && key.trim()) {
    localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
};

export interface AIAnalysisRequest {
  type: 'day' | 'week';
  dateStr: string;
  tasks: Task[];
  habits: Habit[];
  categories: Category[];
  userGoal?: string;
}

export const generateScheduleSummary = async (
  request: AIAnalysisRequest
): Promise<string> => {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  const { type, dateStr, tasks, habits, categories, userGoal } = request;
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  // Prepare structured task context for the LLM
  const tasksContext = tasks.map((t) => {
    const timeInfo = t.startTime && t.endTime ? `${t.startTime} - ${t.endTime}` : 'Unscheduled / Anytime';
    const subtasksInfo = t.subtasks && t.subtasks.length > 0
      ? ` [Subtasks: ${t.subtasks.filter((s) => s.completed).length}/${t.subtasks.length} done]`
      : '';
    return `- [${t.completed ? 'DONE' : 'PENDING'}] ${t.title} (Category: ${categoryMap.get(t.category) || t.category}, Priority: ${t.priority.toUpperCase()}, Time: ${timeInfo})${subtasksInfo}${t.description ? ` - Notes: ${t.description}` : ''}`;
  }).join('\n');

  const habitsContext = habits.map((h) => {
    return `- ${h.title} (Frequency: ${h.frequency}, Current Streak: ${h.streak} days)`;
  }).join('\n');

  const prompt = `
You are an elite productivity strategist and executive coach.
Analyze the user's schedule for the ${type === 'day' ? 'day of ' + dateStr : 'week of ' + dateStr}.

SCHEDULE DATA:
Tasks (${tasks.length} total, ${tasks.filter((t) => t.completed).length} completed):
${tasksContext || 'No tasks currently scheduled.'}

Habits & Routines (${habits.length} total):
${habitsContext || 'No habits currently tracked.'}

${userGoal ? `User's Special Focus / Question: "${userGoal}"` : ''}

Please deliver an inspiring, highly practical, and actionable AI briefing formatted cleanly with markdown:

1. 🎯 **Key Priority Focus (Top 2-3 High-Impact Tasks)**:
   Identify the most critical tasks that will truly move the needle. Explain why they should be prioritized first.

2. ⏱️ **Optimal Execution Flow & Time Strategy**:
   Recommend a battle-tested sequence (e.g. "Eat the Frog" in the morning, deep focus blocks, batching administrative items, taking recovery breaks). Point out any scheduling gaps or potential burnout risks.

3. 💡 **Actionable Tips to Get Them Done**:
   Give concrete, practical techniques (e.g. 2-minute rule, Pomodoro, breaking down mental friction, handling distractions) tailored directly to these specific tasks.

4. ⚡ **Habit & Momentum Catalyst**:
   Highlight how completing their habits will supercharge their focus and energy to finish the day strong.

Keep the tone energetic, encouraging, and razor-sharp. Avoid generic filler.
`;

  // We try gemini-3.8-flash first, followed by fallbacks
  const models = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1500,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        if (response.status === 400 && errorMessage.toLowerCase().includes('api key')) {
          throw new Error('INVALID_API_KEY');
        }
        // If this model is deprecated or not available, try next model in fallback list
        if (
          errorMessage.toLowerCase().includes('not found') ||
          errorMessage.toLowerCase().includes('no longer available') ||
          errorMessage.toLowerCase().includes('deprecated') ||
          response.status === 404
        ) {
          lastError = new Error(errorMessage);
          continue;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedText) {
        throw new Error('No content generated by Gemini.');
      }

      return generatedText;
    } catch (err: any) {
      lastError = err;
      if (err.message === 'INVALID_API_KEY') {
        throw err;
      }
      if (
        err.message &&
        (err.message.includes('404') ||
          err.message.toLowerCase().includes('no longer available') ||
          err.message.toLowerCase().includes('not found') ||
          err.message.toLowerCase().includes('deprecated'))
      ) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('Failed to generate summary from Google Gemini.');
};
