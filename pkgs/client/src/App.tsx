import { StrictMode } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

import './App.css';

function App() {
  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  )
}

export default App
