import RegisterSection from './components/RegisterSection.jsx'
import { UserAuthNavbar } from '../../components/UserAuthNavbar/index.js';
import { useNavigate } from 'react-router-dom';

function RegisterPage(){

    const navigate = useNavigate();

    const handleRegister = (e) => {

        e.preventDefault();
        navigate('/');

    }

    const redirectLogin = (e) => {

        e.preventDefault();
        navigate('/');
    }

    return(

        <>

        <UserAuthNavbar/>
        <RegisterSection onRegister={handleRegister} onLogin={redirectLogin}/>
        </>

    );

}


export default RegisterPage