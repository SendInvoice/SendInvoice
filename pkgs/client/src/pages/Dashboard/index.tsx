import { Link } from 'react-router-dom';

import Navbar from '../Auth/components/Navbar';

import './Dashboard.css';

export default function Dashboard() {
    return (
        <div className="dashboard-layout">
            <Navbar />
            <div className="dashboard-content-area">
                <h1 className="dashboard-title"> Welcome to Send Invoice</h1>
                <h2 className="dashboard-subtitle"> Simplify your billing process. </h2>
                <h3 className="dashboard-subtitle2">
                    Easily create, manage, and send professional invoices to your clients in just a few clicks.
                </h3>
                <Link className='dashboard-link' to='/invoice' style={{ textDecoration: 'none' }}>
                    <h3>Create New Invoce</h3>
                </Link>
            </div>
        </div>
    );
}