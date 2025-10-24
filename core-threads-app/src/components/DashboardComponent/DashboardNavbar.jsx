import './DashboardNavbar.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function DashboardNavbar(){

    return(

        <>

        <div className="navbar-wrapper">

            <span className="navbar-logo">CoreThreads</span>

            <input type="text" placeholder="Search Apparel...." />

            <div className="navbar-icon-wrapper">


            <FontAwesomeIcon icon={["fas", "shopping-cart"]} size="1g" color="#000" className="navbar-icon"/>
            <FontAwesomeIcon icon={["fas", "heart"]} size="1g" color="#000" className="navbar-icon"/>
            <FontAwesomeIcon icon={["fas", "user-circle"]} size="1g" color="#000" className="navbar-icon"/>
            </div>
                            

        </div>
        
        </>


    );


}

export default DashboardNavbar;