import { UserAuthNavbar } from '../../components/UserAuthNavbar/index.js';
import LoginSection from './components/LoginSection.jsx';
import { useNavigate } from 'react-router-dom';

function LoginPage(){

    const navigate = useNavigate();

    const handleLogin = async ({ username, password }) => {
        try {
            const res = await fetch('http://localhost:8080/api/customers/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (res.ok) {
                const data = await res.json();
                // Store a simple session indicator for now
                localStorage.setItem('token', JSON.stringify({ user: data }));
                navigate('/dashboard');
                return null;
            } else {
                // Attempt to parse JSON error
                try {
                    const err = await res.json();
                    return err.error || 'Invalid username or password';
                } catch {
                    const txt = await res.text();
                    return txt || 'Invalid username or password';
                }
            }
        } catch (e) {
            console.error('Login error:', e);
            return 'Unable to reach server. Please try again.';
        }

    };

    const handleRegister = (e) => {
        e.preventDefault();
        navigate('/register');
    }

    return(

        <>

        <UserAuthNavbar/>
        <LoginSection onLogin={handleLogin} onRegister={handleRegister} />

        </>

    );

}


export default LoginPage