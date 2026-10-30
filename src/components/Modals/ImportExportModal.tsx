import React, { useState } from 'react';
import { X, Download, Upload, RefreshCw, Check, Copy, AlertCircle } from 'lucide-react';
import { exportAllData, importAllData, generateStarterData, saveTasks, saveHabits } from '../../utils/storage';
import { Task, Habit } from '../../types';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataReset: (tasks: Task[], habits: Habit[]) => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  onDataReset,
}) => {
  const [copied, setCopied] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    const data = exportAllData();
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dayplan-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importJson.trim()) return;
    const success = importAllData(importJson.trim());
    if (success) {
      setStatusMessage({ type: 'success', text: 'Data imported successfully! Refreshing...' });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setStatusMessage({ type: 'error', text: 'Invalid JSON format. Please verify your backup data.' });
    }
  };

  const handleResetSample = () => {
    if (confirm('Load demo starter schedule? This will overwrite your current schedule.')) {
      const { tasks, habits } = generateStarterData();
      saveTasks(tasks);
      saveHabits(habits);
      onDataReset(tasks, habits);
      setStatusMessage({ type: 'success', text: 'Demo schedule loaded!' });
      setTimeout(() => {
        onClose();
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-peach-100 rounded-none max-w-md w-full border-2 border-dark-brown shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-dark-brown bg-peach-200">
          <h3 className="text-base font-bold text-dark-brown">
            Backup & Data Management
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-none border-2 border-dark-brown text-dark-brown-muted hover:text-dark-brown hover:bg-peach-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs bg-peach-100">
          {statusMessage && (
            <div
              className={`p-3 rounded-none flex items-center gap-2 border-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-500'
                  : 'bg-red-50 text-red-900 border-red-500'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 stroke-[2.5]" />
              )}
              <span className="font-bold">{statusMessage.text}</span>
            </div>
          )}

          {/* Export Section */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-dark-brown">
              Export / Backup
            </h4>
            <p className="text-dark-brown-muted font-medium">
              Save your tasks, time blocks, and habits to a portable JSON file.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleDownload}
                className="flex-1 py-2 px-3 rounded-none border-2 border-dark-brown bg-white hover:bg-peach-50 text-black font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download .JSON</span>
              </button>
              <button
                onClick={handleCopy}
                className="py-2 px-3 rounded-none border-2 border-dark-brown bg-white hover:bg-peach-50 text-black font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="h-[2px] bg-dark-brown-border" />

          {/* Import Section */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-dark-brown">
              Restore / Import
            </h4>
            <textarea
              rows={3}
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder="Paste JSON backup content here..."
              className="w-full px-3 py-2 rounded-none bg-white border-2 border-dark-brown text-black focus:outline-none focus:border-dark-brown font-mono text-xs placeholder-dark-brown/40"
            />
            <button
              onClick={handleImport}
              disabled={!importJson.trim()}
              className="w-full py-2 rounded-none bg-white hover:bg-peach-50 disabled:opacity-40 text-black font-black flex items-center justify-center gap-1.5 border-2 border-dark-brown transition-all shadow-xs"
            >
              <Upload className="w-4 h-4 text-peach-700" />
              <span>Restore from Backup</span>
            </button>
          </div>

          <div className="h-[2px] bg-dark-brown-border" />

          {/* Demo Data Reset */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-dark-brown">
              Sample Schedule Demo
            </h4>
            <button
              onClick={handleResetSample}
              className="w-full py-2 px-3 rounded-none border-2 border-dark-brown bg-white hover:bg-peach-50 text-black font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset / Reload Starter Schedule</span>
            </button>
          </div>
        </div>

        <div className="px-6 py-3 border-t-2 border-dark-brown bg-peach-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-none border-2 border-dark-brown bg-white text-xs font-bold text-dark-brown hover:bg-peach-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
