import styles from '../styles/change.pass.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function ChangePass({onBack}) {

    return(
        <>
        <div className={styles.pageWrapper}>

                <div className={styles.editUserWrapper}>

                    <div className={styles.headerWrapper}>

                        <FontAwesomeIcon icon={["fas", "less-than"]} size="lg" color="var(--color-primary-dark)" className={styles.back} onClick={onBack}/>
                        <h2>Change Your Password</h2>

                    </div>
                    
                    
                    
                    <form className={styles.editUserForm}>


                        <div className={styles.formInputGroup}>
                            <FontAwesomeIcon icon={["fas", "key"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="New Password"
                                    // className={styles.inputUA}
                                    // value={formData.password}
                                    // onChange={handleChange}
                                />
                        </div>

                        <div className={styles.formInputGroup}>
                            <FontAwesomeIcon icon={["fas", "lock"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm Password"
                                    // className={styles.inputUA}
                                    // value={formData.password}
                                    // onChange={handleChange}
                                />
                        </div>

                                


                    </form>

                </div>

                <div className={styles.buttonWrapper}>

                    <button className="button" onClick={() => setActiveSection('edit')}>Confirm Changes</button>
                    <button className="button" onClick={() => setActiveSection('change_pass')}>Reset Changes</button>

                </div>

            </div>
        
        </>

    );

}

export default ChangePass;