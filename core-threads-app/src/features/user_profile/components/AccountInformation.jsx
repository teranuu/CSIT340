import styles from '../styles/account.information.module.css';
import EditUserInformation from './EditUserInformation';
import ChangePass from './ChangePass';
import { useState } from 'react';


function AccountInformation(){

    const [activeSection, setActiveSection] = useState('info');

    const user = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1 234 567 890",
        dateJoined: "2023-04-15",
        language: "English (US)",
        defaultAddress: "123 Street, City, ZIP, Country"
    };

    const goBackToInfo = () => setActiveSection('info');

    const renderSection = () => {

        switch (activeSection) {
            case 'info':
                return(
                <>
                
                <div className={styles.personalDetails}>

                    <span>Personal Information</span>
                    <p><strong>Full Name:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                    <p><strong>Date Joined:</strong> {new Date(user.dateJoined).toLocaleDateString()}</p>
                    <p><strong>Preferred Language:</strong> {user.language}</p>
                    <p><strong>Default Address:</strong> {user.defaultAddress}</p>

                </div>

                <div className={styles.buttonSection}>

                <button className="button" onClick={() => setActiveSection('edit')}>Edit User Information</button>
                <button className="button" onClick={() => setActiveSection('change_pass')}>Change Password</button>

                </div>
                </>
                );
            case 'edit':
                return <EditUserInformation onBack={goBackToInfo}/>;
            case 'change_pass':
                return <ChangePass onBack={goBackToInfo}/>;
        
            default:
                return null;
        }
    }

    return(

        <>

        <div className={styles.accountInformationWrapper}>
        
        <div className={styles.sectionContent}>
                {renderSection()}
        </div>



        </div>
        
        
        </>

    );

}

export default AccountInformation;