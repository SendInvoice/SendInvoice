
import './User.css'

import conchoImage from '../../assets/concho.png';
import Navbar from '../../components/molecules/Navbar';
import { Button } from '../../components/atoms/Button';
import { FaDoorOpen } from 'react-icons/fa';

export default function User() {

  const user = {
    firstName: 'Conchito',
    lastName: 'Martínez',
    email: 'concho.martinezOcasio@example.com',
    profileImageUrl: conchoImage,
  };

  return (
    <div>
      <Navbar />
      <div className="sender-container">
        <div className="user-container">
          <div className="user-card">
            <h3>User Info</h3>
            <div className="user-avatar-wrapper">
              <img
                src={user.profileImageUrl}
                alt="Foto de perfil"
                className="user-avatar"
              />
            </div>
            <h2 className="user-name">
              {user.firstName} {user.lastName}
            </h2>
            <p className="user-email">{user.email}</p>
            <Button
              className="log-out-button"
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