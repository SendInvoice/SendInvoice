import { createContext, useEffect, useState } from "react";

import { SendInvoiceClient } from "../services/SendInvoice";
import { useToken } from "../hooks/user";

import type { JSX } from "react";
import type { Company } from "../services/SendInvoice/Invoice/CompanyClient";

export type Props = {
  children: JSX.Element | JSX.Element[];
};

export type ActiveCompanySetter = (id: string) => void;

export interface ICompanyContext {
  companies: Company[];
  activeCompany: Company | null;
  setActiveCompany: ActiveCompanySetter;
}

export const CompanyContext = createContext<ICompanyContext | null>(null);

CompanyContext.displayName = "CompanyContext";

export function CompanyContextProvider({ children }: Props): JSX.Element {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompany, setInnerActiveCompany] = useState<Company | null>(null);
  const token = useToken();

  useEffect(() => {
    if (token) {
      synch(token);
    }
  }, [token]);

  const synch = async (token: string) => {
    const sendInvoiceClient = new SendInvoiceClient(
      new URL("http://127.0.0.1:8080"),
    );
    const listCompanies =
      await sendInvoiceClient.invoice.company.getCompanies(token);

    if (Array.isArray(listCompanies)) {
      setCompanies(listCompanies);
      return;
    }

    setCompanies([]);
  };

  const setActiveCompany = (id: string) => {
    const company = companies.find((company) => company.id === id) || null;
    setInnerActiveCompany(company);
  };

  return (
    <CompanyContext.Provider
      value={{ companies, activeCompany, setActiveCompany }}
    >
      {children}
    </CompanyContext.Provider>
  );
}
