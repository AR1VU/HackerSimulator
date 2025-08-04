import { Command } from '../types/terminal';

interface CommandDefinition {
  description: string;
  execute: (args: string[], username: string) => string[] | Promise<string[]>;
  usage?: string;
}

// Simulated network state
let currentConnection: string | null = null;
const networkNodes = [
  '192.168.1.1',
  '192.168.1.100',
  '10.0.0.1',
  '172.16.0.50',
  '203.0.113.42'
];

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
      '  connect <ip>            - Connect to a network node',
      '  disconnect              - Disconnect from current node',
      '  download <file>         - Download a file from current node',
      '  upload <file>           - Upload a file to current node',
      '  cat <file>              - Display file contents',
      '  ls                      - List directory contents',
      '  pwd                     - Print working directory',
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
      '  exit                    - Logout from system'
    ]
  },

  clear: {
    description: 'Clear the terminal screen',
    execute: () => ['CLEAR_TERMINAL']
  },

  scan: {
    description: 'Scan network for active nodes',
    execute: async () => {
      const results = [
        'Initiating network scan...',
        'Scanning subnet 192.168.1.0/24...',
        ''
      ];
      
      // Simulate scanning delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      results.push('Active nodes discovered:');
      networkNodes.forEach((ip, index) => {
        const status = Math.random() > 0.3 ? 'ONLINE' : 'FILTERED';
        const ports = status === 'ONLINE' ? '[22,80,443]' : '[BLOCKED]';
        results.push(`  ${ip.padEnd(15)} ${status.padEnd(10)} ${ports}`);
      });
      
      results.push('', `Scan complete. ${networkNodes.length} nodes found.`);
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
      
      if (!networkNodes.includes(targetIp)) {
        return [`Error: Host ${targetIp} not found or unreachable`];
      }
      
      const results = [
        `Connecting to ${targetIp}...`,
        'Establishing secure tunnel...',
        'Bypassing firewall...',
        'Authenticating...'
      ];
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      currentConnection = targetIp;
      results.push(`✓ Connected to ${targetIp}`, `You are now connected to node ${targetIp}`);
      
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
      
      const filename = args[0];
      const results = [
        `Downloading ${filename} from ${currentConnection}...`,
        'Establishing data channel...'
      ];
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (Math.random() > 0.2) {
        results.push(
          `Transfer complete: ${filename} (${Math.floor(Math.random() * 1000 + 100)} KB)`,
          `File saved to /downloads/${filename}`
        );
      } else {
        results.push('Error: File not found or access denied');
      }
      
      return results;
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
      
      if (fileSystem[filename]) {
        return ['', fileSystem[filename], ''];
      } else {
        return [`cat: ${filename}: No such file or directory`];
      }
    }
  },

  ls: {
    description: 'List directory contents',
    execute: () => {
      const files = Object.keys(fileSystem);
      const results = ['total ' + files.length];
      
      files.forEach(file => {
        const size = Math.floor(Math.random() * 10000 + 1000);
        const date = 'Jan 15 12:' + String(Math.floor(Math.random() * 60)).padStart(2, '0');
        results.push(`-rw-r--r-- 1 root root ${size.toString().padStart(8)} ${date} ${file}`);
      });
      
      return results;
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

  // Keep existing commands
  pwd: {
    description: 'Print working directory',
    execute: () => [currentConnection ? `/remote/${currentConnection}` : '/home/hacker']
  },

  whoami: {
    description: 'Display current user',
    execute: (args, username) => [`${username}@matrix`]
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

export const processCommand = async (input: string, username: string): Promise<string[]> => {
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
    return result;
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