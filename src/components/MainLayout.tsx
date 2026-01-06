import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    // เปลี่ยนสีพื้นหลังหลักให้ตัดกับ Sidebar (สีขาว หรือ เทาอ่อนมากๆ)
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}> 
      
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main
        style={{
          // ปรับระยะห่างตามความกว้างใหม่ของ Sidebar (280px / 80px)
          marginLeft: isSidebarOpen ? '280px' : '80px', 
          width: '100%',
          padding: '30px',
          transition: 'margin-left 0.3s ease'
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;