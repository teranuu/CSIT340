import { UserAuthNavbar } from '../../components/UserAuthNavbar/index.js';
import LoginSection from './components/LoginSection.jsx';
import { useNavigate } from 'react-router-dom';

function LoginPage(){

    const navigate = useNavigate();
    
    const handleLogin = (e) => {
        e.preventDefault();
        navigate('/dashboard');
    }

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