import { Route, Routes } from 'react-router-dom';

import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/Auth" element={ <Auth/> }/>
      <Route path="/Dashboard" element={ <Dashboard/> } />
    </Routes>
  )
}

export default App
