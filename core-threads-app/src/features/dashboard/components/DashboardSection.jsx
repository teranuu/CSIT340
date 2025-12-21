import styles from '../styles/section.module.css';
import { ItemCard } from '../../../components/ItemCard/index.js';
import { ApparelCard } from '../../../components/ApparelCard/index.js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, getImageUrl, STATIC_IMAGES } from '../../../config/api.js';
import { useAuth } from '../../../context/AuthContext.jsx';

function DashboardSection() {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  // Fallback data if API fails (neutral placeholders)
  const placeholder = getImageUrl('Grey_sweatpants.png');
  const fallbackFeatured = [];
  const fallbackRecentlyViewed = [];
  const fallbackSuggestions = [];

  const buildImageUrl = (url) => {
    if (!url) return getImageUrl('Grey_sweatpants.png');
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
            id: p.productId,
            name: p.name,
            price: p.price ? `$${Number(p.price).toFixed(2)}` : '$45.50',
            image: image,
            storeName: p.sellerStoreName || p.storeName || null,
            ownerCustomerId: p.sellerCustomerId || null,
            productCode: p.productCode || null,
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
          .slice(0, 3);
        const recentFallback = ensureItems(normalized, 9, 12);
        setRecentlyViewed(recentByName.length ? recentByName : recentFallback);

        // Randomize suggestions and limit to 3
        const shuffled = [...normalized].sort(() => Math.random() - 0.5);
        setSuggestions(shuffled.slice(0, 3));
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
        {featured.map((item, idx) => (
          <ApparelCard
            key={`${item.name}-${idx}`}
            id={item.id}
            image={item.image}
            name={item.name}
            price={item.price}
            ownerStoreName={item.storeName}
            isOwner={!!(
              (user?.customerId && item?.ownerCustomerId && String(user.customerId) === String(item.ownerCustomerId)) ||
              (user?.storeName && item?.storeName && String(user.storeName).toLowerCase() === String(item.storeName).toLowerCase())
            )}
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
                id={item.id}
                image={item.image}
                name={item.name}
                price={item.price}
                ownerStoreName={item.storeName}
                isOwner={!!(
                  (user?.customerId && item?.ownerCustomerId && String(user.customerId) === String(item.ownerCustomerId)) ||
                  (user?.storeName && item?.storeName && String(user.storeName).toLowerCase() === String(item.storeName).toLowerCase())
                )}
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
                id={item.id}
                image={item.image}
                name={item.name}
                price={item.price}
                ownerStoreName={item.storeName}
                isOwner={!!(
                  (user?.customerId && item?.ownerCustomerId && String(user.customerId) === String(item.ownerCustomerId)) ||
                  (user?.storeName && item?.storeName && String(user.storeName).toLowerCase() === String(item.storeName).toLowerCase())
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSection;
