import { useContext } from "react";
import { UserContext, type IUserContext } from "../contexts/UserContext";

import type { User } from "../services/SendInvoice/Auth";

export function useUser(): User | null {
  const userContext = useContext(UserContext);
  return userContext?.user || null;
}

export function useUserContext(): IUserContext | null {
  return useContext(UserContext);
}

export function useToken(): string | null {
  const userContext = useContext(UserContext);
  return userContext?.token || null;
}
