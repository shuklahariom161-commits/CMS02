import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'icon' | 'button' | 'pill';
  showLabel?: boolean;
  className?: string;
  id?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'icon',
  showLabel = false,
  className = '',
  id = 'theme-toggle-btn',
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'pill') {
    return (
      <button
        id={id}
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
          isDark
            ? 'bg-slate-800 text-amber-300 border border-slate-700 hover:bg-slate-750 hover:border-amber-400/40 shadow-xs'
            : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100/80 shadow-xs'
        } ${className}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-400 transition-transform hover:rotate-45" />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-slate-700 transition-transform hover:-rotate-12" />
            <span>Dark Mode</span>
          </>
        )}
      </button>
    );
  }

  if (variant === 'button' || showLabel) {
    return (
      <button
        id={id}
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
          isDark
            ? 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white'
            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
        } ${className}`}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 animate-spin-once" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-600" />
        )}
        <span>{isDark ? 'Light' : 'Dark'}</span>
      </button>
    );
  }

  return (
    <button
      id={id}
      onClick={toggleTheme}
      className={`relative p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center ${
        isDark
          ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700 hover:border-slate-600 hover:text-amber-200 shadow-xs shadow-slate-950/20'
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-indigo-600 shadow-xs'
      } ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode (Currently ${theme})`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-300 hover:rotate-90 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 hover:-rotate-12 text-slate-600" />
      )}
      <span className="sr-only">Toggle theme (Current: {theme})</span>
    </button>
  );
};
