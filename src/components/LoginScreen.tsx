import React, { useState, useEffect } from 'react';
import { LoginCredentials } from '../types/terminal';
import { useSound } from '../hooks/useSound';

interface LoginScreenProps {
  onLogin: (credentials: LoginCredentials) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentStep, setCurrentStep] = useState<'boot' | 'login'>('boot');
  const [bootText, setBootText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [skipBoot, setSkipBoot] = useState(false);
  const { playTyping, playLogin, playBeep } = useSound();

  const bootSequence = [
    'BIOS v2.1.0 - Hacker Terminal System',
    'Copyright (C) 2025 Underground Computing Corp.',
    '',
    'Memory Test: 16384MB OK',
    'CPU: Intel Hacker Core i9-9900K @ 3.60GHz',
    'Detecting IDE devices... OK',
    '',
    'Loading secure boot loader...',
    'Initializing quantum encryption...',
    'Establishing secure connection...',
    '',
    'System ready. Please authenticate.',
    ''
  ];

  useEffect(() => {
    let index = 0;
    let charIndex = 0;
    let currentText = '';
    let timeoutId: NodeJS.Timeout;

    const typeBootSequence = () => {
      if (index < bootSequence.length) {
        const currentLine = bootSequence[index];
        
        if (charIndex < currentLine.length) {
          currentText += currentLine[charIndex];
          setBootText(prev => {
            const lines = prev.split('\n');
            lines[lines.length - 1] = currentText;
            return lines.join('\n');
          });
          charIndex++;
          playTyping();
          timeoutId = setTimeout(typeBootSequence, skipBoot ? 10 : 50 + Math.random() * 50);
        } else {
          currentText = '';
          charIndex = 0;
          index++;
          setBootText(prev => prev + '\n');
          timeoutId = setTimeout(typeBootSequence, skipBoot ? 20 : 200);
        }
      } else {
        timeoutId = setTimeout(() => setCurrentStep('login'), skipBoot ? 100 : 1000);
      }
    };

    timeoutId = setTimeout(typeBootSequence, skipBoot ? 50 : 500);
    return () => clearTimeout(timeoutId);
  }, [playTyping, skipBoot]);

  // Handle spacebar to skip/speed up boot
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && currentStep === 'boot') {
        e.preventDefault();
        setSkipBoot(true);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentStep]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      playLogin();
      onLogin({ username: username.trim(), password });
    } else {
      playBeep(400, 200);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    playTyping();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    playTyping();
  };

  if (currentStep === 'boot') {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono text-sm overflow-hidden">
        <div className="p-4 relative">
          <pre className="whitespace-pre-line">
            {bootText}
            {showCursor && '█'}
          </pre>
          <div className="absolute bottom-4 right-4 text-xs opacity-60">
            Press SPACEBAR to skip
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="border border-green-400 p-8 mb-8">
          <div className="text-center mb-8">
            <div className="text-xl mb-4">
              ╔═══════════════════════════════════╗
            </div>
            <div className="text-xl mb-2">
              ║         MATRIX TERMINAL           ║
            </div>
            <div className="text-xl mb-4">
              ╚═══════════════════════════════════╝
            </div>
            <div className="text-sm opacity-80">
              AUTHORIZED PERSONNEL ONLY
            </div>
            <div className="text-sm opacity-60 mt-2">
              Unauthorized access is prohibited
            </div>
          </div>
          

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="mb-2">Username:</div>
              <div className="flex items-center">
                <span className="mr-2">root@matrix:~$</span>
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  className="bg-transparent border-none outline-none text-green-400 font-mono flex-1"
                  placeholder="enter_username"
                  autoFocus
                />
                {showCursor && username === '' && <span>█</span>}
              </div>
              <div className="h-px bg-green-400 mt-1"></div>
            </div>

            <div>
              <div className="mb-2">Password:</div>
              <div className="flex items-center">
                <span className="mr-2">Enter key:</span>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="bg-transparent border-none outline-none text-green-400 font-mono flex-1"
                  placeholder="••••••••"
                />
                {showCursor && password === '' && <span>█</span>}
              </div>
              <div className="h-px bg-green-400 mt-1"></div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-transparent border border-green-400 text-green-400 p-2 hover:bg-green-400 hover:text-black transition-colors font-mono"
              >
                [ AUTHENTICATE ]
              </button>
            </div>
            {/* Tooltip for user */}
            <div className="mt-4 text-xs text-green-300 text-center opacity-80">
              Tip: You can enter any username and password to login.
            </div>
          </form>
          
          <div className="mt-8 text-xs opacity-60 text-center">
            <div>System Status: ONLINE</div>
            <div>Security Level: MAXIMUM</div>
            <div>Last Login: Never</div>
          </div>
        </div>
      </div>
    </div>
  );
};