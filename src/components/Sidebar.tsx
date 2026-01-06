import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Package, LayoutGrid, Users, MapPin, Building2,
  LogOut, ChevronLeft, ChevronRight,
  ClipboardList, Droplets, Warehouse, FileX, FileText,
  LayoutDashboard 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // localStorage.removeItem('token'); 
    navigate('/login');
  };

  const theme = {
    bg: '#1e2532',
    textMain: '#cbd5e1',
    textHeader: '#64748b',
    activeBg: '#334155',
    activeText: '#ffffff',
    hoverBg: 'rgba(255,255,255,0.05)',
    logoutRed: '#ef4444',
    borderColor: '#334155'
  };

  // --- Menu Config (จัดกลุ่มใหม่) ---
  const menuGroups = [
    // 1. กลุ่ม Master Data
    {
      title: "ข้อมูลพื้นฐาน (MASTER)",
      items: [
        { path: "/supply/master/items", label: "สินค้า (Items)", icon: <Package size={20} /> },
        { path: "/supply/master/categories", label: "หมวดหมู่ (Category)", icon: <LayoutGrid size={20} /> },
        { path: "/supply/master/departments", label: "แผนก (Department)", icon: <Building2 size={20} /> },
        { path: "/supply/master/locations", label: "สถานที่ (Location)", icon: <MapPin size={20} /> },
        { path: "/supply/master/users", label: "ผู้ใช้งาน (User)", icon: <Users size={20} /> },
      ]
    },
    // 2. กลุ่ม Supply (เอามารวมกันตรงนี้)
    {
      title: "งานจ่ายกลาง (SUPPLY)",
      items: [
        { 
          path: "/supply/dashboard", 
          label: "แดชบอร์ด (Dashboard)", // ย้ายมาอยู่ตรงนี้ เป็นรายการแรก
          icon: <LayoutDashboard size={20} /> 
        },
        { path: "/supply/intake", label: "รับเข้า (Intake)", icon: <ClipboardList size={20} /> },
        { path: "/supply/wash-jobs", label: "งานล้าง (Wash)", icon: <Droplets size={20} /> },
        { path: "/supply/inventory", label: "คลัง (Inventory)", icon: <Warehouse size={20} /> },
        { path: "/supply/loss", label: "ตัดจำหน่าย (Loss)", icon: <FileX size={20} /> },
      ]
    },
    // 3. กลุ่ม Ward
    {
      title: "หอผู้ป่วย (WARD)",
      items: [
        { 
            path: "/ward/dashboard", 
            label: "แดชบอร์ด (Dashboard)", 
            icon: <LayoutDashboard size={20} /> 
        },
        { path: "/ward/request", label: "เบิกของ (Request)", icon: <FileText size={20} /> },
      ]
    }
  ];

  return (
    <aside
      style={{
        width: isOpen ? '280px' : '80px',
        backgroundColor: theme.bg,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        transition: 'all 0.3s ease',
        zIndex: 50,
        borderRight: `1px solid ${theme.borderColor}`,
        boxShadow: '4px 0 15px rgba(0,0,0,0.2)'
      }}
    >
      
      {/* ส่วน Header Toggle */}
      <div style={{
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isOpen ? 'space-between' : 'center',
        height: '80px',
        borderBottom: `1px solid ${theme.borderColor}`
      }}>
        {isOpen && (
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            Admin
          </h1>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'transparent',
            border: `1px solid ${theme.textHeader}`,
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: '0.2s'
          }}
        >
          {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* --- SCROLLABLE MENU AREA --- */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '20px 15px',
        scrollbarWidth: 'thin',
        scrollbarColor: `${theme.activeBg} transparent`
      }}>
        {menuGroups.map((group, idx) => (
          <div key={idx} style={{ marginBottom: '30px' }}>
            {/* Group Title */}
            {isOpen && (
              <div style={{
                color: theme.textHeader,
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
                paddingLeft: '12px'
              }}>
                {group.title}
              </div>
            )}

            {/* Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    to={item.path}
                    key={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '12px 16px',
                      textDecoration: 'none',
                      borderRadius: '8px',
                      backgroundColor: isActive ? theme.activeBg : 'transparent',
                      color: isActive ? theme.activeText : theme.textMain,
                      transition: 'background 0.2s ease',
                      justifyContent: isOpen ? 'flex-start' : 'center',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = theme.hoverBg;
                          e.currentTarget.style.color = '#fff';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = theme.textMain;
                        }
                      }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.icon}
                    </div>
                    {isOpen && (
                      <span style={{ marginLeft: '14px', fontSize: '15px', fontWeight: isActive ? 500 : 400 }}>
                        {item.label}
                      </span>
                    )}
                    {isActive && !isOpen && (
                      <div style={{
                        position: 'absolute',
                        left: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '4px',
                        height: '24px',
                        backgroundColor: '#60a5fa',
                        borderRadius: '4px'
                      }} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ส่วน Footer (Logout) */}
      <div style={{
        padding: '20px',
        borderTop: `1px solid ${theme.borderColor}`,
        backgroundColor: theme.bg
      }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            backgroundColor: theme.logoutRed,
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isOpen ? 'center' : 'center',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 4px 6px rgba(239, 68, 68, 0.25)',
            transition: 'transform 0.1s'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <LogOut size={20} />
          {isOpen && <span style={{ marginLeft: '8px' }}>ออกจากระบบ</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;