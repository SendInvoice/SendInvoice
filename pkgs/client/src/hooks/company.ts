import { useContext } from "react";
import { CompanyContext } from "../contexts/CompanyContext";

import type { Company } from "../services/SendInvoice/Invoice/CompanyClient";
import type { ActiveCompanySetter } from "../contexts/CompanyContext";

export function useCompanies(): Company[] | null {
  const companyContext = useContext(CompanyContext);
  return companyContext?.companies || null;
}

export function useActiveCompany(): Company | null {
  const companyContext = useContext(CompanyContext);
  return companyContext?.activeCompany || null;
}

export function useActiveCompanySetter(): ActiveCompanySetter | null {
  const companyContext = useContext(CompanyContext);
  return companyContext?.setActiveCompany || null;
}
