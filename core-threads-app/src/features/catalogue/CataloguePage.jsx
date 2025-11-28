import { MainNavbar } from '../../components/MainNavbar/index.js';
import { Marquee } from '../../components/Marquee/index.js';
import CatalogueMain from './components/CatalogueMain.jsx'; 
function CataloguePage(){

    return(

        <>
        <Marquee/>
        <MainNavbar/>
        <CatalogueMain/>
        </>

    );

}

export default CataloguePage;