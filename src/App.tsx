// import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { CreateGame } from './pages/CreateGame';
import { GameRoom } from './pages/GameRoom';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create" element={<CreateGame />} />
        <Route path="/game/:gameId" element={<GameRoom />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
