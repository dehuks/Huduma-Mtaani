import React from 'react'
import Home from './Components/Homepage/Home'
import CustDashboard from './Components/CustomerDashboard/CustDashboard'
import { Routes,Route } from 'react-router-dom'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='customer-dashboard' element={<CustDashboard/>} />
    </Routes>
  )
}

export default App