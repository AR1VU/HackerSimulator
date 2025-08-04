import React, { useState, useEffect, useRef } from 'react';
import { Command } from '../types/terminal';
import { processCommand, getCurrentTime } from '../utils/commands';
import { TerminalOutput } from './TerminalOutput';
import { useSound } from '../hooks/useSound';

interface TerminalProps {
  username: string;
  onExit: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ username, onExit }) => {
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<Command[]>([]);
  const [showCursor, setShowCursor] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
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
    if (saved && !isInitializing) {
      try {
        const parsed = JSON.parse(saved);
        setCommandHistory(prev => [...prev, ...parsed]);
      } catch (error) {
        console.error('Failed to load command history:', error);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
    playTyping();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentInput.trim() === '') return;

    playEnter();
    
    const command = currentInput.trim();
    const output = processCommand(command, username);
    const timestamp = getCurrentTime();
    
    // Handle special commands
    if (output[0] === 'CLEAR_TERMINAL') {
      setCommandHistory([]);
      setCurrentInput('');
      return;
    }
    
    if (command.toLowerCase() === 'exit') {
      onExit();
      return;
    }
    
    const newCommand: Command = {
      input: command,
      output,
      timestamp
    };
    
    setCommandHistory(prev => [...prev, newCommand]);
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
                className="bg-transparent border-none outline-none text-green-400 font-mono flex-1"
                autoComplete="off"
                spellCheck="false"
              />
              {showCursor && <span className="text-green-400">█</span>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};