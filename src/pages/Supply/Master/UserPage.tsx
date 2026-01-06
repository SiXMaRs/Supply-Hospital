import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, 
  TextField, Stack, MenuItem, Chip
} from '@mui/material';
import { apiService } from '../../../api';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [open, setOpen] = useState(false);
  
  // แก้จาก full_name เป็น name ให้ตรงตามที่ Server ต้องการ
  const [form, setForm] = useState({ 
    email: '', 
    password: '', 
    name: '', 
    role: 'ward', 
    department_id: '' 
  });

  const loadData = async () => {
    try {
      const [uRes, dRes] = await Promise.all([
        apiService.getUsers(),
        apiService.getDepartments()
      ]);
      setUsers(uRes.data);
      setDepartments(dRes.data);
    } catch (err) { 
      console.error("โหลดข้อมูลล้มเหลว"); 
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    try {
      // ตรวจสอบข้อมูลก่อนส่ง
      if (!form.name || !form.email || !form.password) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }

      // Payload ต้องมี propertyชื่อ 'name' เท่านั้น
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        department_id: form.department_id ? Number(form.department_id) : null,
        is_active: true
      };

      await apiService.createUser(payload);
      alert("สร้างผู้ใช้งานสำเร็จ!");
      setOpen(false);
      
      // Reset Form
      setForm({ email: '', password: '', name: '', role: 'ward', department_id: '' });
      loadData();
    } catch (err: any) {
      // แสดงข้อความ Error จาก Server
      const errorMsg = err.response?.data?.message || err.response?.data?.detail || "เกิดข้อผิดพลาด";
      alert(`สร้างไม่สำเร็จ: ${errorMsg}`);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight="bold">จัดการผู้ใช้งาน (User Management)</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>+ เพิ่มผู้ใช้งาน</Button>
      </Stack>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>ชื่อ-นามสกุล</TableCell>
              <TableCell>อีเมล (Username)</TableCell>
              <TableCell>สิทธิ์การใช้งาน</TableCell>
              <TableCell>แผนก</TableCell>
              <TableCell align="center">สถานะ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.id} hover>
                {/* ดึงค่าจาก user.name */}
                <TableCell>{user.name}</TableCell> 
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role ? user.role.toUpperCase() : '-'} 
                    color={user.role === 'admin' ? 'secondary' : user.role === 'supply' ? 'primary' : 'default'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{user.department?.name || '-'}</TableCell>
                <TableCell align="center">{user.is_active ? 'ใช้งาน' : 'ระงับ'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>สร้างผู้ใช้งานใหม่</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField 
            label="ชื่อ-นามสกุล" 
            fullWidth 
            required
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
          />
          
          <TextField 
            label="อีเมล (ใช้ Login)" 
            fullWidth 
            required
            value={form.email} 
            onChange={e => setForm({...form, email: e.target.value})} 
          />
          
          <TextField 
            label="รหัสผ่าน" 
            type="password" 
            fullWidth 
            required
            value={form.password} 
            onChange={e => setForm({...form, password: e.target.value})} 
          />
          
          <TextField 
            select 
            label="สิทธิ์การใช้งาน (Role)" 
            fullWidth 
            value={form.role} 
            onChange={e => setForm({...form, role: e.target.value})}
          >
            <MenuItem value="admin">Admin (คุมทั้งหมด)</MenuItem>
            <MenuItem value="supply">Supply (ห้องผ้า)</MenuItem>
            <MenuItem value="ward">Ward (ตึกผู้ป่วย)</MenuItem>
          </TextField>

          <TextField 
            select 
            label="แผนก/วอร์ด" 
            fullWidth 
            value={form.department_id} 
            onChange={e => setForm({...form, department_id: e.target.value})}
          >
            <MenuItem value="">-- ไม่ระบุ --</MenuItem>
            {departments.map((d: any) => (
              <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
            ))}
          </TextField>

          <Button 
            variant="contained" 
            size="large" 
            onClick={handleSave} 
            sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
          >
            ยืนยันการสร้าง
          </Button>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default UserPage;