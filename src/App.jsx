//Estilização
import './App.css'
//Roteador
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
//Alertas
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// Hooks
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './context/AuthContext';
// Componentes
import ClientNavBar from './components/clientNavBar/ClientNavBar';
import AdminNavBar from './pages/admin/adminNavBar/AdminNavBar'
// Páginas
import Schedules from './pages/logistics/schedules/Schedules'
import Login from './pages/authentication/login/Login';
import Register from './pages/authentication/register/Register'
import ConfirmEmail from './pages/authentication/confirmEmail/ConfirmEmail';
import Home from './pages/home/Home';
import NewSchedule from './pages/logistics/newSchedule/NewSchedule';
import NewFixedSchedule from './pages/logistics/newSchedule/NewFixedSchedule';
import LoginAdmin from './pages/admin/login/LoginAdmin';
import AllSchedules from './pages/admin/allSchedules/AllSchedules';
import NotFound from './pages/404/NotFound'
import AllCompanies from './pages/admin/allCompanies/AllCompanies';
import Company from './pages/geral/company/Company';
import RecoverPassEmail from './pages/authentication/recoverPassEmail/RecoverPassEmail';
import RecoverPassword from './pages/authentication/recoverPass/RecoverPassword';
import Contact from './pages/geral/contact/Contact';
import WorkDays from './pages/logistics/workDays/WorkDays';
import BuyerWorkDays from './pages/sellers/buyerWorkDays/BuyerWorkDays';
import SellerNewSchedule from './pages/sellers/sellerNewSchedule/SellerNewSchedule';
import SellerSchedules from './pages/sellers/sellerSchedules/SellerSchedules';
import Sellers from './pages/sellers/sellers/Sellers';
import AllSellerSchedules from './pages/admin/allSellerSchedules/AllSellerSchedules';
import AllSellers from './pages/admin/allSellers/AllSellers';

function App() {

  const { adminId, userId } = useContext(AuthContext)

  return (
    <div className="App">
      <BrowserRouter>
        <div style={{display: 'flex', flexDirection: 'column-reverse', marginTop: '90px'}}>
          <ToastContainer autoClose='2000' />

          <Routes>
            <Route path='/' element={userId ? <Navigate to='/logistics/schedules' /> : adminId ? <Navigate to='/apr-admin/all-schedules' /> : <Home />} />

            {/* logistica */}
            <Route path='/logistics' element={userId ? <Navigate to='/logistics/schedules' /> : <Navigate to='/' />} />
            <Route path='/logistics/workdays' element={userId ? <WorkDays /> : <Navigate to='/' />} />
            <Route path='/logistics/new-schedule' element={userId ? <NewSchedule /> : <Navigate to='/' />} />
            <Route path='/logistics/new-fixed-schedule' element={userId ? < NewFixedSchedule /> : <Navigate to='/' />} />
            <Route path='/logistics/schedules' element={userId ? <Schedules /> : <Navigate to='/' />} />
            {/* vendas */}
            <Route path='/sales' element={userId ? <Navigate to='/sales/schedules' /> : <Navigate to='/' />} />
            <Route path='/sales/workdays' element={userId ? <BuyerWorkDays /> : <Navigate to='/' />} />
            <Route path='/sales/new-schedule' element={userId ? <SellerNewSchedule /> : <Navigate to='/' />} />
            <Route path='/sales/schedules' element={userId ? <SellerSchedules /> : <Navigate to='/' />} />
            <Route path='/sales/sellers' element={userId ? <Sellers /> : <Navigate to='/' />} />
            {/* Info */}
            <Route path='/contact' element={userId ? <Contact /> : <Navigate to='/' />} />
            <Route path='/company/:id' element={userId ? <Company /> : <Navigate to='/' />} />
            {/* Autenticação */}
            <Route path='/login' element={!userId ? <Login /> : <Navigate to='/schedules' />} />
            <Route path='/register' element={!userId ? <Register /> : <Navigate to='/schedules' />} />
            <Route path='/confirm-email/:id/:email' element={!userId ? <ConfirmEmail /> : <Navigate to='/schedules' />} />
            {/* Esqueci a senha */}
            <Route path='/recover-password-email' element={<RecoverPassEmail />} />
            <Route path='/recover-password/:token' element={<RecoverPassword />} />
            {/* ADM */}
            <Route path='/apr-admin/login' element={<LoginAdmin />} />
            <Route path='/apr-admin/all-sellers-schedules' element={adminId ? <AllSellerSchedules /> : <Navigate to='/' />} />
            <Route path='/apr-admin/all-schedules' element={adminId ? <AllSchedules /> : <Navigate to='/' />} />
            <Route path='/apr-admin/all-companies' element={adminId ? <AllCompanies /> : <Navigate to='/' />} />
            <Route path='/apr-admin/all-sellers' element={adminId ? <AllSellers /> : <Navigate to='/' />} />

            <Route path='*' element={<NotFound />} />
          </Routes>
          <div>
            {userId != '' && <ClientNavBar />}
            {adminId != '' && <AdminNavBar />}
          </div>
        </div>
      </BrowserRouter>

    </div>
  )
}

export default App
