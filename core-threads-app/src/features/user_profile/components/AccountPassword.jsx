import styles from '../styles/account.password.module.css';
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL } from '../../../config/api.js';
import { sanitizePassword } from '../../../utils/inputSanitizer.js';

// Password validation regex - at least 8 characters, 1 uppercase, 1 lowercase, 1 number
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// Max password length
const MAX_PASSWORD_LENGTH = 128;

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

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // 🔒 SECURITY: Real-time input sanitization - block dangerous characters immediately
        // List of dangerous characters that can be used for XSS and injection attacks
        const dangerousChars = ['<', '>', '"', "'", '&', ';', '|', '`', '$', '(', ')', '{', '}', '[', ']'];
        
        // Check if the input contains any dangerous characters
        let sanitizedValue = value;
        let hasDangerousChars = false;
        
        for (let char of dangerousChars) {
            if (sanitizedValue.includes(char)) {
                hasDangerousChars = true;
                // Remove all instances of dangerous characters
                sanitizedValue = sanitizedValue.replaceAll(char, '');
            }
        }
        
        // Also prevent null bytes and control characters
        sanitizedValue = sanitizedValue.replace(/[\x00-\x1F\x7F]/g, '');
        
        // Enforce max length
        if (sanitizedValue.length > MAX_PASSWORD_LENGTH) {
            sanitizedValue = sanitizedValue.slice(0, MAX_PASSWORD_LENGTH);
        }
        
        // Update form data with sanitized value
        setFormData(prev => ({
            ...prev,
            [name]: sanitizedValue
        }));
        
        // 🔒 SECURITY: Provide visual feedback if dangerous characters were detected
        if (hasDangerousChars) {
            setErrors(prev => ({
                ...prev,
                [name]: 'Special characters like < > " \' are not allowed'
            }));
            // Auto-clear error after 2 seconds
            setTimeout(() => {
                setErrors(prev => ({
                    ...prev,
                    [name]: ''
                }));
            }, 2000);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');

        const newErrors = {};

        // 🔒 SECURITY: Sanitize inputs to prevent injection attacks (CWE-89, CWE-79)
        const sanitizedOldPassword = sanitizePassword(formData.oldPassword);
        const sanitizedNewPassword = sanitizePassword(formData.newPassword);
        const sanitizedConfirmPassword = sanitizePassword(formData.confirmPassword);

        // 🔒 SECURITY: Validation checks
        if (!sanitizedOldPassword.trim()) {
            newErrors.oldPassword = 'Old password is required';
        }

        if (!sanitizedNewPassword.trim()) {
            newErrors.newPassword = 'New password is required';
        } else if (!PASSWORD_REGEX.test(sanitizedNewPassword)) {
            newErrors.newPassword = 'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number';
        } else if (sanitizedNewPassword.length > MAX_PASSWORD_LENGTH) {
            newErrors.newPassword = `Password must not exceed ${MAX_PASSWORD_LENGTH} characters`;
        }

        if (!sanitizedConfirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (sanitizedNewPassword !== sanitizedConfirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // 🔒 SECURITY: Check for potential injection attempts
        if (sanitizedOldPassword.includes('<') || sanitizedOldPassword.includes('>') || 
            sanitizedOldPassword.includes('"') || sanitizedOldPassword.includes("'")) {
            newErrors.oldPassword = 'Password contains invalid characters';
        }

        if (sanitizedNewPassword.includes('<') || sanitizedNewPassword.includes('>') || 
            sanitizedNewPassword.includes('"') || sanitizedNewPassword.includes("'")) {
            newErrors.newPassword = 'Password contains invalid characters';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // 🔒 SECURITY: Prevent same password reuse
        if (sanitizedOldPassword === sanitizedNewPassword) {
            setErrors({ newPassword: 'New password must be different from old password' });
            return;
        }

        try {
            setLoading(true);
            
            // 🔒 SECURITY: Send sanitized credentials to backend
            const response = await fetch(`${API_BASE_URL}/api/customers/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    oldPassword: sanitizedOldPassword,
                    newPassword: sanitizedNewPassword,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 401) {
                    setErrors({ oldPassword: 'Current password is incorrect' });
                } else if (response.status === 400) {
                    // Generic error for invalid format (prevents info disclosure)
                    setErrors({ general: errorData.error || 'Invalid password format' });
                } else {
                    setErrors({ general: errorData.error || 'Failed to change password' });
                }
                return;
            }

            // 🔒 SECURITY: Success - clear sensitive data
            setSuccessMessage('Password changed successfully!');
            setFormData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            // Auto-clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (err) {
            setErrors({ general: 'Network error. Please try again.' });
            console.error('Error changing password:', err);
        } finally {
            setLoading(false);
        }
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
            
            {errors.general && <div className={styles.errorMessage}>{errors.general}</div>}
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            
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
                                style={errors.oldPassword ? {borderColor: '#d32f2f', borderWidth: '2px'} : {}}
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
                        {errors.oldPassword && (
                            <span style={{color: '#d32f2f', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block'}}>
                                {errors.oldPassword}
                            </span>
                        )}
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
                                style={errors.newPassword ? {borderColor: '#d32f2f', borderWidth: '2px'} : {}}
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
                        {errors.newPassword && (
                            <span style={{color: '#d32f2f', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block'}}>
                                {errors.newPassword}
                            </span>
                        )}
                    </div>
                </div>

                {/* Confirm Password - Full Width */}
                <div className={styles.confirmPasswordRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword" className={styles.label}>
                            Confirm Password
                        </label>
                        <div className={styles.passwordInputWrapperConfirm}>
                            <input
                                type={showPasswords.confirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                className={styles.inputConfirm}
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                style={errors.confirmPassword ? {borderColor: '#d32f2f', borderWidth: '2px'} : {}}
                            />
                            <button
                                type="button"
                                className={styles.toggleBtnConfirm}
                                onClick={() => togglePasswordVisibility('confirmPassword')}
                                aria-label="Toggle password visibility"
                            >
                                <FontAwesomeIcon icon={showPasswords.confirmPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <span style={{color: '#d32f2f', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block'}}>
                                {errors.confirmPassword}
                            </span>
                        )}
                    </div>

                    <div className={styles.buttonGroup}>
                    <button type="submit" className={styles.saveBtn} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" className={styles.cancelBtn} onClick={handleReset}>
                        Cancel
                    </button>
                </div>
                </div>

                {/* Buttons */}
                
            </form>
        </div>
    );
}

export default AccountPassword;