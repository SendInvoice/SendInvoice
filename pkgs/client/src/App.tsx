import { StrictMode } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

import './App.css';
import Invoice from './pages/Invoice';
import User from './pages/User';
import NewRecipients from './pages/Recipients/New Recipient';
import UpdateRecipients from './pages/Recipients/Update Recipient';

function App() {
  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={ <Dashboard /> } />
          <Route path="/auth" element={ <Auth /> } />
          <Route path="/update-recipient" element={ <UpdateRecipients /> } />
          <Route path="/new-recipients" element={ <NewRecipients /> } />
          <Route path="/invoice" element={ <Invoice /> } />
          <Route path="/user" element={ <User /> } />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  )
}

export default App
