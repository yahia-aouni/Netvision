import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import SellerProfileCompletion from './pages/SellerProfileCompletion'
import SellersPage from './pages/SellersPage'
import SellerProfile from './pages/SellerProfile'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import UsersManagement from './pages/admin/UsersManagement'
import ServicesManagement from './pages/admin/ServicesManagement'
import WalletManagement from './pages/admin/WalletManagement'
import Settings from './pages/admin/Settings'
import OrdersManagement from './pages/admin/OrdersManagement'
import CategoriesManagement from './pages/admin/CategoriesManagement'
import Reports from './pages/admin/Reports'
import Disputes from './pages/admin/Disputes'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - Uses Layout with Navbar and Footer */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/services" element={<Layout><Services /></Layout>} />
        <Route path="/services/:id" element={<Layout><ServiceDetail /></Layout>} />
        <Route path="/sellers" element={<Layout><SellersPage /></Layout>} />
        <Route path="/seller/:id" element={<Layout><SellerProfile /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />

        {/* User Routes - Uses Layout with Navbar and Footer */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/seller-profile/complete" element={<Layout><SellerProfileCompletion /></Layout>} />

        {/* Admin Routes - No Navbar/Footer (custom admin layout) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UsersManagement />} />
        <Route path="/admin/services" element={<ServicesManagement />} />
        <Route path="/admin/orders" element={<OrdersManagement />} />
        <Route path="/admin/categories" element={<CategoriesManagement />} />
        <Route path="/admin/wallets" element={<WalletManagement />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/disputes" element={<Disputes />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App