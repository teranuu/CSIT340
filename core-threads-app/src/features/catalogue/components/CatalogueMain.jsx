// catalogue.main.jsx
import styles from '../styles/catalogue.main.module.css';
import { ApparelCard } from '../../../components/ApparelCard/index.js';
import CategorySidebar from './CategorySidebar.jsx';
import CatalogueToolbar from './CatalogueToolbar.jsx';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_BASE_URL, getImageUrl, STATIC_IMAGES } from '../../../config/api.js';

const WISHLIST_STORAGE_KEY = 'wishlist_items';

function CatalogueMain() {
    const location = useLocation();
    const navigate = useNavigate();
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
        sessionStorage.setItem('cart_items', JSON.stringify(selectedProducts));
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
                        id: p.id,
                        title: p.name,
                        price: priceDisplay,
                        priceValue,
                        imageUrl: image,
                        gender: p.gender || 'Unisex',
                        category: p.category || 'Other',
                        color: p.color || 'Multi',
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
        // Get search query from navigation state or sessionStorage
        const queryFromState = location.state?.searchQuery || '';
        const queryFromSession = sessionStorage.getItem('apparel_search_query') || '';
        // Sanitize query: only allow letters and spaces, trim, limit length
        const sanitizeQuery = (q) => (q ? q.toString()
            .replace(/[^a-zA-Z\s]/g, '') // Remove all non-letter characters except spaces
            .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
            .trim()
            .slice(0, 64) : '');
        const currentQuery = sanitizeQuery(queryFromState || queryFromSession);
        
        // Get highlight product from navigation state
        const productToHighlight = location.state?.highlightProduct || null;
        setHighlightProduct(productToHighlight);
        
        // Get selected category from navigation state (only set once)
        const categoryFromState = location.state?.selectedCategory || null;
        if (categoryFromState && !initialCategory) {
            // Map dashboard category names to catalog category names
            const categoryMapping = {
                'All': 'All Products',
                'Hoodies': 'Hoodies',
                'Shirts': 'Shirts',
                'Pants': 'Pants',
                'Kicks': 'Kicks'
            };
            const mappedCategory = categoryMapping[categoryFromState] || 'All Products';
            setInitialCategory(mappedCategory);
            setCategoryFilter(mappedCategory);
        }
        
        // Clear highlight after animation duration
        if (productToHighlight) {
            setTimeout(() => setHighlightProduct(null), 2000);
        }

        setSearchQuery(currentQuery);

        // Filter products based on search query and gender
        let filtered = products;
        
        // Apply search filter (uses sanitized query)
        if (currentQuery.trim()) {
            const q = currentQuery.toLowerCase();
            filtered = filtered.filter(product =>
                product.title && product.title.toLowerCase().includes(q)
            );
        }
        
        // Apply gender filter
        if (genderFilter !== 'all') {
            filtered = filtered.filter(product =>
                product.gender && product.gender.toLowerCase() === genderFilter.toLowerCase()
            );
        }
        
        // Apply category filter
        if (categoryFilter !== 'All Products') {
            filtered = filtered.filter(product =>
                product.category && product.category.toLowerCase() === categoryFilter.toLowerCase()
            );
        }
        
        // Apply price range filter
        filtered = filtered.filter(product => {
            const price = parseFloat(product.price);
            return price >= priceRange.min && price <= priceRange.max;
        });
        
        // Apply color filter
        if (colorFilter !== 'All') {
            filtered = filtered.filter(product =>
                product.color && product.color.toLowerCase().includes(colorFilter.toLowerCase())
            );
        }
        
        // Apply sorting
        if (sortBy === 'name') {
            filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortBy === 'price-low') {
            filtered = [...filtered].sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sortBy === 'price-high') {
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
                                Search results for "<strong>{searchQuery}</strong>" ({filteredProducts.length} results)
                            </div>
                        )}

                        {filteredProducts.length === 0 && searchQuery ? (
                            <div style={{ 
                                textAlign: 'center', 
                                padding: '40px 20px',
                                fontSize: '16px',
                                color: '#999'
                            }}>
                                No products found matching "{searchQuery}"
                            </div>
                        ) : (
                                                        <div className={styles.cardsGrid}>
                                                            {filteredProducts.map((item, idx) => {
                                                                const uniqueKey = `${item.id}-${item.title}-${idx}`;
                                                                const itemKey = item.id ?? item.title;
                                                                const wishlisted = itemKey ? wishlist.some((w) => String(w.key) === String(itemKey)) : false;
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