export interface Command {
  input: string;
  output: string[];
  timestamp: string;
}

export interface TerminalState {
  currentInput: string;
  commandHistory: Command[];
  isLoggedIn: boolean;
  username: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}