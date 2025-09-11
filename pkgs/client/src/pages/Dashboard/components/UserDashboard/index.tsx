
import './UserDashboard.css';
import type { Invoice } from '../../../../services/SendInvoice/Invoice';
import { SendInvoiceClient } from '../../../../services/SendInvoice';
import { Table } from '../../../../components/atoms/Table';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';


type UserDashboardProps = {
    invoices: Invoice[];
};

export default function UserDashboard({ invoices: initialInvoices }: UserDashboardProps) {

    const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const loadInvoices = async () => {
        try {
            setLoading(true);
            setError('');

            const sendInvoiceClient = new SendInvoiceClient(new URL("http://127.0.0.1:8080"));
            const invoiceList = await sendInvoiceClient.invoice.getInvoices();

            console.log('Loaded Invoices:', invoiceList);
            setInvoices(invoiceList);

        } catch (error) {
            console.error('Error while fetching invoices:', error);
            setError('Error while loading invoices');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialInvoices.length === 0) {
            loadInvoices();
        }
    }, []);

    const prepareTableData = () => {
        const headers = ['Number', 'Date', 'Due Date', 'Subtotal', 'Tax', 'Total', 'Notes'];

        const data = invoices.map(invoice => ({
            'Number': invoice.invoiceNumber,
            'Date': formatDate(invoice.date),
            'Due Date': formatDate(invoice.dueDate),
            'Subtotal': formatCurrency(invoice.subtotal),
            'Tax': formatCurrency(invoice.tax),
            'Total': formatCurrency(invoice.total),
            'Notes': invoice.notes || 'No notes'
        }));

        return { headers, data };
    };

    const formatDate = (dateString: string | Date): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    };

    const { headers, data } = prepareTableData();

    return (
        <div className="dashboard-content-area">
            <h1 className="dashboard-title">Dashboard</h1>
            <Link className='invoice-link' to='/invoice' style={{ textDecoration: 'none' }}>
                <FaPlus /><h3>Create New Invoice</h3>
            </Link>
            <div style={{ marginTop: '20px' }}>
                <h2>Last Invoices</h2>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <p>Loading invoices...</p>
                    </div>
                ) : invoices.length > 0 ? (
                    <Table
                        headers={headers}
                        data={data}
                        className="invoices-table"
                    />
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <p>📭 No hay facturas disponibles</p>
                        <button onClick={loadInvoices}>Cargar Facturas</button>
                    </div>
                )}
            </div>
        </div>
    );
}