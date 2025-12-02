import { MainNavbar } from '../../components/MainNavbar/index.js';
import { Marquee } from '../../components/Marquee/index.js';
import ProductSection from './components/ProductSection.jsx'; 
function ProductPage(){

    return(

        <>
        <Marquee/>
        <MainNavbar/>
        <ProductSection/>
        </>

    );

}

export default ProductPage;