import { useState } from 'react'

import { Button } from '../../../../components/atoms/Button';
import { Form } from '../../../../components/atoms/Form';
import { Input } from '../../../../components/atoms/Input';

import type { FormEvent } from 'react';

import './SignUp.css'

export default function SignUp() {
  const [isDone, setDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setErrorMessage(null);
    console.table({
      name,
      surname,
      email,
    });

    function isValidEmail(email: string): boolean {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email.toLowerCase());
    }

    if (!isValidEmail(email)) {
      setErrorMessage("Invalid email format.");
      return;
    }

    if (!name || !surname || !email) {
      setErrorMessage('All fields are necessary.');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/v1/user', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          name,
          surname,
          email
        }),
      });

      if (res.status === 201) {
        setDone(true);
      } else if (res.status === 400) {
        const data = await res.json();
        setErrorMessage(data.message || 'Validation error.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } catch (err) {
      setErrorMessage('Failed to connect to the server.');
    }
  };

  return (
    <div>
      {
        isDone ? (
          <div>Account created successfully.</div>
        ) : (
          <div>
            <h2 className='page-title'> Create an Account </h2>
            <Form onSubmit={handleSubmit}>
              <Input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Name'
              />
              <Input
                type='text'
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder='Surname'
              />
              <Input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email Address'
              />

              {errorMessage && (
                <p className="error-message">{errorMessage}</p>
              )}

              <Button
                className='button_form'
                type='submit'>
                Sing Up
              </Button>
            </Form>
          </div>
        )
      }
    </div>
  )
}
