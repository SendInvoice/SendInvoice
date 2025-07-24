import { FormEvent, useState } from 'react'

import './LogIn.css'

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

          <form onSubmit={handleSubmit}>
            <label>Enter your email:
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <button type='submit'>Enter</button>
          </form>
        )
      }
    </div>
  )
}
