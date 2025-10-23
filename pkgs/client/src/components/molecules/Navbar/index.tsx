import { UserContext } from "../../../contexts/UserContext";
import { useContext, useState } from "react";
import { useUser } from "../../../hooks/user";

import { FaBuilding, FaChevronDown, FaDoorOpen, FaHome, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaFile, FaUsers } from "react-icons/fa6";

import "./Navbar.css";
import { Button } from "../../atoms/Button";

export default function Navbar() {
   const user = useUser();
  const userContext = useContext(UserContext);
  const navigate = useNavigate();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);

  const handleLogOut = async () => {
    userContext?.logout();
    navigate("/auth");
    setIsUserDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const toggleCompanyDropdown = () => {
    setIsCompanyDropdownOpen(!isCompanyDropdownOpen);
  };

  return (
    <div className="navbar">
      <div className="company-dropdown">
        <button className="company-dropdown-trigger" onClick={toggleCompanyDropdown}>
          <FaBuilding className="company-icon" />
          <span>Select Company</span>
          <FaChevronDown 
            className={`chevron-icon ${isCompanyDropdownOpen ? 'chevron-open' : ''}`} 
          />
        </button>
        
        {isCompanyDropdownOpen && (
          <div className="company-dropdown-menu">
            <div className="company-card-dropdown">
              <p>Create company selection :</p>
            </div>
          </div>
        )}
      </div>

      {/* Navegación central */}
      <div className="navbar-links">
        <Link to={"/Dashboard"}>
          <button className="navbar-button">
            Home
            <FaHome className="icon" />
          </button>
        </Link>
        <Link to={"/Sender"}>
          <button className="navbar-button">
            Sender
            <FaUser className="icon" />
          </button>
        </Link>
        <Link to={"/Recipient"}>
          <button className="navbar-button">
            Recipients
            <FaUsers className="icon" />
          </button>
        </Link>
        <Link to={"/Invoice"}>
          <button className="navbar-button">
            Invoice
            <FaFile className="icon" />
          </button>
        </Link>
      </div>

      {/* Dropdown de usuario - Derecha */}
      <div className="user-dropdown">
        <button className="user-dropdown-trigger" onClick={toggleUserDropdown}>
          <FaUser className="user-icon" />
          <FaChevronDown 
            className={`chevron-icon ${isUserDropdownOpen ? 'chevron-open' : ''}`} 
          />
        </button>
        
        {isUserDropdownOpen && (
          <div className="user-dropdown-menu">
            <div className="user-card-dropdown">
              <h3 className="user-name-dropdown">
                {user?.name} {user?.surname}
              </h3>
              <p className="user-email-dropdown">{user?.email}</p>
              <Button
                className="log-out-button-dropdown"
                onClick={handleLogOut}
              >
                <FaDoorOpen className="button-icon" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
