import styles from '../styles/section.module.css';
import { ItemCard } from '../../../components/ItemCard/index.js';
import { ApparelCard } from '../../../components/ApparelCard/index.js';

function DashboardSection() {
  const categories = [
    { name: 'All', bg: 'linear-gradient(135deg, rgba(56,80,63,0.18), rgba(190,214,190,0.65))' },
    { name: 'Hoodies', bg: 'url(https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80)' },
    { name: 'Shirts', bg: 'url(https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80)' },
    { name: 'Pants', bg: 'url(https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80)' },
    { name: 'Kicks', bg: 'url(https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=400&q=80)' },
  ];

  const featured = [
    { name: 'Urban Hoodie', price: '$49.99', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80' },
    { name: 'Daily Tee', price: '$24.99', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80' },
    { name: 'Tapered Pants', price: '$39.99', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80' },
    { name: 'Court Sneakers', price: '$79.99', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=400&q=80' },
    { name: 'Oversized Hoodie', price: '$54.99', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80' },
    { name: 'Classic Crew', price: '$19.99', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80' },
    { name: 'Utility Cargo', price: '$44.99', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80' },
    { name: 'Low-top Canvas', price: '$59.99', image: 'https://images.unsplash.com/photo-1528702748617-c64d49f918af?auto=format&fit=crop&w=400&q=80' },
    { name: 'Coach Jacket', price: '$69.99', image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=400&q=80' },
  ];

  const recentlyViewed = [
    { name: 'Minimal Hoodie', price: '$48.00', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80' },
    { name: 'Vintage Tee', price: '$22.00', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80' },
  ];

  const suggestions = [
    { name: 'Relaxed Sweatpants', price: '$35.00', image: 'https://images.unsplash.com/photo-1542293787938-4d273c37c5bf?auto=format&fit=crop&w=400&q=80' },
    { name: 'Layered Jacket', price: '$85.00', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className={styles.dashboardSectionWrapper}>
      <div className={styles.categorySidebarWrapper}>
        {categories.map((cat) => (
          <ItemCard
            key={cat.name}
            name={cat.name}
            style={{
              height: '7rem',
              backgroundImage: cat.bg,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: '#1f241f',
              fontWeight: 600,
            }}
          />
        ))}
      </div>

      <div className={styles.apparelDisplaySection}>
        {featured.map((item, idx) => (
          <ApparelCard
            key={`${item.name}-${idx}`}
            image={item.image}
            name={item.name}
            price={item.price}
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
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSection;
