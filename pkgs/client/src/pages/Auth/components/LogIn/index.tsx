import { useState, type FormEvent } from 'react';

import { Input } from '../../../../components/atoms/Input';
import { Button } from '../../../../components/atoms/Button';
import { Form } from '../../../../components/atoms/Form';

import './LogIn.css';

export default function LogIn() {
  const [isDone, setDone] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
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
    } else { 
      console.error('Error during login');
    }
  };

  return (
    <div className='log-in_container'>

      {
        isDone ? (
          <div>DONE</div>
        ) : (
          <div>
            <h2> Log In </h2>
            <Form onSubmit={handleSubmit}>
              <Input
                className='input-field'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email Address'
              />
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
