import { useEffect, useState } from 'react';

import EmptyState from './components/EmptyState';
import UserDashboard from './components/UserDashboard';
import { SendInvoiceClient } from '../../services/SendInvoice';

import './Dashboard.css';
import type { Invoice } from '../../services/SendInvoice/Invoice';
import Navbar from '../../components/molecules/Navbar';

export default function Dashboard() {
    const [hasInvoices, setHasInvoices] = useState(false);     
    const [isLoading, setIsLoading] = useState(true);                  
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    useEffect(() => {
        const checkUserInvoices = async () => {
            try {
                const sendInvoiceClient = new SendInvoiceClient('http://127.0.0.1:8080' as any);
                const invoiceList = await sendInvoiceClient.invoice.getInvoices();
                debugger;
                
                if (!invoiceList || invoiceList.length === 0) {
                    setHasInvoices(false);
                    setInvoices([]);
                } else {
                    setHasInvoices(true);
                    setInvoices(invoiceList);
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Error loading invoices:', error);
                setHasInvoices(false);
                setInvoices([]);
                setIsLoading(false);
            }
        };

        checkUserInvoices();
    }, []);

    if (isLoading) {
        return (
            <div className="dashboard-layout">
                <Navbar />
                <div className="dashboard-content-area">
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            <Navbar />
            {
                !hasInvoices ? (
                    <EmptyState />
                ) : (
                    <UserDashboard invoices={invoices} />
                )
            }
        </div>
    );
}