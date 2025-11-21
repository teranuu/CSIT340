import styles from '../styles/edit.user.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


function EditUserInformation({onBack}) {


    return(

        <>
            <div className={styles.editUserWrapper}>

                <FontAwesomeIcon icon={["fas", "less-than"]} size="lg" color="var(--color-primary-dark)" className={styles.back} onClick={onBack}/>
                
                
                <form className={styles.editUserForm}>

                    <div className={styles.formInputGroup}>
                        <FontAwesomeIcon icon={["fas", "key"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                            <input
                                name="username"
                                type="text"
                                placeholder="Username"
                                // value={formData.username}
                                // onChange={handleChange}
                            />
                    </div>

                    <div className={styles.formInputGroup}>
                        <FontAwesomeIcon icon={["fas", "key"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                            <input
                                name="firstName"
                                type="text"
                                placeholder="First Name"
                                // value={formData.firstName}
                                // onChange={handleChange}
                            />
                    </div>

                    <div className={styles.formInputGroup}>
                        <FontAwesomeIcon icon={["fas", "key"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                            <input
                                name="lastName"
                                type="text"
                                placeholder="Last Name"
                                // value={formData.username}
                                // onChange={handleChange}
                            />
                    </div>


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
                        <FontAwesomeIcon icon={["fas", "key"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
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

        </>

    );

}

export default EditUserInformation