import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaSave } from 'react-icons/fa';
import { SendInvoiceClient } from '../../../services/SendInvoice';
import type { Recipient } from '../../../services/SendInvoice/Invoice/RecipientClient';
import Navbar from '../../../components/molecules/Navbar';
import "./updateRecipients.css"

export default function UpdateRecipient() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const [formData, setFormData] = useState({
        recipientName: '',
        phone: '',
        email: '',
        streetAddress1: '',
        streetAddress2: '',
        city: '',
        cityArea: '',
        postalCode: '',
        country: ''
    });

    const [originalRecipient, setOriginalRecipient] = useState<Recipient | null>(null);

    const loadRecipient = async () => {
        if (!id) {
            setError('Recipient ID is required');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const sendInvoiceClient = new SendInvoiceClient(new URL("http://127.0.0.1:8080"));
            const recipient = await sendInvoiceClient.recipient.getRecipientById(id);
            
            if (!recipient) {
                setError('Recipient not found');
                return;
            }

            setOriginalRecipient(recipient);

            setFormData({
                recipientName: recipient.recipientName || '',
                phone: recipient.phone || '',
                email: recipient.email || '',
                streetAddress1: recipient.address?.streetAddress1 || '',
                streetAddress2: recipient.address?.streetAddress2 || '',
                city: recipient.address?.city || '',
                cityArea: recipient.address?.cityArea || '',
                postalCode: recipient.address?.postalCode || '',
                country: recipient.address?.country || ''
            });

        } catch (error) {
            console.error('Error loading recipient:', error);
            setError('Error loading recipient data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRecipient();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
        if (success) setSuccess('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!id) {
            setError('Recipient ID is required');
            return;
        }

        if (!formData.recipientName.trim()) {
            setError('Recipient name is required');
            return;
        }

        if (!formData.email.trim()) {
            setError('Email is required');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const sendInvoiceClient = new SendInvoiceClient(new URL("http://127.0.0.1:8080"));
            const payload: any = {};
            
            if (formData.recipientName !== originalRecipient?.recipientName) {
                payload.recipientName = formData.recipientName;
            }
            if (formData.phone !== originalRecipient?.phone) {
                payload.phone = formData.phone;
            }
            if (formData.email !== originalRecipient?.email) {
                payload.email = formData.email;
            }

            const addressChanged = 
                formData.streetAddress1 !== (originalRecipient?.address?.streetAddress1 || '') ||
                formData.streetAddress2 !== (originalRecipient?.address?.streetAddress2 || '') ||
                formData.city !== (originalRecipient?.address?.city || '') ||
                formData.cityArea !== (originalRecipient?.address?.cityArea || '') ||
                formData.postalCode !== (originalRecipient?.address?.postalCode || '') ||
                formData.country !== (originalRecipient?.address?.country || '');

            if (addressChanged) {
                payload.address = {
                    streetAddress1: formData.streetAddress1,
                    streetAddress2: formData.streetAddress2,
                    city: formData.city,
                    cityArea: formData.cityArea,
                    postalCode: formData.postalCode,
                    country: formData.country
                };
            }

            if (Object.keys(payload).length === 0) {
                setError('No changes detected');
                return;
            }

            await sendInvoiceClient.recipient.updateRecipient(id, payload);
            setSuccess('Recipient updated successfully!');

            setTimeout(() => navigate('/recipient'), 1500);
            
        } catch (error) {
            console.error('Error updating recipient:', error);
            setError(error instanceof Error ? error.message : 'Error updating recipient');
        } finally {
            setLoading(false);
        }
    };

    if (!id) {
        return (
            <div className="update-recipient-layout">
                <div className="dashboard-content-area">
                    <div className="no-id-message">
                        <p>Recipient ID is required</p>
                        <Link to="/recipient">← Back to Recipients</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="update-recipient-layout">
            <div className="dashboard-content-area">
                <div className="update-recipient-header">
                    <h1 className="dashboard-title">Update Recipient</h1>
                </div>

                {loading && (
                    <div>
                        <p>Loading recipient data...</p>
                    </div>
                )}

                {error && (
                    <div>
                        {error}
                    </div>
                )}

                {success && (
                    <div>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="update-recipient-form">
                    <div className="form-section">
                        <h2>Personal Information</h2>
                        
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="recipientName"
                                value={formData.recipientName}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Address Information</h2>
                        
                        <div className="form-group">
                            <label>Street Address 1</label>
                            <input
                                type="text"
                                name="streetAddress1"
                                value={formData.streetAddress1}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label>Street Address 2</label>
                            <input
                                type="text"
                                name="streetAddress2"
                                value={formData.streetAddress2}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label>State/Province</label>
                                <input
                                    type="text"
                                    name="cityArea"
                                    value={formData.cityArea}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Postal Code</label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label>Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="submit-button"
                        >
                            <FaSave /> {loading ? 'Updating...' : 'Update Recipient'}
                        </button>
                        
                        <Link 
                            to="/recipient" 
                            className="cancel-button"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}