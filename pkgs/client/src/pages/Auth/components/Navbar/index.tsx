import { FaHome, FaUser } from 'react-icons/fa'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { FaUsers } from 'react-icons/fa6'

export default function Navbar() {

    return (
        <div className="navbar">
            <Link style={{textDecoration: 'none' }} to={'/'}>
                <button
                    className="navbar-button"
                >Home
                    <FaHome className='icon'/>
                </button>
            </Link>
            <Link style={{textDecoration: 'none' }} to={'/'}>
                <button
                    className="navbar-button"
                >User
                    <FaUser className='icon' />
                </button>
            </Link>
            <Link style={{textDecoration: 'none' }} to={'/'}>
                <button
                    className="navbar-button"
                >Recipients
                    <FaUsers className='icon' />
                </button>
            </Link>
        </div>
    )
}

