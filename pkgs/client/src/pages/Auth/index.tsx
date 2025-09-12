import { useEffect, useState } from "react";

import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";

import "./Auth.css";

enum AuthState {
  Login,
  SignUp,
}

export default function Auth() {
  const [authState, setAuthState] = useState(AuthState.Login);

  useEffect(() => {

  }, []);

  return (
    <div className="auth-container">
      {authState === AuthState.Login ? (
        <div className="login-container">
          <LogIn />
          <span className="auth-span">
            Dont have an account yet?
            <button
              className="auth-container_button"
              onClick={() => setAuthState(AuthState.SignUp)}
            >
              Sign Up!
            </button>
          </span>
        </div>
      ) : (
        <div className="sign-up-container">
          <SignUp />
          <span className="auth-span">
            Already have an account?
            <button
              className="auth-container_button"
              onClick={() => setAuthState(AuthState.Login)}
            >
              Login.
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
