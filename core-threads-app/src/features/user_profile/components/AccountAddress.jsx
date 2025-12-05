import styles from '../styles/account.address.module.css';
import { useState } from 'react';
import { faPencil, faMapPin, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function AccountAddress() {
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            name: "John Doe",
            phone: "+1 234 567 890",
            street: "222 Pioneer Street, Robinsons Cybergate",
            city: "Mandaluyong, Metro Manila, NCR, Luzon, 6000",
            isDefault: true
        },
        {
            id: 2,
            name: "John Doe",
            phone: "+1 234 567 890",
            street: "222 Pioneer Street, Robinsons Cybergate",
            city: "Mandaluyong, Metro Manila, NCR, Luzon, 6000",
            isDefault: false
        },
        {
            id: 3,
            name: "John Doe",
            phone: "+1 234 567 890",
            street: "222 Pioneer Street, Robinsons Cybergate",
            city: "Mandaluyong, Metro Manila, NCR, Luzon, 6000",
            isDefault: false
        },
        {
            id: 4,
            name: "John Doe",
            phone: "+1 234 567 890",
            street: "222 Pioneer Street, Robinsons Cybergate",
            city: "Mandaluyong, Metro Manila, NCR, Luzon, 6000",
            isDefault: false
        },
        {
            id: 5,
            name: "John Doe",
            phone: "+1 234 567 890",
            street: "222 Pioneer Street, Robinsons Cybergate",
            city: "Mandaluyong, Metro Manila, NCR, Luzon, 6000",
            isDefault: false
        },
        {
            id: 6,
            name: "John Doe",
            phone: "+1 234 567 890",
            street: "222 Pioneer Street, Robinsons Cybergate",
            city: "Mandaluyong, Metro Manila, NCR, Luzon, 6000",
            isDefault: false
        }
    ]);

    const handleSetDefault = (id) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        })));
    };

    const handleEdit = (id) => {
        console.log('Edit address:', id);
        // Add edit logic here
    };

    const handleCreateNew = () => {
        console.log('Create new address');
        // Add create logic here
    };

    return (
        <div className={styles.accountAddressWrapper}>
            <div className={styles.header}>
                <h2 className={styles.title}>My Addresses</h2>
                <button className={styles.createBtn} onClick={handleCreateNew}>
                    + Create New Address
                </button>
            </div>

            <div className={styles.addressList}>
                {addresses.map(address => (
                    <div key={address.id} className={`${styles.addressCard} ${address.isDefault ? styles.isDefault : ''}`}>
                        {address.isDefault && (
                            <span className={styles.defaultBadge}>Default</span>
                        )}

                        <div className={styles.cardContent}>
                            <div className={styles.addressInfo}>
                                <div className={styles.nameRow}>
                                    <span className={styles.name}>{address.name}</span>
                                    <span className={styles.separator}>•</span>
                                    <span className={styles.phone}>
                                        <FontAwesomeIcon icon={faPhone} /> {address.phone}
                                    </span>
                                </div>

                                <div className={styles.addressDetail}>
                                    <FontAwesomeIcon icon={faMapPin} className={styles.detailIcon} />
                                    <div className={styles.detailText}>
                                        <p className={styles.street}>{address.street}</p>
                                        <p className={styles.city}>{address.city}</p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.cardActions}>
                                <button 
                                    className={styles.editBtn}
                                    onClick={() => handleEdit(address.id)}
                                >
                                    <FontAwesomeIcon icon={faPencil} /> Edit
                                </button>
                                <button 
                                    className={`${styles.defaultBtn} ${address.isDefault ? styles.isDefaultBtn : ''}`}
                                    onClick={() => handleSetDefault(address.id)}
                                    disabled={address.isDefault}
                                >
                                    Set As Default
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AccountAddress;
