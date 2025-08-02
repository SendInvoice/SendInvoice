import { Link } from 'react-router-dom';

import Navbar from '../Auth/components/Navbar';

import './Recipient.css';
import { FaEdit, FaPlus } from 'react-icons/fa';

export default function Recipient() {
    return (
        <div className="recipient-layout">
            <Navbar />
            <div className="recipient-content-area">
                <Link className='recipient-link' to='/new-recipients' style={{ textDecoration: 'none' }}>
                    <FaPlus /><h3>Create New Recipient</h3>
                </Link>
                <Link className='recipient-link' to='/update-recipient' style={{ textDecoration: 'none' }}>
                    <FaEdit /><h3>Update Recipient</h3>
                </Link>
            </div>
        </div>
    );
}