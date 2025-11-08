
// import { RegisterPage }  from './features/register/index.js'
// import { LoginPage } from './features/login/index.js'
// import { DashboardPage } from './features/dashboard/index.js'
// import { UserPage } from './features/user_profile/index.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from "react";

const Login = lazy(() => import("./features/login/LoginPage"));
const Register = lazy(() => import("./features/register/RegisterPage"));
const DashboardLayout = lazy(() => import("./features/dashboard/DashboardPage"));
const DashboardSection = lazy(() => import("./features/dashboard/components/DashboardSection"));
const User = lazy(() => import("./features/user_profile/UserPage"));

function App() {


  return (
    <>

      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>

          <Routes>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>}/>

            <Route path="/dashboard" element={<DashboardLayout/>}>
              <Route index element={<DashboardSection/>}/>
              <Route path="settings" element={<User/>} />

            </Route>
           


          {/* default route upon startup */}

          <Route path="*" element={<Login/>}/>

          </Routes>

        </Suspense>
      
      </BrowserRouter>
      



    </>
  )
}

export default App
