import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, 
  TextField, Stack, MenuItem, FormControlLabel, Switch 
} from '@mui/material';
import { apiService } from '../../../api';

const ItemPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ 
    category_id: '', code: '', name: '', uom: 'PCS', 
    standard_par_qty: 0, track_by_piece: false, sterile_required: false, is_active: true 
  });

  const loadData = async () => {
    try {
      const [itRes, catRes] = await Promise.all([
        apiService.getItems(),
        apiService.getItemCategories()
      ]);
      setItems(itRes.data);
      setCategories(catRes.data);
    } catch (err) { console.error("โหลดข้อมูลล้มเหลว"); }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    try {
      // บังคับแปลงข้อมูลเป็น Number ป้องกัน 403 Forbidden
      const payload = {
        ...form,
        category_id: Number(form.category_id), 
        standard_par_qty: Number(form.standard_par_qty) || 0,
        track_by_piece: Boolean(form.track_by_piece),
        sterile_required: Boolean(form.sterile_required)
      };

      await apiService.createItem(payload as any);
      setOpen(false);
      loadData();
      alert("บันทึกสำเร็จ");
    } catch (err: any) {
      alert(`บันทึกไม่สำเร็จ: ${err.response?.data?.message || 'ตรวจสอบสิทธิ์หรือข้อมูล'}`);
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Typography variant="h5" fontWeight="bold">จัดการรายการผ้า/เครื่องมือ (Items)</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>+ เพิ่มรายการ</Button>
      </Stack>

      {/* ใช้ TableContainer หุ้ม Table เพื่อแก้ปัญหา Nesting Error */}
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>รหัส</TableCell>
              <TableCell>ชื่อรายการ</TableCell>
              <TableCell>หน่วยนับ</TableCell>
              <TableCell align="right">Par Qty</TableCell>
              <TableCell align="center">สถานะ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item: any) => (
              <TableRow key={item.id} hover>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.uom}</TableCell>
                <TableCell align="right">{item.standard_par_qty}</TableCell>
                <TableCell align="center">{item.is_active ? 'เปิดใช้งาน' : 'ปิด'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>เพิ่มรายการใหม่</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField select label="หมวดหมู่" fullWidth value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}>
            {categories.map((c: any) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
          </TextField>
          <TextField label="รหัสสินค้า" fullWidth onChange={e => setForm({...form, code: e.target.value})} />
          <TextField label="ชื่อสินค้า" fullWidth onChange={e => setForm({...form, name: e.target.value})} />
          <TextField label="หน่วยนับ" fullWidth value={form.uom} onChange={e => setForm({...form, uom: e.target.value})} />
          <TextField label="จำนวน Par มาตรฐาน" type="number" fullWidth onChange={e => setForm({...form, standard_par_qty: Number(e.target.value)})} />
          <Stack direction="row" spacing={2}>
            <FormControlLabel control={<Switch checked={form.sterile_required} onChange={e => setForm({...form, sterile_required: e.target.checked})} />} label="ต้องฆ่าเชื้อ" />
            <FormControlLabel control={<Switch checked={form.track_by_piece} onChange={e => setForm({...form, track_by_piece: e.target.checked})} />} label="รายชิ้น" />
          </Stack>
          <Button variant="contained" size="large" onClick={handleSave} sx={{ mt: 2 }}>บันทึกข้อมูล</Button>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default ItemPage;