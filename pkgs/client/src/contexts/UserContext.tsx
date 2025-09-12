import { createContext, useState } from "react";

import type { JSX } from "react";
import type { User } from "../services/SendInvoice/Auth";

export type Props = {
  children: JSX.Element | JSX.Element[];
};

export interface IUserContext {
  user: User | null;
  login(email: string): Promise<void>;
  resumeSession(): Promise<void>;
}

export const UserContext = createContext<IUserContext | null>(null);

UserContext.displayName = "UserContext";

export function UserContextProvider({ children }: Props): JSX.Element {
  const [user, setUser] = useState(null);

  const login = async (email: string) => {
    // TODO: Reemplazar por Servicio Auth
    // TODO: Set in localStorage
    setUser({
      id: "1",
      name: "John",
      surname: "Doe",
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const resumeSession = async () => {
    // Read `currentUser` from localStorage and sets it on `setUser`
  }

  return (
    <UserContext.Provider value={{ user, login, resumeSession }}>
      {children}
    </UserContext.Provider>
  );
}
