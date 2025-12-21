import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from "react";
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

const Login = lazy(() => import("./features/login/LoginPage"));
const Register = lazy(() => import("./features/register/RegisterPage"));
const DashboardLayout = lazy(() => import("./features/dashboard/DashboardPage"));
const UserLayout = lazy(() => import("./features/user_profile/UserPage"));
const ShoppingCart = lazy(() => import("./features/shopping_cart/ShoppingCart"));
const CatalogLayout = lazy(() => import("./features/catalogue/CataloguePage"));
const ProductPage = lazy(() => import("./features/product_page/ProductPage"));
const WishlistPage = lazy(() => import("./features/wishlist/WishlistPage"));
const SellerDashboard = lazy(() => import("./features/seller_dashboard/SellerDashboard"));
const AdminLogin = lazy(() => import("./features/admin_dashboard/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./features/admin_dashboard/AdminDashboard"));

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/catalog" 
              element={
                <ProtectedRoute>
                  <CatalogLayout />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/product/:id" 
              element={
                <ProtectedRoute>
                  <ProductPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/settings" 
              element={
                <ProtectedRoute>
                  <UserLayout />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/cart" 
              element={
                <ProtectedRoute>
                  <ShoppingCart />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/wishlist" 
              element={
                <ProtectedRoute>
                  <WishlistPage />
                </ProtectedRoute>
              } 
            />

            {/* Seller and Admin Routes */}
            <Route 
              path="/seller-dashboard" 
              element={
                <ProtectedRoute>
                  <SellerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <AdminProtectedRoute>
                  <AdminDashboard />
                </AdminProtectedRoute>
              } 
            />

            {/* Default Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      </AdminAuthProvider>
    </AuthProvider>
  )
}

export default App