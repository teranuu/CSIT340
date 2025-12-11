
import AdminNavbar from "./components/AdminNavbar";
import AdminSidebar from "./components/AdminSidebar";
import AdminHome from "./pages/AdminHome";
import AdminSeller from "./pages/AdminSeller";
import AdminProduct from "./pages/AdminProduct";
import AdminOrders from "./pages/AdminOrders";
import AdminPayout from "./pages/AdminPayout";
import AdminCategories from "./pages/AdminCategories";
import AdminUsers from "./pages/AdminUsers";
import { useState } from "react";

function AdminDashboard() {
    const [currentPage, setCurrentPage] = useState('home');

    const handleNavigate = (pageId) => {
        setCurrentPage(pageId);
    };

    const renderPage = () => {
        switch(currentPage) {
            case 'home':
                return <AdminHome />;
            case 'sellers':
                return <AdminSeller />;
            case 'products':
                return <AdminProduct />;
            case 'orders':
                return <AdminOrders />;
            case 'payouts':
                return <AdminPayout />;
            case 'categories':
                return <AdminCategories />;
            case 'users':
                return <AdminUsers />;
            default:
                return <div style={{ padding: '24px', background: 'white', borderRadius: '16px' }}>Admin Home (Coming Soon)</div>;
        }
    };

    return(
        <>
            <AdminNavbar />
            <div style={{ display: 'flex', gap: '24px', padding: '24px', background: 'var(--color-tea-green-2)', minHeight: '100vh' }}>
                <AdminSidebar onNavigate={handleNavigate} currentPage={currentPage} />
                <div style={{ flex: 1, background: 'transparent' }}>
                    {renderPage()}
                </div>
            </div>
        </>
    );
}

export default AdminDashboard;