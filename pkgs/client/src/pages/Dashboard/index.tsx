import { Link } from 'react-router-dom';

import Navbar from '../Auth/components/Navbar';

import './Dashboard.css';
import { FaPlus } from 'react-icons/fa';

export default function Dashboard() {
    return (
        <div className="dashboard-layout">
            <Navbar />
            <div className="dashboard-content-area">
                <Link className='dashboard-link' to='/invoice' style={{ textDecoration: 'none' }}>
                    <FaPlus /><h3>Create New Invoce</h3>
                </Link>
                <Link className='dashboard-link' to='recipients' style={{ textDecoration: 'none' }}>
                    <FaPlus /><h3>Create New Recipient</h3>
                </Link>
            </div>
        </div>
    );
}