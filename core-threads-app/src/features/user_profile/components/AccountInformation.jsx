import styles from '../styles/account.information.module.css';
import { useState } from 'react';

function AccountInformation() {
    const [formData, setFormData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 234 567 890',
        dateOfBirth: '1990-01-15',
        gender: 'male',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        // Save logic here
        console.log('Saving details:', formData);
    };

    return (
        <div className={styles.accountInformationWrapper}>
            <h2 className={styles.sectionTitle}>Personal Details</h2>
            <form className={styles.detailsForm} onSubmit={handleSave}>
                <div className={styles.gridRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="firstName" className={styles.label}>First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            className={styles.input}
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="lastName" className={styles.label}>Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className={styles.input}
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className={styles.gridRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={styles.input}
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="phone" className={styles.label}>Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className={styles.input}
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className={styles.gridRow}>
                    <div className={styles.formGroup}>
                        <label htmlFor="dateOfBirth" className={styles.label}>Date of Birth</label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            name="dateOfBirth"
                            className={styles.input}
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Gender</label>
                        <div className={styles.radioGroup}>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="male"
                                    checked={formData.gender === 'male'}
                                    onChange={handleInputChange}
                                    className={styles.radioInput}
                                />
                                Male
                            </label>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="female"
                                    checked={formData.gender === 'female'}
                                    onChange={handleInputChange}
                                    className={styles.radioInput}
                                />
                                Female
                            </label>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="other"
                                    checked={formData.gender === 'other'}
                                    onChange={handleInputChange}
                                    className={styles.radioInput}
                                />
                                Other
                            </label>
                        </div>
                    </div>
                </div>

                <div className={styles.buttonRow}>
                    <button type="submit" className={styles.saveButton}>
                        Save Details
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AccountInformation;