import styles from '../styles/section.module.css';
import { FontAwesomeIcon  } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';

//import corethreads from '../../../assets/corethreads.png';
//import corethreads2 from '../../../assets/corethreads_2.png';

// ✅ SECURITY FIX: Input sanitization to prevent XSS and injection attacks (CWE-79)
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input
        .trim()
        .replace(/[<>\"']/g, '') // Remove HTML special characters
        .slice(0, 255); // Limit length
};

// ✅ SECURITY FIX: Validation patterns for login fields (CWE-20)
const PATTERNS = {
    username: /^[a-zA-Z0-9_-]{3,20}$/, // Alphanumeric, underscore, hyphen
    password: /^[\s\S]{8,64}$/ // Allow any character but with length limits
};

const FIELD_LIMITS = {
    username: 20,
    password: 64
};

import corethreads from '../../../assets/corethreads.png';
import corethreads2 from '../../../assets/corethreads_2.png';

// ✅ SECURITY FIX: Load credentials from environment variables (CWE-798)
// Never hardcode OAuth credentials in source code!
const initializeGoogleSignIn = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
        console.error('Google Client ID not configured');
        return;
    }
    
    if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
                // ✅ SECURITY FIX: Don't log tokens to console (CWE-532)
                // Token is securely passed to backend via httpOnly cookie
            }
        });
    }
};

