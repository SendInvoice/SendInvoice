import { UserContext } from "../../../contexts/UserContext";
import { useContext, useState } from "react";
import { useUser } from "../../../hooks/user";

import {
  FaBuilding,
  FaChevronDown,
  FaDoorOpen,
  FaHome,
  FaUser,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaFile, FaUsers } from "react-icons/fa6";

import "./Navbar.css";
import { Button } from "../../atoms/Button";
import { useActiveCompany, useActiveCompanySetter, useCompanies } from "../../../hooks/company";

export default function Navbar() {
  const user = useUser();
  const companies = useCompanies();
  const activeCompany = useActiveCompany();
  const activeCompanySetter = useActiveCompanySetter();
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

  const handleCompanySelect = (companyId: string) => {
    activeCompanySetter?.(companyId);
    setIsCompanyDropdownOpen(false);
  };

  return (
    <div className="navbar">
      <div className="company-dropdown">
        <button
          className="company-dropdown-trigger"
          onClick={toggleCompanyDropdown}
        >
          <FaBuilding className="company-icon" />
          <span>{activeCompany ? activeCompany.name : 'Select Company'}</span>
          <FaChevronDown
            className={`chevron-icon ${isCompanyDropdownOpen ? "chevron-open" : ""}`}
          />
        </button>

        {isCompanyDropdownOpen && (
          <div className="company-dropdown-menu">
            <div className="company-card-dropdown">
              {companies && companies.length > 0 ? (
                companies.map((company) => (
                  <button
                    key={company.id}
                    className="company-item-dropdown"
                    onClick={() => {
                      handleCompanySelect(company.id);
                    }}
                  >
                    <h4 className="company-name-dropdown">{company.name}</h4>
                    <p className="company-id-dropdown">ID: {company.id}</p>
                  </button>
                ))
              ) : (
                <p className="no-companies-text">No companies available.</p>
              )}
              <button
                className="company-item-dropdown"
              >
                <p className="no-companies-text">Create Company.</p>
              </button>
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
            className={`chevron-icon ${isUserDropdownOpen ? "chevron-open" : ""}`}
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
