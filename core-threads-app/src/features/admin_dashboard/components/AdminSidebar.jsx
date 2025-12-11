import styles from './admin.sidebar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faHome, faUsers, faBox, faClipboardList, faMoneyBill, faTags, faPerson, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function AdminSidebar({ onNavigate, currentPage }) {
    const navigate = useNavigate();
    const navItems = [
        { label: 'Home', icon: faHome, id: 'home' },
        { label: 'Seller Management', icon: faUsers, id: 'sellers' },
        { label: 'Product Moderation', icon: faBox, id: 'products' },
        { label: 'Order Oversight', icon: faClipboardList, id: 'orders' },
        { label: 'Payout/Commission', icon: faMoneyBill, id: 'payouts' },
        { label: 'Category Management', icon: faTags, id: 'categories' },
        { label: 'Users', icon: faPerson, id: 'users' }
    ];

    const handleLogout = () => {
        navigate('/admin-login');
    };

    return (
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
                    onClick={handleLogout}
                >
                    <FontAwesomeIcon icon={faSignOutAlt} className={styles.navIcon} />
                    <span>Logout</span>
                </button>
            </nav>
        </aside>
    );
}

export default AdminSidebar;
