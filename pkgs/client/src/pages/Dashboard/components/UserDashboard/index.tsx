import { Link } from 'react-router-dom';
import './UserDashboard.css';
import type { Invoice } from '../../../../services/SendInvoice/Invoice';


type UserDashboardProps = {
    invoices: Invoice[];
};
     
export default function UserDashboard({ invoices }: UserDashboardProps) {
    return (
        <div className="dashboard-content-area">
            <h1 className="dashboard-title">Dashboard</h1>
            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>Total Invoices</h3>
                    <p>{invoices.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Recent Activity</h3>
                    <p>You have {invoices.length} invoices created</p>
                </div>
            </div>
            <div className="dashboard-actions">
                <Link className='dashboard-link' to='/invoice' style={{ textDecoration: 'none' }}>
                    <h3>Create New Invoice</h3>
                </Link>
                <Link className='dashboard-link' to='/invoices' style={{ textDecoration: 'none' }}>
                    <h3>View All Invoices</h3>
                </Link>
            </div>
        </div>
    );
}