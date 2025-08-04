import React, { useState, useEffect, useRef } from 'react';
import { Command } from '../types/terminal';
import { processCommand, getCurrentTime, getCommandSuggestions } from '../utils/commands';
import { TerminalOutput } from './TerminalOutput';
import { useSound } from '../hooks/useSound';

interface TerminalProps {
  username: string;
  onExit: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ username, onExit }) => {
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<Command[]>([]);
  const [inputHistory, setInputHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { playEnter, playTyping } = useSound();

  // Initialize terminal with welcome message
  useEffect(() => {
    const initializeTerminal = async () => {
      const welcomeMessages = [
        '',
        '╔══════════════════════════════════════════════════════════════╗',
        '║                                                              ║',
        '║               HACKER TYCOON v1.0                             ║',
        '║           Welcome to the Underground Terminal                ║',
        '║                                                              ║',
        '╚══════════════════════════════════════════════════════════════╝',
        '',
        'System initialized successfully.',
        "Type 'help' to see available commands.",
        '',
        '💡 New: Use "skills" command to view your skill tree!',
        ''
      ];

      setCommandHistory([{
        input: '',
        output: welcomeMessages,
        timestamp: getCurrentTime()
      }]);
      
      setTimeout(() => setIsInitializing(false), 1500);
    };

    initializeTerminal();
  }, []);

  // Load command history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`terminal_history_${username}`);
    const savedInputHistory = localStorage.getItem(`input_history_${username}`);
    if (saved && !isInitializing) {
      try {
        const parsed = JSON.parse(saved);
        setCommandHistory(prev => [...prev, ...parsed]);
      } catch (error) {
        console.error('Failed to load command history:', error);
      }
    }
    if (savedInputHistory) {
      try {
        const parsed = JSON.parse(savedInputHistory);
        setInputHistory(parsed);
      } catch (error) {
        console.error('Failed to load input history:', error);
      }
    }
  }, [username, isInitializing]);

  // Save command history to localStorage
  useEffect(() => {
    if (!isInitializing && commandHistory.length > 1) {
      const historyToSave = commandHistory.slice(1); // Remove initial welcome message
      localStorage.setItem(`terminal_history_${username}`, JSON.stringify(historyToSave));
    }
  }, [commandHistory, username, isInitializing]);

  // Save input history to localStorage
  useEffect(() => {
    if (inputHistory.length > 0) {
      localStorage.setItem(`input_history_${username}`, JSON.stringify(inputHistory));
    }
  }, [inputHistory, username]);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commandHistory]);

  // Focus input on mount and keep focused
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    focusInput();
    document.addEventListener('click', focusInput);
    return () => document.removeEventListener('click', focusInput);
  }, []);

  // Handle command suggestions
  useEffect(() => {
    if (currentInput.trim()) {
      const newSuggestions = getCommandSuggestions(currentInput.trim());
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0 && newSuggestions.length < 10);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [currentInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
    setHistoryIndex(-1);
    playTyping();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (inputHistory.length > 0) {
        const newIndex = historyIndex < inputHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCurrentInput(inputHistory[inputHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(inputHistory[inputHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length === 1) {
        setCurrentInput(suggestions[0] + ' ');
        setShowSuggestions(false);
      } else if (suggestions.length > 1) {
        // Find common prefix
        const commonPrefix = suggestions.reduce((prefix, suggestion) => {
          let i = 0;
          while (i < prefix.length && i < suggestion.length && prefix[i] === suggestion[i]) {
            i++;
          }
          return prefix.substring(0, i);
        });
        if (commonPrefix.length > currentInput.length) {
          setCurrentInput(commonPrefix);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentInput.trim() === '' || isProcessing) return;

    setIsProcessing(true);
    playEnter();
    
    const command = currentInput.trim();
    
    // Add to input history
    setInputHistory(prev => {
      const newHistory = [command, ...prev.filter(cmd => cmd !== command)];
      return newHistory.slice(0, 50); // Keep last 50 commands
    });
    setHistoryIndex(-1);
    
    const timestamp = getCurrentTime();
    
    // Add command to display immediately
    const pendingCommand: Command = {
      input: command,
      output: ['Processing...'],
      timestamp
    };
    setCommandHistory(prev => [...prev, pendingCommand]);
    setCurrentInput('');
    setShowSuggestions(false);
    
    try {
      const output = await processCommand(command, username);
      
      // Handle special commands
      if (output[0] === 'CLEAR_TERMINAL') {
        setCommandHistory([]);
        setIsProcessing(false);
        return;
      }
      
      if (command.toLowerCase() === 'exit') {
        onExit();
        return;
      }
      
      // Update the command with real output
      setCommandHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = {
          input: command,
          output,
          timestamp
        };
        return newHistory;
      });
    } catch (error) {
      // Handle errors
      setCommandHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = {
          input: command,
          output: ['Error: Command execution failed'],
          timestamp
        };
        return newHistory;
      });
    }
    
    setIsProcessing(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentInput(suggestion + ' ');
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const oldHandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentInput.trim() === '') return;

    playEnter();
    
    const command = currentInput.trim();
    
    // Handle special commands
    if (command.toLowerCase() === 'clear') {
      setCommandHistory([]);
      setCurrentInput('');
      return;
    }
    
    if (command.toLowerCase() === 'exit') {
      onExit();
      return;
    }
    
    setCurrentInput('');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[80vh] border border-green-400 bg-black text-green-400 font-mono text-sm flex flex-col">
        {/* Terminal Header */}
        <div className="border-b border-green-600 p-2 bg-black flex-shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-green-400">Matrix Terminal</span>
          </div>
        </div>
        
        {/* Terminal Content */}
        <div ref={terminalRef} className="flex-1 flex flex-col overflow-hidden">
          <TerminalOutput commandHistory={commandHistory} username={username} />
          
          {/* Command Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="px-4 pb-2">
              <div className="text-green-600 text-xs mb-1">Suggestions:</div>
              <div className="flex flex-wrap gap-2">
                {suggestions.slice(0, 8).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-green-400 bg-green-900 bg-opacity-20 px-2 py-1 rounded text-xs hover:bg-opacity-40 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Input Line */}
          <div className="p-4 pt-0 flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex items-center">
              <span className="text-green-600">[{getCurrentTime()}]</span>
              <span className="text-green-300 ml-2">{username}@matrix</span>
              <span className="text-green-400">:</span>
              <span className="text-green-300">~</span>
              <span className="text-green-400 mr-1">$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none text-green-400 font-mono flex-1"
                autoComplete="off"
                spellCheck="false"
                disabled={isProcessing}
              />
              {showCursor && !isProcessing && <span className="text-green-400">█</span>}
              {isProcessing && <span className="text-green-400 animate-pulse">⏳</span>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};