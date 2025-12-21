import RegisterSection from './components/RegisterSection.jsx'
import { UserAuthNavbar } from '../../components/UserAuthNavbar/index.js';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function RegisterPage(){

    const navigate = useNavigate();
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleRegister = async (formData) => {
        try {
            const response = await fetch('http://localhost:8080/api/customers/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for session token
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Registration successful:', data);
                
                setShowSuccessModal(true);
                setTimeout(() => {
                    setShowSuccessModal(false);
                    navigate('/login');
                }, 2000);
                return null; // Success, no error
            } else {
                // Try to parse JSON error message from backend
                try {
                    const errorData = await response.json();
                    return errorData.error || 'Registration failed';
                } catch {
                    const errorText = await response.text();
                    return errorText || 'Registration failed';
                }
            }
        } catch (error) {
            console.error('Error during registration:', error);
            return 'Error during registration. Please check if the server is running.';
        }
    }

    const redirectLogin = (e) => {

        e.preventDefault();
        navigate('/login');
    }

    return(

        <>

        <UserAuthNavbar/>
        {showSuccessModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', maxWidth: '400px', width: '90%', boxShadow: '0 12px 30px rgba(0,0,0,0.15)' }}>
                    <h3 style={{ margin: '0 0 0.75rem', color: 'var(--color-primary-dark)' }}>Registration Successful!</h3>
                    <p style={{ margin: '0 0 1rem', color: '#333' }}>Your account has been created. Redirecting to login...</p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{ width: '40px', height: '40px', border: '4px solid #e0e0e0', borderTop: '4px solid var(--color-primary-dark)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                </div>
            </div>
        )}
        <RegisterSection onRegister={handleRegister} onLogin={redirectLogin}/>
        </>

    );

}


export default RegisterPage