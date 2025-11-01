import styles from './user.auth.navbar.module.css';

function Navbar(){

    return(

          <>
          
            <nav className={styles.navbar}>

                <div className="logo">corethreads®</div>

                <ul className={styles.navList}>
                

                <li className={styles.text}>About Us</li>
                <li className={styles.text}>Login</li>
                <li className={styles.text}>Sign Up</li>


                </ul>
               

            </nav>
            
        </>


    );


}

export default Navbar