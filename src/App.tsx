import React, { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Terminal } from './components/Terminal';
import { LoginCredentials } from './types/terminal';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (credentials: LoginCredentials) => {
    setUsername(credentials.username);
    setIsLoggedIn(true);
  };

  const handleExit = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <Terminal username={username} onExit={handleExit} />
      )}
    </div>
  );
}

export default App;