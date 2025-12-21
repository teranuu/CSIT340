import { UserAuthNavbar } from '../../components/UserAuthNavbar/index.js';
import LoginSection from './components/LoginSection.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

function LoginPage(){

    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleLogin = async ({ username, password }) => {
        const result = await login(username, password);
        if (result.success) {
            setShowSuccessModal(true);
            // Redirect to the page they tried to access, or dashboard by default
            const from = location.state?.from?.pathname || '/dashboard';
            setTimeout(() => {
                setShowSuccessModal(false);
                navigate(from, { replace: true });
            }, 2000);
            return null;
        } else {
            return result.error;
        }
    };

    const handleRegister = (e) => {
        e.preventDefault();
        navigate('/register');
    }

    return(
        <>
            <UserAuthNavbar/>
            {showSuccessModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', maxWidth: '400px', width: '90%', boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }}>
                        <h3 style={{ margin: '0 0 0.75rem', color: 'var(--color-primary-dark)' }}>Login Successful!</h3>
                        <p style={{ margin: '0 0 1rem', color: '#333' }}>Redirecting to your dashboard...</p>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ width: '40px', height: '40px', border: '4px solid #e0e0e0', borderTop: '4px solid var(--color-primary-dark)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        </div>
                    </div>
                </div>
            )}
            <LoginSection onLogin={handleLogin} onRegister={handleRegister} />
        </>
    );
}

export default LoginPage