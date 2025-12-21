import styles from '../styles/section.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useState } from 'react';

// Sanitization function to prevent XSS and injection attacks
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input
        .trim()
        .replace(/[<>\"']/g, '') // Remove HTML special characters
        .slice(0, 255); // Limit length
};

// Validation patterns
const PATTERNS = {
    username: /^[a-zA-Z0-9_-]{3,20}$/, // Alphanumeric, underscore, hyphen, 3-20 chars
    firstName: /^[a-zA-Z\s'-]{1,50}$/, // Letters, spaces, hyphens, apostrophes
    lastName: /^[a-zA-Z\s'-]{1,50}$/, // Letters, spaces, hyphens, apostrophes
    password: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,128}$/ // Min 6 chars, letters + numbers
};

const FIELD_LIMITS = {
    username: 20,
    firstName: 50,
    lastName: 50,
    email: 100,
    password: 64,
    confirmPassword: 64,
    phoneNumber: 15
};

// Country codes with flags and phone code
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

function RegisterSection({onRegister, onLogin}){

    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
        gender: '',
        countryCode: 'PH',
        phoneNumber: ''
    });

    const [passwordError, setPasswordError] = useState('');
    const [serverError, setServerError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('error');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 'error' or 'success'

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Apply field-specific length limits
        const limit = FIELD_LIMITS[name];
        let sanitizedValue = value.slice(0, limit);
        
        // Remove dangerous characters from text fields
        if (name === 'username') {
            sanitizedValue = sanitizedValue.replace(/[^a-zA-Z0-9_-]/g, '');
        } else if (name === 'firstName' || name === 'lastName') {
            sanitizedValue = sanitizedValue.replace(/[^a-zA-Z\s'-]/g, '');
        } else if (name === 'email') {
            sanitizedValue = sanitizedValue.toLowerCase().replace(/[<>\"']/g, '');
        } else if (name === 'password' || name === 'confirmPassword') {
            // Allow all special characters for strong passwords, only block script injection chars
            sanitizedValue = sanitizedValue.replace(/[<>]/g, '');
        } else if (name === 'phoneNumber') {
            // Only allow digits and + for phone numbers
            sanitizedValue = sanitizedValue.replace(/[^0-9]/g, '');
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: sanitizedValue
        }));
        
        // Clear field errors when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        
        // Clear password error when user starts typing again
        if (name === 'password' && passwordError) {
            setPasswordError('');
        }
    };

    const validateUsername = (username) => {
        if (username.length < 3) {
            return 'Username must be at least 3 characters';
        }
        if (username.length > 20) {
            return 'Username must not exceed 20 characters';
        }
        if (!PATTERNS.username.test(username)) {
            return 'Username can only contain letters, numbers, underscores, and hyphens';
        }
        return '';
    };

    const validateName = (name, fieldName) => {
        if (name.length < 1) {
            return `${fieldName} is required`;
        }
        if (name.length > 50) {
            return `${fieldName} must not exceed 50 characters`;
        }
        if (!PATTERNS[fieldName.toLowerCase() === 'first' ? 'firstName' : 'lastName'].test(name)) {
            return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
        }
        return '';
    };

    const validateEmail = (email) => {
        if (email.length > 100) {
            return 'Email must not exceed 100 characters';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return '';
    };

    const validatePassword = (password) => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (password.length > 64) {
            return 'Password must not exceed 64 characters';
        }
        if (!/[a-zA-Z]/.test(password)) {
            return 'Password must contain at least one letter';
        }
        if (!/\d/.test(password)) {
            return 'Password must contain at least one number';
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            return 'Password must contain at least one special character';
        }
        return '';
    };

    // Password strength calculator
    const calculatePasswordStrength = (password) => {
        const requirements = {
            minLength: password.length >= 8,
            hasLetter: /[a-zA-Z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password)
        };

        const metCount = Object.values(requirements).filter(Boolean).length;
        let strength = 'weak';
        let color = '#ff4444';

        if (metCount >= 6) {
            strength = 'strong';
            color = '#00cc00';
        } else if (metCount >= 4) {
            strength = 'medium';
            color = '#ffaa00';
        }

        return { requirements, strength, color, score: metCount };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Clear any previous errors
        setServerError('');
        setFieldErrors({});
        
        const newFieldErrors = {};
        
        // Sanitize all inputs
        const sanitizedData = {
            username: sanitizeInput(formData.username),
            firstName: sanitizeInput(formData.firstName),
            lastName: sanitizeInput(formData.lastName),
            email: sanitizeInput(formData.email),
            password: formData.password, // Don't sanitize password, just validate
            confirmPassword: formData.confirmPassword,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender
        };
        
        // Validate username
        if (!sanitizedData.username.trim()) {
            newFieldErrors.username = 'Please enter a username';
        } else {
            const usernameError = validateUsername(sanitizedData.username);
            if (usernameError) newFieldErrors.username = usernameError;
        }
        
        // Validate first name
        if (!sanitizedData.firstName.trim()) {
            newFieldErrors.firstName = 'Please enter your first name';
        } else {
            const firstNameError = validateName(sanitizedData.firstName, 'First');
            if (firstNameError) newFieldErrors.firstName = firstNameError;
        }
        
        // Validate last name
        if (!sanitizedData.lastName.trim()) {
            newFieldErrors.lastName = 'Please enter your last name';
        } else {
            const lastNameError = validateName(sanitizedData.lastName, 'Last');
            if (lastNameError) newFieldErrors.lastName = lastNameError;
        }
        
        // Validate email
        if (!sanitizedData.email.trim()) {
            newFieldErrors.email = 'Please enter your email address';
        } else {
            const emailError = validateEmail(sanitizedData.email);
            if (emailError) newFieldErrors.email = emailError;
        }
        
        // Validate password
        if (!sanitizedData.password.trim()) {
            newFieldErrors.password = 'Please enter a password';
        } else {
            const pwdError = validatePassword(sanitizedData.password);
            if (pwdError) {
                newFieldErrors.password = pwdError;
                setPasswordError(pwdError);
            }
        }
        
        // Validate confirm password
        if (!sanitizedData.confirmPassword.trim()) {
            newFieldErrors.confirmPassword = 'Please confirm your password';
        } else if (sanitizedData.password !== sanitizedData.confirmPassword) {
            newFieldErrors.confirmPassword = 'Passwords do not match';
        }
        
        // Validate date of birth
        if (!sanitizedData.dateOfBirth.trim()) {
            newFieldErrors.dateOfBirth = 'Please select your date of birth';
        }
        
        // Validate gender
        if (!sanitizedData.gender.trim()) {
            newFieldErrors.gender = 'Please select your gender';
        }
        
        // If there are validation errors, display them
        if (Object.keys(newFieldErrors).length > 0) {
            setFieldErrors(newFieldErrors);
            setModalMessage('Please fix the errors above');
            setModalType('error');
            setShowModal(true);
            return;
        }
        
        // If validation passes, send sanitized data to backend (exclude confirmPassword)
        const { confirmPassword, ...registrationData } = sanitizedData;
        const error = await onRegister(registrationData);
        if (error) {
            setModalMessage(error);
            setModalType('error');
            setShowModal(true);
        }
    };

    return(

        <>
            
        <div className={styles.registerSectionWrapper}>

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', maxWidth: '400px', width: '90%', boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }}>
                        <h3 style={{ margin: '0 0 0.75rem', color: modalType === 'error' ? '#d32f2f' : 'var(--color-primary-dark)' }}>
                            {modalType === 'error' ? 'Registration Error' : 'Success'}
                        </h3>
                        <p style={{ margin: '0 0 1rem', color: '#333' }}>{modalMessage}</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="button" className="button" onClick={() => setShowModal(false)} style={{ minWidth: '90px' }}>OK</button>
                        </div>
                    </div>
                </div>
            )}
            
           

                <form className={styles.registerForm} onSubmit={handleSubmit}>

                    <div className={styles.registerHeader}>
                    <span className={styles.text} style={{color:"var(--color-primary-dark)"}}>Hello New User, Sign Up Here</span>
                    <FontAwesomeIcon icon={["fas", "shirt"]} size="2x" color="var(--color-primary-dark)" />
                    </div>

                    <span className={styles.text} style={{fontSize:"1.1rem", fontStyle:"italic"}}>your essentials journey starts with us today</span>
                    

                    <div className={styles.formGroupWrapper}>

                        <div className={styles.formGroup}>
                        <FontAwesomeIcon icon={["fas", "circle-user"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                        <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                            <input
                                name="username"
                                type="text"
                                placeholder="Username (3-20 characters)"
                                value={formData.username}
                                onChange={handleChange}
                                maxLength="20"
                                title="Username can only contain letters, numbers, underscores, and hyphens"
                                style={fieldErrors.username ? {borderColor: 'red', borderWidth: '2px'} : {}}
                            />
                            {fieldErrors.username && (
                                <span style={{color: 'red', fontSize: '0.85rem', marginTop: '0.25rem'}}>
                                    {fieldErrors.username}
                                </span>
                            )}
                        </div>
                    </div>


                    <div className={styles.formGroup}>
                        <FontAwesomeIcon icon={["fas", "user"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                        <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                            <input
                                name="firstName"
                                type="text"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                maxLength="50"
                                title="First name can only contain letters, spaces, hyphens, and apostrophes"
                                style={fieldErrors.firstName ? {borderColor: 'red', borderWidth: '2px'} : {}}
                            />
                            {fieldErrors.firstName && (
                                <span style={{color: 'red', fontSize: '0.85rem', marginTop: '0.25rem'}}>
                                    {fieldErrors.firstName}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <FontAwesomeIcon icon={["fas", "user"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                        <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                            <input
                                name="lastName"
                                type="text"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                maxLength="50"
                                title="Last name can only contain letters, spaces, hyphens, and apostrophes"
                                style={fieldErrors.lastName ? {borderColor: 'red', borderWidth: '2px'} : {}}
                            />
                            {fieldErrors.lastName && (
                                <span style={{color: 'red', fontSize: '0.85rem', marginTop: '0.25rem'}}>
                                    {fieldErrors.lastName}
                                </span>
                            )}
                        </div>
                    </div>

                    

                    
                    <div className={styles.formGroup}>
                        <FontAwesomeIcon icon={["fas", "envelope"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                        <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                            <input
                                name="email"
                                type="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                maxLength="100"
                                autoComplete="email"
                                style={fieldErrors.email ? {borderColor: 'red', borderWidth: '2px'} : {}}
                            />
                            {fieldErrors.email && (
                                <span style={{color: 'red', fontSize: '0.85rem', marginTop: '0.25rem'}}>
                                    {fieldErrors.email}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <FontAwesomeIcon icon={["fas", "calendar"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                        <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                            <input
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                max={new Date().toISOString().split('T')[0]}
                                style={fieldErrors.dateOfBirth ? {borderColor: 'red', borderWidth: '2px'} : {}}
                            />
                            {fieldErrors.dateOfBirth && (
                                <span style={{color: 'red', fontSize: '0.85rem', marginTop: '0.25rem'}}>
                                    {fieldErrors.dateOfBirth}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <FontAwesomeIcon icon={["fas", "person"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                        <div style={{display: 'flex', flexDirection: 'column', flex: 1, width: '100%'}}>
                            <div style={{display: 'flex', alignItems: 'center', position: 'relative', height: '2.8rem'}}>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        padding: '0.8rem 0.9rem',
                                        border: fieldErrors.gender ? '2px solid red' : '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '1rem',
                                        backgroundColor: 'var(--color-primary-light)',
                                        cursor: 'pointer',
                                        color: '#000000',
                                        boxSizing: 'border-box',
                                        appearance: 'none',
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat',
                                        backgroundPosition: 'right 0.75rem center',
                                        paddingRight: '2rem'
                                    }}
                                >
                                    <option value="" disabled style={{color: '#000000'}}>Select Gender</option>
                                    <option value="Male" style={{color: '#000000'}}>Male</option>
                                    <option value="Female" style={{color: '#000000'}}>Female</option>
                                    <option value="Other" style={{color: '#000000'}}>Other</option>
                                </select>
                            </div>
                            {fieldErrors.gender && (
                                <span style={{color: 'red', fontSize: '0.85rem', marginTop: '0.25rem'}}>
                                    {fieldErrors.gender}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <FontAwesomeIcon icon={["fas", "phone"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                        <div style={{display: 'flex', flexDirection: 'column', flex: 1, width: '100%'}}>
                            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', height: '2.8rem'}}>
                                <select
                                    name="countryCode"
                                    value={formData.countryCode}
                                    onChange={handleChange}
                                    style={{
                                        padding: '0.8rem 0.5rem',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '0.95rem',
                                        backgroundColor: 'var(--color-primary-light)',
                                        cursor: 'pointer',
                                        color: '#000000',
                                        boxSizing: 'border-box',
                                        minWidth: '120px',
                                        height: '100%'
                                    }}
                                >
                                    {COUNTRIES.map(country => (
                                        <option key={country.code} value={country.code} style={{color: '#000000'}}>
                                            {country.flag} {country.phoneCode}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    name="phoneNumber"
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    maxLength="15"
                                    style={{
                                        flex: 1,
                                        padding: '0.8rem 0.9rem',
                                        border: fieldErrors.phoneNumber ? '2px solid red' : '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        fontSize: '1rem',
                                        backgroundColor: 'var(--color-primary-light)',
                                        boxSizing: 'border-box',
                                        height: '100%'
                                    }}
                                />
                            </div>
                            {fieldErrors.phoneNumber && (
                                <span style={{color: 'red', fontSize: '0.85rem', marginTop: '0.25rem'}}>
                                    {fieldErrors.phoneNumber}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <FontAwesomeIcon icon={["fas", "key"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                        <div style={{display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', width: '100%'}}>
                            <div style={{display: 'flex', alignItems: 'center', position: 'relative', height: '2.8rem'}}>
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    maxLength="64"
                                    autoComplete="new-password"
                                    style={{...(fieldErrors.password || passwordError ? {borderColor: 'red', borderWidth: '2px'} : {}), paddingRight: '2.8rem', width: '100%', height: '100%', boxSizing: 'border-box'}}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '0.5rem',
                                        color: 'var(--color-primary-dark)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'absolute',
                                        right: '0.5rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        height: '2rem',
                                        width: '2rem',
                                        zIndex: 10
                                    }}
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size="lg" />
                                </button>
                            </div>
                            {formData.password && (() => {
                                const strength = calculatePasswordStrength(formData.password);
                                return (
                                    <div style={{marginTop: '0.5rem'}}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem'}}>
                                            <span style={{fontSize: '0.85rem', fontWeight: '500'}}>Password Strength:</span>
                                            <span style={{fontSize: '0.85rem', fontWeight: 'bold', color: strength.color}}>{strength.strength.toUpperCase()}</span>
                                        </div>
                                        <div style={{width: '100%', height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px', overflow: 'hidden'}}>
                                            <div style={{width: `${(strength.score / 6) * 100}%`, height: '100%', backgroundColor: strength.color, transition: 'width 0.3s ease, background-color 0.3s ease'}}></div>
                                        </div>
                                        <div style={{marginTop: '0.5rem', fontSize: '0.8rem'}}>
                                            <div style={{display: 'flex', alignItems: 'center', gap: '0.3rem', color: strength.requirements.minLength ? 'green' : '#666'}}>
                                                <FontAwesomeIcon icon={["fas", strength.requirements.minLength ? "check-circle" : "times-circle"]} />
                                                <span>At least 8 characters</span>
                                            </div>
                                            <div style={{display: 'flex', alignItems: 'center', gap: '0.3rem', color: strength.requirements.hasUpperCase ? 'green' : '#666'}}>
                                                <FontAwesomeIcon icon={["fas", strength.requirements.hasUpperCase ? "check-circle" : "times-circle"]} />
                                                <span>Uppercase letter</span>
                                            </div>
                                            <div style={{display: 'flex', alignItems: 'center', gap: '0.3rem', color: strength.requirements.hasLowerCase ? 'green' : '#666'}}>
                                                <FontAwesomeIcon icon={["fas", strength.requirements.hasLowerCase ? "check-circle" : "times-circle"]} />
                                                <span>Lowercase letter</span>
                                            </div>
                                            <div style={{display: 'flex', alignItems: 'center', gap: '0.3rem', color: strength.requirements.hasNumber ? 'green' : '#666'}}>
                                                <FontAwesomeIcon icon={["fas", strength.requirements.hasNumber ? "check-circle" : "times-circle"]} />
                                                <span>Number</span>
                                            </div>
                                            <div style={{display: 'flex', alignItems: 'center', gap: '0.3rem', color: strength.requirements.hasSpecial ? 'green' : '#666'}}>
                                                <FontAwesomeIcon icon={["fas", strength.requirements.hasSpecial ? "check-circle" : "times-circle"]} />
                                                <span>Special character (!@#$%^&*...)</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                            {(fieldErrors.password || passwordError) && (
                                <span style={{color: 'red', fontSize: '0.85rem', marginTop: '0.25rem'}}>
                                    {fieldErrors.password || passwordError}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className={styles.formGroup}>

                        <FontAwesomeIcon icon={["fas", "lock"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                        <div style={{display: 'flex', flexDirection: 'column', flex: 1, width: '100%'}}>
                            <div style={{display: 'flex', alignItems: 'center', position: 'relative', height: '2.8rem'}}>
                                <input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    maxLength="64"
                                    autoComplete="new-password"
                                    style={{...(fieldErrors.confirmPassword ? {borderColor: 'red', borderWidth: '2px'} : {}), paddingRight: '2.8rem', width: '100%', height: '100%', boxSizing: 'border-box'}}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '0.5rem',
                                        color: 'var(--color-primary-dark)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'absolute',
                                        right: '0.5rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        height: '2rem',
                                        width: '2rem',
                                        zIndex: 10
                                    }}
                                    title={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} size="lg" />
                                </button>
                            </div>
                            {fieldErrors.confirmPassword && (
                                <span style={{color: 'red', fontSize: '0.85rem', marginTop: '0.25rem'}}>
                                    {fieldErrors.confirmPassword}
                                </span>
                            )}
                        </div>
                    </div>


                    </div>
                    

                    <div className={styles.buttonWrapper}>
                        <button type="submit" className="button" style={{marginTop:"1rem", fontSize:"1.2rem", color:"white", fontStyle:"italic"}}>Sign Up</button>
                    <button type="button" onClick={onLogin} className="button" style={{marginTop:"1rem", fontSize:"1.2rem", color:"white", fontStyle:"italic"}}>Go Back to Login</button>
                    </div>
                    
                    <span className={styles.text} style={{ fontSize: "0.9rem", fontWeight: 400 }}>
                        Already have an account?{" "}
                        <Link 
                            to="/login" 
                            style={{ 
                            color: "var(--color-primary-dark)", 
                            textDecoration: "underline", 
                            fontWeight: 600 
                            }}
                        >
                        Sign in here
                    </Link>
                    </span>

                </form>

                

                



        </div>



        </>
    );

}

export default RegisterSection