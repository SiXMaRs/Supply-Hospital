import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, TextField, Stack, MenuItem, IconButton, Grid, Divider, Box 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { apiService } from '../../api';

const IntakePage = () => {
  const [departments, setDepartments] = useState([]);
  const [masterItems, setMasterItems] = useState([]);
  
  // 1. ข้อมูล Header ตามโครงสร้าง Swagger
  const [header, setHeader] = useState({
    department_id: '',
    sent_by: '',
    ref_no: '',
    notes: '',
  });

  // 2. ข้อมูลรายการย่อย (Items)
  const [items, setItems] = useState([
    { item_id: '', qty_received: 1, condition_note: '', bag_no: '' }
  ]);

  // โหลดข้อมูล Master Data มาใส่ใน Dropdown
  const loadMaster = async () => {
    try {
      const [dRes, iRes] = await Promise.all([
        apiService.getDepartments(),
        apiService.getItems()
      ]);
      setDepartments(dRes.data);
      setMasterItems(iRes.data);
    } catch (err) { 
      console.error("โหลดข้อมูล Master ล้มเหลว"); 
    }
  };

  useEffect(() => {
    loadMaster();
  }, []);

  // ฟังก์ชันจัดการตารางรายการ
  const addItemRow = () => {
    setItems([...items, { item_id: '', qty_received: 1, condition_note: '', bag_no: '' }]);
  };

  const removeItemRow = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  // ฟังก์ชันบันทึกข้อมูล
  const handleSave = async () => {
    try {
      // ดึงชื่อผู้ใช้จาก LocalStorage
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user || !user.name) {
        alert("Session หมดอายุ กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      // ตรวจสอบความครบถ้วนของข้อมูลก่อนส่ง
      if (!header.department_id) { alert("กรุณาเลือกแผนกผู้ส่ง"); return; }
      if (items.some(it => !it.item_id)) { alert("กรุณาเลือกรายการสินค้าให้ครบ"); return; }

      // สร้างก้อน JSON Payload
      const payload = {
        department_id: Number(header.department_id),
        sent_by: header.sent_by || "ไม่ได้ระบุ",
        received_by: user.name, // ต้องมั่นใจว่ามีชื่อตรงนี้
        ref_no: header.ref_no || "",
        received_at: new Date().toISOString(), // ส่งเป็น ISO String
        notes: header.notes || "",
        items: items.map(it => ({
          item_id: Number(it.item_id),
          qty_received: Number(it.qty_received),
          condition_note: it.condition_note || "",
          bag_no: it.bag_no || ""
        }))
      };

      console.log("Payload to send:", JSON.stringify(payload, null, 2));

      // ส่งข้อมูลไปที่ POST /intakes/
      const response = await apiService.createIntake(payload);
      
      if (response.status === 201 || response.status === 200) {
        alert("บันทึกรับของเข้าสำเร็จ!");
        // ล้างข้อมูลหน้าจอ
        setHeader({ department_id: '', sent_by: '', ref_no: '', notes: '' });
        setItems([{ item_id: '', qty_received: 1, condition_note: '', bag_no: '' }]);
      }

    } catch (err: any) {
      // จัดการ Error 500 หรือ Constraint Fail
      console.error("API Error Detail:", err.response?.data);
      const errorMsg = err.response?.data?.message || err.response?.data?.detail || "เกิดข้อผิดพลาดที่ระบบฐานข้อมูล (Internal Server Error)";
      alert(`บันทึกไม่สำเร็จ: ${errorMsg}`);
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3} color="primary">
        บันทึกรับผ้าสกปรก/เครื่องมือเข้าหน่วย (Intake)
      </Typography>
      
      {/* ส่วนที่ 1: ข้อมูลทั่วไป (Header) */}
      <Paper sx={{ p: 3, mb: 3 }} elevation={3}>
        <Typography variant="h6" mb={2} fontWeight="bold">ข้อมูลการรับ</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField 
              select 
              label="ส่งมาจากแผนก/วอร์ด" 
              fullWidth 
              required
              value={header.department_id} 
              onChange={e => setHeader({...header, department_id: e.target.value})}
            >
              {departments.map((d: any) => (
                <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField 
              label="ผู้ส่ง (ชื่อเจ้าหน้าที่วอร์ด)" 
              fullWidth 
              value={header.sent_by} 
              onChange={e => setHeader({...header, sent_by: e.target.value})} 
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField 
              label="เลขที่อ้างอิง/เลขที่ใบส่ง" 
              fullWidth 
              value={header.ref_no} 
              onChange={e => setHeader({...header, ref_no: e.target.value})} 
            />
          </Grid>
          <Grid item xs={12}>
            <TextField 
              label="หมายเหตุเพิ่มเติม" 
              fullWidth 
              multiline 
              rows={2} 
              value={header.notes} 
              onChange={e => setHeader({...header, notes: e.target.value})} 
            />
          </Grid>
        </Grid>
      </Paper>

      {/* ส่วนที่ 2: รายการสินค้า (Items) */}
      <Paper sx={{ p: 3 }} elevation={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">รายการผ้า/เครื่องมือที่ได้รับ</Typography>
          <Button 
            startIcon={<AddIcon />} 
            variant="contained" 
            color="success" 
            onClick={addItemRow}
          >
            เพิ่มรายการ
          </Button>
        </Stack>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#eceff1' }}>
              <TableRow>
                <TableCell width="35%">รายการ</TableCell>
                <TableCell width="15%" align="center">จำนวน</TableCell>
                <TableCell width="20%">เลขถุง/ถัง</TableCell>
                <TableCell width="25%">สภาพของ/ตำหนิ</TableCell>
                <TableCell width="5%"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <TextField 
                      select 
                      fullWidth 
                      size="small" 
                      value={row.item_id} 
                      onChange={e => updateItem(index, 'item_id', e.target.value)}
                    >
                      {masterItems.map((it: any) => (
                        <MenuItem key={it.id} value={it.id}>{it.name} ({it.code})</MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <TextField 
                      type="number" 
                      fullWidth 
                      size="small" 
                      value={row.qty_received} 
                      onChange={e => updateItem(index, 'qty_received', e.target.value)} 
                      inputProps={{ min: 1 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField 
                      fullWidth 
                      size="small" 
                      placeholder="เช่น 312" 
                      value={row.bag_no} 
                      onChange={e => updateItem(index, 'bag_no', e.target.value)} 
                    />
                  </TableCell>
                  <TableCell>
                    <TextField 
                      fullWidth 
                      size="small" 
                      placeholder="เช่น เปียก, ชำรุด" 
                      value={row.condition_note} 
                      onChange={e => updateItem(index, 'condition_note', e.target.value)} 
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="error" 
                      onClick={() => removeItemRow(index)} 
                      disabled={items.length === 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 4 }} />
        
        <Box display="flex" justifyContent="flex-end">
          <Button 
            variant="contained" 
            size="large" 
            onClick={handleSave} 
            sx={{ minWidth: 250, py: 1.5, fontWeight: 'bold', fontSize: '1.1rem' }}
          >
            ยืนยันการรับของเข้า
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default IntakePage;