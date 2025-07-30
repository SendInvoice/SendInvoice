import { useEffect, useState, type FormEvent } from 'react';

import Navbar from '../Auth/components/Navbar'

import { FaPlus } from 'react-icons/fa'
import { Button } from '../../components/atoms/Button';
import { Form } from '../../components/atoms/Form';
import { Input } from '../../components/atoms/Input';

import './Recipients.css'

export default function Recipients() {
    const [message, setMessage] = useState<string | null>(null);
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
                setMessage('Recipient created successfully!');
            } else if (res.status === 400) {
                setMessage('An unexpected error occurred. Please try again.');
            }
        } catch (err) {
            setMessage('Failed to create Recipient');
        }
    };

    const goToNextStep = () => {
        if (!name.trim() || !phone.trim()) {
            setMessage('Please fill in Name and Phone first');
            return;
        }
        setMessage(null);
        setStep(2);
    };

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
                            onClick={goToNextStep}>
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
                        <Button
                            className='button_form'
                            type='submit'>
                            Create New Recipient
                        </Button>
                    </>
                )}
            </Form>
        </div>
    )
}

