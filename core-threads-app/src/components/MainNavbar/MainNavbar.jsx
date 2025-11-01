import styles from './main.navbar.module.css';
import { FontAwesomeIcon  } from "@fortawesome/react-fontawesome";
function MainNavbar(){


    return(

        <>

         <div className={styles.navbarWrapper}>

            <span className="logo">corethreads®</span>

            <input type="text" placeholder="Search Apparel...." />

            <div className={styles.navbarIconWrapper}>


            <FontAwesomeIcon icon={["fas", "shopping-cart"]} size="1g" color="var(--color-accent)" className="icon"/>
            <FontAwesomeIcon icon={["fas", "heart"]} size="1g" color="var(--color-accent)" className="icon"/>
            <FontAwesomeIcon icon={["fas", "user-circle"]} size="1g" color="var(--color-accent)" className="icon"/>
            </div>
                            

        </div>
        
        
        </>
    );

}


export default MainNavbar;