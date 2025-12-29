import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Grid, TextField, Button, MenuItem, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Box, Alert, Snackbar, Switch, FormControlLabel, Chip
} from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import SaveIcon from '@mui/icons-material/Save';
import { apiService } from '../../api';

const LossPage = () => {
  const [losses, setLosses] = useState([]);
  const [items, setItems] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // โครงสร้าง Form ตาม Swagger
  const [form, setForm] = useState({
    department_id: '',
    item_id: '',
    qty: 1,
    reason: '',
    ref_type: 'general', // ประเภทอ้างอิง เช่น wash, request, general
    ref_id: 0,
    created_by: 'Teammy',
    batch_id: 0,
    auto_deduct: true // ให้ระบบตัดสต็อกอัตโนมัติหรือไม่
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [lossRes, itemRes, deptRes] = await Promise.all([
        apiService.getLosses(),
        apiService.getItems(),
        apiService.getDepartments()
      ]);
      setLosses(lossRes.data);
      setItems(itemRes.data);
      setDepartments(deptRes.data);
    } catch (err) {
      showMsg("ไม่สามารถโหลดข้อมูลได้", "error");
    }
  };

  const showMsg = (msg: string, sev: 'success' | 'error') => {
    setAlert({ open: true, message: msg, severity: sev });
  };

  const handleSubmit = async () => {
    if (!form.item_id || !form.department_id || !form.reason) {
      return showMsg("กรุณากรอกข้อมูลสำคัญให้ครบถ้วน", "error");
    }

    try {
      // จัดรูปแบบข้อมูลให้ตรงตามที่ API ต้องการ
      const payload = {
        department_id: Number(form.department_id),
        item_id: Number(form.item_id),
        qty: Number(form.qty),
        reason: form.reason,
        ref_type: form.ref_type,
        ref_id: Number(form.ref_id),
        created_by: form.created_by,
        batch_id: Number(form.batch_id),
        auto_deduct: Boolean(form.auto_deduct)
      };

      await apiService.createLoss(payload);
      showMsg("บันทึกรายการสูญเสียสำเร็จ", "success");
      
      // Reset และโหลดรายการใหม่
      setForm({ ...form, item_id: '', qty: 1, reason: '', ref_id: 0, batch_id: 0 });
      loadInitialData();
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "บันทึกล้มเหลว (Check Database Constraints)";
      showMsg(errMsg, "error");
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom color="error" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ReportProblemIcon /> บันทึกสูญเสีย/ชำรุด (Loss & Damage)
      </Typography>

      {/* ส่วนที่ 1: ฟอร์มบันทึก */}
      <Paper sx={{ p: 4, mb: 4 }} elevation={3}>
        <Typography variant="h6" gutterBottom>สร้างรายการใหม่</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField select label="รายการสินค้า" fullWidth value={form.item_id} onChange={e => setForm({...form, item_id: e.target.value})}>
              {items.map((it: any) => <MenuItem key={it.id} value={it.id}>{it.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField type="number" label="จำนวนที่สูญเสีย" fullWidth value={form.qty} onChange={e => setForm({...form, qty: Number(e.target.value)})} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField select label="หน่วยงานที่รับผิดชอบ" fullWidth value={form.department_id} onChange={e => setForm({...form, department_id: e.target.value})}>
              {departments.map((d: any) => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField label="สาเหตุการสูญเสีย/ชำรุด" fullWidth multiline rows={1} value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} placeholder="เช่น ผ้าขาดระหว่างซัก, ทำเครื่องมือตกแตก" />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={<Switch checked={form.auto_deduct} onChange={e => setForm({...form, auto_deduct: e.target.checked})} color="error" />}
              label="ตัดยอดออกจากสต็อกทันที"
            />
          </Grid>
        </Grid>
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button variant="contained" color="error" startIcon={<SaveIcon />} size="large" onClick={handleSubmit}>
            บันทึกรายการ
          </Button>
        </Box>
      </Paper>

      {/* ส่วนที่ 2: ประวัติ 50 รายการล่าสุด */}
      <Paper sx={{ p: 0 }} elevation={2}>
        <Box p={2} bgcolor="#fafafa" borderBottom="1px solid #eee">
          <Typography variant="h6">ประวัติการสูญเสีย/ชำรุด (ล่าสุด 50 รายการ)</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>วัน-เวลา</b></TableCell>
                <TableCell><b>รายการ</b></TableCell>
                <TableCell align="right"><b>จำนวน</b></TableCell>
                <TableCell><b>สาเหตุ</b></TableCell>
                <TableCell><b>หน่วยงาน</b></TableCell>
                <TableCell align="center"><b>การตัดสต็อก</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {losses.map((row: any) => (
                <TableRow key={row.id}>
                  <TableCell>{new Date(row.created_at).toLocaleString('th-TH')}</TableCell>
                  <TableCell>{row.item_name}</TableCell>
                  <TableCell align="right"><b>{row.qty}</b></TableCell>
                  <TableCell>{row.reason}</TableCell>
                  <TableCell>{row.department_name}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={row.auto_deduct ? "ตัดยอดแล้ว" : "ไม่ตัดยอด"} 
                      color={row.auto_deduct ? "error" : "default"} 
                      size="small" 
                    />
                  </TableCell>
                </TableRow>
              ))}
              {losses.length === 0 && (
                <TableRow><TableCell colSpan={6} align="center">ไม่พบข้อมูลประวัติ</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Snackbar open={alert.open} autoHideDuration={4000} onClose={() => setAlert({ ...alert, open: false })}>
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default LossPage;