import { useEffect, useMemo, useState, type FormEvent } from 'react';

import Navbar from '../Auth/components/Navbar'

import { FaPlus } from 'react-icons/fa'
import { Button } from '../../components/atoms/Button';
import { Form } from '../../components/atoms/Form';
import { Input } from '../../components/atoms/Input';

import './Recipients.css'
import { Modal } from '../../components/atoms/Modal';

export default function Recipients() {
    const [message, setMessage] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [step, setStep] = useState(1);

    const [name, setName] = useState(() => localStorage.getItem('recipient_name') || '');
    const [phone, setPhone] = useState(() => localStorage.getItem('recipient_phone') || '');
    const [address, setAddress] = useState({
        StreetAddress1: '',
        StreetAddress2: '',
        city: '',
        cityArea: '',
        postalCode: '',
        country: ''
    });

    const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        setMessage(null);
        console.table({
            name,
            phone,
            address,
        });
    };

    const handleConfirmSubmit = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/v1/recipients', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    phone,
                    address
                }),
            });

            if (res.status === 201) {
                localStorage.removeItem('recipient_name');
                localStorage.removeItem('recipient_phone');
                setShowModal(false);
                setMessage('Recipient created successfully!');
            } else if (res.status === 400) {
                setShowModal(false);
                setMessage('An unexpected error occurred. Please try again.');
            }
        } catch (err) {
            setShowModal(false);
            setMessage('Failed to create Recipient');
        }
    };

    const canGoToNextStep = name.trim() !== '' && phone.trim() !== '';
    const goToNextStep = () => {
        if (!canGoToNextStep) {
            setMessage('Please fill in Name and Phone first');
            return;
        }
        setMessage(null);
        setStep(2);
    };


    const isSubmitEnable = useMemo(
        () => {
            return address.StreetAddress1 &&
                address.StreetAddress2 &&
                address.city &&
                address.postalCode &&
                address.country
        },
        [
            address.StreetAddress1,
            address.StreetAddress2,
            address.city,
            address.postalCode,
            address.country
        ]
    );

    useEffect(() => {
        localStorage.setItem('recipient_name', name);
    }, [name]);

    useEffect(() => {
        localStorage.setItem('recipient_phone', phone);
    }, [phone]);

    return (
        <div>
            <Navbar />
            <h2 className='h2'><FaPlus /> Add a new Recipient</h2>
            <Form onSubmit={handleSubmit}>
                {step === 1 && (
                    <>
                        <Input
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder='Name'
                        />
                        <Input
                            type='text'
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder='Phone'
                        />
                        {message && <p className="error-message">{message}</p>}
                        <Button
                            className='button_form'
                            type='button'
                            onClick={goToNextStep}
                            disabled={!canGoToNextStep}>
                            Next
                        </Button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <label>Address</label>
                        <Input
                            type='text'
                            value={address.StreetAddress1}
                            onChange={(e) => setAddress({ ...address, StreetAddress1: e.target.value })}
                            placeholder='Street Address 1'
                        />

                        <Input
                            type='text'
                            value={address.StreetAddress2}
                            onChange={(e) => setAddress({ ...address, StreetAddress2: e.target.value })}
                            placeholder='Street Address 2'
                        />
                        <Input
                            type='text'
                            value={address.city}
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                            placeholder='City'
                        />
                        <Input
                            type='text'
                            value={address.cityArea}
                            onChange={(e) => setAddress({ ...address, cityArea: e.target.value })}
                            placeholder='City Area'
                        />
                        <Input
                            type='text'
                            value={address.postalCode}
                            onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                            placeholder='Postal Code'
                        />
                        <Input
                            type='text'
                            value={address.country}
                            onChange={(e) => setAddress({ ...address, country: e.target.value })}
                            placeholder='Country'
                        />
                        {message && <p className="error-message">{message}</p>}
                        <div className="div-button_form">
                            <Button
                                onClick={() => setStep(1)}
                                className="button_form"
                            >Preview
                            </Button>

                            <Button
                                className="button_form"
                                onClick={() => setShowModal(true)}
                                disabled={!isSubmitEnable}
                            >Create New Recipient
                            </Button>
                        </div>
                    </>
                )}
            </Form>
            {showModal && (
                <Modal>
                    <h3>Confirm Recipient Information</h3>
                    <p><strong>Name:</strong> {name}</p>
                    <p><strong>Phone:</strong> {phone}</p>
                    <p><strong>Street Address 1:</strong> {address.StreetAddress1}</p>
                    <p><strong>Street Address 2:</strong> {address.StreetAddress2}</p>
                    <p><strong>City:</strong> {address.city}</p>
                    <p><strong>City Area:</strong> {address.cityArea}</p>
                    <p><strong>Postal Code:</strong> {address.postalCode}</p>
                    <p><strong>Country:</strong> {address.country}</p>

                    <div className="div-button_form">
                        <Button
                            onClick={() => setShowModal(false)}
                            className="button_form"
                        >Cancel
                        </Button>

                        <Button
                            onClick={handleConfirmSubmit}
                            className="button_form"
                        >Confirm
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
