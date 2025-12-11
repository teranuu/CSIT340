import styles from './seller.sidebar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faHome, faBoxOpen, faClipboardList, faChartLine, faCog } from '@fortawesome/free-solid-svg-icons';

function SellerSidebar({ onNavigate, currentPage }) {
    const navItems = [
        { label: 'Home', icon: faHome, id: 'home' },
        { label: 'My Products', icon: faBoxOpen, id: 'products' },
        { label: 'Orders', icon: faClipboardList, id: 'orders' },
        { label: 'Earnings', icon: faChartLine, id: 'earnings' },
        { label: 'Shop Settings', icon: faCog, id: 'settings' }
    ];

    return (
        <aside className={styles.sidebar}>

            <div className={styles.profileCard}>
                <div className={styles.avatar}>
                    <FontAwesomeIcon icon={faUserCircle} />
                </div>
                <div className={styles.profileText}>
                    <p className={styles.kicker}>Seller Center</p>
                    <h3 className={styles.welcome}>Welcome, User</h3>
                </div>
            </div>

            <nav className={styles.navList} aria-label="Seller navigation">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`${styles.navItem} ${currentPage === item.id ? styles.active : ''}`}
                        onClick={() => onNavigate(item.id)}
                    >
                        <FontAwesomeIcon icon={item.icon} className={styles.navIcon} />
                        <span>{item.label}</span>
                        {currentPage === item.id && <span className={styles.pill}>Now</span>}
                    </button>
                ))}
            </nav>
        </aside>
    );
}

export default SellerSidebar;