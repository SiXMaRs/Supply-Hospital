// src/components/Layout.tsx
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children, role }: { children: React.ReactNode, role: string }) => {
  const navigate = useNavigate();
  const drawerWidth = 240;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Linen System ({role.toUpperCase()})</Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{ width: drawerWidth, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' } }}>
        <Toolbar />
        <List>
          {role === 'supply' ? (
            <>
              <ListItem disablePadding onClick={() => navigate('/supply/dashboard')}><ListItemButton><ListItemText primary="สรุปภาพรวม" /></ListItemButton></ListItem>
              <ListItem disablePadding onClick={() => navigate('/supply/master')}><ListItemButton><ListItemText primary="จัดการ Master Data" /></ListItemButton></ListItem>
              <ListItem disablePadding onClick={() => navigate('/supply/intake')}><ListItemButton><ListItemText primary="รับผ้าสกปรก (Intake)" /></ListItemButton></ListItem>
              <ListItem disablePadding onClick={() => navigate('/supply/wash')}><ListItemButton><ListItemText primary="งานซัก (Wash Jobs)" /></ListItemButton></ListItem>
              <ListItem disablePadding onClick={() => navigate('/supply/inventory')}><ListItemButton><ListItemText primary="คลังสต็อกสะอาด" /></ListItemButton></ListItem>
            </>
          ) : (
            <>
              <ListItem disablePadding onClick={() => navigate('/ward/dashboard')}><ListItemButton><ListItemText primary="หน้าแรก" /></ListItemButton></ListItem>
              <ListItem disablePadding onClick={() => navigate('/ward/request')}><ListItemButton><ListItemText primary="สร้างใบเบิกผ้า" /></ListItemButton></ListItem>
              <ListItem disablePadding onClick={() => navigate('/ward/history')}><ListItemButton><ListItemText primary="ประวัติการเบิก" /></ListItemButton></ListItem>
            </>
          )}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
};