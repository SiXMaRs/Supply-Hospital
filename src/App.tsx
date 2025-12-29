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

// --- Protected Route Component ---
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Supply Group (เอา Dashboard ออกก่อน) */}
        <Route path="/supply/intake" element={<ProtectedRoute><IntakePage /></ProtectedRoute>} />
        <Route path="/supply/wash-jobs" element={<ProtectedRoute><WashPage /></ProtectedRoute>} />
        <Route path="/supply/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
        <Route path="/supply/loss" element={<ProtectedRoute><LossPage /></ProtectedRoute>} />
        
        {/* Master Data Group */}
        <Route path="/supply/master/departments" element={<ProtectedRoute><DepartmentPage /></ProtectedRoute>} />
        <Route path="/supply/master/items" element={<ProtectedRoute><ItemPage /></ProtectedRoute>} />
        <Route path="/supply/master/categories" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
        <Route path="/supply/master/users" element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        } />
        <Route path="/supply/master/locations" element={
          <ProtectedRoute>
            <LocationPage />
          </ProtectedRoute>
        } />

        {/* Ward Group */}
        <Route path="/ward/request" element={<ProtectedRoute><RequestPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;