import { Link, useNavigate } from 'react-router-dom';

import './Recipient.css';
import { FaEdit, FaEraser, FaPlus } from 'react-icons/fa';
import type { Recipient } from '../../services/SendInvoice/Invoice/RecipientClient';
import { useEffect, useState } from 'react';
import { SendInvoiceClient } from '../../services/SendInvoice';
import { Table } from '../../components/atoms/Table';
import { Button } from '../../components/atoms/Button';

type RecipientProps = {
    recipients: Recipient[];
};

export default function Recipient({ recipients: inicialRecipients }: RecipientProps) {
    const [recipients, setRecipients] = useState<Recipient[]>(inicialRecipients);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    const navigate = useNavigate();

    const loadRecipients = async () => {
        try {
            setLoading(true);
            setError('');

            const sendInvoiceClient = new SendInvoiceClient(new URL("http://127.0.0.1:8080"));
            const recipientsList = await sendInvoiceClient.recipient.getRecipients();
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

    const handleUpdateRecipient = (id: string) => {
        navigate(`/update-recipient/${id}`);
    };

    const handleDeleteRecipient = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this recipient?')) {
            return
        }

        try {
            setLoading(true);
            const sendInvoiceClient = new SendInvoiceClient(new URL("http://127.0.0.1:8080"));
            await sendInvoiceClient.recipient.deleteRecipient(id);

            setRecipients(prev => prev.filter(recipient => recipient.id !== id));

            console.log('Recipient deleted successfully');
        } catch (error) {
            console.error('Error deleting recipient:', error);
            setError('Error deleting recipient');
        } finally {
            setLoading(false);
        }
    }

    const prepareTableData = () => {
        const headers = ['Name', 'Phone', 'Email', 'Address', 'Update', 'Delete'];

        if (!recipients || !Array.isArray(recipients)) {
            return { headers, data: [] };
        }

        const data = recipients.map(recipient => ({
            'Name': recipient.recipientName,
            'Phone': recipient.phone,
            'Email': recipient.email,
            'Address': `${recipient.address.streetAddress1}, ${recipient.address.city}, ${recipient.address.country}`,
            'Update': (
                <button
                    className="update-button"
                    onClick={() => handleUpdateRecipient(recipient.id)}
                >
                    <FaEdit />
                    Update
                </button>
            ),
            'Delete': (
                <button
                    className="delete-button"
                    onClick={() => handleDeleteRecipient(recipient.id)}
                >
                    <FaEraser />
                    Delete
                </button>
            )
        }));
        return { headers, data };
    };


    const { headers, data } = prepareTableData();

    return (
        <div className="recipient-layout">
            <div className="dashboard-content-area">
                <h1 className="dashboard-title">Recipients</h1>
                <div className="recipient-content-area">
                    <Link className='recipient-link' to='/new-recipient'>
                        <FaPlus /><h3>Create New Recipient</h3>
                    </Link>
                </div>
                <div>
                    {loading ? (
                        <div className="loading-container">
                            <p>Loading recipients...</p>
                        </div>
                    ) : error ? (
                        <div className="error-container">
                            <p>{error}</p>
                            <Button onClick={loadRecipients}>Retry Loading Recipients</Button>
                        </div>
                    ) : recipients.length > 0 ? (
                        <Table
                            headers={headers}
                            data={data}
                            className="recipients-table"
                        />
                    ) : (
                        <div className="empty-container">
                            <p>No recipients available</p>
                            <Button
                                onClick={loadRecipients}>
                                Load Recipients
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
