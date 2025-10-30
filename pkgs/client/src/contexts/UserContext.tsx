import { createContext, useEffect, useState } from "react";


import { SendInvoiceClient } from "../services/SendInvoice";

import type { JSX } from "react";
import type { User } from "../services/SendInvoice/Auth";

export type Props = {
  children: JSX.Element | JSX.Element[];
};

export interface IUserContext {
  user: User | null;
  token: string | null;
  login(email: string): Promise<void>;
  logout(): void;
  resumeSession(): Promise<void>;
}

export const UserContext = createContext<IUserContext | null>(null);

UserContext.displayName = "UserContext";

export function UserContextProvider({ children }: Props): JSX.Element {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState <string | null>(null);

  useEffect(() => {
    resumeSession();
  },[]);

  const login = async (email: string) => {
    const sendInvoiceClient = new SendInvoiceClient(
      new URL("http://127.0.0.1:8080"),
    );
    const tokenPayload = await sendInvoiceClient.auth.login({ email });
    setToken(tokenPayload.token);
    const user = await sendInvoiceClient.auth.whoAmI(tokenPayload.token);

    localStorage.setItem("userToken", tokenPayload.token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    setUser(null);
  };

  const resumeSession = async () => {
    const token = localStorage.getItem("userToken");

    if (token) {
      const sendInvoiceClient = new SendInvoiceClient(
        new URL("http://127.0.0.1:8080"),
      );
      const user = await sendInvoiceClient.auth.whoAmI(token);

      setUser(user);
      setToken(token);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, token, login, logout, resumeSession }}
    >
      {children}
    </UserContext.Provider>
  );
}
