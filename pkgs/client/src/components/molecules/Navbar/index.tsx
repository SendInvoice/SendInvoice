import { FaHome, FaUser } from 'react-icons/fa'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { FaFile, FaUsers } from 'react-icons/fa6'

export default function Navbar() {

    return (
        <div className="navbar">
            <Link style={{textDecoration: 'none' }} to={'/Dashboard'}>
                <button
                    className="navbar-button"
                >Home
                    <FaHome className='icon'/>
                </button>
            </Link>
            <Link style={{textDecoration: 'none' }} to={'/User'}>
                <button
                    className="navbar-button"
                >User
                    <FaUser className='icon' />
                </button>
            </Link>
            <Link style={{textDecoration: 'none' }} to={'/Recipient'}>
                <button
                    className="navbar-button"
                >Recipients
                    <FaUsers className='icon' />
                </button>
            </Link>
            <Link style={{textDecoration: 'none' }} to={'/Invoice'}>
                <button
                    className="navbar-button"
                >Invoice
                    <FaFile className='icon'/>
                </button>
            </Link>
        </div>
    )
}

