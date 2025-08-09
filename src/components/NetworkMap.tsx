import React from 'react';

export interface NetworkNode {
  ip: string;
  status: 'vulnerable' | 'encrypted' | 'honeypot' | 'firewall' | 'offline';
  ports: number[];
  services: string[];
  files: string[];
}

interface NetworkMapProps {
  nodes: NetworkNode[];
  connectedNode?: string;
}

export const NetworkMap: React.FC<NetworkMapProps> = ({ nodes, connectedNode }) => {
  const getNodeSymbol = (status: NetworkNode['status']) => {
    switch (status) {
      case 'vulnerable': return 'V';
      case 'encrypted': return 'E';
      case 'honeypot': return 'H';
      case 'firewall': return 'F';
      case 'offline': return 'X';
      default: return '?';
    }
  };

  const getNodeColor = (status: NetworkNode['status'], isConnected: boolean) => {
    if (isConnected) return 'text-yellow-400 bg-yellow-900';
    
    switch (status) {
      case 'vulnerable': return 'text-red-400 bg-red-900';
      case 'encrypted': return 'text-blue-400 bg-blue-900';
      case 'honeypot': return 'text-purple-400 bg-purple-900';
      case 'firewall': return 'text-gray-400 bg-gray-800';
      case 'offline': return 'text-gray-600 bg-gray-900';
      default: return 'text-green-400 bg-green-900';
    }
  };

  const getStatusDescription = (status: NetworkNode['status']) => {
    switch (status) {
      case 'vulnerable': return 'VULNERABLE';
      case 'encrypted': return 'ENCRYPTED';
      case 'honeypot': return 'HONEYPOT';
      case 'firewall': return 'FIREWALL';
      case 'offline': return 'OFFLINE';
      default: return 'UNKNOWN';
    }
  };

  return (
    <div className="font-mono text-sm">
      <div className="mb-4">
        <div className="text-green-400 mb-2">╔═══════════════ NETWORK MAP ═══════════════╗</div>
        <div className="text-green-400 mb-2">║                                           ║</div>
        
        {/* Grid */}
        {Array.from({ length: 5 }, (_, row) => (
          <div key={row} className="flex justify-center mb-1">
            <span className="text-green-400">║  </span>
            {Array.from({ length: 5 }, (_, col) => {
              const nodeIndex = row * 5 + col;
              const node = nodes[nodeIndex];
              const isConnected = connectedNode === node?.ip;
              
              if (!node) return null;
              
              return (
                <div key={col} className="mx-1">
                  <span 
                    className={`inline-block w-8 h-4 text-center rounded ${getNodeColor(node.status, isConnected)} border`}
                    title={`${node.ip} - ${getStatusDescription(node.status)}`}
                  >
                    {getNodeSymbol(node.status)}
                  </span>
                </div>
              );
            })}
            <span className="text-green-400">  ║</span>
          </div>
        ))}
        
        <div className="text-green-400 mb-2">║                                           ║</div>
        <div className="text-green-400 mb-4">╚═══════════════════════════════════════════╝</div>
      </div>

      {/* Legend */}
      <div className="mb-4">
        <div className="text-green-400 mb-2">Legend:</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center">
            <span className="inline-block w-6 h-4 text-center rounded text-red-400 bg-red-900 border mr-2">V</span>
            <span>Vulnerable</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-6 h-4 text-center rounded text-blue-400 bg-blue-900 border mr-2">E</span>
            <span>Encrypted</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-6 h-4 text-center rounded text-purple-400 bg-purple-900 border mr-2">H</span>
            <span>Honeypot</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-6 h-4 text-center rounded text-gray-400 bg-gray-800 border mr-2">F</span>
            <span>Firewall</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-6 h-4 text-center rounded text-gray-600 bg-gray-900 border mr-2">X</span>
            <span>Offline</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-6 h-4 text-center rounded text-yellow-400 bg-yellow-900 border mr-2">*</span>
            <span>Connected</span>
          </div>
        </div>
      </div>

      {/* Connected Node Info */}
      {connectedNode && (
        <div className="border border-yellow-400 p-2 rounded">
          <div className="text-yellow-400 mb-1">Connected to: {connectedNode}</div>
          {(() => {
            const node = nodes.find(n => n.ip === connectedNode);
            if (!node) return null;
            
            return (
              <div className="text-xs">
                <div>Status: {getStatusDescription(node.status)}</div>
                <div>Open Ports: {node.ports.join(', ')}</div>
                <div>Services: {node.services.join(', ')}</div>
                <div>Files Available: {node.files.length}</div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};