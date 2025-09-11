import { Link } from 'react-router-dom';

import './Recipient.css';
import { FaEdit, FaPlus } from 'react-icons/fa';
import Navbar from '../../components/molecules/Navbar';
import type { Recipient } from '../../services/SendInvoice/Invoice/RecipientClient';
import { useEffect, useState } from 'react';
import { SendInvoiceClient } from '../../services/SendInvoice';
import { Table } from '../../components/atoms/Table';

type RecipientProps = {
    recipients: Recipient[];
};

export default function Recipient({ recipients: inicialRecipients }: RecipientProps) {
    const [recipients, setRecipients] = useState<Recipient[]>(inicialRecipients);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const loadRecipients = async () => {
        try {
            setLoading(true);
            setError('');

            const sendInvoiceClient = new SendInvoiceClient('http://127.0.0.1:8080' as any);
            const recipientsList = await sendInvoiceClient.recipient.getRecipients();

            console.log('Loaded Recipients:', recipientsList);
            setRecipients(recipientsList);

        } catch (error) {
            console.error('Error while fetching recipients:', error);
            setError('Error while loading recipients');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!recipients || recipients.length === 0) {
            loadRecipients();
        }
    }, []);

    const prepareTableData = () => {
        const headers = ['Name', 'Phone', 'Email', 'Address'];

        if (!recipients || !Array.isArray(recipients)) {
            return { headers, data: [] };
        }

        const data = recipients.map(recipient => ({
            'Name': recipient.recipientName,
            'Phone': recipient.phone,
            // 'Email': recipient.(no existe todavia)
            'Address': recipient.addressId,
        }));

        return { headers, data };
    };

    const { headers, data } = prepareTableData();

    return (
        <div className="recipient-layout">
            <Navbar />
            <div className="dashboard-content-area">
                <h1 className="dashboard-title">Recipients</h1>
                <div className="recipient-content-area">
                    <Link className='recipient-link' to='/new-recipient' style={{ textDecoration: 'none' }}>
                        <FaPlus /><h3>Create New Recipient</h3>
                    </Link>
                    <Link className='recipient-link' to='/update-recipient' style={{ textDecoration: 'none' }}>
                        <FaEdit /><h3>Update Recipient</h3>
                    </Link>
                </div>
                <div style={{ marginTop: '20px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <p>Loading recipients...</p>
                        </div>
                    ) : error ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <p style={{ color: 'red' }}>{error}</p>
                            <button onClick={loadRecipients}>Retry Loading Recipients</button>
                        </div>
                    ) : recipients.length > 0 ? (
                        <Table
                            headers={headers}
                            data={data}
                            className="recipients-table"
                        />
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <p>No recipients available</p>
                            <button onClick={loadRecipients}>Load Recipients</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}