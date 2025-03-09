import React from 'react'
import Home from './Components/Homepage/Home'
import CustDashboard from './Components/CustomerDashboard/CustDashboard'
import { Routes,Route } from 'react-router-dom'
import AdminDashboard from './Components/AdminDashboard/AdminDashboard'
import ServiceProviderDash from './Components/ServiceProviderDashboard/ServiceProviderDash'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/customer-dashboard' element={<CustDashboard/>} />
      <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
      <Route path='/serviceprovider-dashbooard' element={<ServiceProviderDash/>}/>
    </Routes>
  )
}

export default App