import Navbar from '../Auth/components/Navbar'
import './User.css'

import conchoImage from '../../assets/concho.png';

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
      <div className="user-container">
        <div className="user-card">
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
        </div>
      </div>
    </div>
  );
}