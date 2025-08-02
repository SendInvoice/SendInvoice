import { StrictMode } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

import './App.css';
import Recipients from './pages/Recipients';
import Invoice from './pages/Invoice';
import User from './pages/User';

function App() {
  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/recipients" element={<Recipients />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/user" element={<User />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  )
}

export default App
