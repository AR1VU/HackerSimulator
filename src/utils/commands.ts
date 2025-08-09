import { Command } from '../types/terminal';
import { NetworkNode } from '../components/NetworkMap';
import { generateNetworkNodes, getNodeFiles } from './networkGenerator';
import { generateFileSystem, FileSystemNavigator } from './filesystem';

interface CommandDefinition {
  description: string;
  execute: (args: string[], username: string) => string[] | Promise<string[]>;
  usage?: string;
}

// Simulated network state
let currentConnection: string | null = null;
let networkNodes: NetworkNode[] = [];
let lastScanTime: number = 0;
let fileSystemNavigators: Map<string, FileSystemNavigator> = new Map();

// Fake file system
const fileSystem: Record<string, string> = {
  'readme.txt': 'Welcome to the underground network.\nAccess granted to authorized personnel only.',
  'passwords.txt': 'admin:password123\nroot:toor\nguest:guest',
  'secrets.log': '[CLASSIFIED] Operation Blackhat initiated\n[CLASSIFIED] Target acquired: mainframe-7\n[CLASSIFIED] Payload deployed successfully',
  'network.conf': 'proxy_server=tor.onion.net\nencryption=AES-256\nstealth_mode=enabled',
  'exploit.py': '#!/usr/bin/env python3\n# Buffer overflow exploit\nimport socket\npayload = "A" * 1024\n# [REDACTED FOR SECURITY]'
};

