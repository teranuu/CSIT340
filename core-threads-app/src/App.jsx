
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from "react";

const Login = lazy(() => import("./features/login/LoginPage"));
const Register = lazy(() => import("./features/register/RegisterPage"));
const DashboardLayout = lazy(() => import("./features/dashboard/DashboardPage"));
const DashboardSection = lazy(() => import("./features/dashboard/components/DashboardSection"));
const UserLayout = lazy(() => import("./features/user_profile/UserPage"));
const UserSection = lazy(() => import("./features/user_profile/components/AccountSection"));


function App() {


  return (
    <>

      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>

          <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>}/>

            <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardSection />} />
              </Route>
           
           <Route path="/dashboard/settings" element={<UserLayout />} />

          {/* default route upon startup */}

          <Route path="*" element={<Login/>}/>

          </Routes>

        </Suspense>
      
      </BrowserRouter>
      



    </>
  )
}

export default App
