import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Grid, TextField, Button, MenuItem, 
  Table, TableBody, TableCell, TableHead, TableRow, IconButton, Box, Alert, Snackbar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import { apiService } from '../../api';

const RequestPage = () => {
  const [departments, setDepartments] = useState([]);
  const [masterItems, setMasterItems] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // โครงสร้างฟอร์มตาม Swagger
  const [form, setForm] = useState({
    department_id: '',
    requested_by: 'Teammy', // แนะนำให้ดึงจากชื่อ User ที่ Login อยู่
    needed_on: new Date().toISOString().split('T')[0], // วันที่แบบ YYYY-MM-DD
    priority: 'normal',
    notes: ''
  });

  const [selectedItems, setSelectedItems] = useState([{ item_id: '', qty_requested: 1 }]);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [deptRes, itemRes] = await Promise.all([
        apiService.getDepartments(),
        apiService.getItems()
      ]);
      setDepartments(deptRes.data);
      setMasterItems(itemRes.data);
    } catch (err) {
      showMsg("ไม่สามารถโหลดข้อมูลพื้นฐานได้", "error");
    }
  };

  const showMsg = (msg: string, sev: 'success' | 'error') => {
    setAlert({ open: true, message: msg, severity: sev });
  };

  const handleAddItem = () => setSelectedItems([...selectedItems, { item_id: '', qty_requested: 1 }]);

  const handleRemoveItem = (index: number) => {
    if (selectedItems.length > 1) {
      setSelectedItems(selectedItems.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    // 1. ตรวจสอบความครบถ้วนก่อนส่ง
    if (!form.department_id) return showMsg("กรุณาเลือกหน่วยงาน", "error");
    
    const validItems = selectedItems.filter(it => it.item_id !== "");
    if (validItems.length === 0) return showMsg("กรุณาเลือกรายการของอย่างน้อย 1 อย่าง", "error");

    try {
      // 2. จัดโครงสร้าง Payload ให้ตรงตาม Swagger
      const payload = {
        department_id: Number(form.department_id), // ต้องเป็น Number
        requested_by: String(form.requested_by),   // ต้องเป็น String
        needed_on: new Date(form.needed_on).toISOString(), // ต้องเป็น ISO 8601 Format
        priority: form.priority,
        notes: form.notes || "-", // ป้องกันค่าว่าง
        items: validItems.map(it => ({
          item_id: Number(it.item_id),          // ต้องเป็น Number
          qty_requested: Number(it.qty_requested) // ต้องเป็น Number
        }))
      };

      await apiService.createRequest(payload);
      showMsg("ส่งใบขอเบิกสำเร็จ!", "success");
      
      // Reset Form
      setSelectedItems([{ item_id: '', qty_requested: 1 }]);
      setForm({ ...form, notes: '', department_id: '' });
      
    } catch (err: any) {
      // ดึง Error Message จาก Backend มาแสดง
      const errMsg = err.response?.data?.message || "เกิดข้อผิดพลาด 400: ข้อมูลไม่ถูกต้อง";
      showMsg(errMsg, "error");
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom color="primary" sx={{ mb: 3 }}>
        ระบบใบขอเบิกวัสดุ (Material Request)
      </Typography>

      <Paper sx={{ p: 4, mb: 3 }} elevation={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField 
              select 
              label="หน่วยงานที่ขอเบิก" 
              fullWidth 
              value={form.department_id}
              onChange={e => setForm({...form, department_id: e.target.value})}
              required
            >
              {departments.map((d: any) => (
                <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField 
              type="date" 
              label="วันที่ต้องการใช้ของ" 
              fullWidth 
              InputLabelProps={{ shrink: true }}
              value={form.needed_on}
              onChange={e => setForm({...form, needed_on: e.target.value})}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField 
              select 
              label="ความเร่งด่วน" 
              fullWidth 
              value={form.priority}
              onChange={e => setForm({...form, priority: e.target.value})}
            >
              <MenuItem value="normal">ปกติ (Normal)</MenuItem>
              <MenuItem value="urgent">ด่วน (Urgent)</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField 
              label="หมายเหตุการเบิก" 
              fullWidth 
              multiline 
              rows={2}
              value={form.notes}
              onChange={e => setForm({...form, notes: e.target.value})}
              placeholder="ระบุเหตุผลการเบิก หรือคำแนะนำเพิ่มเติม..."
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 4 }} elevation={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight="bold">รายการของที่ต้องการ</Typography>
          <Button 
            startIcon={<AddIcon />} 
            variant="outlined" 
            onClick={handleAddItem}
          >
            เพิ่มแถวรายการ
          </Button>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#fafafa' }}>
              <TableRow>
                <TableCell>รายการสิ่งของ</TableCell>
                <TableCell width="200px" align="center">จำนวนที่ต้องการ</TableCell>
                <TableCell width="80px" align="center">ลบ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedItems.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField 
                      select 
                      fullWidth 
                      size="small" 
                      value={row.item_id}
                      onChange={e => {
                        const newItems = [...selectedItems];
                        newItems[index].item_id = e.target.value;
                        setSelectedItems(newItems);
                      }}
                    >
                      {masterItems.map((it: any) => (
                        <MenuItem key={it.id} value={it.id}>
                          {it.name} ({it.code})
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell align="center">
                    <TextField 
                      type="number" 
                      size="small" 
                      inputProps={{ min: 1 }}
                      value={row.qty_requested}
                      onChange={e => {
                        const newItems = [...selectedItems];
                        newItems[index].qty_requested = Number(e.target.value);
                        setSelectedItems(newItems);
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="error" onClick={() => handleRemoveItem(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={4} display="flex" justifyContent="center">
          <Button 
            variant="contained" 
            size="large" 
            startIcon={<SendIcon />}
            onClick={handleSave}
            sx={{ px: 8, py: 1.5, borderRadius: 2 }}
          >
            ส่งใบขอเบิกไปยัง Supply
          </Button>
        </Box>
      </Paper>

      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={alert.severity} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

const TableContainer = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ width: '100%', overflowX: 'auto' }}>{children}</Box>
);

export default RequestPage;