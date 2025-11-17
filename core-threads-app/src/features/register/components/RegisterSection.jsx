import styles from '../styles/section.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useState } from 'react';

function RegisterSection({onRegister, onLogin}){

    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.username.trim()) {
            alert('Please enter a username');
            return;
        }
        
        if (!formData.firstName.trim()) {
            alert('Please enter your first name');
            return;
        }
        
        if (!formData.lastName.trim()) {
            alert('Please enter your last name');
            return;
        }
        
        if (!formData.email.trim()) {
            alert('Please enter your email address');
            return;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        if (!formData.password.trim()) {
            alert('Please enter a password');
            return;
        }
        
        if (!formData.confirmPassword.trim()) {
            alert('Please confirm your password');
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // If validation passes, call the onRegister function
        onRegister(e);
    };

    return(

        <>
            
        <div className={styles.registerSectionWrapper}>
            
           

                <form className={styles.registerForm} onSubmit={handleSubmit}>

                    <div className={styles.registerHeader}>
                    <span className={styles.text} style={{color:"var(--color-primary-dark)"}}>Hello New User, Sign Up Here</span>
                    <FontAwesomeIcon icon={["fas", "shirt"]} size="2x" color="var(--color-primary-dark)" />
                    </div>

                    <span className={styles.text} style={{fontSize:"1.1rem", fontStyle:"italic"}}>your essentials journey starts with us today</span>
                    

                    
                    <div className={styles.formGroup}>
                        <FontAwesomeIcon icon={["fas", "circle-user"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                        <input
                            name="username"
                            type="text"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>


                    <div className={styles.formGroup}>
                        <FontAwesomeIcon icon={["fas", "user"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                        <input
                            name="firstName"
                            type="text"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <FontAwesomeIcon icon={["fas", "user"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                        <input
                            name="lastName"
                            type="text"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>

                    

                    
                    <div className={styles.formGroup}>
                        <FontAwesomeIcon icon={["fas", "envelope"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                        <input
                            name="email"
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <FontAwesomeIcon icon={["fas", "key"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formGroup}>

                        <FontAwesomeIcon icon={["fas", "lock"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.buttonWrapper}>
                        <button type="submit" className="button" style={{marginTop:"1rem", fontSize:"1.2rem", color:"white", fontStyle:"italic"}}>Sign Up</button>
                    <button type="button" onClick={onLogin} className="button" style={{marginTop:"1rem", fontSize:"1.2rem", color:"white", fontStyle:"italic"}}>Go Back to Login</button>
                    </div>
                    
                    <span className={styles.text} style={{fontSize:"0.9rem", fontWeight:400}}>Already have an account? Sign in here</span>
                    {/* <span className={styles.text} style={{ fontSize: "0.9rem", fontWeight: 400 }}>
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
                    </span> */}

                </form>

                

                



        </div>



        </>
    );

}

export default RegisterSection