import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemCard } from '../../../components/ItemCard/index.js';
import { ApparelCard } from '../../../components/ApparelCard/index.js';
import { getImageUrl } from '../../../config/api.js';
import styles from '../styles/footer.module.css';

function DashboardFooter(){
    // Countdown starting at 20:45:12 (in seconds)
    const initialSeconds = 20 * 3600 + 45 * 60 + 12;
    const [remaining, setRemaining] = useState(initialSeconds);
    const navigate = useNavigate();

    const dealsOfTheDay = [
        {
            name: 'Black Hoodie',
            image: getImageUrl('Black_hoodie.png'),
            originalPrice: '$79.99',
            discountedPrice: '$49.99',
        },
        {
            name: 'CoreThreads Shoes',
            image: getImageUrl('corethreads_shoes.png'),
            originalPrice: '$59.99',
            discountedPrice: '$39.99',
        },
        {
            name: 'Jeans',
            image: getImageUrl('Jeans.png'),
            originalPrice: '$89.99',
            discountedPrice: '$59.99',
        },
        {
            name: 'Classic Cap',
            image: getImageUrl('Classic_cap.png'),
            originalPrice: '$29.99',
            discountedPrice: '$14.99',
        },
    ];
    /* increase the length and width of the itemcards because the images in the itemcard aren't fully seen enough */
    useEffect(() => {
        const timer = setInterval(() => {
            setRemaining(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (totalSeconds) => {
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        return `${hours} : ${minutes} : ${seconds} Left!`;
    };

    const handleDealClick = (deal) => {
        // Store the deal item in sessionStorage
        const cartItem = {
            name: deal.name,
            image: deal.image,
            price: deal.discountedPrice,
            originalPrice: deal.originalPrice,
            quantity: 1,
            isDealItem: true,
        };
        
        // Add to cart via sessionStorage
        const existingCart = JSON.parse(sessionStorage.getItem('cart_items') || '[]');
        const updatedCart = [...existingCart, cartItem];
        sessionStorage.setItem('cart_items', JSON.stringify(updatedCart));
        
        // Navigate to cart
        navigate('/dashboard/cart');
    };

    return(
        <>
        <div className={styles.dashboardFooterWrapper}>
            <div className={styles.dealsWrapper}>
                <span className={styles.text}>Deals of the Day</span>
                <div style={{border:"1px solid", color:"var(--color-accent)"}} />
                <span className={styles.text}>{formatTime(remaining)}</span>
            </div>

            <div className={styles.dealsItemWrapper}>
                {dealsOfTheDay.map((deal, idx) => (
                    <div 
                        key={idx} 
                        className={styles.dealCardContainer}
                        onClick={() => handleDealClick(deal)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className={styles.dealCardImage}>
                            <img src={deal.image} alt={deal.name} />
                        </div>
                        <div className={styles.dealCardInfo}>
                            <h3 className={styles.dealCardName}>{deal.name}</h3>
                            <div className={styles.priceSection}>
                                <span className={styles.originalPrice}>{deal.originalPrice}</span>
                                <span className={styles.discountedPrice}>{deal.discountedPrice}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className={styles.copyrightSection}>
                <span className={styles.copyrightText}>© 2025 corethreads®. All rights reserved.</span>
            </div>
        </div>
        </>
    );
}

export default DashboardFooter;