import styles from './admin.sidebar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faHome, faUsers, faMoneyBill, faTags, faPerson, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { API_BASE_URL } from '../../../config/api';
import { useState } from 'react';
import LogoutModal from './LogoutModal';

function AdminSidebar({ onNavigate, currentPage }) {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { adminLogout } = useAdminAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const navItems = [
        { label: 'Home', icon: faHome, id: 'home' },
        { label: 'Seller Management', icon: faUsers, id: 'sellers' },
        { label: 'Payout/Commission', icon: faMoneyBill, id: 'payouts' },
        { label: 'Category Management', icon: faTags, id: 'categories' },
        { label: 'Users', icon: faPerson, id: 'users' }
    ];

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = async () => {
        setIsLoggingOut(true);
        try {
            console.log('🔓 Admin logging out...');
            
            // Call backend logout to invalidate session
            await fetch(`${API_BASE_URL}/api/customers/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            
            // Clear frontend auth states
            await logout();
            await adminLogout();
            
            console.log('✅ Admin logged out successfully');
            
            // Redirect to admin login
            navigate('/admin-login', { replace: true });
        } catch (error) {
            console.error('Logout error:', error);
            // Still redirect even if logout fails
            navigate('/admin-login', { replace: true });
        } finally {
            setIsLoggingOut(false);
            setShowLogoutModal(false);
        }
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    return (
        <>
            <aside className={styles.sidebar}>
                <div className={styles.profileCard}>
                    <div className={styles.avatar}>
                        <FontAwesomeIcon icon={faUserTie} />
                    </div>
                    <div className={styles.profileText}>
                        <p className={styles.kicker}>Admin Center</p>
                        <h3 className={styles.welcome}>Welcome, Admin</h3>
                    </div>
                </div>

                <nav className={styles.navList} aria-label="Admin navigation">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            className={`${styles.navItem} ${currentPage === item.id ? styles.active : ''}`}
                            onClick={() => onNavigate(item.id)}
                        >
                            <FontAwesomeIcon icon={item.icon} className={styles.navIcon} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                    <button
                        type="button"
                        className={styles.logoutBtn}
                        onClick={handleLogoutClick}
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className={styles.navIcon} />
                        <span>Logout</span>
                    </button>
                </nav>
            </aside>

            <LogoutModal
                isOpen={showLogoutModal}
                onConfirm={handleConfirmLogout}
                onCancel={handleCancelLogout}
                isLoading={isLoggingOut}
            />
        </>
    );
}

export default AdminSidebar;
