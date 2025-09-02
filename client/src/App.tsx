import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import LandingPage from './components/Landing/LandingPage';

function App() {
  return (
    <SocketProvider>
      <AuthProvider>
          <div className="App">
            <LandingPage />
          </div>
      </AuthProvider>
    </SocketProvider>
  );
}

export default App;
