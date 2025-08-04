import React from 'react';
import { Command } from '../types/terminal';

interface TerminalOutputProps {
  commandHistory: Command[];
  username: string;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ commandHistory, username }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 pb-0">
      {commandHistory.map((command, index) => (
        <div key={index} className="mb-2">
          <div className="text-green-400">
            <span className="text-green-600">[{command.timestamp}]</span>
            <span className="text-green-300 ml-2">{username}@matrix</span>
            <span className="text-green-400">:</span>
            <span className="text-green-300">~</span>
            <span className="text-green-400">$ {command.input}</span>
          </div>
          {command.output.map((line, lineIndex) => (
            <div key={lineIndex} className="text-green-400 ml-4">
              {line}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};