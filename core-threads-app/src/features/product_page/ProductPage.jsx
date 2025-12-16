import { MainNavbar } from '../../components/MainNavbar/index.js';
import { Marquee } from '../../components/Marquee/index.js';
import ProductSection from './components/ProductSection.jsx';
import { useParams, Navigate } from 'react-router-dom';

function ProductPage(){
    const { id } = useParams();

    // Validate ID to prevent directory traversal attacks
    // Only allow positive integers, block: ../, encoded chars, absolute paths, special chars
    const sanitizeProductId = (rawId) => {
        if (!rawId) return null;
        
        // Remove any URL encoding attempts and path traversal patterns
        const cleaned = String(rawId).replace(/[^0-9]/g, '');
        
        // Must be a positive integer
        const parsed = parseInt(cleaned, 10);
        if (isNaN(parsed) || parsed <= 0 || parsed > 999999999) {
            return null;
        }
        
        return parsed.toString();
    };

    const sanitizedId = sanitizeProductId(id);

    // Redirect to dashboard if invalid ID detected
    if (id && !sanitizedId) {
        return <Navigate to="/dashboard" replace />;
    }

    return(
        <>
        <Marquee/>
        <MainNavbar/>
        <ProductSection productId={sanitizedId} />
        </>
    );
}

export default ProductPage;