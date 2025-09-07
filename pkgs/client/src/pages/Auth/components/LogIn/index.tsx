import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { Input } from '../../../../components/atoms/Input';
import { Button } from '../../../../components/atoms/Button';
import { Form } from '../../../../components/atoms/Form';

import './LogIn.css';

export default function LogIn() {
  const [isDone, setDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  
  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setErrorMessage(null);
    console.table({
      email
    });

    const res = await fetch('http://localhost:8080/api/v1/auth/log-in', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email
      }),
    });

    if (res.ok) {
      const resBody = await res.json();
      console.log(resBody);

      localStorage.setItem('authToken', resBody.token);

      setDone(true);
      navigate('/dashboard');
    } else {
      setErrorMessage('Error during login');
    }
  };

  return (
    <div>
      {
        isDone ? (
          <div>We have sent an email for you to enter!</div>
        ) : (
            <div>
              <h2 className='page-title'> Log In </h2>
              <Form onSubmit={handleSubmit}>
                <Input
                  className='input-field'
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
                  Enter
                </Button>
              </Form>
            </div>
        )
      }
    </div>
  )
}
