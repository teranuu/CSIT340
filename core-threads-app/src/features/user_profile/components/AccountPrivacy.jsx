import styles from '../styles/account.privacy.module.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStore } from '@fortawesome/free-solid-svg-icons';

function AccountPrivacy() {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isSellerEnabled, setIsSellerEnabled] = useState(false);

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

    const toggleSellerStatus = () => {
        setIsSellerEnabled(!isSellerEnabled);
        console.log('Seller status toggled:', !isSellerEnabled);
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
                        </div>
                    </div>
                    <div className={styles.toggleContainer}>
                        <label className={styles.toggleSwitch}>
                            <input 
                                type="checkbox" 
                                checked={isSellerEnabled}
                                onChange={toggleSellerStatus}
                                className={styles.toggleInput}
                            />
                            <span className={styles.toggleSlider}></span>
                        </label>
                        <span className={styles.toggleLabel}>
                            {isSellerEnabled ? 'Seller Enabled' : 'Seller Disabled'}
                        </span>
                        {isSellerEnabled && (
                            <button className={styles.sellerDashboardBtn}>
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