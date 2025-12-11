import { useEffect, useState } from 'react';
import { ItemCard } from '../../../components/ItemCard/index.js';
import styles from '../styles/footer.module.css';

function DashboardFooter(){
    // Countdown starting at 20:45:12 (in seconds)
    const initialSeconds = 20 * 3600 + 45 * 60 + 12;
    const [remaining, setRemaining] = useState(initialSeconds);

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

    return(
        <>
        <div className={styles.dashboardFooterWrapper}>
            <div className={styles.dealsWrapper}>
                <span className={styles.text}>Deals of the Day</span>
                <div style={{border:"1px solid", color:"var(--color-accent)"}} />
                <span className={styles.text}>{formatTime(remaining)}</span>
            </div>

            <div className={styles.dealsItemWrapper}>
                <ItemCard style={{height:"10rem", border: "1.5px solid var(--color-accent)"}} />
                <ItemCard style={{height:"10rem", border: "1.5px solid var(--color-accent)"}} />
                <ItemCard style={{height:"10rem", border: "1.5px solid var(--color-accent)"}} />
                <ItemCard style={{height:"10rem", border: "1.5px solid var(--color-accent)"}} />
            </div>

            <div className={styles.copyrightSection}>
                <span className={styles.copyrightText}>© 2025 corethreads®. All rights reserved.</span>
            </div>
        </div>
        </>
    );
}

export default DashboardFooter;