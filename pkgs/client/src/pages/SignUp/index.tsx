import { FormEvent, useState } from 'react'

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
      const res = await fetch('http://localhost:8080/api/v1/auth/sign-up', {
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
    }
  };

  return (
    <div className='sign-up_container'>

      {
        isDone ? (
          <div>DONE</div>
        ) : (

          <form onSubmit={handleSubmit}>
            <label>Enter your name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>Enter your surname:
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </label>
            <label>Enter your email:
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <button type='submit'>Registrarse</button>
          </form>
        )
      }
    </div>
  )
}
