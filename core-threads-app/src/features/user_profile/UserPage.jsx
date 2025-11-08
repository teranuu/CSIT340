
import { MainNavbar } from "../../components/MainNavbar/index.js";
import { Marquee } from "../../components/Marquee/index.js";
import AccountSection from "./components/AccountSection.jsx";
import { Outlet } from "react-router-dom";
function UserPage(){

 
    return(

        <>
        <MainNavbar/>
        <AccountSection/>
        
        </>

    );


}


export default UserPage;
