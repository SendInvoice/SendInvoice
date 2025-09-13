import { StrictMode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

import "./App.css";
import Invoice from "./pages/Invoice";
import User from "./pages/User";
import NewRecipients from "./pages/Recipient/New Recipient";
import UpdateRecipient from "./pages/Recipient/UpdateRecipient";
import Recipient from "./pages/Recipient";

import { UserContext, UserContextProvider } from "./contexts/UserContext";

function App() {
  return (
    <StrictMode>
      <UserContextProvider>
        <UserContext.Consumer>
          {(userContext) => (
            <BrowserRouter>
              {userContext?.user ? (
                <Routes>
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route
                    path="/recipient"
                    element={<Recipient recipients={[]} />}
                  />
                  <Route
                    path="/update-recipient/:id"
                    element={<UpdateRecipient />}
                  />
                  <Route path="/new-recipient" element={<NewRecipients />} />
                  <Route path="/invoice" element={<Invoice />} />
                  <Route path="/user" element={<User />} />
                </Routes>
              ) : (
                <Routes>
                  <Route path="/" element={<Navigate to="/auth" replace />} />
                  <Route path="/auth" element={<Auth />} />
                </Routes>
              )}
            </BrowserRouter>
          )}
        </UserContext.Consumer>
      </UserContextProvider>
    </StrictMode>
  );
}

export default App;
