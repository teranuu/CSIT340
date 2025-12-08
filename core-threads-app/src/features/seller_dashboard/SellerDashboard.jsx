import SellerNavbar from "./components/SellerNavbar";
import SellerSidebar from "./components/SellerSidebar";
import SellerDashboardSection from "./pages/SellerDashboardSection";
import SellerOrders from "./pages/SellerOrders";
import SellerProducts from "./pages/SellerProducts";
import SellerEarnings from "./pages/SellerEarnings";
import SellerSettings from "./pages/SellerSettings";
import { useState } from "react";

function SellerDashboard(){
    const [currentPage, setCurrentPage] = useState('home');

    const handleNavigate = (pageId) => {
        setCurrentPage(pageId);
    };

    const renderPage = () => {
        switch(currentPage) {
            case 'home':
                return <SellerDashboardSection />;
            case 'products':
                return <SellerProducts />;
            case 'orders':
                return <SellerOrders />;
            case 'earnings':
                return <SellerEarnings />;
            case 'settings':
                return <SellerSettings />;
            default:
                return <SellerDashboardSection />;
        }
    };

    return(

        <>

        <SellerNavbar/>
        <div style={{ display: 'flex', gap: '24px', padding: '24px', background: 'var(--color-tea-green-2)', minHeight: '100vh' }}>
            <SellerSidebar onNavigate={handleNavigate} currentPage={currentPage} />
            <div style={{ flex: 1, background: 'transparent' }}>
                {renderPage()}
            </div>
        </div>
        
        
        </>
    );

}

export default SellerDashboard;