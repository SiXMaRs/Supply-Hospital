import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, TextField, Button, MenuItem, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Box, Alert, Snackbar, Switch, FormControlLabel, Chip, Card, CardContent,
  InputAdornment, Fade, Stack, Divider, Paper, IconButton, Tooltip
} from '@mui/material';
import { 
  AlertTriangle, Save, Building2, Package, FileWarning, 
  History, Archive, CheckCircle2, XCircle, Trash2, Info
} from 'lucide-react';

// import { apiService } from '../../api'; // Uncomment เมื่อต่อ API จริง

// --- Modern Design Tokens ---
const theme = {
  primary: '#E11D48',     // Rose 600
  primaryHover: '#BE123C', // Rose 700
  bg: '#FFF1F2',          // Rose 50 (Background Page)
  surface: '#FFFFFF',     // White (Cards)
  border: '#FECDD3',      // Rose 200
  textMain: '#881337',    // Rose 900
  textMuted: '#9F1239',   // Rose 800
  success: '#10B981',     // Green
  gray: '#64748B'         // Slate 500
};

const LossPage = () => {
  // --- State ---
  const [losses, setLosses] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [form, setForm] = useState({
    department_id: '',
    item_id: '',
    qty: 1,
    reason: '',
    ref_type: 'general',
    ref_id: 0,
    created_by: 'Admin',
    batch_id: 0,
    auto_deduct: true 
  });

  // --- Effects ---
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    // --- Mock Data Setup (ลบส่วนนี้ออกเมื่อใช้ API จริง) ---
    const mockDepartments = [
      { id: 1, name: 'คลังสินค้าหลัก (Main Warehouse)' },
      { id: 2, name: 'แผนกผลิต (Production)' },
      { id: 3, name: 'แผนก QC' },
    ];
    const mockItems = [
      { id: 101, name: 'ขวดแก้ว 500ml', code: 'GLS-500' },
      { id: 102, name: 'กล่องกระดาษ A4', code: 'BOX-A4' },
      { id: 103, name: 'ฝาพลาสติก (Type C)', code: 'CAP-C' },
    ];
    const mockLosses = [
      { id: 1, item_name: 'ขวดแก้ว 500ml', qty: 5, reason: 'แตกเสียหายระหว่างขนย้าย', department_name: 'คลังสินค้าหลัก', created_at: new Date().toISOString(), auto_deduct: true },
      { id: 2, item_name: 'ฝาพลาสติก (Type C)', qty: 20, reason: 'QC ไม่ผ่าน (รอยขีดข่วน)', department_name: 'แผนก QC', created_at: new Date(Date.now() - 86400000).toISOString(), auto_deduct: false },
    ];

    // Set Data
    setDepartments(mockDepartments);
    setItems(mockItems);
    setLosses(mockLosses);

    // --- API Code (Uncomment when ready) ---
    /*
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
    */
  };

  const showMsg = (msg: string, sev: 'success' | 'error') => {
    setAlert({ open: true, message: msg, severity: sev });
  };

  const handleSubmit = async () => {
    if (!form.item_id || !form.department_id || !form.reason) {
      return showMsg("กรุณากรอกข้อมูลให้ครบถ้วน (สินค้า, แผนก, สาเหตุ)", "error");
    }

    // Mock Process
    console.log("Saving Loss:", form);
    
    // จำลองการเพิ่มข้อมูลลงตารางทันทีเพื่อให้เห็นภาพ
    const selectedItem = items.find(i => i.id === form.item_id);
    const selectedDept = departments.find(d => d.id === form.department_id);
    
    const newLoss = {
        id: Date.now(),
        item_name: selectedItem?.name,
        qty: form.qty,
        reason: form.reason,
        department_name: selectedDept?.name,
        created_at: new Date().toISOString(),
        auto_deduct: form.auto_deduct
    };
    
    setLosses([newLoss, ...losses]);
    showMsg("บันทึกรายการสูญเสียสำเร็จ", "success");
    setForm({ ...form, item_id: '', qty: 1, reason: '', ref_id: 0, batch_id: 0 });

    /* API Call Code
    try {
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
      setForm({ ...form, item_id: '', qty: 1, reason: '', ref_id: 0, batch_id: 0 });
      loadInitialData();
    } catch (err: any) {
      showMsg("บันทึกล้มเหลว", "error");
    }
    */
  };

  // --- Styles ---
  const cardStyle = {
    borderRadius: '16px',
    border: 'none',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    bgcolor: theme.surface,
    height: '100%',
    overflow: 'hidden'
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#FAFAFA',
      '& fieldset': { borderColor: '#E2E8F0' },
      '&:hover fieldset': { borderColor: '#CBD5E1' },
      '&.Mui-focused fieldset': { borderColor: theme.primary },
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.bg, py: { xs: 3, md: 5 } }}>
      <Fade in={true}>
        <Container maxWidth="xl">
          
          {/* --- Header Section --- */}
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2} mb={4}>
            <Box 
              sx={{ 
                width: 56, height: 56, 
                borderRadius: '16px', 
                bgcolor: '#FFE4E6', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: theme.primary,
                boxShadow: '0 4px 12px rgba(225, 29, 72, 0.2)'
              }}
            >
              <AlertTriangle size={28} strokeWidth={2.5} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="800" color={theme.textMain} letterSpacing="-0.5px">
                Loss & Damage
              </Typography>
              <Typography variant="body1" color={theme.textMuted}>
                บันทึกความเสียหายและสินค้าสูญหาย
              </Typography>
            </Box>
          </Stack>

          <Grid container spacing={3}>
            
            {/* --- Section 1: Form --- */}
            <Grid item xs={12} lg={4}>
              <Card sx={cardStyle}>
                <Box sx={{ px: 3, py: 2, borderBottom: `1px solid ${theme.border}`, bgcolor: '#FFF1F2', display: 'flex', alignItems: 'center', gap: 1 }}>
                   <FileWarning size={20} color={theme.primary} />
                   <Typography variant="h6" fontWeight="700" color={theme.textMain}>
                      บันทึกรายการใหม่
                   </Typography>
                </Box>
                
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    {/* Item Select */}
                    <Box>
                        <Typography variant="caption" fontWeight={600} color={theme.textMuted} mb={0.5} display="block">สินค้าที่เสียหาย</Typography>
                        <TextField 
                          select 
                          fullWidth 
                          value={form.item_id} 
                          onChange={e => setForm({...form, item_id: e.target.value})}
                          placeholder="เลือกสินค้า"
                          sx={inputStyle}
                          SelectProps={{ displayEmpty: true }}
                          InputProps={{
                              startAdornment: <InputAdornment position="start"><Package size={18} color={theme.gray}/></InputAdornment>
                          }}
                        >
                          <MenuItem value="" disabled><em>กรุณาเลือกสินค้า...</em></MenuItem>
                          {items.map((it: any) => <MenuItem key={it.id} value={it.id}>{it.name}</MenuItem>)}
                        </TextField>
                    </Box>

                    {/* Qty & Dept */}
                    <Stack direction="row" spacing={2}>
                        <Box flex={1}>
                            <Typography variant="caption" fontWeight={600} color={theme.textMuted} mb={0.5} display="block">จำนวน (Qty)</Typography>
                            <TextField 
                                type="number" 
                                fullWidth 
                                value={form.qty} 
                                onChange={e => setForm({...form, qty: Number(e.target.value)})} 
                                sx={inputStyle}
                                inputProps={{ min: 1 }}
                            />
                        </Box>
                        <Box flex={1}>
                            <Typography variant="caption" fontWeight={600} color={theme.textMuted} mb={0.5} display="block">หน่วยงาน</Typography>
                            <TextField 
                                select 
                                fullWidth 
                                value={form.department_id} 
                                onChange={e => setForm({...form, department_id: e.target.value})}
                                sx={inputStyle}
                                SelectProps={{ displayEmpty: true }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start"><Building2 size={18} color={theme.gray}/></InputAdornment>
                                }}
                            >
                                <MenuItem value="" disabled><em>เลือกแผนก...</em></MenuItem>
                                {departments.map((d: any) => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                            </TextField>
                        </Box>
                    </Stack>

                    {/* Reason */}
                    <Box>
                        <Typography variant="caption" fontWeight={600} color={theme.textMuted} mb={0.5} display="block">สาเหตุความเสียหาย</Typography>
                        <TextField 
                            fullWidth 
                            multiline 
                            rows={3} 
                            value={form.reason} 
                            onChange={e => setForm({...form, reason: e.target.value})} 
                            placeholder="เช่น ตกแตกขณะขนย้าย, หมดอายุ, สูญหายตรวจนับไม่พบ..." 
                            sx={inputStyle}
                        />
                    </Box>

                    <Divider />

                    {/* Switch Control */}
                    <Box 
                        sx={{ 
                            p: 2, borderRadius: '12px', 
                            bgcolor: form.auto_deduct ? '#FFF1F2' : '#F8FAFC', 
                            border: `1px solid ${form.auto_deduct ? theme.border : '#E2E8F0'}`,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <FormControlLabel
                            control={
                                <Switch 
                                    checked={form.auto_deduct} 
                                    onChange={e => setForm({...form, auto_deduct: e.target.checked})} 
                                    sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': { color: theme.primary },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: theme.primary },
                                    }}
                                />
                            }
                            label={
                                <Box>
                                    <Typography fontWeight="bold" color={form.auto_deduct ? theme.primary : 'text.secondary'}>
                                        ตัดยอดสต็อกทันที (Auto Deduct)
                                    </Typography>
                                    <Typography variant="caption" display="block" color="text.secondary">
                                        ระบบจะลดยอดคงเหลือในคลังสินค้าอัตโนมัติ
                                    </Typography>
                                </Box>
                            }
                        />
                    </Box>

                    <Button 
                        variant="contained" 
                        fullWidth
                        size="large" 
                        onClick={handleSubmit}
                        startIcon={<Save size={20} />}
                        sx={{ 
                            borderRadius: '12px', py: 1.8, 
                            bgcolor: theme.primary, 
                            fontWeight: 'bold', fontSize: '1rem',
                            boxShadow: '0 8px 20px rgba(225, 29, 72, 0.3)',
                            '&:hover': { bgcolor: theme.primaryHover, transform: 'translateY(-2px)' },
                            transition: 'all 0.2s'
                        }}
                    >
                        บันทึกรายการ
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* --- Section 2: History Table --- */}
            <Grid item xs={12} lg={8}>
              <Card sx={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ px: 3, py: 2, borderBottom: `1px solid #E2E8F0`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <Stack direction="row" alignItems="center" spacing={1.5}>
                      <History size={20} color={theme.gray} />
                      <Typography variant="h6" fontWeight="700" color={theme.textMain}>ประวัติรายการ (History)</Typography>
                   </Stack>
                   <Chip label={`Total: ${losses.length}`} size="small" sx={{ bgcolor: '#F1F5F9', fontWeight: 600 }} />
                </Box>

                <TableContainer sx={{ maxHeight: 600 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ bgcolor: '#F8FAFC', color: theme.gray, fontWeight: 600 }}>สินค้า / เวลา</TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#F8FAFC', color: theme.gray, fontWeight: 600 }}>จำนวน</TableCell>
                        <TableCell sx={{ bgcolor: '#F8FAFC', color: theme.gray, fontWeight: 600 }}>สาเหตุ / แผนก</TableCell>
                        <TableCell align="center" sx={{ bgcolor: '#F8FAFC', color: theme.gray, fontWeight: 600 }}>การตัดสต็อก</TableCell>
                        <TableCell align="center" width={50} sx={{ bgcolor: '#F8FAFC' }}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {losses.length > 0 ? losses.map((row: any) => (
                        <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell>
                            <Typography fontWeight="600" variant="body1" color="#1E293B">{row.item_name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                {new Date(row.created_at).toLocaleDateString('th-TH')} • {new Date(row.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute:'2-digit' })} น.
                            </Typography>
                          </TableCell>
                          
                          <TableCell align="center">
                            <Chip label={`-${row.qty}`} color="error" size="small" sx={{ fontWeight: 'bold', minWidth: 40 }} />
                          </TableCell>
                          
                          <TableCell>
                            <Typography variant="body2" color="#334155" sx={{ mb: 0.5 }}>{row.reason}</Typography>
                            <Stack direction="row" alignItems="center" gap={0.5}>
                                <Building2 size={12} color="#94A3B8"/>
                                <Typography variant="caption" color="text.secondary">{row.department_name}</Typography>
                            </Stack>
                          </TableCell>
                          
                          <TableCell align="center">
                            {row.auto_deduct ? (
                                <Tooltip title="ตัดสต็อกสำเร็จ">
                                    <Chip 
                                        icon={<CheckCircle2 size={14} />} 
                                        label="ตัดแล้ว" 
                                        size="small" 
                                        sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 600, border: '1px solid #A7F3D0' }} 
                                    />
                                </Tooltip>
                             ) : (
                                <Tooltip title="บันทึกข้อมูลอย่างเดียว ไม่ตัดสต็อก">
                                    <Chip 
                                        icon={<Info size={14} />} 
                                        label="บันทึกเฉยๆ" 
                                        size="small" 
                                        sx={{ bgcolor: '#F8FAFC', color: '#64748B', border: '1px solid #E2E8F0' }} 
                                    />
                                </Tooltip>
                             )}
                          </TableCell>
                          
                          <TableCell>
                             <IconButton size="small" sx={{ color: '#CBD5E1', '&:hover': { color: theme.primary, bgcolor: '#FFF1F2' } }}>
                                <Trash2 size={16} />
                             </IconButton>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                           <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                               <Box display="flex" flexDirection="column" alignItems="center" gap={2} color="#94A3B8">
                                   <Box p={2} borderRadius="50%" bgcolor="#F1F5F9">
                                      <Archive size={32} />
                                   </Box>
                                   <Typography>ยังไม่มีรายการความเสียหาย</Typography>
                               </Box>
                           </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
          </Grid>

          {/* Feedback Snackbar */}
          <Snackbar 
            open={alert.open} 
            autoHideDuration={4000} 
            onClose={() => setAlert({ ...alert, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
                variant="filled" 
                severity={alert.severity} 
                iconMapping={{
                    success: <CheckCircle2 size={20} />,
                    error: <AlertTriangle size={20} />
                }}
                sx={{ borderRadius: '12px', fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
            >
                {alert.message}
            </Alert>
          </Snackbar>

        </Container>
      </Fade>
    </Box>
  );
};

export default LossPage;