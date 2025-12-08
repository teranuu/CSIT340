
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from "react";

const Login = lazy(() => import("./features/login/LoginPage"));
const Register = lazy(() => import("./features/register/RegisterPage"));
const DashboardLayout = lazy(() => import("./features/dashboard/DashboardPage"));
const DashboardSection = lazy(() => import("./features/dashboard/components/DashboardSection"));
const UserLayout = lazy(() => import("./features/user_profile/UserPage"));
const ShoppingCart = lazy(() => import("./features/shopping_cart/ShoppingCart"));
const CatalogLayout = lazy(() => import("./features/catalogue/CataloguePage"));
const WishlistPage = lazy(() => import("./features/wishlist/WishlistPage"));
const SellerDashboard = lazy(() => import("./features/seller_dashboard/SellerDashboard"));



function App() {


  return (
    <>

      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>

          <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>}/>

            <Route path="/dashboard" element={<DashboardLayout/>}/>
            {/* <Route index element={<DashboardSection />} />
              </Route> */}

            <Route path="/dashboard/catalog" element={<CatalogLayout/>}/>
           
           <Route path="/dashboard/settings" element={<UserLayout/>} />
              
           <Route path="/dashboard/wishlist" element={<WishlistPage/>} />
           <Route path="/dashboard/cart" element={<ShoppingCart/>} />
          {/* default route upon startup */}
          <Route path="/seller-dashboard" element={<SellerDashboard/>} />
          <Route path="*" element={<Login/>}/>



          </Routes>

        </Suspense>
      
      </BrowserRouter>
      



    </>
  )
}

export default App
