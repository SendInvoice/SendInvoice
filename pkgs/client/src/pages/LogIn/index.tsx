import { FormEvent, useState } from 'react'

import './LogIn.css'
import { Input } from '../../components/atoms/Input.tsx';
import { Button } from '../../components/atoms/Button.tsx/index.tsx';

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
      setDone(true);
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
            <p>Dont have an account yet? Sing Up!</p>
            <form onSubmit={handleSubmit}>
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
            </form>
          </div>
        )
      }
    </div>
  )
}
