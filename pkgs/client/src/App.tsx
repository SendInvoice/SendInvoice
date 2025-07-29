import { StrictMode } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

import './App.css';
import Recipients from './pages/Recipients';
import Invoice from './pages/Invoice';

function App() {
  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/recipients" element={<Recipients />} />
          <Route path="/invoice" element={<Invoice />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  )
}

export default App
