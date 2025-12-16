import styles from '../styles/section.module.css';
import { ItemCard } from '../../../components/ItemCard/index.js';
import { ApparelCard } from '../../../components/ApparelCard/index.js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, getImageUrl, STATIC_IMAGES } from '../../../config/api.js';

function DashboardSection() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const RECENT_KEY = 'recently_viewed_products';

  const categoryImages = {
    All: getImageUrl('Categories_All.png'),
    Hoodies: getImageUrl('Categories_Hoodies.png'),
    Shirts: getImageUrl('Categories_Shirts.png'),
    Pants: getImageUrl('Categories_Pants.png'),
    Kicks: getImageUrl('Categories_Kicks.png'),
  };

  const categories = [
    { name: 'All', bg: `url(${categoryImages.All})` },
    { name: 'Hoodies', bg: `url(${categoryImages.Hoodies})` },
    { name: 'Shirts', bg: `url(${categoryImages.Shirts})` },
    { name: 'Pants', bg: `url(${categoryImages.Pants})` },
    { name: 'Kicks', bg: `url(${categoryImages.Kicks})` },
  ];

  // Fallback data if API fails (neutral placeholders, no Unsplash)
  const placeholder = 'http://localhost:8081/api/images/Grey_sweatpants.png';
  const fallbackFeatured = [];
  const fallbackRecentlyViewed = [];
  const fallbackSuggestions = [];

  const buildImageUrl = (url) => {
    if (!url) return 'http://localhost:8081/api/images/Grey_sweatpants.png';
    return getImageUrl(url);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/products/summary`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();

        const normalized = products.map((p) => {
          let image = buildImageUrl(p.imageUrl);
          // Use static image for Grey Sweatpants
          if (p.name === 'Grey Sweatpants') {
            image = STATIC_IMAGES.GREY_SWEATPANTS;
          }
          return {
            name: p.name,
            price: p.price ? `$${Number(p.price).toFixed(2)}` : '$45.50',
            image: image,
          };
        });

        console.log('Dashboard: normalized products', normalized);

        const ensureItems = (list, start, end) => {
          const slice = list.slice(start, end);
          if (slice.length) return slice;
          return list.length ? list : [];
        };

        setFeatured(ensureItems(normalized, 0, 9));

        // Load recently viewed from sessionStorage and fall back to server order if empty
        const storedRecent = JSON.parse(sessionStorage.getItem(RECENT_KEY) || '[]');
        const recentByName = storedRecent
          .map((name) => normalized.find((n) => n.name === name))
          .filter(Boolean)
          .slice(0, 4);
        const recentFallback = ensureItems(normalized, 9, 13);
        setRecentlyViewed(recentByName.length ? recentByName : recentFallback);

        setSuggestions(ensureItems(normalized, 11, 13));
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
        setFeatured(fallbackFeatured);
        setRecentlyViewed(fallbackRecentlyViewed);
        setSuggestions(fallbackSuggestions);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (productName) => {
    // Persist recently viewed list (most recent first, unique, max 6)
    setRecentlyViewed((prev) => {
      const currentNames = prev.map((p) => p.name);
      if (currentNames.includes(productName)) {
        const reordered = [productName, ...currentNames.filter((n) => n !== productName)];
        sessionStorage.setItem(RECENT_KEY, JSON.stringify(reordered.slice(0, 6)));
        return reordered
          .map((name) => prev.find((p) => p.name === name))
          .filter(Boolean)
          .slice(0, 4);
      }
      const updated = [productName, ...currentNames].slice(0, 6);
      sessionStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      // We only have productName; best-effort attach from featured/suggestions/recentlyViewed lists
      const pool = [...featured, ...suggestions, ...prev];
      const mapped = updated
        .map((name) => pool.find((p) => p.name === name))
        .filter(Boolean)
        .slice(0, 4);
      return mapped.length ? mapped : prev;
    });

    navigate('/dashboard/catalog', { state: { highlightProduct: productName } });
  };

  const handleCategoryClick = (categoryName) => {
    navigate('/dashboard/catalog', { state: { selectedCategory: categoryName } });
  };

  if (error) {
    console.warn('Using fallback data. API Error:', error);
  }

  return (
    <div className={styles.dashboardSectionWrapper}>
      <div className={styles.categorySidebarWrapper}>
        {categories.map((cat) => (
          <ItemCard
            key={cat.name}
            name={cat.name}
            onClick={() => handleCategoryClick(cat.name)}
            style={{
              height: '7rem',
              backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.35)), ${cat.bg}`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: '#fff',
              fontWeight: 700,
              textShadow: '0 1px 2px rgba(0,0,0,0.6)',
              border: '0.1rem solid rgba(255,255,255,0.5)',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      <div className={styles.apparelDisplaySection}>
        {/* Sanity check card using a known working static image */}
        <ApparelCard
          key="sanity-shoes"
          image={STATIC_IMAGES.CORETHREADS_SHOES}
          name="CoreThreads Shoes"
          price={"$49.50"}
          onClick={() => handleProductClick('CoreThreads Shoes')}
        />

        {featured.map((item, idx) => (
          <ApparelCard
            key={`${item.name}-${idx}`}
            image={item.image}
            name={item.name}
            price={item.price}
            onClick={() => handleProductClick(item.name)}
          />
        ))}
      </div>

      <div className={styles.rightDisplayWrapper}>
        <div className={styles.rightSectionWrapper}>
          <span className={styles.sectionTitle}>Recently Viewed</span>
          <div className={styles.rightCards}>
            {recentlyViewed.map((item, idx) => (
              <ApparelCard
                key={`recent-${idx}`}
                image={item.image}
                name={item.name}
                price={item.price}
                onClick={() => handleProductClick(item.name)}
              />
            ))}
          </div>
        </div>

        <div className={styles.rightSectionWrapper}>
          <span className={styles.sectionTitle}>Suggestions for you</span>
          <div className={styles.rightCards}>
            {suggestions.map((item, idx) => (
              <ApparelCard
                key={`suggest-${idx}`}
                image={item.image}
                name={item.name}
                price={item.price}
                onClick={() => handleProductClick(item.name)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSection;
