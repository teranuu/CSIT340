import styles from '../styles/account.address.module.css';
import { useState } from 'react';
import { faPencil, faMapPin, faPhone, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function AccountAddress() {
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        phone: '',
        street: '',
        city: ''
    });

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
        const address = addresses.find(addr => addr.id === id);
        if (address) {
            setEditingAddress(address);
            setEditForm({
                name: address.name,
                phone: address.phone,
                street: address.street,
                city: address.city
            });
            setShowEditModal(true);
        }
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveEdit = () => {
        if (!editForm.name || !editForm.phone || !editForm.street || !editForm.city) {
            alert('Please fill in all fields');
            return;
        }

        setAddresses(addresses.map(addr => 
            addr.id === editingAddress.id 
                ? { ...addr, ...editForm }
                : addr
        ));
        handleCloseEditModal();
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setEditingAddress(null);
        setEditForm({ name: '', phone: '', street: '', city: '' });
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this address?');
        if (confirmDelete) {
            setAddresses(addresses.filter(addr => addr.id !== id));
        }
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
                                <button 
                                    className={styles.deleteBtn}
                                    onClick={() => handleDelete(address.id)}
                                >
                                    <FontAwesomeIcon icon={faTrash} /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showEditModal && (
                <div className={styles.modalOverlay} onClick={handleCloseEditModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Edit Address</h3>
                            <button className={styles.closeBtn} onClick={handleCloseEditModal}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleEditFormChange}
                                    className={styles.formInput}
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={editForm.phone}
                                    onChange={handleEditFormChange}
                                    className={styles.formInput}
                                    placeholder="Enter phone number"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Street Address</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={editForm.street}
                                    onChange={handleEditFormChange}
                                    className={styles.formInput}
                                    placeholder="Enter street address"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>City/Province/Region</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={editForm.city}
                                    onChange={handleEditFormChange}
                                    className={styles.formInput}
                                    placeholder="Enter city, province, region"
                                />
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.cancelBtn} onClick={handleCloseEditModal}>
                                Cancel
                            </button>
                            <button className={styles.saveBtn} onClick={handleSaveEdit}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AccountAddress;
