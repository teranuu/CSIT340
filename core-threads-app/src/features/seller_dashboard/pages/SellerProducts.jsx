import styles from '../styles/seller.products.module.css';
import SellerStatCard from '../components/SellerStatCard';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

function SellerProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({ name: '', price: '', stock: '', image: '' });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/sellers/products', {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products || []);
            } else {
                setError('Failed to fetch products');
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products');
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setFormData({ name: '', price: '', stock: '', image: '' });
        setShowAddModal(true);
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setFormData({ name: product.name, price: product.price, stock: product.stock, image: product.image });
        setShowEditModal(true);
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const res = await fetch(`http://localhost:8080/api/products/${id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                if (res.ok) {
                    setProducts(products.filter(p => p.productId !== id));
                } else {
                    alert('Failed to delete product');
                }
            } catch (err) {
                console.error('Error deleting product:', err);
                alert('Failed to delete product');
            }
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProduct = async () => {
        if (!formData.name) {
            alert('Product name is required');
            return;
        }

        // Note: Product creation via API requires POST /api/products
        // This is a placeholder - implement when product POST endpoint is ready
        alert('Product create/update requires backend product POST/PUT endpoint integration.');
        
        if (showAddModal) setShowAddModal(false);
        if (showEditModal) setShowEditModal(false);
        
        // Refresh products list
        await fetchProducts();
    };

    const statsData = [
        { title: 'Total Products', value: products.length },
        { title: 'Total Sales', value: 0 }, // TODO: Calculate from order items
        { title: 'In Stock', value: 0 } // TODO: Sum stock from variants
    ];

    if (loading) {
        return (
            <div className={styles.productsWrapper}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.productsWrapper}>
                <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

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
                {products.length > 0 ? (
                    products.map(product => (
                        <div key={product.productId} className={styles.productCard}>
                            <div className={styles.imageSection}>
                                <div className={styles.imagePlaceholder}>
                                    📦
                                </div>
                            </div>
                            <div className={styles.productInfo}>
                                <h3 className={styles.productName}>{product.name}</h3>
                                <div className={styles.detailsRow}>
                                    <span className={styles.price}>N/A</span>
                                    <span className={styles.stock}>Stock: N/A</span>
                                </div>
                                <div className={styles.salesRow}>
                                    <span className={styles.salesLabel}>
                                        {product.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.actionButtons}>
                                <button className={styles.editBtn} onClick={() => handleEditClick(product)}>
                                    <FontAwesomeIcon icon={faPencil} /> Edit
                                </button>
                                <button className={styles.deleteBtn} onClick={() => handleDeleteClick(product.productId)}>
                                    <FontAwesomeIcon icon={faTrash} /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#666' }}>
                        No products yet. Click "Add Product" to create your first product.
                    </div>
                )}
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