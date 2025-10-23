import { createContext, useEffect, useState } from "react";

import { SendInvoiceClient } from "../services/SendInvoice";

import type { JSX } from "react";
import type { Company } from "../services/SendInvoice/Invoice/CompanyClient";
import { useToken } from "../hooks/user";

export type Props = {
  children: JSX.Element | JSX.Element[];
};

export interface ICompanyContext {
  companies: Company[];
  activeCompany: Company | null;
  synch(token: string): Promise<void>;
  setActiveCompany(id: string): void;
}

export const CompanyContext = createContext<ICompanyContext | null>(null);

CompanyContext.displayName = "CompanyContext";

export function CompanyContextProvider({ children }: Props): JSX.Element {
  const [companies, setCompanies] = useState <Company[] | null> (null);
  const [innerActiveCompany, setInnerActiveCompany] = useState  <Company | null> (null);
  const token = useToken();

  useEffect(() => {
    if (token) {
        synch(token);
    }
  },[token]);

  const synch = async (token: string) => {
    const sendInvoiceClient = new SendInvoiceClient(new URL("http://127.0.0.1:8080"));
    const listCompanies = await sendInvoiceClient.invoice.company.getCompanies();

    setCompanies(listCompanies);
  }

  return (
    <CompanyContext.Provider
      value={{ companies, activeCompany, synch, setActiveCompany }}
    >
      {children}
    </CompanyContext.Provider>
  );
}
