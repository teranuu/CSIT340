import styles from '../styles/seller.products.module.css';
import SellerStatCard from '../components/SellerStatCard';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

function SellerProducts() {
    const [products, setProducts] = useState([
        { id: 1, name: 'Eco Tote Bag', price: '$25.00', stock: 150, image: '🛍️', sales: 320 },
        { id: 2, name: 'Bamboo Cutlery Set', price: '$18.00', stock: 89, image: '🍴', sales: 245 },
        { id: 3, name: 'Organic Cotton Tee', price: '$35.00', stock: 200, image: '👕', sales: 180 }
    ]);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ name: '', price: '', stock: '', image: '' });

    const handleAddClick = () => {
        setFormData({ name: '', price: '', stock: '', image: '' });
        setShowAddModal(true);
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setFormData({ name: product.name, price: product.price, stock: product.stock, image: product.image });
        setShowEditModal(true);
    };

    const handleDeleteClick = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProduct = () => {
        if (!formData.name || !formData.price || !formData.stock) {
            alert('Please fill in all fields');
            return;
        }

        if (editingProduct) {
            setProducts(products.map(p => 
                p.id === editingProduct.id 
                    ? { ...p, ...formData }
                    : p
            ));
            setShowEditModal(false);
        } else {
            setProducts([...products, {
                id: Math.max(...products.map(p => p.id), 0) + 1,
                ...formData,
                sales: 0
            }]);
            setShowAddModal(false);
        }
    };

    const statsData = [
        { title: 'Total Products', value: products.length },
        { title: 'Total Sales', value: products.reduce((sum, p) => sum + p.sales, 0) },
        { title: 'In Stock', value: products.reduce((sum, p) => sum + parseInt(p.stock), 0) }
    ];

    return (
        <div className={styles.productsWrapper}>
            <div className={styles.header}>
                <h2 className={styles.title}>My Products</h2>
                <button className={styles.addBtn} onClick={handleAddClick}>
                    <FontAwesomeIcon icon={faPlus} /> Add Product
                </button>
            </div>

            <div className={styles.statsGrid}>
                {statsData.map(stat => (
                    <SellerStatCard key={stat.title} title={stat.title} value={stat.value} />
                ))}
            </div>

            <div className={styles.productsGrid}>
                {products.map(product => (
                    <div key={product.id} className={styles.productCard}>
                        <div className={styles.imageSection}>
                            <div className={styles.imagePlaceholder}>{product.image}</div>
                        </div>
                        <div className={styles.productInfo}>
                            <h3 className={styles.productName}>{product.name}</h3>
                            <div className={styles.detailsRow}>
                                <span className={styles.price}>{product.price}</span>
                                <span className={styles.stock}>Stock: {product.stock}</span>
                            </div>
                            <div className={styles.salesRow}>
                                <span className={styles.salesLabel}>Sales: {product.sales}</span>
                            </div>
                        </div>
                        <div className={styles.actionButtons}>
                            <button className={styles.editBtn} onClick={() => handleEditClick(product)}>
                                <FontAwesomeIcon icon={faPencil} /> Edit
                            </button>
                            <button className={styles.deleteBtn} onClick={() => handleDeleteClick(product.id)}>
                                <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showAddModal && (
                <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Add New Product</h3>
                            <button className={styles.closeBtn} onClick={() => setShowAddModal(false)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label>Product Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="Enter product name" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Price</label>
                                <input type="text" name="price" value={formData.price} onChange={handleFormChange} placeholder="e.g., $25.00" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Stock</label>
                                <input type="number" name="stock" value={formData.stock} onChange={handleFormChange} placeholder="Enter quantity" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Product Image/Emoji</label>
                                <input type="text" name="image" value={formData.image} onChange={handleFormChange} placeholder="e.g., 🛍️" maxLength="2" />
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.cancelBtn} onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className={styles.saveBtn} onClick={handleSaveProduct}>Add Product</button>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Edit Product</h3>
                            <button className={styles.closeBtn} onClick={() => setShowEditModal(false)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label>Product Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleFormChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Price</label>
                                <input type="text" name="price" value={formData.price} onChange={handleFormChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Stock</label>
                                <input type="number" name="stock" value={formData.stock} onChange={handleFormChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Product Image/Emoji</label>
                                <input type="text" name="image" value={formData.image} onChange={handleFormChange} maxLength="2" />
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.cancelBtn} onClick={() => setShowEditModal(false)}>Cancel</button>
                            <button className={styles.saveBtn} onClick={handleSaveProduct}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SellerProducts;