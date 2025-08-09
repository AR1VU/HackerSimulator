import { NetworkNode } from '../components/NetworkMap';

export const generateNetworkNodes = (): NetworkNode[] => {
  const nodes: NetworkNode[] = [];
  const statuses: NetworkNode['status'][] = ['vulnerable', 'encrypted', 'honeypot', 'firewall', 'offline'];
  
  // Common services and files for different node types
  const servicesByStatus = {
    vulnerable: ['ssh', 'ftp', 'telnet', 'http'],
    encrypted: ['https', 'ssh', 'vpn'],
    honeypot: ['ssh', 'ftp', 'http', 'smtp'],
    firewall: ['https', 'ssh'],
    offline: []
  };

  const filesByStatus = {
    vulnerable: ['passwords.txt', 'user_data.db', 'config.ini', 'backup.zip', 'logs.txt'],
    encrypted: ['encrypted.dat', 'keys.pem', 'secure_config.enc'],
    honeypot: ['fake_secrets.txt', 'decoy_data.csv', 'honeypot.log', 'trap_files.zip'],
    firewall: ['firewall.conf', 'access.log', 'blocked_ips.txt'],
    offline: []
  };

  const portsByStatus = {
    vulnerable: [21, 22, 23, 80, 443, 3389],
    encrypted: [22, 443, 1194],
    honeypot: [21, 22, 25, 80, 443],
    firewall: [22, 443],
    offline: []
  };

  for (let i = 1; i <= 25; i++) {
    const ip = `192.168.0.${i}`;
    
    // Distribute statuses with some randomness but ensure variety
    let status: NetworkNode['status'];
    if (i <= 8) {
      status = 'vulnerable';
    } else if (i <= 12) {
      status = 'encrypted';
    } else if (i <= 16) {
      status = 'honeypot';
    } else if (i <= 20) {
      status = 'firewall';
    } else {
      status = 'offline';
    }

    // Add some randomness
    if (Math.random() < 0.3) {
      status = statuses[Math.floor(Math.random() * statuses.length)];
    }

    const services = [...servicesByStatus[status]];
    const files = [...filesByStatus[status]];
    const ports = [...portsByStatus[status]];

    // Add some random variation
    if (status !== 'offline' && Math.random() < 0.4) {
      const extraServices = ['mysql', 'postgresql', 'redis', 'mongodb', 'apache', 'nginx'];
      const extraPorts = [3306, 5432, 6379, 27017, 8080, 8443];
      const randomService = extraServices[Math.floor(Math.random() * extraServices.length)];
      const randomPort = extraPorts[Math.floor(Math.random() * extraPorts.length)];
      
      if (!services.includes(randomService)) {
        services.push(randomService);
      }
      if (!ports.includes(randomPort)) {
        ports.push(randomPort);
      }
    }

    nodes.push({
      ip,
      status,
      ports: ports.sort((a, b) => a - b),
      services,
      files
    });
  }

  return nodes;
};

export const getNodeFiles = (ip: string, nodes: NetworkNode[]): Record<string, string> => {
  const node = nodes.find(n => n.ip === ip);
  if (!node) return {};

  const fileContents: Record<string, string> = {};

  node.files.forEach(filename => {
    switch (filename) {
      case 'passwords.txt':
        fileContents[filename] = `admin:password123\nroot:toor\nuser:123456\nguest:guest\nservice:service123`;
        break;
      case 'user_data.db':
        fileContents[filename] = `[DATABASE DUMP]\nUSER_ID | USERNAME | EMAIL\n1 | admin | admin@company.com\n2 | john_doe | john@company.com\n3 | jane_smith | jane@company.com`;
        break;
      case 'config.ini':
        fileContents[filename] = `[DATABASE]\nhost=localhost\nport=3306\nuser=root\npassword=admin123\n\n[API]\nkey=sk_live_abc123xyz789\nendpoint=https://api.internal.com`;
        break;
      case 'backup.zip':
        fileContents[filename] = `[COMPRESSED FILE]\nContains: system_backup_2024.tar.gz\nSize: 2.3GB\nEncryption: None\nCreated: 2024-01-15`;
        break;
      case 'logs.txt':
        fileContents[filename] = `[2024-01-20 10:30:15] Login attempt from 203.0.113.42\n[2024-01-20 10:31:22] Failed login: admin\n[2024-01-20 10:32:01] Successful login: root\n[2024-01-20 11:15:33] File access: /etc/passwd`;
        break;
      case 'encrypted.dat':
        fileContents[filename] = `[ENCRYPTED DATA]\n4f8a2c9e1b7d3a5f6e8c9b2a4d7f1e3c\n9b2a4d7f1e3c4f8a2c9e1b7d3a5f6e8c\n[AES-256 ENCRYPTION DETECTED]\nKey required for decryption`;
        break;
      case 'keys.pem':
        fileContents[filename] = `-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7...\n[TRUNCATED FOR SECURITY]\n-----END PRIVATE KEY-----`;
        break;
      case 'secure_config.enc':
        fileContents[filename] = `[ENCRYPTED CONFIGURATION]\nEncryption: AES-256-CBC\nSalt: a1b2c3d4e5f6\nIV: 1234567890abcdef\nData: [ENCRYPTED]`;
        break;
      case 'fake_secrets.txt':
        fileContents[filename] = `TOP SECRET DOCUMENTS\n===================\nOperation Codename: BLUE_FALCON\nAgent: 007\nLocation: [REDACTED]\n\n[WARNING: THIS IS A HONEYPOT]`;
        break;
      case 'decoy_data.csv':
        fileContents[filename] = `name,ssn,credit_card\nJohn Fake,000-00-0000,0000-0000-0000-0000\nJane Decoy,111-11-1111,1111-1111-1111-1111\n\n[HONEYPOT DATA - NOT REAL]`;
        break;
      case 'honeypot.log':
        fileContents[filename] = `[HONEYPOT LOG]\n[2024-01-20 14:22:15] Intrusion detected from ${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}\n[2024-01-20 14:22:16] Logging attacker behavior\n[2024-01-20 14:22:17] Alerting security team`;
        break;
      case 'firewall.conf':
        fileContents[filename] = `# Firewall Configuration\nDROP INPUT from 0.0.0.0/0 to port 23\nALLOW INPUT from 192.168.0.0/24 to port 22\nDROP INPUT from 0.0.0.0/0 to port 21\nALLOW OUTPUT to 0.0.0.0/0`;
        break;
      case 'access.log':
        fileContents[filename] = `192.168.0.100 - - [20/Jan/2024:10:30:15] "GET /admin HTTP/1.1" 403 1234\n192.168.0.101 - - [20/Jan/2024:10:31:22] "POST /login HTTP/1.1" 200 567\n203.0.113.42 - - [20/Jan/2024:10:32:01] "GET /secrets HTTP/1.1" 404 890`;
        break;
      case 'blocked_ips.txt':
        fileContents[filename] = `# Blocked IP Addresses\n203.0.113.42 - Multiple failed login attempts\n198.51.100.123 - Port scanning detected\n192.0.2.99 - Malicious payload detected`;
        break;
      default:
        fileContents[filename] = `[FILE CONTENT]\nFilename: ${filename}\nNode: ${ip}\nAccess Level: Restricted\n\nThis is a simulated file in the network node.`;
    }
  });

  return fileContents;
};