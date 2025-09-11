import { StrictMode } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

import './App.css';
import Invoice from './pages/Invoice';
import User from './pages/User';
import NewRecipients from './pages/Recipient/New Recipient';
import UpdateRecipients from './pages/Recipient/Update Recipient';
import Recipient from './pages/Recipient';

function App() {
  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={ <Dashboard /> } />
          <Route path="/auth" element={ <Auth /> } />
          <Route path="/recipient" element={ <Recipient recipients={[]}/> } />
          <Route path="/update-recipient" element={ <UpdateRecipients /> } />
          <Route path="/new-recipient" element={ <NewRecipients /> } />
          <Route path="/invoice" element={ <Invoice /> } />
          <Route path="/user" element={ <User /> } />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  )
}

export default App
