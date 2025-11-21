import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './assets/Components/Login/LoginPage'
import DashboardPage from './assets/Components/Dashboard/DashboardPage'
import HomePage from './assets/Components/Home/HomePage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
