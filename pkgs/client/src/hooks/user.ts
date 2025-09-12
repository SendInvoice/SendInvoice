import { useContext } from "react";
import type { User } from "../services/SendInvoice/Auth";
import { UserContext } from "../contexts/UserContext";

export function useUser(): User | null {
  const userContext = useContext(UserContext);
  return userContext?.user || null;
}
