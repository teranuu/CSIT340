import styles from '../styles/account.information.module.css';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../config/api.js';

const COUNTRIES = [
    { code: 'US', name: 'United States', flag: '🇺🇸', phoneCode: '+1' },
    { code: 'PH', name: 'Philippines', flag: '🇵🇭', phoneCode: '+63' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', phoneCode: '+44' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', phoneCode: '+1' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺', phoneCode: '+61' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', phoneCode: '+81' },
    { code: 'IN', name: 'India', flag: '🇮🇳', phoneCode: '+91' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', phoneCode: '+49' },
    { code: 'FR', name: 'France', flag: '🇫🇷', phoneCode: '+33' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬', phoneCode: '+65' },
];

// Field length limits
const FIELD_LIMITS = {
    firstName: 50,
    lastName: 50,
    email: 100,
    phoneNumber: 15,
};

// Sanitization function to prevent XSS attacks
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input
        .trim()
        .replace(/[<>\"']/g, '') // Remove HTML special characters
        .slice(0, 255); // Limit length
};

// Email validation pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation (digits and + only)
const PHONE_REGEX = /^[0-9+\-\s()]*$/;

// Name validation pattern (letters, spaces, hyphens, apostrophes)
const NAME_REGEX = /^[a-zA-Z\s'-]{1,50}$/;

function AccountInformation() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        countryCode: 'PH',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    // Fetch user data from backend using session token
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Call /api/me to get current authenticated user's data
                const response = await fetch(`${API_BASE_URL}/api/customers/me`, {
                    method: 'GET',
                    credentials: 'include', // Include HTTP-only session cookie
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Session invalid or expired. Please login again.');
                    }
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setFormData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    countryCode: 'PH',
                    phoneNumber: data.phoneNumber || '',
                    dateOfBirth: data.dateOfBirth || '',
                    gender: data.gender || '',
                });
            } catch (err) {
                setError(err.message);
                console.error('Error fetching user data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let sanitizedValue = value;

        // Apply field-specific sanitization
        if (name === 'firstName' || name === 'lastName') {
            // Only allow letters, spaces, hyphens, and apostrophes
            sanitizedValue = value.slice(0, FIELD_LIMITS[name]).replace(/[^a-zA-Z\s'-]/g, '');
        } else if (name === 'email') {
            // Remove dangerous characters and limit length
            sanitizedValue = value.slice(0, FIELD_LIMITS.email).toLowerCase().replace(/[<>\"']/g, '');
        } else if (name === 'phoneNumber') {
            // Only allow digits, +, -, spaces, and parentheses
            sanitizedValue = value.slice(0, FIELD_LIMITS.phoneNumber).replace(/[^0-9+\-\s()]/g, '');
        } else if (name === 'countryCode') {
            // Validate country code from whitelist
            if (!COUNTRIES.find(c => c.code === value)) {
                return; // Don't update if invalid country code
            }
        }

        setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
        setSuccessMessage(null);
        // Clear field error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const getPhoneCodeByCountry = (countryCode) => {
        const country = COUNTRIES.find(c => c.code === countryCode);
        return country ? country.phoneCode : '+63';
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            setError(null);
            setSuccessMessage(null);
            const newFieldErrors = {};

            // Sanitize all inputs before validation
            const sanitizedData = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim().toLowerCase(),
                phoneNumber: formData.phoneNumber.trim(),
                dateOfBirth: formData.dateOfBirth.trim(),
                gender: formData.gender.trim(),
            };

            // Validate first name
            if (!sanitizedData.firstName) {
                newFieldErrors.firstName = 'First name is required';
            } else if (!NAME_REGEX.test(sanitizedData.firstName)) {
                newFieldErrors.firstName = 'First name can only contain letters, spaces, hyphens, and apostrophes';
            } else if (sanitizedData.firstName.length > FIELD_LIMITS.firstName) {
                newFieldErrors.firstName = `First name must be less than ${FIELD_LIMITS.firstName} characters`;
            }

            // Validate last name
            if (!sanitizedData.lastName) {
                newFieldErrors.lastName = 'Last name is required';
            } else if (!NAME_REGEX.test(sanitizedData.lastName)) {
                newFieldErrors.lastName = 'Last name can only contain letters, spaces, hyphens, and apostrophes';
            } else if (sanitizedData.lastName.length > FIELD_LIMITS.lastName) {
                newFieldErrors.lastName = `Last name must be less than ${FIELD_LIMITS.lastName} characters`;
            }

            // Validate email
            if (!sanitizedData.email) {
                newFieldErrors.email = 'Email is required';
            } else if (!EMAIL_REGEX.test(sanitizedData.email)) {
                newFieldErrors.email = 'Please enter a valid email address';
            } else if (sanitizedData.email.length > FIELD_LIMITS.email) {
                newFieldErrors.email = `Email must be less than ${FIELD_LIMITS.email} characters`;
            }

            // Validate phone number (if provided)
            if (sanitizedData.phoneNumber && !PHONE_REGEX.test(sanitizedData.phoneNumber)) {
                newFieldErrors.phoneNumber = 'Phone number can only contain digits, spaces, +, -, and parentheses';
            } else if (sanitizedData.phoneNumber.length > FIELD_LIMITS.phoneNumber) {
                newFieldErrors.phoneNumber = `Phone number must be less than ${FIELD_LIMITS.phoneNumber} characters`;
            }

            // Validate date of birth format if provided
            if (sanitizedData.dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(sanitizedData.dateOfBirth)) {
                newFieldErrors.dateOfBirth = 'Invalid date format';
            }

            // Validate gender if provided
            if (sanitizedData.gender && !['male', 'female', 'other', ''].includes(sanitizedData.gender)) {
                newFieldErrors.gender = 'Invalid gender selected';
            }

            // Validate country code
            if (!COUNTRIES.find(c => c.code === formData.countryCode)) {
                newFieldErrors.countryCode = 'Invalid country code';
            }

            // If there are validation errors, display them
            if (Object.keys(newFieldErrors).length > 0) {
                setFieldErrors(newFieldErrors);
                setError('Please fix the errors above');
                return;
            }

            // First, get current user's ID from /api/me
            const meResponse = await fetch(`${API_BASE_URL}/api/customers/me`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!meResponse.ok) {
                throw new Error('Session expired. Please login again.');
            }

            const currentUser = await meResponse.json();

            // Send sanitized data to backend
            const response = await fetch(`${API_BASE_URL}/api/customers/${currentUser.customerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    firstName: sanitizedData.firstName,
                    lastName: sanitizedData.lastName,
                    email: sanitizedData.email,
                    phoneNumber: sanitizedData.phoneNumber,
                    dateOfBirth: sanitizedData.dateOfBirth,
                    gender: sanitizedData.gender,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update user information');
            }

            setFieldErrors({});
            setSuccessMessage('Personal information updated successfully!');
        } catch (err) {
            setError(err.message);
            console.error('Error updating user data:', err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.accountInformationWrapper}>
                <div className={styles.loadingMessage}>Loading your information...</div>
            </div>
        );
    }

    return (
        <div className={styles.accountInformationWrapper}>
            <h2 className={styles.sectionTitle}>Personal Details</h2>
            {error && <div className={styles.errorMessage}>{error}</div>}
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            <form className={styles.detailsForm} onSubmit={handleSave}>
                <div className={styles.gridRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="firstName" className={styles.label}>First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            className={styles.input}
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            maxLength={FIELD_LIMITS.firstName}
                            required
                            style={fieldErrors.firstName ? {borderColor: '#d32f2f', borderWidth: '2px'} : {}}
                        />
                        {fieldErrors.firstName && (
                            <span style={{color: '#d32f2f', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block'}}>
                                {fieldErrors.firstName}
                            </span>
                        )}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="lastName" className={styles.label}>Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className={styles.input}
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            maxLength={FIELD_LIMITS.lastName}
                            required
                            style={fieldErrors.lastName ? {borderColor: '#d32f2f', borderWidth: '2px'} : {}}
                        />
                        {fieldErrors.lastName && (
                            <span style={{color: '#d32f2f', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block'}}>
                                {fieldErrors.lastName}
                            </span>
                        )}
                    </div>
                </div>

                <div className={styles.gridRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={styles.input}
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleInputChange}
                            maxLength={FIELD_LIMITS.email}
                            required
                            style={fieldErrors.email ? {borderColor: '#d32f2f', borderWidth: '2px'} : {}}
                        />
                        {fieldErrors.email && (
                            <span style={{color: '#d32f2f', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block'}}>
                                {fieldErrors.email}
                            </span>
                        )}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="phoneNumber" className={styles.label}>Phone Number</label>
                        <div style={{
                            display: 'flex',
                            alignItems: 'stretch',
                            border: fieldErrors.phoneNumber ? '2px solid #d32f2f' : '1px solid #ccc',
                            borderRadius: '4px',
                            backgroundColor: '#fff',
                            overflow: 'hidden',
                            height: '40px'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                paddingLeft: '10px',
                                paddingRight: '10px',
                                borderRight: '1px solid #ddd',
                                backgroundColor: '#f9f9f9'
                            }}>
                                <span style={{ fontSize: '1.1rem' }}>
                                    {COUNTRIES.find(c => c.code === formData.countryCode)?.flag}
                                </span>
                                <select
                                    name="countryCode"
                                    value={formData.countryCode}
                                    onChange={handleInputChange}
                                    style={{
                                        border: 'none',
                                        background: 'transparent',
                                        padding: '4px 2px',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        outline: 'none',
                                        fontWeight: '500',
                                        color: '#333',
                                        minWidth: '50px'
                                    }}
                                >
                                    {COUNTRIES.map(country => (
                                        <option key={country.code} value={country.code}>
                                            {country.phoneCode}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                placeholder="Phone Number"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                maxLength={FIELD_LIMITS.phoneNumber}
                                style={{
                                    border: 'none',
                                    flex: 1,
                                    padding: '0 12px',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    backgroundColor: 'transparent'
                                }}
                            />
                        </div>
                        {fieldErrors.phoneNumber && (
                            <span style={{color: '#d32f2f', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block'}}>
                                {fieldErrors.phoneNumber}
                            </span>
                        )}
                    </div>
                </div>

                <div className={styles.gridRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="dateOfBirth" className={styles.label}>Date of Birth</label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            className={styles.input}
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            style={fieldErrors.dateOfBirth ? {borderColor: '#d32f2f', borderWidth: '2px'} : {}}
                        />
                        {fieldErrors.dateOfBirth && (
                            <span style={{color: '#d32f2f', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block'}}>
                                {fieldErrors.dateOfBirth}
                            </span>
                        )}
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Gender</label>
                        <div className={styles.radioGroup}>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={formData.gender === 'male'}
                                    onChange={handleInputChange}
                                    className={styles.radioInput}
                                />
                                Male
                            </label>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={formData.gender === 'female'}
                                    onChange={handleInputChange}
                                    className={styles.radioInput}
                                />
                                Female
                            </label>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="other"
                                    checked={formData.gender === 'other'}
                                    onChange={handleInputChange}
                                    className={styles.radioInput}
                                />
                                Other
                            </label>
                        </div>
                        {fieldErrors.gender && (
                            <span style={{color: '#d32f2f', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block'}}>
                                {fieldErrors.gender}
                            </span>
                        )}
                    </div>
                </div>

                <div className={styles.buttonRow}>
                    <button type="submit" className={styles.saveButton} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Details'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AccountInformation;