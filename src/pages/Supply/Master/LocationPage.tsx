import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, 
  TextField, Stack, MenuItem, FormControlLabel, Switch
} from '@mui/material';
import { apiService } from '../../../api';

const LocationPage = () => {
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [open, setOpen] = useState(false);
  
  // อ้างอิงโครงสร้างจาก Swagger
  const [form, setForm] = useState({ 
    code: '', 
    name: '', 
    type: 'STORE', // ตัวอย่าง: STORE, WARD, SHELF
    department_id: '', 
    parent_id: '', 
    is_active: true 
  });

  const loadData = async () => {
    try {
      const [lRes, dRes] = await Promise.all([
        apiService.getLocations(),
        apiService.getDepartments()
      ]);
      setLocations(lRes.data);
      setDepartments(dRes.data);
    } catch (err) { 
      console.error("โหลดข้อมูลล้มเหลว"); 
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    try {
      // แปลงข้อมูลให้เป็น Number ตามที่ API ต้องการ
      const payload = {
        code: form.code,
        name: form.name,
        type: form.type,
        department_id: form.department_id ? Number(form.department_id) : null,
        parent_id: form.parent_id ? Number(form.parent_id) : null,
        is_active: form.is_active
      };

      await apiService.createLocation(payload);
      alert("สร้างจุดเก็บสำเร็จ!");
      setOpen(false);
      setForm({ code: '', name: '', type: 'STORE', department_id: '', parent_id: '', is_active: true });
      loadData();
    } catch (err: any) {
      alert(`สร้างไม่สำเร็จ: ${err.response?.data?.message || 'ข้อมูลผิดรูปแบบ'}`);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight="bold">จัดการจุดเก็บ/ตำแหน่ง (Locations)</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>+ เพิ่มจุดเก็บ</Button>
      </Stack>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>รหัส (Code)</TableCell>
              <TableCell>ชื่อตำแหน่ง (Name)</TableCell>
              <TableCell>ประเภท</TableCell>
              <TableCell>แผนกที่สังกัด</TableCell>
              <TableCell align="center">สถานะ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map((loc: any) => (
              <TableRow key={loc.id} hover>
                <TableCell>{loc.code}</TableCell>
                <TableCell>{loc.name}</TableCell>
                <TableCell>{loc.type}</TableCell>
                <TableCell>{loc.department?.name || '-'}</TableCell>
                <TableCell align="center">{loc.is_active ? 'เปิดใช้งาน' : 'ปิด'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold' }}>เพิ่มจุดเก็บใหม่</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField 
            label="รหัสตำแหน่ง (เช่น A01)" 
            fullWidth 
            required
            value={form.code} 
            onChange={e => setForm({...form, code: e.target.value})} 
          />
          
          <TextField 
            label="ชื่อตำแหน่ง (เช่น ตู้เก็บของชั้น 1)" 
            fullWidth 
            required
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})} 
          />

          <TextField 
            select 
            label="ประเภทตำแหน่ง" 
            fullWidth 
            value={form.type} 
            onChange={e => setForm({...form, type: e.target.value})}
          >
            <MenuItem value="STORE">คลังสินค้า (Store)</MenuItem>
            <MenuItem value="WARD">วอร์ด/ตึก (Ward)</MenuItem>
            <MenuItem value="SHELF">ชั้นวาง (Shelf)</MenuItem>
            <MenuItem value="AREA">พื้นที่ทั่วไป (Area)</MenuItem>
          </TextField>
          
          <TextField 
            select 
            label="แผนกที่เกี่ยวข้อง" 
            fullWidth 
            value={form.department_id} 
            onChange={e => setForm({...form, department_id: e.target.value})}
          >
            <MenuItem value="">-- ไม่ระบุ --</MenuItem>
            {departments.map((d: any) => (
              <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
            ))}
          </TextField>

          <TextField 
            select 
            label="จุดเก็บหลัก (Parent)" 
            fullWidth 
            value={form.parent_id} 
            onChange={e => setForm({...form, parent_id: e.target.value})}
            helperText="กรณีเป็นจุดย่อยในจุดอื่น"
          >
            <MenuItem value="">-- เป็นจุดเก็บหลัก --</MenuItem>
            {locations.filter((l: any) => !l.parent_id).map((l: any) => (
              <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>
            ))}
          </TextField>

          <FormControlLabel 
            control={<Switch checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />} 
            label="เปิดใช้งาน" 
          />

          <Button 
            variant="contained" 
            size="large" 
            onClick={handleSave} 
            sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
          >
            บันทึกตำแหน่ง
          </Button>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default LocationPage;