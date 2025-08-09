import React from 'react';
import { Command } from '../types/terminal';
import { NetworkMap, NetworkNode } from './NetworkMap';

interface TerminalOutputProps {
  commandHistory: Command[];
  username: string;
  networkNodes?: NetworkNode[];
  connectedNode?: string;
}

export const TerminalOutput: React.FC<TerminalOutputProps> = ({ 
  commandHistory, 
  username, 
  networkNodes = [], 
  connectedNode 
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 pb-0">
      {commandHistory.map((command, index) => (
        <div key={index} className="mb-2">
          <div className="text-green-400">
            <span className="text-green-600">[{command.timestamp}]</span>
            <span className="text-green-300 ml-2">
              {connectedNode ? `root@${connectedNode}` : `${username}@matrix`}
            </span>
            <span className="text-green-400">:</span>
            <span className="text-green-300">~</span>
            <span className="text-green-400">$ {command.input}</span>
          </div>
          {command.output.map((line, lineIndex) => {
            // Handle network map display
            if (line === 'NETWORK_MAP_START') {
              return (
                <div key={lineIndex} className="ml-4 my-4">
                  <NetworkMap nodes={networkNodes} connectedNode={connectedNode} />
                </div>
              );
            }
            
            // Skip the end marker
            if (line === 'NETWORK_MAP_END') {
              return null;
            }
            
            return (
              <div key={lineIndex} className="text-green-400 ml-4">
                {line}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};