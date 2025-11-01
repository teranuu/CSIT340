import styles from '../styles/section.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
function RegisterSection(){


    return(

        <>
            
        <div className={styles.registerSectionWrapper}>
            
           

                <form className={styles.registerForm}>

                    <div className={styles.registerHeader}>
                    <span className={styles.text} style={{color:"var(--color-primary-dark)"}}>Hello New User, Sign Up Here</span>
                    <FontAwesomeIcon icon={["fas", "shirt"]} size="2x" color="var(--color-primary-dark)" />
                    </div>

                    <span className={styles.text} style={{fontSize:"1.1rem", fontStyle:"italic"}}>your essentials journey starts with us today</span>
                    

                    
                    <div className={styles.formGroup}>
                        <FontAwesomeIcon icon={["fas", "circle-user"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                        <input
                            // id="email"
                            // name="email"
                            // type="email"
                            // value={formData.email}
                            // onChange={handleChange}
                            // required
                            placeholder="Username"
                        />
                    </div>


                    <div className={styles.formGroup}>
                        <FontAwesomeIcon icon={["fas", "user"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                        <input
                            // id="email"
                            // name="email"
                            // type="email"
                            // value={formData.email}
                            // onChange={handleChange}
                            // required
                            placeholder="First Name"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <FontAwesomeIcon icon={["fas", "user"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                        <input
                            // id="email"
                            // name="email"
                            // type="email"
                            // value={formData.email}
                            // onChange={handleChange}
                            // required
                            placeholder="Last Name"
                        />
                    </div>

                    

                    
                    <div className={styles.formGroup}>
                        <FontAwesomeIcon icon={["fas", "envelope"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                        <input
                            // id="email"
                            // name="email"
                            // type="email"
                            // value={formData.email}
                            // onChange={handleChange}
                            // required
                            placeholder="Email Address"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <FontAwesomeIcon icon={["fas", "key"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                        <input
                            // id="email"
                            // name="email"
                            // type="email"
                            // value={formData.email}
                            // onChange={handleChange}
                            // required
                            placeholder="Password"
                        />
                    </div>

                    <div className={styles.formGroup}>

                        <FontAwesomeIcon icon={["fas", "lock"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                        <input
                            // id="email"
                            // name="email"
                            // type="email"
                            // value={formData.email}
                            // onChange={handleChange}
                            // required
                            placeholder="Confirm Password"
                        />
                    </div>

                    <div className={styles.buttonWrapper}>
                        <button type="submit" className="button" style={{marginTop:"1rem", fontSize:"1.2rem", color:"white", fontStyle:"italic"}}>Sign Up</button>
                    <button type="submit" className="button" style={{marginTop:"1rem", fontSize:"1.2rem", color:"white", fontStyle:"italic"}}>Go Back to Login</button>
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