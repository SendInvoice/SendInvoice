import { useEffect, useState } from "react";

import EmptyState from "./components/EmptyState";
import UserDashboard from "./components/UserDashboard";
import { SendInvoiceClient } from "../../services/SendInvoice";

import "./Dashboard.css";
import type { Invoice } from "../../services/SendInvoice/Invoice";
import { useActiveCompany } from "../../hooks/company";
import { useToken } from "../../hooks/user";

export default function Dashboard() {
  const [hasInvoices, setHasInvoices] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const activeCompany = useActiveCompany();
  const token = useToken();
  const checkUserInvoices = async (token: string, companyId: string) => {
    try {
      const sendInvoiceClient = new SendInvoiceClient(
        new URL("http://127.0.0.1:8080"),
      );
      const invoiceList = await sendInvoiceClient.invoice.getInvoices(token, companyId);

      if (!invoiceList || invoiceList.length === 0) {
        setHasInvoices(false);
        setInvoices([]);
      } else {
        setHasInvoices(true);
        setInvoices(invoiceList);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error loading invoices:", error);
      setHasInvoices(false);
      setInvoices([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeCompany?.id && token) {
      checkUserInvoices(token, activeCompany.id);
    }
  }, [activeCompany, token]);

  if (isLoading) {
    return (
      <div className="dashboard-layout">
        <div className="dashboard-content-area">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {!hasInvoices ? <EmptyState /> : <UserDashboard invoices={invoices} />}
    </div>
  );
}
