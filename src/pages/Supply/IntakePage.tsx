import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, TextField, Stack, MenuItem, IconButton, Grid, Divider, Box,
  InputAdornment, Fade, Chip, Paper
} from '@mui/material';
import { 
  Save, Plus, Trash2, PackagePlus, FileText, User, Building, StickyNote, Box as BoxIcon, AlertCircle 
} from 'lucide-react';
import { apiService } from '../../api';

// --- Theme & Style Constants ---
const theme = {
  primary: '#1e293b',    // Slate 800
  secondary: '#64748b',  // Slate 500
  bg: '#f8fafc',         // Slate 50
  cardBorder: '#e2e8f0', // Slate 200
  tableHead: '#f1f5f9',  // Slate 100
  accent: '#0ea5e9',     // Sky 500
};

const IntakePage = () => {
  // --- State Management ---
  const [departments, setDepartments] = useState([]);
  const [masterItems, setMasterItems] = useState([]);
  
  const [header, setHeader] = useState({
    department_id: '',
    sent_by: '',
    ref_no: '',
    notes: '',
  });

  const [items, setItems] = useState([
    { item_id: '', qty_received: 1, condition_note: '', bag_no: '' }
  ]);

  // --- Load Data ---
  const loadMaster = async () => {
    try {
      const [dRes, iRes] = await Promise.all([
        apiService.getDepartments(),
        apiService.getItems()
      ]);
      setDepartments(dRes.data || []);
      setMasterItems(iRes.data || []);
    } catch (err) { 
      console.error("โหลดข้อมูล Master ล้มเหลว"); 
    }
  };

  useEffect(() => { loadMaster(); }, []);

  // --- Logic Handlers ---
  const addItemRow = () => {
    setItems([...items, { item_id: '', qty_received: 1, condition_note: '', bag_no: '' }]);
  };

  const removeItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSave = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      if (!user || !user.name) {
        alert("Session หมดอายุ กรุณาเข้าสู่ระบบใหม่");
        return;
      }

      if (!header.department_id) { alert("กรุณาเลือกแผนกผู้ส่ง"); return; }
      if (items.some(it => !it.item_id)) { alert("กรุณาเลือกรายการสินค้าให้ครบ"); return; }

      const payload = {
        department_id: Number(header.department_id),
        sent_by: header.sent_by || "ไม่ได้ระบุ",
        received_by: user.name,
        ref_no: header.ref_no || "",
        received_at: new Date().toISOString(),
        notes: header.notes || "",
        items: items.map(it => ({
          item_id: Number(it.item_id),
          qty_received: Number(it.qty_received),
          condition_note: it.condition_note || "",
          bag_no: it.bag_no || ""
        }))
      };

      const response = await apiService.createIntake(payload);
      
      if (response.status === 201 || response.status === 200) {
        alert("บันทึกรับของเข้าสำเร็จ!");
        // Reset Form
        setHeader({ department_id: '', sent_by: '', ref_no: '', notes: '' });
        setItems([{ item_id: '', qty_received: 1, condition_note: '', bag_no: '' }]);
      }

    } catch (err) {
      console.error("API Error:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.detail || "เกิดข้อผิดพลาด";
      alert(`บันทึกไม่สำเร็จ: ${errorMsg}`);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.bg, py: 4 }}>
      <Fade in={true}>
        <Container maxWidth="lg">
          
          {/* --- Page Header --- */}
          <Stack direction="row" alignItems="center" spacing={2} mb={4}>
            <Box 
              sx={{ 
                p: 1.5, borderRadius: '12px', 
                bgcolor: '#fff', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: `1px solid ${theme.cardBorder}`,
                color: theme.accent
              }}
            >
              <PackagePlus size={32} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="800" color={theme.primary}>
                บันทึกรับเข้า (Intake)
              </Typography>
              <Typography variant="body2" color={theme.secondary}>
                ลงทะเบียนรับผ้าสกปรกหรือเครื่องมือเข้าสู่ระบบ
              </Typography>
            </Box>
          </Stack>
          
          {/* --- Section 1: Header Information --- */}
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: '16px', 
              border: `1px solid ${theme.cardBorder}`, 
              mb: 3, overflow: 'visible' 
            }}
          >
            <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${theme.cardBorder}`, bgcolor: '#fff' }}>
               <Typography variant="subtitle1" fontWeight="bold" display="flex" alignItems="center" gap={1}>
                 <FileText size={18} color={theme.secondary} /> ข้อมูลใบส่งของ
               </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField 
                    select 
                    label="ส่งมาจากแผนก/วอร์ด" 
                    fullWidth 
                    required
                    size="medium"
                    value={header.department_id} 
                    onChange={e => setHeader({...header, department_id: e.target.value})}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><Building size={18} color={theme.secondary}/></InputAdornment>,
                        sx: { borderRadius: '10px' }
                    }}
                  >
                    {departments.map((d) => (
                      <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField 
                    label="ชื่อผู้นำส่ง" 
                    placeholder="ระบุชื่อเจ้าหน้าที่"
                    fullWidth 
                    value={header.sent_by} 
                    onChange={e => setHeader({...header, sent_by: e.target.value})} 
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><User size={18} color={theme.secondary}/></InputAdornment>,
                        sx: { borderRadius: '10px' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField 
                    label="เลขที่ใบส่งของ (Ref No.)" 
                    placeholder="เช่น 67-001"
                    fullWidth 
                    value={header.ref_no} 
                    onChange={e => setHeader({...header, ref_no: e.target.value})} 
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><FileText size={18} color={theme.secondary}/></InputAdornment>,
                        sx: { borderRadius: '10px' }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    label="หมายเหตุเพิ่มเติม" 
                    fullWidth 
                    multiline 
                    rows={2} 
                    placeholder="รายละเอียดเพิ่มเติม (ถ้ามี)"
                    value={header.notes} 
                    onChange={e => setHeader({...header, notes: e.target.value})} 
                    InputProps={{
                        startAdornment: <InputAdornment position="start" sx={{ mt: 1.5 }}><StickyNote size={18} color={theme.secondary}/></InputAdornment>,
                        sx: { borderRadius: '10px' }
                    }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* --- Section 2: Items Table --- */}
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: '16px', 
              border: `1px solid ${theme.cardBorder}`,
              minHeight: 400,
              display: 'flex', flexDirection: 'column'
            }}
          >
            <Box sx={{ 
                px: 3, py: 2, 
                borderBottom: `1px solid ${theme.cardBorder}`, 
                bgcolor: '#fff',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <Typography variant="subtitle1" fontWeight="bold" display="flex" alignItems="center" gap={1}>
                 <BoxIcon size={18} color={theme.secondary} /> รายการสินค้า
                 <Chip label={`${items.length} รายการ`} size="small" sx={{ bgcolor: theme.bg, fontWeight: 600 }} />
              </Typography>
              <Button 
                startIcon={<Plus size={18} />} 
                variant="outlined" 
                size="small"
                onClick={addItemRow}
                sx={{ 
                    borderRadius: '8px', 
                    textTransform: 'none', 
                    fontWeight: 600,
                    borderColor: theme.cardBorder,
                    color: theme.primary,
                    '&:hover': { bgcolor: theme.bg, borderColor: theme.secondary }
                }}
              >
                เพิ่มแถว
              </Button>
            </Box>

            <TableContainer sx={{ flexGrow: 1 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell width="35%" sx={{ bgcolor: theme.tableHead, fontWeight: 600, color: theme.secondary }}>รายการ (Item)</TableCell>
                    <TableCell width="15%" align="center" sx={{ bgcolor: theme.tableHead, fontWeight: 600, color: theme.secondary }}>จำนวน</TableCell>
                    <TableCell width="20%" sx={{ bgcolor: theme.tableHead, fontWeight: 600, color: theme.secondary }}>เลขถุง/ถัง</TableCell>
                    <TableCell width="25%" sx={{ bgcolor: theme.tableHead, fontWeight: 600, color: theme.secondary }}>สภาพ/ตำหนิ</TableCell>
                    <TableCell width="5%" sx={{ bgcolor: theme.tableHead }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((row, index) => (
                    <TableRow key={index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ p: 2 }}>
                        <TextField 
                          select 
                          fullWidth 
                          size="small" 
                          placeholder="เลือกรายการ"
                          value={row.item_id} 
                          onChange={e => updateItem(index, 'item_id', e.target.value)}
                          InputProps={{ sx: { borderRadius: '8px', bgcolor: '#fff' } }}
                        >
                          {masterItems.map((it) => (
                            <MenuItem key={it.id} value={it.id}>{it.name} <Typography variant="caption" color="text.secondary" ml={1}>({it.code})</Typography></MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell align="center" sx={{ p: 2 }}>
                        <TextField 
                          type="number" 
                          fullWidth 
                          size="small" 
                          value={row.qty_received} 
                          onChange={e => updateItem(index, 'qty_received', e.target.value)} 
                          inputProps={{ min: 1, style: { textAlign: 'center' } }}
                          InputProps={{ sx: { borderRadius: '8px', bgcolor: '#fff' } }}
                        />
                      </TableCell>
                      <TableCell sx={{ p: 2 }}>
                        <TextField 
                          fullWidth 
                          size="small" 
                          placeholder="ระบุเลข" 
                          value={row.bag_no} 
                          onChange={e => updateItem(index, 'bag_no', e.target.value)} 
                          InputProps={{ sx: { borderRadius: '8px', bgcolor: '#fff' } }}
                        />
                      </TableCell>
                      <TableCell sx={{ p: 2 }}>
                        <TextField 
                          fullWidth 
                          size="small" 
                          placeholder="เช่น เปียก, ขาด" 
                          value={row.condition_note} 
                          onChange={e => updateItem(index, 'condition_note', e.target.value)} 
                          InputProps={{ sx: { borderRadius: '8px', bgcolor: '#fff' } }}
                        />
                      </TableCell>
                      <TableCell sx={{ p: 2 }}>
                        <IconButton 
                          size="small"
                          color="error" 
                          onClick={() => removeItemRow(index)} 
                          disabled={items.length === 1}
                          sx={{ 
                            opacity: items.length === 1 ? 0.3 : 0.7,
                            '&:hover': { bgcolor: '#fee2e2', opacity: 1 }
                          }}
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* --- Footer Action --- */}
          <Paper 
            elevation={0} 
            sx={{ 
                position: 'sticky', bottom: 20, zIndex: 10,
                mt: 3, p: 2, 
                borderRadius: '16px', 
                bgcolor: 'rgba(255,255,255,0.9)', 
                backdropFilter: 'blur(10px)',
                border: `1px solid ${theme.cardBorder}`,
                boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}
          >
             <Box display="flex" alignItems="center" gap={1} color={theme.secondary}>
                <AlertCircle size={18} />
                <Typography variant="caption">กรุณาตรวจสอบความถูกต้องของจำนวนก่อนบันทึก</Typography>
             </Box>
             <Button 
                variant="contained" 
                size="large" 
                onClick={handleSave} 
                startIcon={<Save size={20} />}
                sx={{ 
                    borderRadius: '10px', 
                    bgcolor: theme.primary, 
                    px: 4, py: 1.2,
                    fontWeight: 'bold',
                    boxShadow: '0 4px 10px rgba(30, 41, 59, 0.2)',
                    '&:hover': { bgcolor: '#0f172a' }
                }}
              >
                ยืนยันการรับของ
             </Button>
          </Paper>

        </Container>
      </Fade>
    </Box>
  );
};

export default IntakePage;