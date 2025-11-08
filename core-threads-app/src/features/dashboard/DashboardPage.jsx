import { MainNavbar } from "../../components/MainNavbar/index.js";
import DashboardSection from "./components/DashboardSection";
import DashboardFooter from "./components/DashboardFooter.jsx";
import { Marquee } from "../../components/Marquee/index.js";
import { Outlet } from "react-router-dom";
function DashboardPage(){


    return(

        <>

        <Marquee/>
        <MainNavbar/>
        {/* <DashboardSection/> */}
        <Outlet/>
        <DashboardFooter/>

        </>



    );


}

export default DashboardPage;