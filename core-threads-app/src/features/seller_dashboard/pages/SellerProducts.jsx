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
    const [formData, setFormData] = useState({ name: '', price: '', stock: '', category: 'Hoodies', description: '', productCode: '', colors: [] });
    const [formError, setFormError] = useState('');
    const [nameWarning, setNameWarning] = useState('');
    const DESCRIPTION_MAX = 500;
    const [imageFile, setImageFile] = useState(null);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

    // Delete confirmation modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState(null);
    const [deletePending, setDeletePending] = useState(false);
    const [deleteError, setDeleteError] = useState('');

    // Info/status modal for non-implemented flows or success messages
    const [infoMessage, setInfoMessage] = useState('');
    const [showInfoModal, setShowInfoModal] = useState(false);

    const ALLOWED_COLORS = ['black','white','grey','navy blue','olive green','dark blue'];

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
        setFormData({ name: '', price: '', stock: '', category: 'Hoodies', description: '', productCode: '', colors: [] });
        setFormError('');
        setImageFile(null);
        setShowAddModal(true);
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || '',
            price: product.price || '',
            stock: product.stock || '',
            category: product.category || 'Hoodies',
            description: product.description || '',
            productCode: product.productCode || '',
            colors: Array.isArray(product.colors) ? product.colors : []
        });
        setFormError('');
        setImageFile(null);
        setShowEditModal(true);
    };

    const handleDeleteClick = async (id) => {
        setDeleteTargetId(id);
        setDeleteError('');
        setShowDeleteModal(true);
    };

    // Strong frontend sanitizer for product names to mitigate injection
    // Allows letters, numbers, spaces and a safe set of punctuation.
    const sanitizeProductName = (raw) => {
        if (typeof raw !== 'string') return '';
        let v = raw
            .replace(/[\u0000-\u001F\u007F]/g, '') // strip control chars
            .replace(/[<>`"'=\\]/g, '') // remove risky meta chars
            .replace(/--+/g, '-') // collapse dashes
            .replace(/\/{2,}/g, '/') // collapse slashes
            .replace(/\s{2,}/g, ' ') // collapse multiple spaces to single
            .trim();
        // Whitelist filter (final guard): keep letters, numbers, space, and safe punctuation
        // Explicitly allow: space A-Z a-z 0-9 . , & ( ) - / # + '
        v = v.split('').filter(c => /[ A-Za-z0-9.,'&()\-\/#+]/.test(c)).join('');
        // Length cap for safety
        if (v.length > 100) v = v.slice(0, 100);
        return v;
    };

    // Light sanitizer for description: blocks angle brackets and control chars; trims and caps length
    const sanitizeDescription = (raw) => {
        if (typeof raw !== 'string') return '';
        let v = raw
            .replace(/[\u0000-\u001F\u007F]/g, '')
            .replace(/[<>`]/g, '')
            .replace(/\s{2,}/g, ' ');
        if (v.length > DESCRIPTION_MAX) v = v.slice(0, DESCRIPTION_MAX);
        return v.trimStart();
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        // default generic change (used by numeric/other fields)
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNameChange = (e) => {
        const cleaned = sanitizeProductName(e.target.value);
        const mutated = cleaned !== e.target.value;
        setFormData(prev => ({ ...prev, name: cleaned }));
        setNameWarning(mutated ? 'Some risky characters were removed.' : '');
        if (cleaned.length === 0) {
            setFormError('Product name is required');
        } else {
            setFormError('');
        }
    };

    const handleDescriptionChange = (e) => {
        const cleaned = sanitizeDescription(e.target.value);
        setFormData(prev => ({ ...prev, description: cleaned }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
        setImageFile(file);
    };

    const handleCategorySelect = (category) => {
        setFormData(prev => ({ ...prev, category }));
        setCategoryDropdownOpen(false);
    };

    const toggleColor = (color) => {
        setFormData(prev => {
            const has = prev.colors?.includes(color);
            const nextColors = has ? prev.colors.filter(c => c !== color) : [...(prev.colors||[]), color];
            return { ...prev, colors: nextColors };
        });
    };

    const handleSaveProduct = async () => {
        // Basic inline validation instead of alert
        if (!formData.name || String(formData.name).trim().length === 0) {
            setFormError('Product name is required');
            return;
        }

        // Final guard: re-sanitize before submit
        const safeName = sanitizeProductName(formData.name);
        if (!safeName) {
            setFormError('Product name is invalid after sanitization');
            return;
        }

        const payload = {
            name: safeName.trim(),
            description: sanitizeDescription(formData.description || ''),
            category: formData.category,
            price: String(formData.price || '').trim(),
            stock: formData.stock ? Number(formData.stock) : 0,
            active: true,
            colors: (formData.colors || []).filter(c => ALLOWED_COLORS.includes(c))
        };

        try {
            if (showAddModal) {
                // Create product via seller endpoint
                const res = await fetch('http://localhost:8080/api/sellers/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                });
                if (!res.ok) {
                    const err = await res.json().catch(() => ({ error: 'Failed to create product' }));
                    setFormError(err.error || 'Failed to create product');
                    return;
                }
                const created = await res.json();
                // Upload image if selected
                if (imageFile) {
                    const fd = new FormData();
                    fd.append('file', imageFile);
                    const imgRes = await fetch(`http://localhost:8080/api/sellers/products/${created.productId}/image`, {
                        method: 'POST',
                        credentials: 'include',
                        body: fd
                    });
                    if (!imgRes.ok) {
                        console.warn('Failed to upload image');
                    }
                }
            } else if (showEditModal && editingProduct) {
                // Update product via seller endpoint
                console.log('=== EDIT PRODUCT FRONTEND ===');
                console.log('Product ID:', editingProduct.productId);
                console.log('Payload:', payload);
                const res = await fetch(`http://localhost:8080/api/sellers/products/${editingProduct.productId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ ...payload, active: undefined })
                });
                console.log('Response Status:', res.status);
                console.log('Response OK:', res.ok);
                if (!res.ok) {
                    const err = await res.json().catch(() => ({ error: 'Failed to update product' }));
                    console.error('Update error:', err);
                    setFormError(err.error || 'Failed to update product');
                    return;
                }
                console.log('Product updated successfully');
                if (imageFile) {
                    const fd = new FormData();
                    fd.append('file', imageFile);
                    const imgRes = await fetch(`http://localhost:8080/api/sellers/products/${editingProduct.productId}/image`, {
                        method: 'POST',
                        credentials: 'include',
                        body: fd
                    });
                    if (!imgRes.ok) {
                        console.warn('Failed to upload image');
                    }
                }
            }
        } catch (err) {
            console.error('Save product error:', err);
            setFormError('Unexpected error while saving product');
            return;
        }

        // Close modals and refresh
        if (showAddModal) setShowAddModal(false);
        if (showEditModal) setShowEditModal(false);
        setImageFile(null);
        setFormError('');
        await fetchProducts();
    };

    const confirmDelete = async () => {
        if (!deleteTargetId) return;
        setDeletePending(true);
        setDeleteError('');
        try {
            const res = await fetch(`http://localhost:8080/api/sellers/products/${deleteTargetId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) {
                setProducts(prev => prev.filter(p => p.productId !== deleteTargetId));
                setShowDeleteModal(false);
                setDeleteTargetId(null);
            } else {
                setDeleteError('Failed to delete product');
            }
        } catch (err) {
            console.error('Error deleting product:', err);
            setDeleteError('Failed to delete product');
        } finally {
            setDeletePending(false);
        }
    };

    const totalStock = Array.isArray(products) ? products.reduce((sum, p) => sum + (Number(p?.stock) || 0), 0) : 0;
    const statsData = [
        { title: 'Total Products', value: products.length },
        { title: 'Total Sales', value: 0 },
        { title: 'In Stock', value: totalStock }
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
                                {product.imageUrl && product.imageUrl !== '/images/placeholder.png' ? (
                                    <img
                                        src={`http://localhost:8080${product.imageUrl}`}
                                        alt={product.name}
                                        className={styles.productImage}
                                        onError={(e) => { 
                                            e.currentTarget.style.display = 'none'; 
                                            const placeholder = e.currentTarget.nextElementSibling;
                                            if (placeholder) placeholder.style.display = 'grid';
                                        }}
                                    />
                                ) : null}
                                {(!product.imageUrl || product.imageUrl === '/images/placeholder.png') && (
                                    <div className={styles.imagePlaceholder}>📦</div>
                                )}
                            </div>
                            <div className={styles.productInfo}>
                                <h3 className={styles.productName}>{product.name}</h3>
                                <div className={styles.detailsRow}>
                                    <span className={styles.price}>${product.price ?? '0.00'}</span>
                                    <span className={styles.stock}>Stock: {product.stock ?? 0}</span>
                                </div>
                                <div className={styles.categoryRow}>
                                    <span className={styles.categoryBadge}>
                                        {product.category || 'Uncategorized'}
                                    </span>
                                </div>
                                {product.colors && product.colors.length > 0 && (
                                    <div className={styles.colorsRow}>
                                        {product.colors.map(color => (
                                            <span key={color} className={styles.colorBadge} data-color={color} title={color}></span>
                                        ))}
                                    </div>
                                )}
                                <div className={styles.metaRow}>
                                    <span className={styles.statusBadge}>
                                        {product.isActive ? '● Active' : '○ Inactive'}
                                    </span>
                                    {product.productCode && (
                                        <span className={styles.codeBadge}>{product.productCode}</span>
                                    )}
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
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleNameChange}
                                    onPaste={(e) => { e.preventDefault(); handleNameChange({ target: { value: e.clipboardData.getData('text') } }); }}
                                    placeholder="Enter product name"
                                />
                                {formError && (
                                    <div style={{ color: 'crimson', fontSize: '0.85rem', marginTop: '0.5rem' }}>{formError}</div>
                                )}
                                {!formError && nameWarning && (
                                    <div style={{ color: '#8a6d3b', fontSize: '0.8rem', marginTop: '0.35rem' }}>{nameWarning}</div>
                                )}
                            </div>
                            <div className={styles.formGroup}>
                                <label>Category</label>
                                <div className={styles.customDropdown}>
                                    <button 
                                        type="button"
                                        className={styles.dropdownButton}
                                        onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                                    >
                                        <span>{formData.category}</span>
                                        <span className={styles.dropdownArrow}>▼</span>
                                    </button>
                                    {categoryDropdownOpen && (
                                        <div className={styles.dropdownMenu}>
                                            {['Hoodies', 'Shirts', 'Pants', 'Kicks'].map(cat => (
                                                <div 
                                                    key={cat}
                                                    className={`${styles.dropdownItem} ${formData.category === cat ? styles.selected : ''}`}
                                                    onClick={() => handleCategorySelect(cat)}
                                                >
                                                    {cat}
                                                    {formData.category === cat && <span className={styles.checkmark}>✓</span>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Available Colors</label>
                                <div className={styles.colorGrid}>
                                    {['black','white','grey','navy blue','olive green','dark blue'].map(color => (
                                        <label key={color} className={styles.colorOption}>
                                            <input
                                                type="checkbox"
                                                checked={(formData.colors||[]).includes(color)}
                                                onChange={() => toggleColor(color)}
                                            />
                                            <span className={styles.colorSwatch} data-color={color}></span>
                                            <span className={styles.colorLabel}>{color}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Price</label>
                                <input type="number" min="0" step="0.01" name="price" value={formData.price} onChange={handleFormChange} placeholder="e.g., 25.00" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Stock</label>
                                <input type="number" min="0" name="stock" value={formData.stock} onChange={handleFormChange} placeholder="Enter quantity" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Description (optional)</label>
                                <div className={styles.textareaWrapper}>
                                    <textarea
                                        className={styles.textareaModern}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleDescriptionChange}
                                        placeholder="Describe your product"
                                        rows={4}
                                    />
                                    <div className={styles.textareaCounter}>{(formData.description || '').length}/{DESCRIPTION_MAX}</div>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Product Image</label>
                                <input key={`add-image-${showAddModal}`} type="file" accept="image/*" onChange={handleFileChange} />
                                {imageFile && <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>📁 {imageFile.name}</div>}
                            </div>
                            <div className={styles.formGroup}>
                                <label>Product Code</label>
                                <input type="text" name="productCode" value={formData.productCode} disabled placeholder="Auto-generated" />
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
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleNameChange}
                                    onPaste={(e) => { e.preventDefault(); handleNameChange({ target: { value: e.clipboardData.getData('text') } }); }}
                                />
                                {formError && (
                                    <div style={{ color: 'crimson', fontSize: '0.85rem', marginTop: '0.5rem' }}>{formError}</div>
                                )}
                                {!formError && nameWarning && (
                                    <div style={{ color: '#8a6d3b', fontSize: '0.8rem', marginTop: '0.35rem' }}>{nameWarning}</div>
                                )}
                            </div>
                            <div className={styles.formGroup}>
                                <label>Category</label>
                                <div className={styles.customDropdown}>
                                    <button 
                                        type="button"
                                        className={styles.dropdownButton}
                                        onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                                    >
                                        <span>{formData.category}</span>
                                        <span className={styles.dropdownArrow}>▼</span>
                                    </button>
                                    {categoryDropdownOpen && (
                                        <div className={styles.dropdownMenu}>
                                            {['Hoodies', 'Shirts', 'Pants', 'Kicks'].map(cat => (
                                                <div 
                                                    key={cat}
                                                    className={`${styles.dropdownItem} ${formData.category === cat ? styles.selected : ''}`}
                                                    onClick={() => handleCategorySelect(cat)}
                                                >
                                                    {cat}
                                                    {formData.category === cat && <span className={styles.checkmark}>✓</span>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Available Colors</label>
                                <div className={styles.colorGrid}>
                                    {['black','white','grey','navy blue','olive green','dark blue'].map(color => (
                                        <label key={color} className={styles.colorOption}>
                                            <input
                                                type="checkbox"
                                                checked={(formData.colors||[]).includes(color)}
                                                onChange={() => toggleColor(color)}
                                            />
                                            <span className={styles.colorSwatch} data-color={color}></span>
                                            <span className={styles.colorLabel}>{color}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Price</label>
                                <input type="number" min="0" step="0.01" name="price" value={formData.price} onChange={handleFormChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Stock</label>
                                <input type="number" min="0" name="stock" value={formData.stock} onChange={handleFormChange} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Description (optional)</label>
                                <div className={styles.textareaWrapper}>
                                    <textarea
                                        className={styles.textareaModern}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleDescriptionChange}
                                        rows={4}
                                    />
                                    <div className={styles.textareaCounter}>{(formData.description || '').length}/{DESCRIPTION_MAX}</div>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Product Image</label>
                                <input key={`edit-image-${editingProduct?.productId}`} type="file" accept="image/*" onChange={handleFileChange} />
                                {imageFile && <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>📁 {imageFile.name}</div>}
                            </div>
                            <div className={styles.formGroup}>
                                <label>Product Code</label>
                                <input type="text" name="productCode" value={formData.productCode} disabled placeholder="Auto-generated" />
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.cancelBtn} onClick={() => setShowEditModal(false)}>Cancel</button>
                            <button className={styles.saveBtn} onClick={handleSaveProduct}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className={styles.modalOverlay} onClick={() => !deletePending && setShowDeleteModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Confirm Deletion</h3>
                            <button className={styles.closeBtn} onClick={() => !deletePending && setShowDeleteModal(false)} disabled={deletePending}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <p>Are you sure you want to delete this product? This action cannot be undone.</p>
                            {deleteError && (
                                <div style={{ color: 'crimson', fontSize: '0.9rem', marginTop: '0.75rem' }}>{deleteError}</div>
                            )}
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.cancelBtn} onClick={() => setShowDeleteModal(false)} disabled={deletePending}>Cancel</button>
                            <button className={styles.deleteBtn} onClick={confirmDelete} disabled={deletePending}>
                                {deletePending ? 'Deleting…' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showInfoModal && (
                <div className={styles.modalOverlay} onClick={() => setShowInfoModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Notice</h3>
                            <button className={styles.closeBtn} onClick={() => setShowInfoModal(false)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <p>{infoMessage}</p>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.saveBtn} onClick={() => setShowInfoModal(false)}>OK</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SellerProducts;