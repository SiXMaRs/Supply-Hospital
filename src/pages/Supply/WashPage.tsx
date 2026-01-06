// src/pages/Supply/WashPage.tsx

import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, TextField, Stack, MenuItem, Grid, Box, Divider, Alert
} from '@mui/material';
import { apiService } from '../../api';

const WashPage = () => {
  const [intakes, setIntakes] = useState([]);
  const [selectedIntake, setSelectedIntake] = useState<any>(null);
  const [loadingError, setLoadingError] = useState(""); // เก็บข้อความ Error
  
  const [form, setForm] = useState({
    intake_id: '',
    job_no: `WSH-${new Date().getTime()}`,
    cycle_type: 'laundry',
    notes: '',
  });

  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    loadIntakes();
  }, []);

  const loadIntakes = async () => {
    try {
      setLoadingError("");
      const res = await apiService.getPendingIntakes();
      if (res.data && res.data.length > 0) {
        setIntakes(res.data);
      } else {
        setLoadingError("ไม่พบรายการ Intake ที่รอซักในระบบ (กรุณาไปบันทึกรับของเข้าก่อน)");
      }
    } catch (err: any) {
      console.error("Error loading intakes:", err);
      setLoadingError("ไม่สามารถดึงข้อมูล Intake ได้: " + (err.response?.data?.message || "ติดต่อผู้ดูแลระบบ"));
    }
  };

  const handleIntakeChange = (intakeId: string) => {
    const intake = intakes.find((i: any) => i.id === intakeId) as any;
    if (intake) {
      setSelectedIntake(intake);
      setForm({ ...form, intake_id: intakeId });
      // ตรวจสอบว่ามี items หรือไม่
      const washItems = (intake.items || []).map((it: any) => ({
        intake_item_id: it.id,
        item_id: it.item_id,
        item_name: it.item?.name || `Item ID: ${it.item_id}`,
        qty_received: it.qty_received,
        qty_input: it.qty_received, 
      }));
      setItems(washItems);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        intake_id: Number(form.intake_id),
        job_no: form.job_no,
        cycle_type: form.cycle_type,
        notes: form.notes,
        items: items.map(it => ({
          intake_item_id: Number(it.intake_item_id),
          item_id: Number(it.item_id),
          qty_input: Number(it.qty_input)
        }))
      };

      await apiService.createWashJob(payload);
      alert("บันทึกงานซักสำเร็จ!");
      setSelectedIntake(null);
      setItems([]);
      setForm({ ...form, intake_id: '', job_no: `WSH-${new Date().getTime()}` });
      loadIntakes(); // โหลดข้อมูลใหม่
    } catch (err: any) {
      alert("บันทึกไม่สำเร็จ: " + (err.response?.data?.message || "ข้อมูลไม่ถูกต้อง"));
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3} color="primary">
        สร้างงานซัก/ฆ่าเชื้อ (Wash & Sterile Job)
      </Typography>

      {/* แสดง Alert เมื่อมี Error */}
      {loadingError && (
        <Alert severity="warning" sx={{ mb: 3 }}>{loadingError}</Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField 
              select 
              label="เลือกใบรับของสกปรก (Reference Intake)" 
              fullWidth 
              disabled={intakes.length === 0}
              value={form.intake_id}
              onChange={(e) => handleIntakeChange(e.target.value)}
            >
              {intakes.map((i: any) => (
                <MenuItem key={i.id} value={i.id}>
                  #{i.id} - จาก {i.department?.name || 'แผนกทั่วไป'} ({new Date(i.received_at).toLocaleDateString()})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField label="เลขที่งาน" fullWidth value={form.job_no} readOnly />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField 
              select 
              label="ประเภทกระบวนการ" 
              fullWidth 
              value={form.cycle_type}
              onChange={e => setForm({...form, cycle_type: e.target.value})}
            >
              <MenuItem value="laundry">ซักฟอก (Laundry)</MenuItem>
              <MenuItem value="sterile">ทำให้ปราศจากเชื้อ (Sterile)</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {selectedIntake && items.length > 0 ? (
        <Paper sx={{ p: 3 }} elevation={3}>
          <Typography variant="h6" mb={2} fontWeight="bold">รายการที่ต้องดำเนินการ</Typography>
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>รายการ</TableCell>
                  <TableCell align="center">รับมา</TableCell>
                  <TableCell align="center" width="200px">จำนวนที่เข้าเครื่อง</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.item_name}</TableCell>
                    <TableCell align="center">{row.qty_received}</TableCell>
                    <TableCell align="center">
                      <TextField 
                        type="number" 
                        size="small" 
                        value={row.qty_input}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].qty_input = e.target.value;
                          setItems(newItems);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Divider sx={{ my: 3 }} />
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" size="large" onClick={handleSave}>บันทึกงานซัก</Button>
          </Box>
        </Paper>
      ) : selectedIntake && (
        <Alert severity="info">ใบรับของนี้ไม่มีรายการสินค้าภายใน</Alert>
      )}
    </Container>
  );
};

export default WashPage;