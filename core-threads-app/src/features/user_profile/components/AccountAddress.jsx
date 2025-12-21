import styles from '../styles/account.address.module.css';
import { useState, useEffect } from 'react';
import { faPencil, faMapPin, faPhone, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { API_BASE_URL } from '../../../config/api.js';

// Sanitization function - preserves spaces, only removes dangerous HTML characters
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input
        .replace(/[<>\"']/g, '')  // Remove HTML dangerous chars
        .slice(0, 255);           // Limit to 255 chars
};

function AccountAddress() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [modalErrors, setModalErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [customer, setCustomer] = useState({ firstName: '', lastName: '', phoneNumber: '' });
    const [formData, setFormData] = useState({
        phone: '',
        street: '',
        city: ''
    });

    const fetchCustomer = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/customers/me`, {
                method: 'GET',
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setCustomer({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    phoneNumber: data.phoneNumber || ''
                });
            }
        } catch (err) {
            console.error('Error fetching customer profile:', err);
        }
    };

    // Fetch addresses and customer profile from API
    useEffect(() => {
        fetchCustomer();
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE_URL}/api/addresses`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setAddresses(data || []);
            } else if (response.status === 404) {
                // No addresses yet
                setAddresses([]);
            } else {
                const errorData = await response.json().catch(() => ({}));
                setError(errorData.error || 'Failed to load addresses');
            }
        } catch (err) {
            console.error('Error fetching addresses:', err);
            setError('Failed to load addresses: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (address = null) => {
        if (address) {
            // Edit mode
            setIsEditing(true);
            setEditingId(address.id);
            setFormData({
                phone: address.phone,
                street: address.street,
                city: address.city
            });
        } else {
            // Create mode
            setIsEditing(false);
            setEditingId(null);
            setFormData({
                phone: customer.phoneNumber || '',
                street: '',
                city: ''
            });
        }
        setModalErrors({});
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setEditingId(null);
        setFormData({ phone: customer.phoneNumber || '', street: '', city: '' });
        setModalErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: sanitizeInput(value)
        }));
        // Clear error for this field when user starts typing
        if (modalErrors[name]) {
            setModalErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!/^[0-9+\-\s()]{7,}$/.test(formData.phone)) {
            errors.phone = 'Invalid phone number format';
        }

        if (!formData.street.trim()) {
            errors.street = 'Street address is required';
        } else if (formData.street.length < 5) {
            errors.street = 'Street address must be at least 5 characters';
        }

        if (!formData.city.trim()) {
            errors.city = 'City/Province/Region is required';
        } else if (formData.city.length < 3) {
            errors.city = 'City/Province/Region must be at least 3 characters';
        }

        return errors;
    };

    const handleSaveAddress = async () => {
        const errors = validateForm();
        
        if (Object.keys(errors).length > 0) {
            setModalErrors(errors);
            return;
        }

        try {
            const url = isEditing 
                ? `${API_BASE_URL}/api/addresses/${editingId}`
                : `${API_BASE_URL}/api/addresses`;

            const method = isEditing ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    phone: formData.phone,
                    street: formData.street,
                    city: formData.city
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setModalErrors({ general: errorData.error || 'Failed to save address' });
                return;
            }

            setSuccessMessage(isEditing ? 'Address updated successfully!' : 'Address created successfully!');
            handleCloseModal();
            fetchAddresses();
            
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setModalErrors({ general: 'An error occurred while saving address' });
            console.error('Error saving address:', err);
        }
    };

    const handleSetDefault = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/addresses/${id}/set-default`, {
                method: 'PATCH',
                credentials: 'include',
            });

            if (response.ok) {
                fetchAddresses();
                setSuccessMessage('Default address updated!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setError('Failed to set default address');
            }
        } catch (err) {
            console.error('Error setting default address:', err);
            setError('Failed to set default address');
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this address?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/addresses/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                fetchAddresses();
                setSuccessMessage('Address deleted successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setError('Failed to delete address');
            }
        } catch (err) {
            console.error('Error deleting address:', err);
            setError('Failed to delete address');
        }
    };

    return (
        <div className={styles.accountAddressWrapper}>
            <div className={styles.header}>
                <h2 className={styles.title}>My Addresses</h2>
                <button className={styles.createBtn} onClick={() => handleOpenModal()}>
                    + Create New Address
                </button>
            </div>

            {error && <div className={styles.errorMessage}>{error}</div>}
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

            {loading ? (
                <div className={styles.loadingMessage}>Loading addresses...</div>
            ) : addresses.length === 0 ? (
                <div className={styles.emptyMessage}>
                    <p>No addresses yet. Create your first address!</p>
                    <button className={styles.createBtn} onClick={() => handleOpenModal()}>
                        + Create New Address
                    </button>
                </div>
            ) : (
                <div className={styles.addressList}>
                    {addresses.map(address => (
                        <div key={address.id} className={`${styles.addressCard} ${address.isDefault ? styles.isDefault : ''}`}>
                            {address.isDefault && (
                                <span className={styles.defaultBadge}>Default</span>
                            )}

                            <div className={styles.cardContent}>
                                <div className={styles.addressInfo}>
                                    <div className={styles.nameRow}>
                                        <span className={styles.name}>{`${address.firstName || ''} ${address.lastName || ''}`.trim() || 'Name unavailable'}</span>
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
                                        onClick={() => handleOpenModal(address)}
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
            )}

            {showModal && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>
                                {isEditing ? 'Edit Address' : 'Create New Address'}
                            </h3>
                            <button className={styles.closeBtn} onClick={handleCloseModal}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        {modalErrors.general && (
                            <div className={styles.modalError}>{modalErrors.general}</div>
                        )}

                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>First Name</label>
                                <input
                                    type="text"
                                    value={customer.firstName}
                                    readOnly
                                    className={styles.formInput}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Last Name</label>
                                <input
                                    type="text"
                                    value={customer.lastName}
                                    readOnly
                                    className={styles.formInput}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={styles.formInput}
                                    placeholder="Enter phone number"
                                    style={modalErrors.phone ? {borderColor: '#d32f2f', borderWidth: '2px'} : {}}
                                />
                                {modalErrors.phone && (
                                    <span className={styles.fieldError}>{modalErrors.phone}</span>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Street Address</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    className={styles.formInput}
                                    placeholder="Enter street address"
                                    style={modalErrors.street ? {borderColor: '#d32f2f', borderWidth: '2px'} : {}}
                                />
                                {modalErrors.street && (
                                    <span className={styles.fieldError}>{modalErrors.street}</span>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>City/Province/Region</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className={styles.formInput}
                                    placeholder="Enter city, province, region"
                                    style={modalErrors.city ? {borderColor: '#d32f2f', borderWidth: '2px'} : {}}
                                />
                                {modalErrors.city && (
                                    <span className={styles.fieldError}>{modalErrors.city}</span>
                                )}
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button className={styles.cancelBtn} onClick={handleCloseModal}>
                                Cancel
                            </button>
                            <button className={styles.saveBtn} onClick={handleSaveAddress}>
                                {isEditing ? 'Save Changes' : 'Create Address'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AccountAddress;