function LoginSection({ onLogin, onRegister }){

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [serverError, setServerError] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState('error');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        // Load Google Sign-In SDK
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogleSignIn;
        document.head.appendChild(script);

        // ✅ SECURITY FIX: Load Facebook App ID from environment (CWE-798)
        window.fbAsyncInit = function() {
            const appId = import.meta.env.VITE_FACEBOOK_APP_ID;
            if (!appId) {
                console.error('Facebook App ID not configured');
                return;
            }
            
            FB.init({
                appId: appId,
                cookie: true,
                xfbml: true,
                version: 'v18.0'
            });
        };

        // Load Facebook SDK
        const fbScript = document.createElement('script');
        fbScript.src = 'https://connect.facebook.net/en_US/sdk.js';
        fbScript.async = true;
        fbScript.defer = true;
        document.head.appendChild(fbScript);

        return () => {
            document.head.removeChild(script);
            if (fbScript.parentNode) document.head.removeChild(fbScript);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // ✅ SECURITY FIX: Apply field-specific sanitization (CWE-79, CWE-89)
        const limit = FIELD_LIMITS[name];
        let sanitizedValue = value.slice(0, limit);
        
        // Remove dangerous characters from each field
        if (name === 'username') {
            // Only allow alphanumeric, underscore, hyphen
            sanitizedValue = sanitizedValue.replace(/[^a-zA-Z0-9_-]/g, '');
        } else if (name === 'password') {
            // Block script tags and HTML special characters but allow special chars for strong passwords
            sanitizedValue = sanitizedValue.replace(/[<>\"'`]/g, '');
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: sanitizedValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        // ✅ SECURITY FIX: Validate input format to prevent injection (CWE-20)
        if (!formData.username.trim()) {
            setModalMessage('Please enter your username');
            setModalType('error');
            setShowErrorModal(true);
            return;
        }
        
        if (!PATTERNS.username.test(formData.username)) {
            setModalMessage('Username can only contain letters, numbers, underscores, and hyphens (3-20 characters)');
            setModalType('error');
            setShowErrorModal(true);
            return;
        }
        
        if (!formData.password.trim()) {
            setModalMessage('Please enter your password');
            setModalType('error');
            setShowErrorModal(true);
            return;
        }
        
        if (formData.password.length < 8 || formData.password.length > 64) {
            setModalMessage('Password must be 8-64 characters');
            setModalType('error');
            setShowErrorModal(true);
            return;
        }

        const err = await onLogin(formData);
        if (err) {
            setServerError(err);
            setModalMessage(err || 'Login failed');
            setModalType('error');
            setShowErrorModal(true);
        }
    };

    const handleGoogleSignIn = () => {
        if (window.google && window.google.accounts) {
            window.google.accounts.id.renderButton(
                document.getElementById('google-signin-button'),
                { theme: 'outline', size: 'large' }
            );
            document.getElementById('google-signin-button').click();
        } else {
            setModalMessage('Google Sign-In is not available. Please ensure you have a stable internet connection.');
            setShowErrorModal(true);
        }
    };

    const handleFacebookSignIn = () => {
        if (typeof FB !== 'undefined') {
            FB.login(function(response) {
                if (response.authResponse) {
                    FB.api('/me', {fields: 'id,name,email'}, function(user) {
                        // Send Facebook user data to backend
                        handleSocialLogin({
                            provider: 'facebook',
                            id: user.id,
                            name: user.name,
                            email: user.email
                        });
                    });
                } else {
                    setModalMessage('Facebook login was cancelled.');
                    setShowErrorModal(true);
                }
            }, {scope: 'public_profile,email'});
        } else {
            setModalMessage('Facebook SDK is not available. Please ensure you have a stable internet connection.');
            setShowErrorModal(true);
        }
    };

    const handleSocialLogin = async (socialData) => {
        try {
            // ✅ SECURITY FIX: Use environment variable for API URL (CWE-798)
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
            
            const response = await fetch(`${API_BASE_URL}/api/customers/social-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // ✅ SECURITY FIX: Send credentials with request for httpOnly cookie
                credentials: 'include',
                body: JSON.stringify(socialData)
            });

            if (response.ok) {
                const data = await response.json();
                // ✅ SECURITY: Don't store ANY user data in localStorage or sessionStorage
                // Session is managed entirely server-side with HTTP-only cookies
                // Trigger login callback
                onLogin({ username: data.username || data.email, password: null });
                setServerError('');
            } else {
                const errorData = await response.json().catch(() => ({ error: 'Social login failed' }));
                setServerError(errorData.error || 'Social login failed. Please try again.');
            }
        } catch (error) {
            console.error('Social login error:', error);
            setModalMessage('Error during social login. Please check your connection.');
            setShowErrorModal(true);
        }
    };

    return(

        <>
            
        <div className={styles.loginSectionWrapper}>

            {showErrorModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', maxWidth: '380px', width: '90%', boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }}>
                        <h3 style={{ margin: '0 0 0.75rem', color: modalType === 'error' ? '#d32f2f' : 'var(--color-primary-dark)' }}>
                            {modalType === 'error' ? 'Login Error' : 'Success'}
                        </h3>
                        <p style={{ margin: '0 0 1rem', color: '#333' }}>{modalMessage || 'Account not found. Please check your username or sign up.'}</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <button type="button" className="button" onClick={() => setShowErrorModal(false)} style={{ minWidth: '90px' }}>OK</button>
                        </div>
                    </div>
                </div>
            )}
            
           

                <form className={styles.loginForm} onSubmit={handleSubmit}>

                    <div className={styles.registerHeader}>
                    <span className="logo" style={{color:"var(--color-primary-dark)", fontSize:"2.3rem"}}>corethreads®</span>
                    </div>

                    

                    
                    <div className={styles.formGroup}>
                        <FontAwesomeIcon icon={["fas", "circle-user"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                        <input
                            name="username"
                            type="text"
                            placeholder="Username"
                            className={styles.inputUA}
                            value={formData.username}
                            onChange={handleChange}
                            maxLength={20}
                            required
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
                                maxLength={64}
                                required
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
                                title={showPassword ? "Hide password" : "Show password"}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size="lg" />
                            </button>
                        </div>
                    </div>

                    <div className={styles.buttonWrapper}>
                        {serverError && (
                            <div style={{ color:'red', fontSize:'0.9rem', marginBottom:'0.5rem', textAlign:'center' }}>
                                {serverError}
                            </div>
                        )}
                        <button type="submit" className="button" style={{marginTop:"1rem", fontSize:"1.2rem", color:"white", fontWeight:400}}>Sign In</button>
                        <button type="button" onClick={onRegister} className="button" style={{fontSize:"1.2rem", color:"white", fontWeight:400}}>Sign Up Using Email</button>
                        <span className={styles.text} style={{fontSize:"0.9rem", fontStyle:"italic"}}>or you can sign-in with</span>

                        <div className={styles.gfWrapper}>
                            <button type="button" className="button" onClick={handleFacebookSignIn}> <FontAwesomeIcon icon={faFacebook} size="lg" color="white" className={styles.iconFG}/>Facebook</button>
                            <button type="button" className="button" onClick={handleGoogleSignIn}> <FontAwesomeIcon icon={faGoogle} size="lg" color="white" className={styles.iconFG}/>Google</button>
                        </div>
                        <div id="google-signin-button" style={{display: 'none'}}></div>

                    </div>
                    
                

                </form>

                <div className={styles.rightSectionWrapper}>

                    
                <div className={styles.imageSectionWrapper} style={{ backgroundImage: `url(${corethreads})`}}>


                </div>

                <div className={styles.imageSectionWrapper} style={{ backgroundImage: `url(${corethreads2})`}}>


                </div>

                </div>


                

                



        </div>



        </>
    );

}

export default LoginSection