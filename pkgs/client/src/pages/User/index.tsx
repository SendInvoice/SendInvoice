import { useNavigate } from 'react-router-dom';
import { useEffect, useContext } from 'react';

import { Button } from '../../components/atoms/Button';
import { FaDoorOpen } from 'react-icons/fa';
import { UserContext } from '../../contexts/UserContext';

import Navbar from '../../components/molecules/Navbar';
import './User.css'


export default function User() {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

 useEffect(() => {
    if (!userContext?.user) {
      userContext?.resumeSession();
    }
  }, [userContext]);

  const handleLogOut = async () => {
    await userContext?.logout();
    navigate("/auth");
  };

  const { firstName, lastName, email } = userContext!.user;

  return (
    <div>
      <Navbar />
      <div className="sender-container">
        <div className="user-container">
          <div className="user-card">
            <h3>User Info</h3>
            <div className="user-avatar-wrapper">
              <img
                src="https://via.placeholder.com/150"
                alt="Foto de perfil"
                className="user-avatar"
              />
            </div>
            <h2 className="user-name">
              {firstName} {lastName}
            </h2>
            <p className="user-email">{email}</p>
            <Button
              className="log-out-button"
              onClick={handleLogOut}
            >
              <FaDoorOpen className="button-icon" />
            </Button>
          </div>
        </div>
        <div className="sender-info-container">
          <h2> SENDER INFO</h2>
        </div>
      </div>
    </div>
  );
}