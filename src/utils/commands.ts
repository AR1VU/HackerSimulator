import { Command } from '../types/terminal';

export const processCommand = (input: string, username: string): string[] => {
  const command = input.toLowerCase().trim();
  const args = command.split(' ');
  
  switch (args[0]) {
    case 'help':
      return [
        'Available commands:',
        '  help          - Show this help message',
        '  clear         - Clear the terminal',
        '  whoami        - Display current user',
        '  ls            - List directory contents',
        '  cat           - Display file contents',
        '  pwd           - Print working directory',
        '  date          - Show current date and time',
        '  uname         - System information',
        '  ps            - Show running processes',
        '  netstat       - Network connections',
        '  hack          - Initialize hacking tools',
        '  matrix        - Enter the Matrix',
        '  skills        - View your skill tree',
        '  exit          - Logout from system'
      ];
      
    case 'clear':
      return ['CLEAR_TERMINAL'];
      
    case 'whoami':
      return [`${username}@matrix`];
      
    case 'ls':
      return [
        'total 8',
        'drwxr-xr-x  2 root root 4096 Jan 15 12:00 bin',
        'drwxr-xr-x  3 root root 4096 Jan 15 12:00 boot', 
        'drwxr-xr-x  2 root root 4096 Jan 15 12:00 dev',
        'drwxr-xr-x  2 root root 4096 Jan 15 12:00 etc',
        'drwxr-xr-x  3 root root 4096 Jan 15 12:00 home',
        'drwxr-xr-x  2 root root 4096 Jan 15 12:00 lib',
        'drwxr-xr-x  2 root root 4096 Jan 15 12:00 mnt',
        'drwxr-xr-x  2 root root 4096 Jan 15 12:00 opt',
        'drwxr-xr-x  2 root root 4096 Jan 15 12:00 proc',
        'drwx------  2 root root 4096 Jan 15 12:00 root',
        'drwxr-xr-x  2 root root 4096 Jan 15 12:00 sbin',
        'drwxr-xr-x  2 root root 4096 Jan 15 12:00 tmp',
        'drwxr-xr-x  2 root root 4096 Jan 15 12:00 usr',
        'drwxr-xr-x  2 root root 4096 Jan 15 12:00 var'
      ];
      
    case 'pwd':
      return ['/home/hacker'];
      
    case 'date':
      return [new Date().toString()];
      
    case 'uname':
      return ['Linux tycoon-terminal 5.4.0-hacker #1 SMP x86_64 GNU/Linux'];
      
    case 'ps':
      return [
        'PID  TTY      TIME     CMD',
        '1    ?        00:00:01 systemd',
        '123  pts/0    00:00:00 bash',
        '456  pts/0    00:00:00 hack_daemon',
        '789  pts/0    00:00:00 matrix_client',
        '1337 pts/0    00:00:00 crypto_miner'
      ];
      
    case 'netstat':
      return [
        'Active Internet connections (w/o servers)',
        'Proto Recv-Q Send-Q Local Address      Foreign Address    State',
        'tcp        0      0 192.168.1.100:22   203.0.113.0:54321  ESTABLISHED',
        'tcp        0      0 192.168.1.100:443  198.51.100.0:80    TIME_WAIT',
        'tcp        0      0 192.168.1.100:8080 192.0.2.0:1337     SYN_SENT'
      ];
      
    case 'cat':
      if (args[1]) {
        return [
          `cat: ${args[1]}: Permission denied`,
          '[CLASSIFIED DOCUMENT]',
          'Access Level: RESTRICTED'
        ];
      }
      return ['cat: missing file operand'];
      
    case 'hack':
      return [
        'Initializing hacking tools...',
        'Loading exploits database... [████████████████████] 100%',
        'Starting port scanner... [████████████████████] 100%',
        'Activating stealth mode... [████████████████████] 100%',
        '',
        '🔓 HACKING TOOLKIT READY',
        'Type "help" for available commands'
      ];
      
    case 'matrix':
      return [
        'Connecting to the Matrix...',
        'Bypassing security protocols... [████████████████████] 100%',
        '',
        '01001000 01100101 01101100 01101100 01101111',
        '01001110 01100101 01101111',
        '',
        'Welcome to the Matrix, Neo.',
        'The choice is yours...'
      ];
      
    case 'skills':
      return [
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
      ];
      
    case 'exit':
      return ['Connection terminated. Goodbye, hacker.'];
      
    default:
      return [`Command not found: ${command}`, 'Type "help" for available commands.'];
  }
};

export const getCurrentTime = (): string => {
  const now = new Date();
  return now.toTimeString().split(' ')[0];
};