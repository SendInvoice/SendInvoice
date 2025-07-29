import { Card } from '../../components/atoms/Card';

import Navbar from '../Auth/components/Navbar';
import Sidebar from '../Auth/components/Sidebar';

import './Dashboard.css';

export default function Dashboard() {

    return (

        <div className="dashboard-layout">
            <Navbar />
            <div className="main-content">
                <Sidebar />
                <div className="content-area">
                    <Card
                        className='dashboard-card'>
                        <h3>Create New Invoce</h3>
                    </Card>
                    <h1 className='h1-dashboard'>Dashboard</h1>
                </div>
            </div>
        </div>
    );
}