import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, TextField, Stack } from '@mui/material';
import { apiService } from '../../../api';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: '', name: '', is_active: true });

  const loadData = async () => {
    try {
      const res = await apiService.getItemCategories();
      setCategories(res.data);
    } catch (err) { console.error("โหลดข้อมูลไม่สำเร็จ"); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    try {
      await apiService.createItemCategory(form);
      setOpen(false);
      loadData();
      alert("บันทึกหมวดหมู่สำเร็จ");
    } catch (err: any) {
      alert("บันทึกไม่สำเร็จ: " + (err.response?.data?.message || "สิทธิ์ไม่พอหรือรูปแบบข้อมูลผิด"));
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight="bold">จัดการหมวดหมู่สินค้า</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>+ เพิ่มหมวดหมู่</Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>รหัสหมวดหมู่</TableCell>
              <TableCell>ชื่อหมวดหมู่</TableCell>
              <TableCell align="center">สถานะ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat: any) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.code}</TableCell>
                <TableCell>{cat.name}</TableCell>
                <TableCell align="center">{cat.is_active ? 'เปิดใช้งาน' : 'ปิด'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>เพิ่มหมวดหมู่ใหม่</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="รหัสหมวดหมู่" fullWidth onChange={e => setForm({...form, code: e.target.value})} />
          <TextField label="ชื่อหมวดหมู่" fullWidth onChange={e => setForm({...form, name: e.target.value})} />
          <Button variant="contained" size="large" onClick={handleSave} sx={{ mt: 2 }}>บันทึกข้อมูล</Button>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default CategoryPage;