import { createContext, useState } from "react";

import type { JSX } from "react";
import type { User } from "../services/SendInvoice/Auth";
import { SendInvoiceClient } from "../services/SendInvoice";

export type Props = {
  children: JSX.Element | JSX.Element[];
};

export interface IUserContext {
  user: User | null;
  login(email: string): Promise<void>;
  logout(): void;
  resumeSession(): Promise<void>;
}

export const UserContext = createContext<IUserContext | null>(null);

UserContext.displayName = "UserContext";

export function UserContextProvider({ children }: Props): JSX.Element {
  const [user, setUser] = useState(null);

  const login = async (email: string) => {
    const sendInvoiceClient = new SendInvoiceClient(new URL("http://127.0.0.1:8080"));
    const token = await sendInvoiceClient.auth.login({ email });
    const user = await sendInvoiceClient.auth.whoAmI(token.token);

    localStorage.setItem('userToken', token.token);
    setUser(user);
  };

    const logout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
  };

  const resumeSession = async () => {
    const token = localStorage.getItem('userToken');
    if (token) {
      const sendInvoiceClient = new SendInvoiceClient(new URL("http://127.0.0.1:8080"));
      const user = await sendInvoiceClient.auth.whoAmI(token);
      setUser(user);
    }
  }

  return (
    <UserContext.Provider value={{ user, login, logout, resumeSession }}>
      {children}
    </UserContext.Provider>
  );
}
