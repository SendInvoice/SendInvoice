import { StrictMode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/templates/AppLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Invoice from "./pages/Invoice";
import User from "./pages/User";
import NewRecipients from "./pages/Recipient/New Recipient";
import Recipient from "./pages/Recipient";

import "./App.css";

import { UserContextProvider } from "./contexts/UserContext";
import AuthLayout from "./components/templates/AuthLayout";

function App() {
  return (
    <StrictMode>
      <UserContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/recipient"
                element={<Recipient recipients={[]} />}
              />
              {/* <Route
                        path="/update-recipient/:id"
                        element={<UpdateRecipient />}
                      /> */}
              <Route path="/new-recipient" element={<NewRecipients />} />
              <Route path="/invoice" element={<Invoice />} />
              <Route path="/user" element={<User />} />
            </Route>
            <Route path="/" element={<AuthLayout />}>
              <Route path="/" element={<Navigate to="/auth" />} />
              <Route path="/auth" element={<Auth />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserContextProvider>
    </StrictMode>
  );
}

export default App;
