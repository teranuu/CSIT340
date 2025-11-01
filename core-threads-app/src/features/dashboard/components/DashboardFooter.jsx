import { ItemCard } from '../../../components/ItemCard/index.js';
import styles from '../styles/footer.module.css';

function DashboardFooter(){

    return(


        <>
    
        <div className={styles.dashboardFooterWrapper}>
                
                    <div className={styles.dealsWrapper}>

                        <span className={styles.text}>Deals of the Day</span>
                        <div style={{border:"1px solid", color:"var(--color-accent)"}}/>
                        <span className={styles.text}>20 : 45 : 12 Left!</span>

                    </div>

                    <div className={styles.dealsItemWrapper}>

                        <ItemCard style={{height:"10rem", border: "2.5px solid var(--color-accent)"}}/>
                        <ItemCard style={{height:"10rem", border: "2.5px solid var(--color-accent)"}}/>
                        <ItemCard style={{height:"10rem", border: "2.5px solid var(--color-accent)"}}/>
                        <ItemCard style={{height:"10rem", border: "2.5px solid var(--color-accent)"}}/>
                    </div>



                </div>


        </>

    );

    
}

export default DashboardFooter;