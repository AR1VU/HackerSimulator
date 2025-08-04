export interface Command {
  input: string;
  output: string[];
  timestamp: string;
}

export interface TerminalState {
  currentInput: string;
  commandHistory: Command[];
  commandHistoryIndex: number;
  inputHistory: string[];
  isLoggedIn: boolean;
  username: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}