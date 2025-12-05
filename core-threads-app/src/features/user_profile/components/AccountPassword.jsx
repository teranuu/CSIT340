import styles from '../styles/account.password.module.css';
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function AccountPassword() {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [showPasswords, setShowPasswords] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        console.log('Saving password:', formData);
        // Add save logic here
    };

    const handleReset = () => {
        setFormData({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    return (
        <div className={styles.changePasswordWrapper}>
            <h2 className={styles.sectionTitle}>Change Password</h2>
            
            <form className={styles.passwordForm} onSubmit={handleSave}>
                {/* Old and New Password Row */}
                <div className={styles.passwordRow}>
                    {/* Old Password */}
                    <div className={styles.formGroup}>
                        <label htmlFor="oldPassword" className={styles.label}>
                            Old Password
                        </label>
                        <div className={styles.passwordInputWrapper}>
                            <input
                                type={showPasswords.oldPassword ? 'text' : 'password'}
                                id="oldPassword"
                                name="oldPassword"
                                className={styles.input}
                                placeholder="••••••••"
                                value={formData.oldPassword}
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                className={styles.toggleBtn}
                                onClick={() => togglePasswordVisibility('oldPassword')}
                                aria-label="Toggle password visibility"
                            >
                                <FontAwesomeIcon icon={showPasswords.oldPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className={styles.formGroup}>
                        <label htmlFor="newPassword" className={styles.label}>
                            New Password
                        </label>
                        <div className={styles.passwordInputWrapper}>
                            <input
                                type={showPasswords.newPassword ? 'text' : 'password'}
                                id="newPassword"
                                name="newPassword"
                                className={styles.input}
                                placeholder="••••••••"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                className={styles.toggleBtn}
                                onClick={() => togglePasswordVisibility('newPassword')}
                                aria-label="Toggle password visibility"
                            >
                                <FontAwesomeIcon icon={showPasswords.newPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Confirm Password - Full Width */}
                <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword" className={styles.label}>
                        Confirm Password
                    </label>
                    <div className={styles.passwordInputWrapper}>
                        <input
                            type={showPasswords.confirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            className={styles.input}
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                        />
                        <button
                            type="button"
                            className={styles.toggleBtn}
                            onClick={() => togglePasswordVisibility('confirmPassword')}
                            aria-label="Toggle password visibility"
                        >
                            <FontAwesomeIcon icon={showPasswords.confirmPassword ? faEyeSlash : faEye} />
                        </button>
                    </div>
                </div>

                {/* Buttons */}
                <div className={styles.buttonGroup}>
                    <button type="submit" className={styles.saveBtn}>
                        Save Changes
                    </button>
                    <button type="button" className={styles.cancelBtn} onClick={handleReset}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AccountPassword;