// Command definitions
const commands: Record<string, CommandDefinition> = {
  help: {
    description: 'Show available commands',
    execute: () => [
      'Available commands:',
      '  help                    - Show this help message',
      '  clear                   - Clear the terminal',
      '  scan                    - Scan network for active nodes',
      '  scan-detailed           - Detailed network scan with ports',
      '  connect <ip>            - Connect to a network node',
      '  disconnect              - Disconnect from current node',
      '  cd <directory>          - Change directory (when connected)',
      '  ls                      - List directory contents',
      '  pwd                     - Print working directory',
      '  cat <file>              - Display file contents',
      '  download <file>         - Download a file from current node',
      '  downloads               - Show downloaded files',
      '  upload <file>           - Upload a file to current node',
      '  whoami                  - Display current user',
      '  ps                      - Show running processes',
      '  netstat                 - Show network connections',
      '  hack                    - Initialize hacking tools',
      '  exploit <target>        - Run exploit against target',
      '  crack <file>            - Attempt to crack encrypted file',
      '  trace <ip>              - Trace route to IP address',
      '  nmap <ip>               - Port scan target',
      '  ssh <user>@<host>       - SSH to remote host',
      '  ftp <host>              - Connect to FTP server',
      '  ping <host>             - Ping a host',
      '  date                    - Show current date and time',
      '  uname                   - System information',
      '  matrix                  - Enter the Matrix',
      '  skills                  - View your skill tree',
      '  hint                    - Get helpful tips and guidance',
      '  exit                    - Logout from system'
    ]
  },

  clear: {
    description: 'Clear the terminal screen',
    execute: () => ['CLEAR_TERMINAL']
  },

  scan: {
    description: 'Scan network for active nodes',
    execute: async (args, username) => {
      // Generate or refresh network nodes
      const now = Date.now();
      if (networkNodes.length === 0 || now - lastScanTime > 300000) { // Refresh every 5 minutes
        networkNodes = generateNetworkNodes();
        lastScanTime = now;
      }
      
      const results = [
        'Initiating network scan...',
        'Scanning subnet 192.168.0.0/24...',
        'Probing 25 hosts...',
        ''
      ];
      
      // Simulate scanning delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add network map
      results.push('NETWORK_MAP_START');
      results.push('NETWORK_MAP_END');
      results.push('');
      
      // Add summary
      const statusCounts = networkNodes.reduce((acc, node) => {
        acc[node.status] = (acc[node.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      results.push('Scan Summary:');
      results.push(`  Vulnerable: ${statusCounts.vulnerable || 0}`);
      results.push(`  Encrypted:  ${statusCounts.encrypted || 0}`);
      results.push(`  Honeypots:  ${statusCounts.honeypot || 0}`);
      results.push(`  Firewalled: ${statusCounts.firewall || 0}`);
      results.push(`  Offline:    ${statusCounts.offline || 0}`);
      results.push('');
      results.push('Use "connect <ip>" to access a node.');
      results.push('Example: connect 192.168.0.5');
      
      return results;
    }
  },

  'scan-detailed': {
    description: 'Detailed network scan with port information',
    execute: async () => {
      if (networkNodes.length === 0) {
        return ['No network data available. Run "scan" first.'];
      }
      
      const results = [
        'Detailed Network Scan Results:',
        '================================',
        ''
      ];
      
      networkNodes.forEach(node => {
        if (node.status !== 'offline') {
          results.push(`${node.ip.padEnd(15)} [${node.status.toUpperCase()}]`);
          results.push(`  Ports: ${node.ports.join(', ')}`);
          results.push(`  Services: ${node.services.join(', ')}`);
          results.push('');
        }
      });
      
      return results;
    }
  },

  connect: {
    description: 'Connect to a network node',
    usage: 'connect <ip>',
    execute: async (args) => {
      if (args.length < 1) {
        return ['Usage: connect <ip>', 'Example: connect 192.168.1.100'];
      }
      
      const targetIp = args[0];
      
      const targetNode = networkNodes.find(node => node.ip === targetIp);
      
      if (!targetNode) {
        return [`Error: Host ${targetIp} not found or unreachable`];
      }
      
      if (targetNode.status === 'offline') {
        return [`Error: Host ${targetIp} is offline`];
      }
      
      const results = [
        `Connecting to ${targetIp}...`,
        'Establishing connection...'
      ];
      
      // Different connection behavior based on node type
      if (targetNode.status === 'firewall') {
        results.push('Firewall detected...');
        results.push('Attempting to bypass...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (Math.random() < 0.3) {
          results.push('✗ Connection blocked by firewall');
          return results;
        } else {
          results.push('✓ Firewall bypassed');
        }
      } else if (targetNode.status === 'honeypot') {
        results.push('Authenticating...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        results.push('⚠️  WARNING: Honeypot detected!');
        results.push('⚠️  Your connection may be monitored');
      } else if (targetNode.status === 'encrypted') {
        results.push('Encrypted connection required...');
        results.push('Attempting handshake...');
        await new Promise(resolve => setTimeout(resolve, 1500));
        results.push('✓ Secure tunnel established');
      } else {
        results.push('Authenticating...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      currentConnection = targetIp;
      
      // Initialize file system navigator for this node
      if (!fileSystemNavigators.has(targetIp)) {
        const fileSystem = generateFileSystem(targetNode);
        fileSystemNavigators.set(targetIp, new FileSystemNavigator(fileSystem));
      }
      
      results.push(`✓ Connected to ${targetIp}`);
      results.push(`Node type: ${targetNode.status.toUpperCase()}`);
      results.push('File system initialized');
      results.push('Use "ls" to list files, "cd <dir>" to navigate, "cat <file>" to read files');
      
      return results;
    }
  },

  disconnect: {
    description: 'Disconnect from current node',
    execute: () => {
      if (!currentConnection) {
        return ['No active connection to disconnect from.'];
      }
      
      const prevConnection = currentConnection;
      currentConnection = null;
      return [
        `Disconnecting from ${prevConnection}...`,
        'Connection terminated.',
        'Returned to base terminal.'
      ];
    }
  },

  download: {
    description: 'Download a file from current node',
    usage: 'download <filename>',
    execute: async (args) => {
      if (args.length < 1) {
        return ['Usage: download <filename>', 'Example: download secrets.txt'];
      }
      
      if (!currentConnection) {
        return ['Error: Not connected to any node. Use "connect <ip>" first.'];
      }
      
      const navigator = fileSystemNavigators.get(currentConnection);
      if (!navigator) {
        return ['Error: Connection lost'];
      }
      
      const filename = args[0];
      
      const result = navigator.downloadFile(filename, currentConnection);
      
      if (result.success) {
        return [
          `Downloading ${filename} from ${currentConnection}...`,
          'Establishing data channel...',
          result.message || 'Download completed'
        ];
      } else {
        return [result.message || 'Download failed'];
      }
    }
  },

  upload: {
    description: 'Upload a file to current node',
    usage: 'upload <filename>',
    execute: async (args) => {
      if (args.length < 1) {
        return ['Usage: upload <filename>', 'Example: upload payload.exe'];
      }
      
      if (!currentConnection) {
        return ['Error: Not connected to any node. Use "connect <ip>" first.'];
      }
      
      const filename = args[0];
      const results = [
        `Uploading ${filename} to ${currentConnection}...`,
        'Checking permissions...'
      ];
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      if (Math.random() > 0.3) {
        results.push(
          `Upload complete: ${filename}`,
          'File transferred successfully'
        );
      } else {
        results.push('Error: Upload failed - insufficient privileges');
      }
      
      return results;
    }
  },

  cat: {
    description: 'Display file contents',
    usage: 'cat <filename>',
    execute: (args) => {
      if (args.length < 1) {
        return ['Usage: cat <filename>', 'Example: cat readme.txt'];
      }
      
      const filename = args[0];
      
      if (!currentConnection) {
        // Check local files first
        if (fileSystem[filename]) {
          return ['', fileSystem[filename], ''];
        }
        return [`cat: ${filename}: No such file or directory`];
      }
      
      // Use file system navigator for connected nodes
      const navigator = fileSystemNavigators.get(currentConnection);
      if (navigator) {
        const result = navigator.readFile(filename);
        if (result.success) {
          return ['', result.message || '', ''];
        } else {
          return [result.message || `cat: ${filename}: No such file or directory`];
        }
      }
      
      return [`cat: ${filename}: No such file or directory`];
    }
  },

  ls: {
    description: 'List directory contents',
    execute: () => {
      if (!currentConnection) {
        // Show local files
        const files = Object.keys(fileSystem);
        const results = ['Local directory contents:', 'total ' + files.length];
        
        files.forEach(file => {
          const size = Math.floor(Math.random() * 10000 + 1000);
          const date = 'Jan 15 12:' + String(Math.floor(Math.random() * 60)).padStart(2, '0');
          results.push(`-rw-r--r-- 1 root root ${size.toString().padStart(8)} ${date} ${file}`);
        });
        
        return results;
      }
      
      // Use file system navigator for connected nodes
      const navigator = fileSystemNavigators.get(currentConnection);
      if (navigator) {
        return navigator.listDirectory();
      }
      
      return ['Error: Connection lost'];
    }
  },

  cd: {
    description: 'Change directory',
    usage: 'cd <directory>',
    execute: (args) => {
      if (!currentConnection) {
        return ['cd: command only available when connected to a remote node'];
      }
      
      const navigator = fileSystemNavigators.get(currentConnection);
      if (!navigator) {
        return ['Error: Connection lost'];
      }
      
      const path = args.length > 0 ? args[0] : '/';
      const result = navigator.changeDirectory(path);
      
      if (result.success) {
        return [`Changed directory to: ${navigator.getCurrentPath()}`];
      } else {
        return [result.message || 'cd: failed to change directory'];
      }
    }
  },

  pwd: {
    description: 'Print working directory',
    execute: () => {
      if (!currentConnection) {
        return ['/home/hacker'];
      }
      
      const navigator = fileSystemNavigators.get(currentConnection);
      if (navigator) {
        return [navigator.getCurrentPath()];
      }
      
      return ['/'];
    }
  },

  exploit: {
    description: 'Run exploit against target',
    usage: 'exploit <target>',
    execute: async (args) => {
      if (args.length < 1) {
        return ['Usage: exploit <target>', 'Example: exploit 192.168.1.100'];
      }
      
      const target = args[0];
      const results = [
        `Launching exploit against ${target}...`,
        'Loading payload...',
        'Scanning for vulnerabilities...'
      ];
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (Math.random() > 0.4) {
        results.push(
          '✓ Vulnerability found: Buffer overflow in service',
          '✓ Exploit successful!',
          '✓ Root access gained'
        );
      } else {
        results.push(
          '✗ No exploitable vulnerabilities found',
          '✗ Target appears to be patched'
        );
      }
      
      return results;
    }
  },

  crack: {
    description: 'Attempt to crack encrypted file',
    usage: 'crack <filename>',
    execute: async (args) => {
      if (args.length < 1) {
        return ['Usage: crack <filename>', 'Example: crack encrypted.zip'];
      }
      
      const filename = args[0];
      const results = [
        `Attempting to crack ${filename}...`,
        'Initializing dictionary attack...',
        'Trying common passwords...'
      ];
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      if (Math.random() > 0.6) {
        results.push(
          '✓ Password found: admin123',
          '✓ File decrypted successfully'
        );
      } else {
        results.push(
          '✗ Crack attempt failed',
          '✗ Password not found in dictionary'
        );
      }
      
      return results;
    }
  },

  nmap: {
    description: 'Port scan target',
    usage: 'nmap <ip>',
    execute: async (args) => {
      if (args.length < 1) {
        return ['Usage: nmap <ip>', 'Example: nmap 192.168.1.100'];
      }
      
      const target = args[0];
      const results = [
        `Starting Nmap scan on ${target}...`,
        'Scanning ports 1-1000...'
      ];
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const openPorts = [22, 80, 443, 8080, 3389].filter(() => Math.random() > 0.5);
      
      results.push('', 'PORT     STATE    SERVICE');
      openPorts.forEach(port => {
        const services = { 22: 'ssh', 80: 'http', 443: 'https', 8080: 'http-proxy', 3389: 'rdp' };
        results.push(`${port}/tcp   open     ${services[port as keyof typeof services] || 'unknown'}`);
      });
      
      results.push('', `Nmap scan complete. ${openPorts.length} open ports found.`);
      return results;
    }
  },

  trace: {
    description: 'Trace route to IP address',
    usage: 'trace <ip>',
    execute: async (args) => {
      if (args.length < 1) {
        return ['Usage: trace <ip>', 'Example: trace 8.8.8.8'];
      }
      
      const target = args[0];
      const results = [`Tracing route to ${target}...`, ''];
      
      const hops = [
        '192.168.1.1',
        '10.0.0.1',
        '203.0.113.1',
        '198.51.100.1',
        target
      ];
      
      for (let i = 0; i < hops.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const ms = Math.floor(Math.random() * 50 + 10);
        results.push(`${(i + 1).toString().padStart(2)} ${hops[i].padEnd(15)} ${ms}ms`);
      }
      
      results.push('', 'Trace complete.');
      return results;
    }
  },

  whoami: {
    description: 'Display current user',
    execute: (args, username) => [
      currentConnection ? `root@${currentConnection}` : `${username}@matrix`
    ]
  },

  date: {
    description: 'Show current date and time',
    execute: () => [new Date().toString()]
  },

  uname: {
    description: 'System information',
    execute: () => ['Linux matrix-terminal 5.4.0-hacker #1 SMP x86_64 GNU/Linux']
  },

  ps: {
    description: 'Show running processes',
    execute: () => [
      'PID  TTY      TIME     CMD',
      '1    ?        00:00:01 systemd',
      '123  pts/0    00:00:00 bash',
      '456  pts/0    00:00:00 hack_daemon',
      '789  pts/0    00:00:00 matrix_client',
      '1337 pts/0    00:00:00 crypto_miner'
    ]
  },

  netstat: {
    description: 'Show network connections',
    execute: () => [
      'Active Internet connections (w/o servers)',
      'Proto Recv-Q Send-Q Local Address      Foreign Address    State',
      'tcp        0      0 192.168.1.100:22   203.0.113.0:54321  ESTABLISHED',
      'tcp        0      0 192.168.1.100:443  198.51.100.0:80    TIME_WAIT',
      'tcp        0      0 192.168.1.100:8080 192.0.2.0:1337     SYN_SENT'
    ]
  },

  hack: {
    description: 'Initialize hacking tools',
    execute: () => [
      'Initializing hacking tools...',
      'Loading exploits database... [████████████████████] 100%',
      'Starting port scanner... [████████████████████] 100%',
      'Activating stealth mode... [████████████████████] 100%',
      '',
      '🔓 HACKING TOOLKIT READY',
      'Type "help" for available commands'
    ]
  },

  matrix: {
    description: 'Enter the Matrix',
    execute: () => [
      'Connecting to the Matrix...',
      'Bypassing security protocols... [████████████████████] 100%',
      '',
      '01001000 01100101 01101100 01101100 01101111',
      '01001110 01100101 01101111',
      '',
      'Welcome to the Matrix, Neo.',
      'The choice is yours...'
    ]
  },

  skills: {
    description: 'View your skill tree',
    execute: () => [
      '╔═══════════════ SKILL TREE ═══════════════╗',
      '║                                          ║',
      '║  🔧 Programming    ████████░░ 80%        ║',
      '║  🔒 Cryptography   ██████░░░░ 60%        ║',
      '║  🌐 Networking     █████████░ 90%        ║',
      '║  🛡️  Security       ███████░░░ 70%        ║',
      '║  🔍 Forensics      ████░░░░░░ 40%        ║',
      '║  🎯 Social Eng.    ██████████ 100%       ║',
      '║                                          ║',
      '╚══════════════════════════════════════════╝'
    ]
  },

  hint: {
    description: 'Get helpful tips and guidance',
    execute: () => {
      const hints = [
        '🔍 NETWORK EXPLORATION TIPS:',
        '  • Start with "scan" to discover network nodes',
        '  • Look for vulnerable (V) nodes - they\'re easier to access',
        '  • Use "connect <ip>" to access a specific node',
        '  • Try "ls" and "cat <file>" once connected to explore files',
        '',
        '⚡ QUICK START GUIDE:',
        '  1. Type "scan" to see the network map',
        '  2. Find a red "V" node (vulnerable)',
        '  3. Type "connect 192.168.0.X" (replace X with node number)',
        '  4. Use "ls" to see available files',
        '  5. Use "cat <filename>" to read interesting files',
        '',
        '🛡️ NODE TYPES EXPLAINED:',
        '  • V (Red) = Vulnerable - Easy to access, may contain valuable data',
        '  • E (Blue) = Encrypted - Secure but may have useful files',
        '  • H (Purple) = Honeypot - Fake system, will detect intrusion',
        '  • F (Gray) = Firewall - Protected, harder to access',
        '  • X (Dark) = Offline - Cannot connect',
        '',
        '🎯 USEFUL COMMANDS:',
        '  • "nmap <ip>" - Scan ports on a specific target',
      ]
      '  • "cd <directory>" - Navigate to a directory',
      '  • "pwd" - Show current directory path',
        '  • "exploit <ip>" - Attempt to compromise a system',
        '  • "download <file>" - Download files from connected node',
        '  • "disconnect" - Return to base terminal',
        '',
        '💡 Pro tip: Each node type has different files and security levels!'
      '💡 Pro tip: Each node has a full file system to explore!',
      '💡 Navigate with cd, explore with ls, read with cat, download with download!'
      
      return hints;
    }
  },

  downloads: {
    description: 'Show downloaded files',
    execute: () => {
      const allDownloads: { filename: string; content: string; source: string; timestamp: string }[] = [];
      
      // Collect downloads from all navigators
      fileSystemNavigators.forEach((navigator) => {
        allDownloads.push(...navigator.getDownloadedFiles());
      });
      
      if (allDownloads.length === 0) {
        return ['No files downloaded yet.', 'Use "download <filename>" while connected to a node to download files.'];
      }
      
      const results = ['Downloaded Files:', '================', ''];
      
      allDownloads.forEach((file, index) => {
        const date = new Date(file.timestamp).toLocaleString();
        results.push(`${index + 1}. ${file.filename}`);
        results.push(`   Source: ${file.source}`);
        results.push(`   Downloaded: ${date}`);
        results.push(`   Size: ${file.content.length} bytes`);
        results.push('');
      });
      
      results.push(`Total: ${allDownloads.length} files downloaded`);
      return results;
    }
  },

  ping: {
    description: 'Ping a host',
    usage: 'ping <host>',
    execute: async (args) => {
      if (args.length < 1) {
        return ['Usage: ping <host>', 'Example: ping google.com'];
      }
      
      const host = args[0];
      const results = [`PING ${host} (${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}): 56 data bytes`];
      
      for (let i = 0; i < 4; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const ms = Math.floor(Math.random() * 50 + 10);
        results.push(`64 bytes from ${host}: icmp_seq=${i} time=${ms}ms`);
      }
      
      results.push('', `--- ${host} ping statistics ---`, '4 packets transmitted, 4 received, 0% packet loss');
      return results;
    }
  },

  ssh: {
    description: 'SSH to remote host',
    usage: 'ssh <user>@<host>',
    execute: (args) => {
      if (args.length < 1) {
        return ['Usage: ssh <user>@<host>', 'Example: ssh root@192.168.1.100'];
      }
      
      return [
        `Connecting to ${args[0]}...`,
        'Connection refused: Permission denied (publickey,password)',
        'Authentication failed.'
      ];
    }
  },

  ftp: {
    description: 'Connect to FTP server',
    usage: 'ftp <host>',
    execute: (args) => {
      if (args.length < 1) {
        return ['Usage: ftp <host>', 'Example: ftp ftp.example.com'];
      }
      
      return [
        `Connecting to ${args[0]}...`,
        'Connected to ftp server.',
        'Login required. Use "download" and "upload" commands.'
      ];
    }
  },

  exit: {
    description: 'Logout from system',
    execute: () => ['Connection terminated. Goodbye, hacker.']
  }
};

export const processCommand = async (input: string, username: string): Promise<string[] | { output: string[], networkNodes?: NetworkNode[], connectedNode?: string }> => {
  const trimmedInput = input.trim();
  if (!trimmedInput) return [];
  
  const parts = trimmedInput.split(' ');
  const commandName = parts[0].toLowerCase();
  const args = parts.slice(1);
  
  const command = commands[commandName];
  
  if (!command) {
    return [`Command not found: ${commandName}`, 'Type "help" for available commands.'];
  }
  
  try {
    const result = await command.execute(args, username);
    
    // Check if this is a scan command that should return network data
    if (commandName === 'scan' && Array.isArray(result)) {
      return {
        output: result,
        networkNodes: networkNodes,
        connectedNode: currentConnection || undefined
      };
    }
    
    return Array.isArray(result) ? result : [result];
  } catch (error) {
    return [`Error executing command: ${commandName}`, 'Please try again.'];
  }
};

export const getCommandSuggestions = (input: string): string[] => {
  const commandNames = Object.keys(commands);
  const trimmedInput = input.toLowerCase().trim();
  
  if (!trimmedInput) return [];
  
  return commandNames.filter(cmd => 
    cmd.toLowerCase().startsWith(trimmedInput)
  ).sort();
};

export const getAllCommands = (): string[] => {
  return Object.keys(commands).sort();
};

export const getCurrentTime = (): string => {
  const now = new Date();
  return now.toTimeString().split(' ')[0];
};

export const getCurrentConnection = (): string | null => {
  return currentConnection;
};

export const getNetworkNodes = (): NetworkNode[] => {
  return networkNodes;
};