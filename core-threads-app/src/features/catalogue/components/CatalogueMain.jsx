// catalogue.main.jsx
import styles from '../styles/catalogue.main.module.css';
import { ApparelCard } from '../../../components/ApparelCard/index.js';
import CategorySidebar from './CategorySidebar.jsx';
import CatalogueToolbar from './CatalogueToolbar.jsx';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL, getImageUrl, STATIC_IMAGES } from '../../../config/api.js';
import { sanitizeSearchQuery, sanitizeText, sanitizeNumber, escapeHtml } from '../../../utils/inputSanitizer.js';
import { useAuth } from '../../../context/AuthContext.jsx';

const WISHLIST_STORAGE_KEY = 'wishlist_items';

function CatalogueMain() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState(() => {
        try {
            const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.warn('Unable to read wishlist from storage', e);
            return [];
        }
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [highlightProduct, setHighlightProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [genderFilter, setGenderFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [categoryFilter, setCategoryFilter] = useState('All Products');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
    const [colorFilter, setColorFilter] = useState('All');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [initialCategory, setInitialCategory] = useState(null);

    const handleProductClick = (productName) => {
        setHighlightProduct(productName);
        setTimeout(() => setHighlightProduct(null), 2000);
    };

    const handleGenderChange = (gender) => {
        setGenderFilter(gender);
    };

    const handleSortChange = (sort) => {
        setSortBy(sort);
    };

    const handleCategoryChange = (category) => {
        setCategoryFilter(category);
    };

    const handlePriceRangeChange = (range) => {
        setPriceRange(range);
    };

    const handleColorChange = (color) => {
        setColorFilter(color);
    };

    const toggleProductSelection = (product, uniqueKey) => {
        // Prevent selecting products owned by the current user by seller id or store name
        const ownsBySeller = user?.customerId && product?.ownerCustomerId && String(user.customerId) === String(product.ownerCustomerId);
        const ownsByStore = user?.storeName && product?.storeName && String(user.storeName).toLowerCase() === String(product.storeName).toLowerCase();
        if (ownsBySeller || ownsByStore) return;
        setSelectedProducts(prev => {
            const isSelected = prev.some(p => p.uniqueKey === uniqueKey);
            if (isSelected) {
                return prev.filter(p => p.uniqueKey !== uniqueKey);
            } else {
                return [...prev, { ...product, uniqueKey }];
            }
        });
    };

    const handleCheckout = () => {
        // Store selected products in sessionStorage for cart page
        const payload = JSON.stringify(selectedProducts);
        sessionStorage.setItem('cart_items', payload);
        navigate('/dashboard/cart');
    };

    const buildImageUrl = (url) => {
        if (!url) return 'https://via.placeholder.com/300x300?text=No+Image';
        return getImageUrl(url);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/products/summary`);
                if (!response.ok) throw new Error('Failed to fetch products');
                const data = await response.json();

                // Normalize products with image URLs and static image fallbacks
                const normalized = data.map((p) => {
                    const priceValue = p.price ? Number(p.price) : 45.50;
                    const priceDisplay = priceValue.toFixed(2);
                    let image = buildImageUrl(p.imageUrl);
                    // Use static image for Grey Sweatpants
                    if (p.name === 'Grey Sweatpants') {
                        image = STATIC_IMAGES.GREY_SWEATPANTS;
                    }
                    // Add CoreThreads Shoes with static image
                    if (p.name === 'CoreThreads Shoes') {
                        image = STATIC_IMAGES.CORETHREADS_SHOES;
                    }
                    return {
                        id: p.productId || p.id,
                        title: p.name,
                        price: priceDisplay,
                        priceValue,
                        imageUrl: image,
                        gender: p.gender || 'Unisex',
                        category: p.category || 'Other',
                        color: p.color || 'Multi',
                        storeName: p.sellerStoreName || p.storeName || null,
                        ownerCustomerId: p.sellerCustomerId || null,
                        productCode: p.productCode || null,
                    };
                });

                setProducts(normalized);
                setFilteredProducts(normalized);
            } catch (err) {
                console.error('Error fetching products:', err);
                // Keep empty state on error
                setProducts([]);
                setFilteredProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        // 🔒 SECURITY: Get search query from navigation state or sessionStorage with sanitization
        const queryFromState = location.state?.searchQuery || '';
        const queryFromSession = sessionStorage.getItem('apparel_search_query') || '';
        const rawQuery = queryFromState || queryFromSession;
        
        // 🔒 Sanitize query to prevent XSS and injection attacks
        const currentQuery = sanitizeSearchQuery(rawQuery, 100);
        
        // 🔒 SECURITY: Sanitize product highlight to prevent XSS
        const productToHighlight = sanitizeText(location.state?.highlightProduct || '', 100) || null;
        setHighlightProduct(productToHighlight);
        
        // 🔒 SECURITY: Sanitize selected category to prevent injection
        const categoryFromState = location.state?.selectedCategory || null;
        if (categoryFromState && !initialCategory) {
            // Map dashboard category names to catalog category names (whitelist approach)
            const categoryMapping = {
                'All': 'All Products',
                'Hoodies': 'Hoodies',
                'Shirts': 'Shirts',
                'Pants': 'Pants',
                'Kicks': 'Kicks'
            };
            const sanitizedCategory = sanitizeText(categoryFromState, 50);
            const mappedCategory = categoryMapping[sanitizedCategory] || 'All Products';
            setInitialCategory(mappedCategory);
            setCategoryFilter(mappedCategory);
        }
        
        // Clear highlight after animation duration
        if (productToHighlight) {
            setTimeout(() => setHighlightProduct(null), 2000);
        }

        setSearchQuery(currentQuery);

        // 🔒 SECURITY: Filter products based on sanitized search query and gender
        let filtered = products;
        
        // Apply search filter (uses sanitized query)
        if (currentQuery.trim()) {
            const q = currentQuery.toLowerCase();
            filtered = filtered.filter(product =>
                product.title && product.title.toLowerCase().includes(q)
            );
        }
        
        // 🔒 SECURITY: Validate gender filter against whitelist
        const validGenders = ['all', 'male', 'female', 'unisex'];
        const safeGenderFilter = validGenders.includes(genderFilter.toLowerCase()) ? genderFilter : 'all';
        if (safeGenderFilter !== 'all') {
            filtered = filtered.filter(product =>
                product.gender && product.gender.toLowerCase() === safeGenderFilter.toLowerCase()
            );
        }
        
        // 🔒 SECURITY: Validate category filter against whitelist
        const validCategories = ['All Products', 'Hoodies', 'Shirts', 'Pants', 'Kicks', 'Other'];
        const safeCategoryFilter = validCategories.includes(categoryFilter) ? categoryFilter : 'All Products';
        if (safeCategoryFilter !== 'All Products') {
            filtered = filtered.filter(product =>
                product.category && product.category.toLowerCase() === safeCategoryFilter.toLowerCase()
            );
        }
        
        // 🔒 SECURITY: Validate and sanitize price range to prevent injection
        const minPrice = sanitizeNumber(priceRange.min, 0, 10000) ?? 0;
        const maxPrice = sanitizeNumber(priceRange.max, 0, 10000) ?? 500;
        filtered = filtered.filter(product => {
            const price = parseFloat(product.price);
            return price >= minPrice && price <= maxPrice;
        });
        
        // 🔒 SECURITY: Validate color filter against whitelist
        const validColors = ['All', 'Red', 'Blue', 'Black', 'White', 'Green', 'Multi'];
        const safeColorFilter = validColors.includes(colorFilter) ? colorFilter : 'All';
        if (safeColorFilter !== 'All') {
            filtered = filtered.filter(product =>
                product.color && product.color.toLowerCase().includes(safeColorFilter.toLowerCase())
            );
        }
        
        // 🔒 SECURITY: Validate sort option against whitelist
        const validSortOptions = ['name', 'price-low', 'price-high'];
        const safeSortBy = validSortOptions.includes(sortBy) ? sortBy : 'name';
        if (safeSortBy === 'name') {
            filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        } else if (safeSortBy === 'price-low') {
            filtered = [...filtered].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (safeSortBy === 'price-high') {
            filtered = [...filtered].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }
        
        setFilteredProducts(filtered);

        // Clear sessionStorage after reading
        if (queryFromState) {
            sessionStorage.removeItem('apparel_search_query');
        }
    }, [location, products, genderFilter, sortBy, categoryFilter, priceRange, colorFilter]);

    useEffect(() => {
        try {
            localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
        } catch (e) {
            console.warn('Unable to persist wishlist', e);
        }
    }, [wishlist]);

    const toggleWishlistItem = (item) => {
        const itemKey = item.id ?? item.title;
        if (!itemKey) return; // require a stable key to avoid toggling all items

        setWishlist((prev) => {
            const exists = prev.find((w) => String(w.key) === String(itemKey));
            if (exists) {
                return prev.filter((w) => String(w.key) !== String(itemKey));
            }
            const priceValue = item.priceValue ?? parseFloat(item.price) ?? 0;
            return [
                ...prev,
                {
                    key: itemKey,
                    id: item.id,
                    name: item.title,
                    price: priceValue,
                    imageUrl: item.imageUrl,
                    gender: item.gender,
                    category: item.category,
                    color: item.color,
                },
            ];
        });
    };

    return (
        <>
        <div className={styles.catalogueMainWrapper}>

            <div className={styles.leftContentSection}>
              <CategorySidebar
                initialCategory={initialCategory}
                onCategoryChange={handleCategoryChange}
                onPriceRangeChange={handlePriceRangeChange}
                onColorChange={handleColorChange}
              />
            </div>

            <div className={styles.rightContentSection}>
                <CatalogueToolbar 
                    onGenderChange={handleGenderChange}
                    onSortChange={handleSortChange}
                />

                {loading ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '20px 20px',
                        fontSize: '16px',
                        color: '#999'
                    }}>
                        Loading products...
                    </div>
                ) : (
                    <>
                        {searchQuery && (
                            <div style={{ 
                                padding: '15px 0', 
                                fontSize: '14px', 
                                color: '#666',
                                borderBottom: '1px solid #eee',
                                marginBottom: '15px'
                            }}>
                                Search results for "<strong>{escapeHtml(searchQuery)}</strong>" ({filteredProducts.length} results)
                            </div>
                        )}

                        {filteredProducts.length === 0 && searchQuery ? (
                            <div style={{ 
                                textAlign: 'center', 
                                padding: '40px 20px',
                                fontSize: '16px',
                                color: '#999'
                            }}>
                                No products found matching "{escapeHtml(searchQuery)}"
                            </div>
                        ) : (
                                                        <div className={styles.cardsGrid}>
                                                            {filteredProducts.map((item, idx) => {
                                                                const uniqueKey = `${item.id}-${item.title}-${idx}`;
                                                                const itemKey = item.id ?? item.title;
                                                                const wishlisted = itemKey ? wishlist.some((w) => String(w.key) === String(itemKey)) : false;
                                                                const isOwner = !!(
                                                                    (user?.customerId && item?.ownerCustomerId && String(user.customerId) === String(item.ownerCustomerId)) ||
                                                                    (user?.storeName && item?.storeName && String(user.storeName).toLowerCase() === String(item.storeName).toLowerCase())
                                                                );
                                                                return (
                                                                    <ApparelCard
                                                                        key={uniqueKey}
                                                                        id={item.id}
                                                                        name={item.title}
                                                                        price={`$${item.price}`}
                                                                        image={item.imageUrl}
                                                                        onClick={() => handleProductClick(item.title)}
                                                                        isHighlighted={highlightProduct === item.title}
                                                                        gender={item.gender}
                                                                        isSelected={selectedProducts.some(p => p.uniqueKey === uniqueKey)}
                                                                        onSelect={() => toggleProductSelection(item, uniqueKey)}
                                                                        isWishlisted={wishlisted}
                                                                        onToggleWishlist={() => toggleWishlistItem(item)}
                                                                        ownerStoreName={item.storeName}
                                                                        isOwner={!!isOwner}
                                                                    />
                                                                );
                                                            })}
                                                        </div>
                        )}
                    </>
                )}
            </div>

        </div>

        {selectedProducts.length > 0 && (
            <div className={styles.checkoutBar}>
                <div className={styles.checkoutInfo}>
                    <span className={styles.selectedCount}>
                        {selectedProducts.length} item{selectedProducts.length > 1 ? 's' : ''} selected
                    </span>
                    <span className={styles.totalPrice}>
                        Total: ${selectedProducts.reduce((sum, p) => sum + (p.priceValue ?? parseFloat(p.price)), 0).toFixed(2)}
                    </span>
                </div>
                <button className={styles.checkoutButton} onClick={handleCheckout}>
                    Proceed to Cart
                </button>
            </div>
        )}
        </>
    );
}

export default CatalogueMain;