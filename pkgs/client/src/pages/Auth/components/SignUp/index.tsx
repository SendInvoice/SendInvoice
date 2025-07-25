import { useState } from 'react'

import { Button } from '../../../../components/atoms/Button';
import { Form } from '../../../../components/atoms/Form';
import { Input } from '../../../../components/atoms/Input';

import type { FormEvent } from 'react';

import './SignUp.css'

export default function SignUp() {
  const [isDone, setDone] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    console.table({
      name,
      surname,
      email
    });

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
    }
  };

  return (
    <div className='sign-up_container'>

      {
        isDone ? (
          <div>DONE</div>
        ) : (
          <div>
            <h2> Create an Account </h2>
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
