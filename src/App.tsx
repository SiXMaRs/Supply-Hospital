import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from "./pages/Auth/Login";
import ItemPage from "./pages/Supply/Master/ItemPage";
import CategoryPage from "./pages/Supply/Master/CategoryPage";
import DepartmentPage from "./pages/Supply/Master/DepartmentPage";
import IntakePage from "./pages/Supply/IntakePage";
import WashPage from "./pages/Supply/WashPage";
import InventoryPage from "./pages/Supply/InventoryPage";
import RequestPage from "./pages/Ward/RequestPage";
import UserPage from "./pages/Supply/Master/UserPage";
import LocationPage from "./pages/Supply/Master/LocationPage";
import LossPage from "./pages/Supply/LossPage";

// Import Dashboards
import SupplyDashboard from "./pages/Supply/SupplyDashboard"; 
// 1. เพิ่ม Import WardDashboard (ตรวจสอบ path ให้ตรงกับโฟลเดอร์จริงของคุณ)
import WardDashboard from "./pages/Ward/WardDashboard"; 

import MainLayout from "./components/MainLayout";

const ProtectedRoute = () => {
  // ตรวจสอบ Token (ถ้าไม่มี Token จะดีดไป Login)
  const token = localStorage.getItem('token');
  return token ? <MainLayout /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Redirect root path to login or dashboard based on your preference */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Protected Routes (ต้อง Login ก่อนถึงจะเข้าได้) */}
        <Route element={<ProtectedRoute />}>
            
            {/* Supply Dashboard */}
            <Route path="/supply/dashboard" element={<SupplyDashboard />} />

            {/* Master Data Group */}
            <Route path="/supply/master/departments" element={<DepartmentPage />} />
            <Route path="/supply/master/items" element={<ItemPage />} />
            <Route path="/supply/master/categories" element={<CategoryPage />} />
            <Route path="/supply/master/users" element={<UserPage />} />
            <Route path="/supply/master/locations" element={<LocationPage />} />

            {/* Supply Group */}
            <Route path="/supply/intake" element={<IntakePage />} />
            <Route path="/supply/wash-jobs" element={<WashPage />} /> 
            <Route path="/supply/inventory" element={<InventoryPage />} />
            <Route path="/supply/loss" element={<LossPage />} />

            {/* Ward Group */}
            {/* 2. เพิ่ม Route นี้ครับ ไม่งั้นกด Sidebar แล้วจะเด้งออก */}
            <Route path="/ward/dashboard" element={<WardDashboard />} />
            <Route path="/ward/request" element={<RequestPage />} />

        </Route>

        {/* Fallback: ถ้าพิมพ์ URL มั่ว ให้เด้งไป Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;