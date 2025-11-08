
import styles from '../styles/account.section.module.css';
import AccountInformation from './AccountInformation';
import AccountWallet from './AccountWallet';
import AccountOrder from './AccountOrder';
import { useState } from 'react';

const MENU_ITEMS = [
  { id: 'info', label: 'Account Information' },
  { id: 'wallet', label: 'My Wallet' },
  { id: 'cashback', label: 'My Cashback' },
  { id: 'orders', label: 'My Orders/Tracking' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'delete', label: 'Request Account Deletion' },
  { id: 'logout', label: 'Log-out Account' },
];

function AccountSection() {
  // 2️⃣ Local state for current section (placeholder for router)
  const [activeSection, setActiveSection] = useState('info');

  // 3️⃣ Dynamic section rendering
  const renderSection = () => {
    switch (activeSection) {
      case 'info': return <AccountInformation />;
      case 'wallet': return <AccountWallet />;
      case 'orders': return <AccountOrder />;
      default: return <div>Coming soon...</div>;
    }
  };

  return (
    <div className={styles.accountSectionWrapper}>

    <div className={styles.accountNavbarWrapper}>

       
        <h2 className="text" style={{ fontSize: "2.8rem" , margin:"0"}}>My Account</h2>
         <div className={styles.borderNavbar} />
        {/* LEFT SIDEBAR */}
        <nav className={styles.accountNavbar}>


            
            <ul className={styles.list}>
            {MENU_ITEMS.map(item => (
                <li key={item.id}>
                <button
                    className={`${styles.navButton} ${activeSection === item.id ? styles.active : ''}`}
                    onClick={() => setActiveSection(item.id)}>
                    {item.label}
                </button>
                </li>
            ))}
            </ul>
        </nav>


    </div>
        

      {/* RIGHT CONTENT */}
      <section className={styles.accountContentWrapper}>
        {renderSection()}
      </section>
    </div>
  );
}

export default AccountSection;
