import styles from '../styles/section.module.css';
import { ItemCard } from '../../../components/ItemCard/index.js';
import { ApparelCard } from '../../../components/ApparelCard/index.js';
function DashboardSection(){


    const cards = Array.from({ length: 12 });

    return(
        
        <>

    <div className={styles.dashboardSectionWrapper}>
     
      <div className={styles.categorySidebarWrapper}>
        <ItemCard name="All" style={{height:"7rem"}}/>
        <ItemCard name="Hoodies" style={{height:"7rem"}}/>
        <ItemCard name="Shirts" style={{height:"7rem"}} />
        <ItemCard name="Pants" style={{height:"7rem"}}/>
        <ItemCard name="Kicks" style={{height:"7rem"}}/>
      </div>

     
      <div className={styles.apparelDisplaySection}>
        {cards.map((_, i) => (
          <div key={i} className={styles.apparelItemRow}>
            <ApparelCard
              image="https://via.placeholder.com/150"
              name="Hoodie"
              price="$49.99"
            />
            <ApparelCard
              image="https://via.placeholder.com/150"
              name="T-Shirt"
              price="$29.99"
            />
            <ApparelCard
              image="https://via.placeholder.com/150"
              name="Pants"
              price="$39.99"
            />
          </div>
        ))}
      </div>

      {/* Right Sidebar */}
      <div className={styles.rightDisplayWrapper}>
        <div className={styles.rightSectionWrapper}>
          <span>Recently Viewed</span>
          <ItemCard style={{ height: '10rem' }}/>
        </div>

        <div className={styles.rightSectionWrapper}>
          <span>Suggestion for you</span>
          <ItemCard style={{ height: '10rem' }}/>
        </div>
      </div>
    </div>
        


        
        </>


    );


}

export default DashboardSection;
