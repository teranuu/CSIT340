import styles from '../styles/section.module.css';
import { FontAwesomeIcon  } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

import corethreads from '../../../assets/corethreads.png';
import corethreads2 from '../../../assets/corethreads_2.png';
function LoginSection({ onLogin, onRegister }){


    return(

        <>
            
        <div className={styles.loginSectionWrapper}>
            
           

                <form className={styles.loginForm} onSubmit={onLogin}>

                    <div className={styles.registerHeader}>
                    <span className="logo" style={{color:"var(--color-primary-dark)", fontSize:"2.3rem"}}>corethreads®</span>
                    </div>

                    

                    
                    <div className={styles.formGroup}>
                        <FontAwesomeIcon icon={["fas", "circle-user"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                        <input
                            // id="email"
                            // name="email"
                            // type="email"
                            // value={formData.email}
                            // onChange={handleChange}
                            // required
                            type="text"
                            placeholder="Username"
                            className={styles.inputUA}
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
                            type="password"
                            placeholder="Password"
                            className={styles.inputUA}

                        />
                    </div>

                    <div className={styles.buttonWrapper}>
                        <button type="submit" className="button" style={{marginTop:"1rem", fontSize:"1.2rem", color:"white", fontWeight:400}}>Sign In</button>
                        <button type="button" onClick={onRegister} className="button" style={{fontSize:"1.2rem", color:"white", fontWeight:400}}>Sign Up Using Email</button>
                        <span className={styles.text} style={{fontSize:"0.9rem", fontStyle:"italic"}}>or you can sign-in with</span>

                        <div className={styles.gfWrapper}>
                            <button type="button" className="button" > <FontAwesomeIcon icon={faFacebook} size="lg" color="white" className={styles.iconFG}/>Facebook</button>
                            <button type="button" className="button" > <FontAwesomeIcon icon={faGoogle} size="lg" color="white" className={styles.iconFG}/>Google</button>
                        </div>

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