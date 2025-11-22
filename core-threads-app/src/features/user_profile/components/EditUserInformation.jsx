import styles from '../styles/edit.user.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


function EditUserInformation({onBack}) {


    return(

        <>
            <div className={styles.pageWrapper}>

                <div className={styles.editUserWrapper}>

                    <div className={styles.headerWrapper}>

                        <FontAwesomeIcon icon={["fas", "less-than"]} size="lg" color="var(--color-primary-dark)" className={styles.back} onClick={onBack}/>
                        <h2>Edit Your Information</h2>

                    </div>
                    
                    
                    
                    <form className={styles.editUserForm}>

                        <div className={styles.formInputGroup}>
                            <FontAwesomeIcon icon={["fas", "circle-user"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                                <input
                                    name="username"
                                    type="text"
                                    placeholder="Username"
                                    // value={formData.username}
                                    // onChange={handleChange}
                                />
                        </div>

                        <div className={styles.formInputGroup}>
                            <FontAwesomeIcon icon={["fas", "user"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                                <input
                                    name="firstName"
                                    type="text"
                                    placeholder="First Name"
                                    // value={formData.firstName}
                                    // onChange={handleChange}
                                />
                        </div>

                        <div className={styles.formInputGroup}>
                            <FontAwesomeIcon icon={["fas", "user"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                                <input
                                    name="lastName"
                                    type="text"
                                    placeholder="Last Name"
                                    // value={formData.username}
                                    // onChange={handleChange}
                                />
                        </div>

                        <div className={styles.formInputGroup}>
                            <FontAwesomeIcon icon={["fas", "envelope"]} size="lg" color="var(--color-primary-dark)" className="icon"/>
                                <input
                                    name="emailAddress"
                                    type="text"
                                    placeholder="Email Address"
                                    // value={formData.username}
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

export default EditUserInformation