export interface FileSystemNode {
  [key: string]: string | FileSystemNode;
}

export interface FileSystemState {
  currentPath: string[];
  downloadedFiles: { filename: string; content: string; source: string; timestamp: string }[];
}

export interface NavigationResult {
  success: boolean;
  message?: string;
  content?: FileSystemNode;
}