
import AdminNavbar from "./components/AdminNavbar";
import AdminSidebar from "./components/AdminSidebar";
import AdminHome from "./pages/AdminHome";
import AdminSeller from "./pages/AdminSeller";
import AdminPayout from "./pages/AdminPayout";
import AdminCategories from "./pages/AdminCategories";
import AdminUsers from "./pages/AdminUsers";
import { useState, useEffect } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const [currentPage, setCurrentPage] = useState('home');
    const { adminUser, adminIsAuthenticated, adminLoading } = useAdminAuth();
    const navigate = useNavigate();

    // 🔒 SECURITY: Verify admin is authenticated and has ADMIN role
    useEffect(() => {
        console.log('📋 AdminDashboard - Verifying user access:', {
            isAuthenticated: adminIsAuthenticated,
            userRole: adminUser?.role,
            loading: adminLoading
        });

        // While loading, don't redirect to avoid race conditions
        if (adminLoading) return;

        if (!adminIsAuthenticated || adminUser?.role !== 'ADMIN') {
            console.error('❌ Unauthorized access attempt - not an admin!');
            navigate('/admin-login', { replace: true });
        }
    }, [adminIsAuthenticated, adminUser, adminLoading, navigate]);

    const handleNavigate = (pageId) => {
        setCurrentPage(pageId);
    };

    const renderPage = () => {
        switch(currentPage) {
            case 'home':
                return <AdminHome />;
            case 'sellers':
                return <AdminSeller />;
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