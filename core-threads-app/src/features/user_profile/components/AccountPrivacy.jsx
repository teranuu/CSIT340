import styles from '../styles/account.privacy.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons';

function AccountPrivacy() {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isSellerEnabled, setIsSellerEnabled] = useState(false);
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);
    const navigate = useNavigate();

    // Initialize seller status on mount so it persists across sessions/logins
    useEffect(() => {
        const fetchSellerStatus = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/sellers/me', {
                    method: 'GET',
                    credentials: 'include'
                });
                if (res.ok) {
                    setIsSellerEnabled(true);
                } else {
                    // 404 means not a seller yet; keep disabled
                    setIsSellerEnabled(false);
                }
            } catch (e) {
                console.error('Failed to check seller status:', e);
            }
        };
        fetchSellerStatus();
    }, []);

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        console.log('Account deletion confirmed');
        // Add deletion logic here
        setShowDeleteModal(false);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
    };

    const toggleSellerStatus = async () => {
        if (isTogglingStatus) return; // Prevent double-click

        // Once enabled, keep it enabled; do not allow turning off from here
        if (isSellerEnabled) {
            return; // ignore attempts to disable per requirements
        }

        if (!isSellerEnabled) {
            // Enable seller
            setIsTogglingStatus(true);
            try {
                const response = await fetch('http://localhost:8080/api/sellers/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        storeName: 'My Store',
                        storeDescription: 'Welcome to my store!'
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Seller registered:', data);
                    setIsSellerEnabled(true);
                    alert('Seller account enabled successfully!');
                } else {
                    // If backend says already a seller, just reflect enabled state silently
                    const error = await response.json().catch(() => ({}));
                    console.error('Registration error:', error);
                    if (response.status === 409 || (error?.error && /already registered/i.test(error.error))) {
                        setIsSellerEnabled(true);
                        // No alert needed; user is already a seller
                    } else {
                        alert(`Failed to enable seller account: ${error.error || 'Unknown error'}`);
                    }
                }
            } catch (err) {
                console.error('Error enabling seller:', err);
                alert('Error enabling seller account');
            } finally {
                setIsTogglingStatus(false);
            }
        }
    };

    const handleGoToSellerDashboard = () => {
        navigate('/seller-dashboard');
    };

    return (
        <>
            <h2 className={styles.sectionTitle}>Privacy Settings</h2>
            
            <div className={styles.privacyContent}>
                {/* Seller Status Toggle Card */}
                <div className={styles.deleteCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.iconWrapper}>
                            <FontAwesomeIcon icon={faStore} className={styles.warningIcon} />
                        </div>
                        <div className={styles.cardContent}>
                            <h3 className={styles.deleteTitle}>Seller Status</h3>
                            <p className={styles.deleteDescription}>Enable or disable your seller account to start selling products on the platform.</p>
                            <p className={styles.warningNote}>⚠️ Note: Once enabled, seller status cannot be disabled.</p>
                        </div>
                    </div>
                    <div className={styles.toggleContainer}>
                        <label className={styles.toggleSwitch}>
                            <input 
                                type="checkbox" 
                                checked={isSellerEnabled}
                                onChange={toggleSellerStatus}
                                className={styles.toggleInput}
                                disabled={isSellerEnabled || isTogglingStatus}
                            />
                            <span className={styles.toggleSlider}></span>
                        </label>
                        <span className={styles.toggleLabel}>
                            {isSellerEnabled ? 'Seller Enabled' : 'Seller Disabled'}
                        </span>
                        {isSellerEnabled && (
                            <button className={styles.sellerDashboardBtn} onClick={handleGoToSellerDashboard} disabled={isTogglingStatus}>
                                Go to Seller Dashboard
                            </button>
                        )}
                    </div>
                </div>

                {/* Delete Account Card */}
                <div className={styles.deleteCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.iconWrapper}>
                            <svg className={styles.warningIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
                            </svg>
                        </div>
                        <div className={styles.cardContent}>
                            <h3 className={styles.deleteTitle}>Delete Your Account</h3>
                            <p className={styles.deleteDescription}>Permanently remove your account and all associated data. This action cannot be undone.</p>
                        </div>
                    </div>
                    <button 
                        className={styles.deleteBtn}
                        onClick={handleDeleteAccount}
                    >
                        Delete Account
                    </button>
                </div>
            </div>

            {showDeleteModal && (
                <div className={styles.modalOverlay} onClick={cancelDelete}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h3>Confirm Account Deletion</h3>
                        <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                        <div className={styles.modalActions}>
                            <button className={styles.cancelBtn} onClick={cancelDelete}>Cancel</button>
                            <button className={styles.confirmDeleteBtn} onClick={confirmDelete}>Delete Account</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AccountPrivacy;