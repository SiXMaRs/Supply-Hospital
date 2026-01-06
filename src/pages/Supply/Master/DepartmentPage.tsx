import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, 
  TextField, Stack, Switch, FormControlLabel 
} from '@mui/material';
import { apiService } from '../../../api'; // ถอย 3 ชั้น (Master < Supply < Pages)

const DepartmentPage = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: '', name: '', type: 'ward', is_active: true });

  const loadData = () => apiService.getDepartments().then(res => setData(res.data));
  
  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    try {
      await apiService.createDepartment(form);
      setOpen(false);
      loadData();
      setForm({ code: '', name: '', type: 'ward', is_active: true });
    } catch (err) { alert('บันทึกไม่สำเร็จ'); }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight="bold">จัดการแผนก (Departments)</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>+ เพิ่มแผนก</Button>
      </Stack>

      <Table component={Paper}>
        <TableHead>
          <TableRow sx={{ bgcolor: '#f5f5f5' }}>
            <TableCell>รหัส</TableCell>
            <TableCell>ชื่อแผนก</TableCell>
            <TableCell>ประเภท</TableCell>
            <TableCell>สถานะ</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell>{item.code}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.is_active ? 'ใช้งาน' : 'ระงับ'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>เพิ่มแผนกใหม่</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 350 }}>
          <TextField label="รหัสแผนก" fullWidth value={form.code} onChange={e => setForm({...form, code: e.target.value})} />
          <TextField label="ชื่อแผนก" fullWidth value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <TextField label="ประเภท (เช่น ward, supply)" fullWidth value={form.type} onChange={e => setForm({...form, type: e.target.value})} />
          <FormControlLabel control={<Switch checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />} label="เปิดใช้งาน" />
          <Button variant="contained" onClick={handleSave}>บันทึก</Button>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default DepartmentPage;