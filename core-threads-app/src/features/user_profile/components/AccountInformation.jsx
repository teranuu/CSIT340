import styles from '../styles/account.information.module.css';

function AccountInformation(){

    const user = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1 234 567 890",
        dateJoined: "2023-04-15",
        language: "English (US)",
        defaultAddress: "123 Street, City, ZIP, Country"
    };


    return(

        <>

        <div className={styles.accountInformationWrapper}>

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

            <button className="button">Edit User Information</button>
            <button className="button">Change Password</button>


        </div>

        </div>
        
        
        </>

    );

}

export default AccountInformation;