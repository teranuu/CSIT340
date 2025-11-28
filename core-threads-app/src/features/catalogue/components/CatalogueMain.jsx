// catalogue.main.jsx
import styles from '../styles/catalogue.main.module.css';
import { CatalogueCard } from '../../../components/CatalogueCard/index.js';
import CategorySidebar from './CategorySidebar.jsx';
import CatalogueToolbar from './CatalogueToolbar.jsx';

function CatalogueMain() {

    const products = [
        { id: 1, title: "Black Hoodie", price: 4.00, imageUrl: "/images/black-hoodie.jpg" },
        { id: 2, title: "Grey Sweatpants", price: 6.50, imageUrl: "/images/sweatpants.jpg" },
        { id: 3, title: "Classic Cap", price: 3.25, imageUrl: "/images/cap.jpg" },
        { id: 4, title: "White Tee", price: 5.99, imageUrl: "/images/white-tee.jpg" },
        { id: 5, title: "Jeans", price: 12.49, imageUrl: "/images/jeans.jpg" },
        { id: 6, title: "Beanie", price: 3.99, imageUrl: "/images/beanie.jpg" },
        { id: 7, title: "Jacket", price: 18.50, imageUrl: "/images/jacket.jpg" },
        { id: 8, title: "Socks Pack", price: 2.50, imageUrl: "/images/socks.jpg" },
        { id: 1, title: "Black Hoodie", price: 4.00, imageUrl: "/images/black-hoodie.jpg" },
        { id: 2, title: "Grey Sweatpants", price: 6.50, imageUrl: "/images/sweatpants.jpg" },
        { id: 3, title: "Classic Cap", price: 3.25, imageUrl: "/images/cap.jpg" },
        { id: 4, title: "White Tee", price: 5.99, imageUrl: "/images/white-tee.jpg" },
        { id: 5, title: "Jeans", price: 12.49, imageUrl: "/images/jeans.jpg" },
        { id: 6, title: "Beanie", price: 3.99, imageUrl: "/images/beanie.jpg" },
        { id: 7, title: "Jacket", price: 18.50, imageUrl: "/images/jacket.jpg" },
        { id: 8, title: "Socks Pack", price: 2.50, imageUrl: "/images/socks.jpg" },
        { id: 1, title: "Black Hoodie", price: 4.00, imageUrl: "/images/black-hoodie.jpg" },
        { id: 2, title: "Grey Sweatpants", price: 6.50, imageUrl: "/images/sweatpants.jpg" },
        { id: 3, title: "Classic Cap", price: 3.25, imageUrl: "/images/cap.jpg" },
        { id: 4, title: "White Tee", price: 5.99, imageUrl: "/images/white-tee.jpg" },
        { id: 5, title: "Jeans", price: 12.49, imageUrl: "/images/jeans.jpg" },
        { id: 6, title: "Beanie", price: 3.99, imageUrl: "/images/beanie.jpg" },
        { id: 7, title: "Jacket", price: 18.50, imageUrl: "/images/jacket.jpg" },
        { id: 8, title: "Socks Pack", price: 2.50, imageUrl: "/images/socks.jpg" },
        // add more as needed...
    ];

    return (
        <>
        <div className={styles.catalogueMainWrapper}>

            <div className={styles.leftContentSection}>
              <CategorySidebar/>
            </div>

            <div className={styles.rightContentSection}>
                <CatalogueToolbar />

                <div className={styles.cardsGrid}>
                  {products.map((item, idx) => (
                    <CatalogueCard
                      key={`${item.id}-${idx}`}
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