
import { RegisterPage }  from './features/register/index.js'
import { LoginPage } from './features/login/index.js'
import { DashboardPage } from './features/dashboard/index.js'
import { Routes, Route } from 'react-router-dom';


function App() {


  return (
    <>

      <Routes>
      <Route path="/" element={<LoginPage/>} />
      <Route path="/registerpage" element={<RegisterPage/>}/>
      <Route path="/dashboardpage" element={<DashboardPage/>}/>
      </Routes>

    </>
  )
}

export default App
