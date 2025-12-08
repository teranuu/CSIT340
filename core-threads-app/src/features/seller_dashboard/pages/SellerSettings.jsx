import styles from "../styles/seller.settings.module.css";
import SellerStatCard from '../components/SellerStatCard';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore, faImage, faToggleOn, faToggleOff, faSave, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function SellerSettings() {
    const navigate = useNavigate();
    const [storeData, setStoreData] = useState({
        storeName: 'Green Threads Co.',
        storeDescription: 'Your one-stop shop for sustainable and eco-friendly fashion. We believe in quality, comfort, and conscious living.',
        storeLogo: '🌿',
        storeBanner: '🍃',
        isActive: true
    });

    const [isEditing, setIsEditing] = useState({
        name: false,
        description: false
    });

    const handleInputChange = (field, value) => {
        setStoreData(prev => ({ ...prev, [field]: value }));
    };

    const handleToggleEdit = (field) => {
        setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSave = () => {
        // Save logic would go here (API call)
        alert('Store settings saved successfully!');
        setIsEditing({ name: false, description: false });
    };

    const handleToggleVisibility = () => {
        setStoreData(prev => ({ ...prev, isActive: !prev.isActive }));
    };

    const handleLogout = () => {
        navigate('/dashboard/settings');
    };

    return (
        <div className={styles.settingsWrapper}>
            <header className={styles.header}>
                <div>
                    <h2 className={styles.pageTitle}>Shop Settings</h2>
                    <p className={styles.subtitle}>Manage your store information and preferences</p>
                </div>
                <div className={styles.headerActions}>
                    <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        Logout
                    </button>
                    <button type="button" className={styles.saveBtn} onClick={handleSave}>
                        <FontAwesomeIcon icon={faSave} />
                        Save Changes
                    </button>
                </div>
            </header>

            <div className={styles.statusCard}>
                <SellerStatCard 
                    title="Store Status" 
                    value={storeData.isActive ? 'Active' : 'Inactive'}
                    subtitle={storeData.isActive ? 'Your store is visible to customers' : 'Your store is hidden from customers'}
                />
            </div>

            <div className={styles.settingsGrid}>
                {/* Store Name Section */}
                <div className={styles.settingCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardTitleGroup}>
                            <FontAwesomeIcon icon={faStore} className={styles.cardIcon} />
                            <h3 className={styles.cardTitle}>Store Name</h3>
                        </div>
                        <button 
                            type="button" 
                            className={styles.editBtn}
                            onClick={() => handleToggleEdit('name')}
                        >
                            {isEditing.name ? 'Cancel' : 'Edit'}
                        </button>
                    </div>
                    <div className={styles.cardBody}>
                        {isEditing.name ? (
                            <input
                                type="text"
                                className={styles.input}
                                value={storeData.storeName}
                                onChange={(e) => handleInputChange('storeName', e.target.value)}
                                placeholder="Enter store name"
                            />
                        ) : (
                            <p className={styles.displayText}>{storeData.storeName}</p>
                        )}
                    </div>
                </div>

                {/* Store Description Section */}
                <div className={styles.settingCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardTitleGroup}>
                            <FontAwesomeIcon icon={faStore} className={styles.cardIcon} />
                            <h3 className={styles.cardTitle}>Store Description</h3>
                        </div>
                        <button 
                            type="button" 
                            className={styles.editBtn}
                            onClick={() => handleToggleEdit('description')}
                        >
                            {isEditing.description ? 'Cancel' : 'Edit'}
                        </button>
                    </div>
                    <div className={styles.cardBody}>
                        {isEditing.description ? (
                            <textarea
                                className={styles.textarea}
                                value={storeData.storeDescription}
                                onChange={(e) => handleInputChange('storeDescription', e.target.value)}
                                placeholder="Enter store description"
                                rows={4}
                            />
                        ) : (
                            <p className={styles.displayText}>{storeData.storeDescription}</p>
                        )}
                    </div>
                </div>

                {/* Store Logo Section */}
                <div className={styles.settingCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardTitleGroup}>
                            <FontAwesomeIcon icon={faImage} className={styles.cardIcon} />
                            <h3 className={styles.cardTitle}>Store Logo</h3>
                        </div>
                    </div>
                    <div className={styles.cardBody}>
                        <div className={styles.uploadSection}>
                            <div className={styles.imagePreview}>
                                <span className={styles.emojiPreview}>{storeData.storeLogo}</span>
                            </div>
                            <div className={styles.uploadInfo}>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={storeData.storeLogo}
                                    onChange={(e) => handleInputChange('storeLogo', e.target.value)}
                                    placeholder="Enter emoji or upload image"
                                />
                                <p className={styles.uploadHint}>Recommended: 200x200px, PNG or JPG</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Store Banner Section */}
                <div className={styles.settingCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardTitleGroup}>
                            <FontAwesomeIcon icon={faImage} className={styles.cardIcon} />
                            <h3 className={styles.cardTitle}>Store Banner</h3>
                        </div>
                    </div>
                    <div className={styles.cardBody}>
                        <div className={styles.uploadSection}>
                            <div className={`${styles.imagePreview} ${styles.bannerPreview}`}>
                                <span className={styles.emojiPreview}>{storeData.storeBanner}</span>
                            </div>
                            <div className={styles.uploadInfo}>
                                <input
                                    type="text"
                                    className={styles.input}
                                    value={storeData.storeBanner}
                                    onChange={(e) => handleInputChange('storeBanner', e.target.value)}
                                    placeholder="Enter emoji or upload image"
                                />
                                <p className={styles.uploadHint}>Recommended: 1200x400px, PNG or JPG</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Store Visibility Section */}
                <div className={`${styles.settingCard} ${styles.fullWidth}`}>
                    <div className={styles.cardHeader}>
                        <div className={styles.cardTitleGroup}>
                            <FontAwesomeIcon 
                                icon={storeData.isActive ? faToggleOn : faToggleOff} 
                                className={`${styles.cardIcon} ${storeData.isActive ? styles.activeIcon : styles.inactiveIcon}`}
                            />
                            <div>
                                <h3 className={styles.cardTitle}>Store Visibility</h3>
                                <p className={styles.cardSubtitle}>
                                    {storeData.isActive 
                                        ? 'Your store is currently visible to all customers' 
                                        : 'Your store is currently hidden from customers'}
                                </p>
                            </div>
                        </div>
                        <label className={styles.switch}>
                            <input 
                                type="checkbox" 
                                checked={storeData.isActive}
                                onChange={handleToggleVisibility}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SellerSettings;