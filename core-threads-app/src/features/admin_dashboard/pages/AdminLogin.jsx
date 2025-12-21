import styles from '../styles/admin.login.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { API_BASE_URL } from '../../../config/api';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { sanitizeUsername, sanitizePassword } from '../../../utils/inputSanitizer.js';

function AdminLogin(){

     const navigate = useNavigate();
     const { validateAdminSession } = useAdminAuth();
     const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        // 🔒 SECURITY: Validate and sanitize username input
        const usernameValidation = sanitizeUsername(formData.username);
        if (!usernameValidation.isValid) {
            setServerError(usernameValidation.error);
            return;
        }

        // 🔒 SECURITY: Validate and sanitize password input
        const passwordValidation = sanitizePassword(formData.password);
        if (!passwordValidation.isValid) {
            setServerError(passwordValidation.error);
            return;
        }

        setIsLoading(true);

        try {
            // 🔒 SECURITY: Clear any stale session before attempting new login
            console.log('🔄 Clearing stale session...');
            await fetch(`${API_BASE_URL}/api/customers/logout`, {
                method: 'POST',
                credentials: 'include'
            }).catch(err => console.log('Logout cleanup:', err.message));

            // Now attempt admin login with sanitized credentials
            console.log('🔐 Attempting admin login...');
            const response = await fetch(`${API_BASE_URL}/api/customers/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                // 🔒 SECURITY: Send only sanitized data to backend
                body: JSON.stringify({
                    username: usernameValidation.value,
                    password: formData.password // Password is never exposed to backend validation display
                })
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            const data = await response.json();
            console.log('Response data:', data);

            if (!response.ok) {
                if (response.status === 401) {
                    setServerError('Invalid username or password');
                } else {
                    setServerError(data.error || 'Login failed. Please try again.');
                }
                setIsLoading(false);
                return;
            }

            console.log('Admin login successful:', data);

            // Verify that the user has ADMIN role
            if (data.role !== 'ADMIN') {
                console.error('User role is not ADMIN:', data.role);
                setServerError('Access denied. Admin privileges required.');
                // Immediately logout if user is not admin
                await fetch(`${API_BASE_URL}/api/customers/logout`, {
                    method: 'POST',
                    credentials: 'include'
                }).catch(err => console.log('Logout on non-admin:', err.message));
                setIsLoading(false);
                return;
            }

            // 🔒 SECURITY: Only store non-sensitive data in sessionStorage
            sessionStorage.setItem('admin_user', JSON.stringify({
                id: data.id,
                username: data.username,
                email: data.email,
                role: data.role,
                firstName: data.firstName,
                lastName: data.lastName
                // 🔒 NEVER store password or sensitive info
            }));
            console.log('✅ Admin user authenticated and session stored securely');
            
            // ✅ FIX: Trigger admin context validation before navigating
            console.log('🔄 Validating admin session after login...');
            await validateAdminSession();
            
            // Navigate to admin dashboard
            navigate('/admin-dashboard');
        } catch (error) {
            console.error('Admin login error:', error);
            console.error('Error stack:', error.stack);
            setServerError('Network error. Please check your connection.');
        } finally {
            setIsLoading(false);
        }
    };

    return(
        <div className={styles.loginSectionWrapper}>
            <form className={styles.loginForm} onSubmit={handleSubmit}>

                <div className={styles.registerHeader}>
                    <span className="logo" style={{color:"var(--color-primary-dark)", fontSize:"2.3rem"}}>corethreads®</span>
                </div>

                <span>Admin Login</span>

                <div className={styles.formGroup}>
                    <FontAwesomeIcon icon={["fas", "circle-user"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                    <input
                        name="username"
                        type="text"
                        placeholder="Username"
                        className={styles.inputUA}
                        value={formData.username}
                        onChange={handleChange}
                        disabled={isLoading}
                    />
                </div>

                <div className={styles.formGroup}>
                    <FontAwesomeIcon icon={["fas", "key"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                    <div style={{display: 'flex', alignItems: 'center', position: 'relative', width: '100%'}}>
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className={styles.inputUA}
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                            style={{paddingRight: '2.8rem', width: '100%'}}
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
                            disabled={isLoading}
                            title={showPassword ? "Hide password" : "Show password"}
                        >
                            <FontAwesomeIcon 
                                icon={showPassword ? faEye : faEyeSlash} 
                                size="lg"
                            />
                        </button>
                    </div>
                </div>

                <div className={styles.buttonWrapper}>
                    {serverError && (
                        <div style={{ color:'red', fontSize:'0.9rem', marginBottom:'0.5rem', textAlign:'center' }}>
                            {serverError}
                        </div>
                    )}
                    <button 
                        type="submit" 
                        className="button" 
                        style={{marginTop:"1rem", fontSize:"1.2rem", color:"white", fontWeight:400}}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </div>

            </form>
        </div>
    );

}

export default AdminLogin;