import { useState } from 'react'
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';

import './Auth.css'

enum AuthState {
    Login,
    SignUp,
}

export default function Auth() {
    const [authState, setAuthState] = useState(AuthState.Login);

    return (
        <div className='auth-container'>
            {
                authState === AuthState.Login ? (
                    <div>
                        <LogIn />
                        <span>Dont have an account yet?
                            <button
                                className='auth-container_button'
                                onClick={() => setAuthState(AuthState.SignUp)}>
                                Sign Up!
                            </button></span>
                    </div>
                ) : (
                    <div>
                        <SignUp />
                        <span>Already have an account?
                            <button
                                className='auth-container_button'
                                onClick={() => setAuthState(AuthState.Login)}>
                                Login.
                            </button></span>
                    </div>
                )
            }
        </div>
    )
}
