import styles from "../styles/seller.settings.module.css";
import SellerStatCard from '../components/SellerStatCard';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore, faToggleOn, faToggleOff, faSave, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function SellerSettings() {
    const navigate = useNavigate();
    const [storeData, setStoreData] = useState({
        storeName: '',
        storeDescription: '',
        isActive: true
    });

    const [isEditing, setIsEditing] = useState({
        name: false,
        description: false
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({ open: false, title: '', message: '', variant: 'success' });

    const openModal = (title, message, variant = 'success') => {
        setModal({ open: true, title, message, variant });
    };

    const closeModal = () => setModal((m) => ({ ...m, open: false }));

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/sellers/me', {
                    credentials: 'include'
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        setError('Seller profile not found. Please enable seller mode in Privacy Settings first.');
                    } else {
                        setError('Failed to load store settings');
                    }
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                setStoreData(prev => ({
                    ...prev,
                    storeName: data.storeName || '',
                    storeDescription: data.storeDescription || ''
                }));
                setError(null);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching store data:', err);
                setError('Error loading store settings');
                setLoading(false);
            }
        };

        fetchStoreData();
    }, []);

    const handleInputChange = (field, value) => {
        setStoreData(prev => ({ ...prev, [field]: value }));
    };

    const handleToggleEdit = (field) => {
        setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('http://localhost:8080/api/sellers/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    storeName: storeData.storeName,
                    storeDescription: storeData.storeDescription
                })
            });

            const data = await response.json();
            console.log('Save response:', response.status, data);

            if (response.ok) {
                openModal('Success', 'Store settings saved successfully!', 'success');
                setIsEditing({ name: false, description: false });
                // Trigger a storage event so sidebar can refresh
                window.dispatchEvent(new Event('storeNameUpdated'));
            } else {
                console.error('Save error:', data);
                openModal('Save Failed', `Failed to save store settings: ${data.error || 'Unknown error'}`, 'error');
            }
        } catch (err) {
            console.error('Error saving store data:', err);
            openModal('Network Error', 'Error saving store settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleVisibility = () => {
        setStoreData(prev => ({ ...prev, isActive: !prev.isActive }));
    };

    const handleLogout = () => {
        navigate('/dashboard/settings');
    };

    return (
        <div className={styles.settingsWrapper}>
            {modal.open && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={`${styles.modalHeader} ${modal.variant === 'success' ? styles.success : styles.error}`}>
                            {modal.title}
                        </div>
                        <div className={styles.modalBody}>{modal.message}</div>
                        <div className={styles.modalActions}>
                            <button type="button" className={styles.modalButton} onClick={closeModal}>OK</button>
                        </div>
                    </div>
                </div>
            )}
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
                    <button type="button" className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                        <FontAwesomeIcon icon={faSave} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </header>

            {loading ? (
                <p style={{ textAlign: 'center', padding: '2rem' }}>Loading settings...</p>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '8px', marginTop: '1rem' }}>
                    <p><strong>⚠️ {error}</strong></p>
                    <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
                        Go to your profile → Privacy Settings → Enable Seller Status to get started.
                    </p>
                </div>
            ) : (
                <>
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

                {/* Store Banner section removed as requested */}

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
            </>
            )}
        </div>
    );
}

export default SellerSettings;