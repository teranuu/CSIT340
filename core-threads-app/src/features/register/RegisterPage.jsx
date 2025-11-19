import RegisterSection from './components/RegisterSection.jsx'
import { UserAuthNavbar } from '../../components/UserAuthNavbar/index.js';
import { useNavigate } from 'react-router-dom';

function RegisterPage(){

    const navigate = useNavigate();

    const handleRegister = async (formData) => {
        try {
            const response = await fetch('http://localhost:8080/api/customers/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Registration successful:', data);
                alert('Registration successful!');
                navigate('/login');
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
        <RegisterSection onRegister={handleRegister} onLogin={redirectLogin}/>
        </>

    );

}


export default RegisterPage