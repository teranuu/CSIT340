// catalogue.main.jsx
import styles from '../styles/catalogue.main.module.css';
import { CatalogueCard } from '../../../components/CatalogueCard/index.js';
import CategorySidebar from './CategorySidebar.jsx';
import CatalogueToolbar from './CatalogueToolbar.jsx';
import { useFilterState } from '../../../context/FilterContext';

function CatalogueMain() {
    const products = [
      { id: 1, title: "Black Hoodie", price: 1200, category: 'Hoodies', color: 'Black', imageUrl: "/images/black-hoodie.jpg" },
      { id: 2, title: "Grey Sweatpants", price: 850, category: 'Pants', color: 'Grey', imageUrl: "/images/sweatpants.jpg" },
      { id: 3, title: "Classic Cap", price: 300, category: 'Accessories', color: 'Black', imageUrl: "/images/cap.jpg" },
      { id: 4, title: "White Tee", price: 450, category: 'Shirts', color: 'White', imageUrl: "/images/white-tee.jpg" },
      { id: 5, title: "Jeans", price: 1299, category: 'Pants', color: 'Blue', imageUrl: "/images/jeans.jpg" },
      { id: 6, title: "Beanie", price: 350, category: 'Accessories', color: 'Black', imageUrl: "/images/beanie.jpg" },
      { id: 7, title: "Jacket", price: 2400, category: 'Jackets', color: 'Navy', imageUrl: "/images/jacket.jpg" },
      { id: 8, title: "Socks Pack", price: 199, category: 'Accessories', color: 'White', imageUrl: "/images/socks.jpg" },
      { id: 9, title: "Navy Polo", price: 699, category: 'Shirts', color: 'Navy', imageUrl: "/images/polo-navy.jpg" },
      { id: 10, title: "Windbreaker", price: 1799, category: 'Jackets', color: 'Black', imageUrl: "/images/windbreaker.jpg" },
      { id: 11, title: "Chino Pants", price: 999, category: 'Pants', color: 'Beige', imageUrl: "/images/chinos.jpg" },
      { id: 12, title: "Graphic Tee", price: 399, category: 'Shirts', color: 'White', imageUrl: "/images/graphic-tee.jpg" }
    ];

    const { category, priceMin, priceMax, color } = useFilterState();
    const filteredProducts = products.filter(p => {
      if (category && category !== 'All Products' && p.category !== category) return false;
      if (p.price < priceMin || p.price > priceMax) return false;
      if (color && color !== 'All' && p.color && p.color.toLowerCase() !== color.toLowerCase()) return false;
      return true;
    });

    return (
        <>
        <div className={styles.catalogueMainWrapper}>

            <div className={styles.leftContentSection}>
              <CategorySidebar/>
            </div>

            <div className={styles.rightContentSection}>
                <CatalogueToolbar />

                <div className={styles.cardsGrid}>
                  {filteredProducts.map((item, idx) => (
                    <CatalogueCard
                      key={`${item.id}-${idx}`}
                      id={item.id}
                      title={item.title}
                      price={item.price}
                      imageUrl={item.imageUrl}
                    />
                  ))}
                </div>
            </div>

        </div>
        </>
    );
}

export default CatalogueMain;