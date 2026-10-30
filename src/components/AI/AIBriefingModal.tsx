import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  RefreshCw,
  Key,
  Copy,
  Check,
  Calendar,
  AlertCircle,
  HelpCircle,
  Send,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Task, Habit, Category, ViewMode } from '../../types';
import { formatDisplayDate, getWeekDays, formatDateKey } from '../../utils/dateUtils';
import {
  generateScheduleSummary,
  getGeminiApiKey,
  saveGeminiApiKey,
} from '../../services/geminiService';
import { MarkdownViewer } from './MarkdownViewer';

interface AIBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate: Date;
  tasks: Task[];
  habits: Habit[];
  categories: Category[];
  initialMode?: 'day' | 'week';
}

export const AIBriefingModal: React.FC<AIBriefingModalProps> = ({
  isOpen,
  onClose,
  currentDate,
  tasks,
  habits,
  categories,
  initialMode = 'day',
}) => {
  const [analysisType, setAnalysisType] = useState<'day' | 'week'>(initialMode);
  const [apiKey, setApiKey] = useState<string>('');
  const [isConfiguringKey, setIsConfiguringKey] = useState<boolean>(false);
  const [userPrompt, setUserPrompt] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [briefingContent, setBriefingContent] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Sync initial mode
  useEffect(() => {
    setAnalysisType(initialMode);
  }, [initialMode, isOpen]);

  // Load existing key
  useEffect(() => {
    const existing = getGeminiApiKey();
    setApiKey(existing);
    if (!existing) {
      setIsConfiguringKey(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter tasks based on analysis type (day or week)
  const relevantTasks = tasks.filter((t) => {
    if (analysisType === 'day') {
      return t.date === formatDateKey(currentDate);
    } else {
      const weekDays = getWeekDays(currentDate).map((d) => formatDateKey(d));
      return weekDays.includes(t.date);
    }
  });

  const dateLabel =
    analysisType === 'day'
      ? formatDisplayDate(currentDate, 'EEEE, MMMM d, yyyy')
      : `Week of ${formatDisplayDate(getWeekDays(currentDate)[0], 'MMM d')} - ${formatDisplayDate(
          getWeekDays(currentDate)[6],
          'MMM d, yyyy'
        )}`;

  const handleSaveKey = () => {
    saveGeminiApiKey(apiKey);
    setIsConfiguringKey(false);
    setErrorMessage(null);
  };

  const handleGenerate = async () => {
    const currentKey = getGeminiApiKey();
    if (!currentKey) {
      setIsConfiguringKey(true);
      setErrorMessage('Please enter your Google Gemini API Key to continue.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const summary = await generateScheduleSummary({
        type: analysisType,
        dateStr: dateLabel,
        tasks: relevantTasks,
        habits,
        categories,
        userGoal: userPrompt.trim() || undefined,
      });
      setBriefingContent(summary);
      setUserPrompt('');
    } catch (err: any) {
      if (err.message === 'MISSING_API_KEY' || err.message === 'INVALID_API_KEY') {
        setIsConfiguringKey(true);
        setErrorMessage(
          err.message === 'INVALID_API_KEY'
            ? 'The provided Google API key is invalid. Please double check your key in Google AI Studio.'
            : 'Please enter your Google Gemini API Key.'
        );
      } else {
        setErrorMessage(err.message || 'Failed to generate AI briefing. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!briefingContent) return;
    navigator.clipboard.writeText(briefingContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-peach-100 rounded-none max-w-2xl w-full border-2 border-dark-brown shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-dark-brown bg-peach-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-none border-2 border-dark-brown bg-white flex items-center justify-center text-peach-700 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-dark-brown">
                  AI Productivity Coach
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[10px] font-bold bg-white text-dark-brown border-2 border-dark-brown">
                  <Zap className="w-2.5 h-2.5 text-peach-600" />
                  Google Gemini
                </span>
              </div>
              <p className="text-xs text-dark-brown-muted font-medium">
                Daily & weekly task prioritization and execution tips
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsConfiguringKey(!isConfiguringKey)}
              title="API Key Settings"
              className={`p-2 rounded-none border-2 text-xs font-bold flex items-center gap-1 transition-colors ${
                isConfiguringKey
                  ? 'bg-white border-dark-brown text-black shadow-xs ring-2 ring-dark-brown'
                  : 'border-dark-brown bg-white text-dark-brown hover:bg-peach-50'
              }`}
            >
              <Key className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-none border-2 border-dark-brown text-dark-brown-muted hover:text-dark-brown hover:bg-peach-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* API Key Configuration Dropdown */}
        {isConfiguringKey && (
          <div className="px-6 py-4 bg-peach-200 border-b-2 border-dark-brown text-xs space-y-2.5 animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between">
              <span className="font-bold text-dark-brown flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Google Gemini API Key
              </span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-dark-brown-muted hover:text-dark-brown hover:underline flex items-center gap-1 font-bold"
              >
                <span>Get free API key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-dark-brown-muted font-medium">
              Your key is saved locally in your browser storage and sent directly to Google's API.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 px-3 py-2 rounded-none bg-white border-2 border-dark-brown text-black font-mono text-xs focus:outline-none focus:border-dark-brown placeholder-dark-brown/40 font-semibold"
              />
              <button
                onClick={handleSaveKey}
                className="px-4 py-2 rounded-none bg-white hover:bg-peach-50 text-black font-black border-2 border-dark-brown transition-all shrink-0 shadow-xs"
              >
                Save Key
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 bg-peach-100">
          {/* Controls Bar: Mode selector & scope indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-peach-200 p-2.5 rounded-none border-2 border-dark-brown">
            <div className="flex items-center gap-1 bg-white p-1 rounded-none border-2 border-dark-brown">
              <button
                onClick={() => setAnalysisType('day')}
                className={`px-3 py-1.5 rounded-none border-2 text-xs transition-all ${
                  analysisType === 'day'
                    ? 'bg-white text-black border-dark-brown font-black shadow-xs ring-2 ring-dark-brown'
                    : 'border-transparent text-dark-brown-muted hover:text-dark-brown font-bold'
                }`}
              >
                Day Briefing
              </button>
              <button
                onClick={() => setAnalysisType('week')}
                className={`px-3 py-1.5 rounded-none border-2 text-xs transition-all ${
                  analysisType === 'week'
                    ? 'bg-white text-black border-dark-brown font-black shadow-xs ring-2 ring-dark-brown'
                    : 'border-transparent text-dark-brown-muted hover:text-dark-brown font-bold'
                }`}
              >
                Week Strategy
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-dark-brown px-1 font-bold">
              <Calendar className="w-3.5 h-3.5 text-peach-700" />
              <span>{dateLabel}</span>
              <span className="text-dark-brown">
                ({relevantTasks.length} tasks)
              </span>
            </div>
          </div>

          {/* Optional specific prompt question */}
          <div className="relative">
            <input
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
              placeholder="Ask a specific question (e.g. 'I only have 3 hours today, what must I finish?')..."
              className="w-full px-3.5 py-2.5 pr-28 rounded-none bg-white border-2 border-dark-brown text-xs sm:text-sm text-black placeholder-dark-brown/40 focus:outline-none focus:border-dark-brown font-semibold"
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-none border-2 border-dark-brown bg-white hover:bg-peach-50 disabled:opacity-50 text-black text-xs font-black flex items-center gap-1 transition-all shadow-xs"
            >
              {isLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-peach-700" />
              )}
              <span>{isLoading ? 'Thinking...' : 'Analyze'}</span>
            </button>
          </div>

          {/* Error Message display */}
          {errorMessage && (
            <div className="p-3.5 rounded-none border-2 border-red-500 bg-red-50 text-xs text-red-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600 stroke-[2.5]" />
              <div className="flex-1 font-bold">{errorMessage}</div>
            </div>
          )}

          {/* Briefing Result or Empty State */}
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-none border-2 border-dark-brown bg-white flex items-center justify-center text-peach-700 shadow-sm animate-pulse">
                  <Sparkles className="w-6 h-6 animate-spin" />
                </div>
              </div>
              <h4 className="text-sm font-bold text-dark-brown">
                Synthesizing Your Schedule...
              </h4>
              <p className="text-xs text-dark-brown-muted max-w-sm font-medium">
                Google Gemini is reviewing your scheduled tasks, time blocks, and priorities to formulate your strategic plan.
              </p>
            </div>
          ) : briefingContent ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b-2 border-dark-brown">
                <span className="text-xs font-bold uppercase tracking-wider text-dark-brown">
                  AI Strategy Analysis
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-none border-2 border-dark-brown bg-white text-black hover:bg-peach-50 transition-colors shadow-xs"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Briefing</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleGenerate}
                    title="Regenerate"
                    className="p-1 rounded-none border-2 border-dark-brown bg-white text-slate-700 hover:bg-peach-50 shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Formatted Markdown */}
              <div className="bg-white p-4 sm:p-5 rounded-none border-2 border-dark-brown shadow-xs text-black">
                <MarkdownViewer content={briefingContent} />
              </div>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-14 h-14 rounded-none border-2 border-dark-brown bg-white flex items-center justify-center text-peach-700 shadow-xs">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="max-w-md">
                <h4 className="text-base font-bold text-dark-brown mb-1">
                  Ready for your {analysisType === 'day' ? 'Daily' : 'Weekly'} Strategy Briefing?
                </h4>
                <p className="text-xs text-dark-brown-muted leading-relaxed font-medium">
                  Click the button below to have Google Gemini evaluate your tasks, highlight your top priorities, and provide customized execution tactics to accomplish them.
                </p>
              </div>
              <button
                onClick={handleGenerate}
                className="px-6 py-2.5 rounded-none border-2 border-dark-brown bg-white hover:bg-peach-50 active:scale-95 text-black text-xs font-black shadow-xs flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-peach-700" />
                <span>Generate {analysisType === 'day' ? 'Daily' : 'Weekly'} Briefing</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t-2 border-dark-brown bg-peach-100 flex items-center justify-between text-xs">
          <span className="text-dark-brown font-bold">
            Powered by Google Gemini 3.8 Flash
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-none border-2 border-dark-brown bg-white hover:bg-peach-50 text-dark-brown font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
