import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, TextField, Button, MenuItem, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  IconButton, Box, Alert, Snackbar, Card, CardContent, InputAdornment, 
  Stack, Fade, Chip, Divider, Paper
} from '@mui/material';
import { 
  ShoppingCart, Plus, Trash2, Send, 
  Building2, FileText, AlertCircle, Clock, 
  Package, CheckCircle2, ChevronRight
} from 'lucide-react';
// import { apiService } from '../../api'; // Comment ไว้ก่อนถ้ายังไม่ได้ต่อ API จริง

// --- Modern Color Palette ---
const colors = {
  primary: '#4F46E5',    // Indigo
  primaryLight: '#EEF2FF',
  secondary: '#64748B',  // Slate
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  bg: '#F8FAFC',
  cardBg: '#FFFFFF',
  border: '#E2E8F0',
  textMain: '#1E293B',
  textMuted: '#94A3B8'
};

const RequestPage = () => {
  // --- State ---
  const [departments, setDepartments] = useState<any[]>([]);
  const [masterItems, setMasterItems] = useState<any[]>([]);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  const [form, setForm] = useState({
    department_id: '',
    requested_by: 'Teammy', 
    needed_on: new Date().toISOString().split('T')[0],
    priority: 'normal',
    notes: ''
  });

  const [selectedItems, setSelectedItems] = useState([{ item_id: '', qty_requested: 1 }]);

  // --- Effects ---
  useEffect(() => {
    loadInitialData();
  }, []);

  // --- แก้ไขจุดที่ 1: โหลดข้อมูลแบบตรงไปตรงมา (ไม่ต้อง await API สำหรับ Demo) ---
  const loadInitialData = () => {
      // Mock Data 
      setDepartments([
        { id: 1, name: 'แผนกฉุกเฉิน (ER)' },
        { id: 2, name: 'ห้องผ่าตัด (OR)' },
        { id: 3, name: 'หอผู้ป่วยใน (IPD)' },
        { id: 4, name: 'แผนกผู้ป่วยนอก (OPD)' },
      ]);

      setMasterItems([
        { id: 101, name: 'หน้ากากอนามัย N95', code: 'MSK-001' },
        { id: 102, name: 'ถุงมือยาง (M)', code: 'GLV-M' },
        { id: 103, name: 'แอลกอฮอล์ 70%', code: 'ALC-70' },
        { id: 104, name: 'สำลีก้อน', code: 'CTN-BALL' },
        { id: 105, name: 'เข็มฉีดยา เบอร์ 24', code: 'NDL-24' },
      ]);
  };

  const showMsg = (msg: string, sev: 'success' | 'error') => {
    setAlert({ open: true, message: msg, severity: sev });
  };

  // --- Handlers ---
  const handleAddItem = () => setSelectedItems([...selectedItems, { item_id: '', qty_requested: 1 }]);

  const handleRemoveItem = (index: number) => {
    if (selectedItems.length > 1) {
      setSelectedItems(selectedItems.filter((_, i) => i !== index));
    }
  };

  const calculateTotalQty = () => {
    return selectedItems.reduce((sum, item) => sum + Number(item.qty_requested || 0), 0);
  };

  const handleSave = async () => {
    if (!form.department_id) return showMsg("กรุณาเลือกหน่วยงาน", "error");
    
    const validItems = selectedItems.filter(it => it.item_id !== "");
    if (validItems.length === 0) return showMsg("กรุณาเลือกรายการของอย่างน้อย 1 อย่าง", "error");

    try {
      // จำลองการส่งข้อมูล
      console.log("Saving data:", { ...form, items: validItems });
      
      // await apiService.createRequest(payload); // เปิดใช้งานเมื่อต่อ API จริง
      
      showMsg("ส่งใบขอเบิกสำเร็จ!", "success");
      
      // Reset Form
      setSelectedItems([{ item_id: '', qty_requested: 1 }]);
      setForm({ ...form, notes: '', department_id: '' });
      
    } catch (err: any) {
      showMsg("เกิดข้อผิดพลาด (Demo Mode)", "error");
    }
  };

  // --- Common Styles ---
  const cardStyle = {
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
    bgcolor: colors.cardBg,
    overflow: 'hidden'
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#FAFAFA',
      '& fieldset': { borderColor: '#E2E8F0' },
      '&:hover fieldset': { borderColor: '#CBD5E1' },
      '&.Mui-focused fieldset': { borderColor: colors.primary, borderWidth: '2px' },
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: colors.bg, py: { xs: 3, md: 5 } }}>
          <Fade in={true}>
        <Container maxWidth="xl">
          
          {/* --- Header Section --- */}
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'start', sm: 'center' }} spacing={2} mb={4}>
            <Box 
              sx={{ 
                width: 56, height: 56, 
                borderRadius: '16px', 
                bgcolor: 'white', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(79, 70, 229, 0.15)',
                color: colors.primary
              }}
            >
              <ShoppingCart size={28} strokeWidth={2.5} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="800" color={colors.textMain} letterSpacing="-0.5px">
                Material Request
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                 <Typography variant="body1" color={colors.secondary}>
                  สร้างใบเบิกวัสดุอุปกรณ์
                </Typography>
                <ChevronRight size={16} color={colors.textMuted}/>
                <Typography variant="body2" fontWeight={600} color={colors.primary}>
                  New Request
                </Typography>
              </Stack>
            </Box>
          </Stack>

          <Grid container spacing={3}>
            
            {/* --- Section 1: Job Info --- */}
            <Grid item xs={12} lg={5}>
              <Card sx={cardStyle}>
                <Box sx={{ px: 3, py: 2.5, borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                   <Box p={1} borderRadius="8px" bgcolor={colors.primaryLight} color={colors.primary}>
                      <FileText size={20} />
                   </Box>
                   <Typography variant="h6" fontWeight="700" color={colors.textMain}>
                      ข้อมูลงาน
                   </Typography>
                </Box>
                
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    {/* --- แก้ไขจุดเลือก Department --- */}
                    <TextField 
                      select 
                      label="หน่วยงาน (Department)" 
                      fullWidth 
                      value={form.department_id}
                      onChange={e => setForm({...form, department_id: e.target.value})}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Building2 size={18} color={colors.secondary}/></InputAdornment>,
                      }}
                      sx={inputStyle}
                      SelectProps={{
                        MenuProps: { paper: { sx: { maxHeight: 300 } } }
                      }}
                    >
                      <MenuItem value="" disabled>
                        <em>กรุณาเลือกหน่วยงาน</em>
                      </MenuItem>
                      {departments.map((d: any) => (
                        <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                      ))}
                    </TextField>

                    <TextField 
                      type="date" 
                      label="วันที่ต้องการใช้ (Needed Date)" 
                      fullWidth 
                      InputLabelProps={{ shrink: true }}
                      value={form.needed_on}
                      onChange={e => setForm({...form, needed_on: e.target.value})}
                      sx={inputStyle}
                    />

                    <TextField 
                      select 
                      label="ความเร่งด่วน (Priority)" 
                      fullWidth 
                      value={form.priority}
                      onChange={e => setForm({...form, priority: e.target.value})}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">
                          {form.priority === 'urgent' ? <AlertCircle size={18} color={colors.danger}/> : <Clock size={18} color={colors.secondary}/>}
                        </InputAdornment>,
                      }}
                      sx={inputStyle}
                    >
                      <MenuItem value="normal">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box width={8} height={8} borderRadius="50%" bgcolor={colors.success} />
                          <Typography>ปกติ (Normal)</Typography>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="urgent">
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box width={8} height={8} borderRadius="50%" bgcolor={colors.danger} />
                          <Typography fontWeight="bold" color={colors.danger}>ด่วน (Urgent)</Typography>
                        </Stack>
                      </MenuItem>
                    </TextField>

                    <TextField 
                      label="หมายเหตุ (Note)" 
                      fullWidth 
                      multiline 
                      rows={3}
                      value={form.notes}
                      onChange={e => setForm({...form, notes: e.target.value})}
                      placeholder="ระบุเหตุผลการเบิก..."
                      sx={inputStyle}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* --- Section 2: Items Table --- */}
            <Grid item xs={12} lg={7}>
              <Card sx={{ ...cardStyle, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ 
                  px: 3, py: 2, 
                  borderBottom: `1px solid ${colors.border}`, 
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  bgcolor: '#fff'
                }}>
                   <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Box p={1} borderRadius="8px" bgcolor="#ECFDF5" color={colors.success}>
                        <Package size={20} />
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight="700" color={colors.textMain}>รายการเบิกจ่าย</Typography>
                        <Typography variant="caption" color={colors.secondary}>เลือกสินค้าและระบุจำนวน</Typography>
                      </Box>
                   </Stack>
                   
                   <Button 
                      startIcon={<Plus size={18} />} 
                      variant="contained" 
                      onClick={handleAddItem}
                      sx={{ 
                        borderRadius: '10px', textTransform: 'none', fontWeight: 600,
                        bgcolor: colors.textMain, color: '#fff',
                        boxShadow: 'none',
                        '&:hover': { bgcolor: '#0F172A' }
                      }}
                   >
                      เพิ่มแถว
                   </Button>
                </Box>
                
                <TableContainer sx={{ flexGrow: 1, maxHeight: 420 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell width="5%" align="center" sx={{ bgcolor: '#F8FAFC', color: colors.secondary, fontWeight: 600 }}>#</TableCell>
                        <TableCell width="60%" sx={{ bgcolor: '#F8FAFC', color: colors.secondary, fontWeight: 600 }}>รายการสินค้า</TableCell>
                        <TableCell width="20%" align="center" sx={{ bgcolor: '#F8FAFC', color: colors.secondary, fontWeight: 600 }}>จำนวน</TableCell>
                        <TableCell width="15%" align="center" sx={{ bgcolor: '#F8FAFC', color: colors.secondary, fontWeight: 600 }}>ลบ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedItems.map((row, index) => (
                        <TableRow key={index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell align="center" sx={{ color: colors.secondary, fontWeight: 500 }}>
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            {/* --- แก้ไขจุดเลือก Item --- */}
                            <TextField 
                              select 
                              fullWidth 
                              size="small" 
                              variant="outlined"
                              value={row.item_id}
                              onChange={e => {
                                const newItems = [...selectedItems];
                                newItems[index].item_id = e.target.value;
                                setSelectedItems(newItems);
                              }}
                              sx={{ 
                                '& .MuiOutlinedInput-root': { 
                                  bgcolor: '#fff', borderRadius: '8px',
                                  '& fieldset': { borderColor: colors.border }
                                } 
                              }}
                              placeholder="เลือกสินค้า"
                              SelectProps={{
                                MenuProps: { paper: { sx: { maxHeight: 300 } } }
                              }}
                            >
                              <MenuItem value="" disabled>
                                <em>โปรดเลือกรายการสินค้า</em>
                              </MenuItem>
                              {masterItems.map((it: any) => (
                                <MenuItem key={it.id} value={it.id}>
                                  <Stack direction="row" justifyContent="space-between" width="100%">
                                    <Typography variant="body2">{it.name}</Typography>
                                    <Typography variant="caption" color={colors.textMuted} sx={{ bgcolor: '#F1F5F9', px: 0.5, borderRadius: 1 }}>{it.code}</Typography>
                                  </Stack>
                                </MenuItem>
                              ))}
                            </TextField>
                          </TableCell>
                          <TableCell align="center">
                            <TextField 
                              type="number" 
                              size="small" 
                              fullWidth
                              inputProps={{ min: 1, style: { textAlign: 'center' } }}
                              value={row.qty_requested}
                              onChange={e => {
                                const newItems = [...selectedItems];
                                newItems[index].qty_requested = Number(e.target.value);
                                setSelectedItems(newItems);
                              }}
                              sx={{ 
                                '& .MuiOutlinedInput-root': { 
                                  bgcolor: '#fff', borderRadius: '8px',
                                  '& fieldset': { borderColor: colors.border }
                                } 
                              }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton 
                                size="small"
                                onClick={() => handleRemoveItem(index)}
                                disabled={selectedItems.length === 1}
                                sx={{ 
                                    color: selectedItems.length === 1 ? colors.border : colors.textMuted,
                                    '&:hover': { color: colors.danger, bgcolor: '#FEF2F2' }
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

                <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderTop: `1px solid ${colors.border}` }}>
                   <Grid container alignItems="center" spacing={2}>
                      <Grid item xs={12} sm={6}>
                          <Stack direction="row" spacing={3}>
                             <Box>
                                <Typography variant="caption" color={colors.secondary}>รายการทั้งหมด</Typography>
                                <Typography variant="h6" fontWeight="bold" color={colors.textMain}>{selectedItems.length}</Typography>
                             </Box>
                             <Divider orientation="vertical" flexItem />
                             <Box>
                                <Typography variant="caption" color={colors.secondary}>ยอดรวมชิ้น</Typography>
                                <Typography variant="h6" fontWeight="bold" color={colors.primary}>{calculateTotalQty()}</Typography>
                             </Box>
                          </Stack>
                      </Grid>
                      <Grid item xs={12} sm={6} display="flex" justifyContent={{xs:'flex-start', sm:'flex-end'}}>
                        <Button 
                          variant="contained" 
                          size="large" 
                          startIcon={<Send size={20} />}
                          onClick={handleSave}
                          sx={{ 
                              px: 4, py: 1.2, borderRadius: '12px', 
                              bgcolor: colors.primary,
                              boxShadow: '0 8px 20px rgba(79, 70, 229, 0.25)',
                              fontWeight: 'bold',
                              textTransform: 'none',
                              fontSize: '1rem',
                              '&:hover': { bgcolor: '#4338CA', transform: 'translateY(-2px)' },
                              transition: 'all 0.2s'
                          }}
                        >
                          ยืนยันใบเบิก
                        </Button>
                      </Grid>
                   </Grid>
                </Box>
              </Card>
            </Grid>
          </Grid>

          <Snackbar 
            open={alert.open} 
            autoHideDuration={4000} 
            onClose={() => setAlert({ ...alert, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              onClose={() => setAlert({ ...alert, open: false })}
              severity={alert.severity} 
              variant="filled" 
              icon={alert.severity === 'success' ? <CheckCircle2 size={20}/> : <AlertCircle size={20}/>}
              sx={{ borderRadius: '12px', fontWeight: 500, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
            >
              {alert.message}
            </Alert>
          </Snackbar>

        </Container>
      </Fade>
    </Box>
  );
};

export default RequestPage;