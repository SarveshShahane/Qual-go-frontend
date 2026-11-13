import { useEffect } from 'react';

export interface ShortcutHandlers {
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onEscape?: () => void;
  onDeselect?: () => void;
  onHelp?: () => void;
  onRun?: () => void;
  onSimulate?: () => void;
  onOpenHelp?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger shortcuts when typing inside an input, textarea, or Monaco editor
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.closest('.monaco-editor'))
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Undo: Ctrl+Z / Cmd+Z
      if (cmdOrCtrl && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handlers.onUndo?.();
        return;
      }

      // Redo: Ctrl+Shift+Z / Cmd+Shift+Z or Ctrl+Y
      if (
        (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'z') ||
        (cmdOrCtrl && e.key.toLowerCase() === 'y')
      ) {
        e.preventDefault();
        handlers.onRedo?.();
        return;
      }

      // Duplicate: Ctrl+D / Cmd+D
      if (cmdOrCtrl && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handlers.onDuplicate?.();
        return;
      }

      // Run Simulation: Ctrl+Enter / Cmd+Enter
      if (cmdOrCtrl && e.key === 'Enter') {
        e.preventDefault();
        handlers.onSimulate?.() ?? handlers.onRun?.();
        return;
      }

      // Delete: Delete or Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        handlers.onDelete?.();
        return;
      }

      // Escape: Deselect or Close
      if (e.key === 'Escape') {
        e.preventDefault();
        handlers.onEscape?.();
        handlers.onDeselect?.();
        return;
      }

      // Help: ?
      if (e.key === '?' && !cmdOrCtrl) {
        e.preventDefault();
        handlers.onHelp?.();
        handlers.onOpenHelp?.();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers, enabled]);
}
