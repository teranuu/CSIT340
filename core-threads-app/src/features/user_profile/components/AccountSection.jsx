
import styles from '../styles/account.section.module.css';
import AccountInformation from './AccountInformation';
import AccountWallet from './AccountWallet';
import AccountOrder from './AccountOrder';
import AccountAddress from './AccountAddress';
import AccountPassword from './AccountPassword';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faClipboardList, 
  faBell,
  faPencil
} from '@fortawesome/free-solid-svg-icons';

const MENU_SECTIONS = [
  {
    id: 'account',
    title: 'My Account',
    icon: faUser,
    items: [
      { id: 'profile', label: 'Profile', highlight: true },
      { id: 'banks', label: 'Banks & Cards' },
      { id: 'addresses', label: 'Addresses' },
      { id: 'password', label: 'Change Password' },
      { id: 'privacy', label: 'Privacy Settings' },
    ]
  },
  {
    id: 'purchase',
    title: 'My Purchase',
    icon: faClipboardList,
    items: []
  },
  {
    id: 'logout',
    title: 'Log-Out Of Your Account',
    icon: faUser,
    items: []
  },
];

function AccountSection() {
  const [activeSection, setActiveSection] = useState('profile');
  const navigate = useNavigate();

  const handleSectionClick = (id) => {
    setActiveSection(id);
  };

  const handleMainSectionClick = (sectionId) => {
    // For sections without subitems, set them as active
    if (sectionId === 'account') {
      setActiveSection('profile'); // Default to Profile when My Account is clicked
    } else if (sectionId === 'purchase') {
      setActiveSection('purchase');
    } else if (sectionId === 'notifications') {
      setActiveSection('notifications');
    } else if (sectionId === 'logout') {
      const confirmLogout = window.confirm('Are you sure you want to log out?');
      if (confirmLogout) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };
  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return <AccountInformation />;
      case 'banks': return <AccountWallet />;
      case 'addresses': return <AccountAddress />;
      case 'password': return <AccountPassword />;
      case 'purchase': return <AccountOrder />;
      default: return <div>Coming soon...</div>;
    }
  };

  return (
    <div className={styles.accountSectionWrapper}>
      <div className={styles.accountNavbarWrapper}>
        {/* Profile Header */}
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            <FontAwesomeIcon icon={faUser} className={styles.avatarIcon} />
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.username}>dcayacap123</div>
            <button className={styles.editProfileBtn}>
              <FontAwesomeIcon icon={faPencil} className={styles.editIcon} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* LEFT SIDEBAR */}
        <nav className={styles.accountNavbar}>
          {MENU_SECTIONS.map(section => (
            <div key={section.id} className={styles.menuSection}>
              <button
                className={`${styles.sectionHeader} ${
                  section.items.length === 0 && activeSection === section.id ? styles.activeSectionHeader : ''
                }`}
                onClick={() => handleMainSectionClick(section.id)}
              >
                <FontAwesomeIcon icon={section.icon} className={styles.sectionIcon} />
                <span>{section.title}</span>
              </button>
              
              {section.items.length > 0 && (
                <ul className={styles.submenu}>
                  {section.items.map(item => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={`${styles.submenuButton} ${
                          activeSection === item.id ? styles.activeSubmenu : ''
                        } ${item.highlight ? styles.highlight : ''}`}
                        onClick={() => handleSectionClick(item.id)}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
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
