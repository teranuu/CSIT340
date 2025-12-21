import styles from './seller.sidebar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faHome, faBoxOpen, faClipboardList, faChartLine, faCog } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';

function SellerSidebar({ onNavigate, currentPage }) {
    const [customerName, setCustomerName] = useState('');
    const [storeName, setStoreName] = useState('');
    const [loading, setLoading] = useState(true);

    const navItems = [
        { label: 'Home', icon: faHome, id: 'home' },
        { label: 'My Products', icon: faBoxOpen, id: 'products' },
        { label: 'Orders', icon: faClipboardList, id: 'orders' },
        { label: 'Earnings', icon: faChartLine, id: 'earnings' },
        { label: 'Shop Settings', icon: faCog, id: 'settings' }
    ];

    useEffect(() => {
        const fetchSellerInfo = async () => {
            try {
                // Fetch seller profile info
                const response = await fetch('http://localhost:8080/api/sellers/me', {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setStoreName(data.storeName || 'My Store');
                }

                // Fetch customer info from session/login endpoint
                const sessionRes = await fetch('http://localhost:8080/api/customers/validate-session', {
                    credentials: 'include'
                });

                if (sessionRes.ok) {
                    const sessionData = await sessionRes.json();
                    setCustomerName(sessionData.firstName || 'User');
                }

                setLoading(false);
            } catch (err) {
                console.error('Error fetching seller info:', err);
                setCustomerName('User');
                setStoreName('My Store');
                setLoading(false);
            }
        };

        fetchSellerInfo();

        // Listen for store name updates
        const handleStoreUpdate = () => {
            fetchSellerInfo();
        };

        window.addEventListener('storeNameUpdated', handleStoreUpdate);
        return () => window.removeEventListener('storeNameUpdated', handleStoreUpdate);
    }, []);

    return (
        <aside className={styles.sidebar}>

            <div className={styles.profileCard}>
                <div className={styles.avatar}>
                    <FontAwesomeIcon icon={faUserCircle} />
                </div>
                <div className={styles.profileText}>
                    <p className={styles.kicker}>Seller Center</p>
                    <h3 className={styles.welcome}>
                        {loading ? 'Loading...' : `Welcome, ${customerName} | ${storeName}`}
                    </h3>
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