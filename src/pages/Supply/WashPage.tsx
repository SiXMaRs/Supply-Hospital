// src/pages/Supply/WashPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, Typography, Grid, TextField, Stack, MenuItem, 
  InputAdornment, Fade, Chip, Alert, Snackbar, Paper, Divider, 
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material'; // ลบ Container ออก และใช้ Box แทน
import { 
  Waves, Settings, List, ArrowRight, Save, Droplets, 
  Shirt, Hash
} from 'lucide-react';

// --- Theme & Styles (คงเดิม) ---
const theme = {
  primary: '#1e293b',
  secondary: '#64748B',
  bg: '#f8fafc',
  surface: '#FFFFFF',
  border: '#e2e8f0',
  accent: '#3B82F6',
  accentHover: '#2563EB',
  success: '#10B981',
  error: '#EF4444',
  iconBg: '#DBEAFE',
};

const WashPage = () => {
  // --- State ---
  const [intakes, setIntakes] = useState<any[]>([]);
  const [selectedIntake, setSelectedIntake] = useState<any>(null);
  const [loadingError, setLoadingError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  const [form, setForm] = useState({
    intake_id: '',
    job_no: `WSH-${new Date().getTime().toString().slice(-6)}`,
    cycle_type: 'laundry',
    notes: '',
  });

  const [items, setItems] = useState<any[]>([]);

  // --- Effects ---
  useEffect(() => {
    loadIntakes();
  }, []);

  const loadIntakes = async () => {
    // Mock Data
    const mockIntakes = [
        { 
            id: 1, ref_no: 'INT-20231025-01', received_at: new Date().toISOString(), 
            department: { name: 'แผนกผู้ป่วยใน (IPD)' },
            items: [
                { id: 101, item_id: 1, item: { name: 'ผ้าปูที่นอน', code: 'BD-001' }, qty_received: 50 },
                { id: 102, item_id: 2, item: { name: 'ปลอกหมอน', code: 'PL-002' }, qty_received: 50 },
                { id: 103, item_id: 3, item: { name: 'ชุดผู้ป่วย (L)', code: 'PT-L' }, qty_received: 30 },
            ]
        },
        { 
            id: 2, ref_no: 'INT-20231025-02', received_at: new Date(Date.now() - 3600000).toISOString(), 
            department: { name: 'ห้องผ่าตัด (OR)' },
            items: [
                { id: 201, item_id: 4, item: { name: 'ผ้าห่อเซต (เขียว)', code: 'SR-Gn' }, qty_received: 20 },
                { id: 202, item_id: 5, item: { name: 'กาวน์แพทย์', code: 'DOC-G' }, qty_received: 10 },
            ]
        }
    ];
    setIntakes(mockIntakes);
  };

  // --- Handlers ---
  const handleIntakeChange = (intakeId: string) => {
    const intake = intakes.find((i: any) => i.id === intakeId);
    if (intake) {
      setSelectedIntake(intake);
      setForm({ ...form, intake_id: intakeId });
      
      const washItems = (intake.items || []).map((it: any) => ({
        intake_item_id: it.id,
        item_id: it.item_id,
        item_name: it.item?.name || `Item ID: ${it.item_id}`,
        item_code: it.item?.code || '-',
        qty_received: it.qty_received,
        qty_input: it.qty_received,
      }));
      setItems(washItems);
    }
  };

  const handleSave = async () => {
    if (!form.intake_id) {
        setSnackbar({ open: true, message: 'กรุณาเลือกรายการ Intake ก่อน', severity: 'error' });
        return;
    }
    console.log("Saving Payload:", { ...form, items });
    setSnackbar({ open: true, message: 'บันทึกงานซักเรียบร้อยแล้ว (Mock)', severity: 'success' });
    
    setTimeout(() => {
        setSelectedIntake(null);
        setItems([]);
        setForm({ ...form, intake_id: '', job_no: `WSH-${new Date().getTime().toString().slice(-6)}` });
    }, 1500);
  };

  const totalQty = useMemo(() => items.reduce((sum, item) => sum + Number(item.qty_input || 0), 0), [items]);

  return (
    // แก้ไข 1: เพิ่ม width: '100%' และ overflowX: 'hidden' เพื่อป้องกัน scrollbar แนวนอน
    <Box sx={{ minHeight: '100vh', bgcolor: theme.bg, width: '100%', overflowX: 'hidden' }}>
      <Fade in={true}>
        {/* แก้ไข 2: เปลี่ยนจาก Container เป็น Box และใส่ Padding เอง เพื่อให้เต็มจอจริงๆ (Fluid Layout) */}
        <Box sx={{ p: 3, width: '100%' }}>
          
          {/* --- Page Header --- */}
          <Box mb={4} display="flex" alignItems="center" gap={2.5} sx={{
              p: 3,
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${theme.accent}10 0%, ${theme.accent}05 100%)`,
              border: `1px solid ${theme.accent}20`
          }}>
            <Box sx={{ 
                p: 2, 
                borderRadius: '14px', 
                background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
                color: 'white',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: `0 8px 16px ${theme.accent}30`
            }}>
                <Waves size={36} strokeWidth={1.5} />
            </Box>
            <Box>
                <Typography variant="h5" fontWeight="900" color={theme.primary} sx={{ letterSpacing: '-0.5px' }}>
                    Wash Process Management
                </Typography>
                <Typography variant="body2" color={theme.secondary} sx={{ mt: 0.5, fontWeight: 600 }}>
                    สร้างใบงานส่งผ้าเข้ากระบวนการซักฟอก/ฆ่าเชื้อ
                </Typography>
            </Box>
                    </Box>

                    {/* Top Summary Cards */}
                    <Box mb={3} display="flex" gap={2} alignItems="stretch">
                        <Paper elevation={0} sx={{ flex: 1, p: 2, borderRadius: '12px', border: `1px solid ${theme.border}`, background: 'linear-gradient(135deg,#fff,#fbfdff)' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }}>Intake</Typography>
                            <Typography variant="h6" fontWeight={800} sx={{ mt: 0.5 }}>{form.intake_id ? `#${form.intake_id}` : 'ยังไม่เลือก'}</Typography>
                            <Typography variant="caption" color="text.secondary">{selectedIntake?.department?.name || '—'}</Typography>
                        </Paper>
                        <Paper elevation={0} sx={{ flex: 1, p: 2, borderRadius: '12px', border: `1px solid ${theme.border}`, background: 'linear-gradient(135deg,#fff,#fbfdff)' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }}>Job No.</Typography>
                            <Typography variant="h6" fontWeight={800} sx={{ mt: 0.5 }}>{form.job_no}</Typography>
                            <Typography variant="caption" color="text.secondary">{form.cycle_type === 'laundry' ? 'Laundry' : 'Sterile'}</Typography>
                        </Paper>
                        <Paper elevation={0} sx={{ flex: 1, p: 2, borderRadius: '12px', border: `1px solid ${theme.border}`, background: 'linear-gradient(135deg,#fff,#fbfdff)' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 700 }}>Total Items</Typography>
                            <Typography variant="h6" fontWeight={900} sx={{ mt: 0.5, color: theme.accent }}>{totalQty} ชิ้น</Typography>
                            <Typography variant="caption" color="text.secondary">{items.length} รายการ</Typography>
                        </Paper>
                    </Box>

                    {loadingError && (
                         <Alert severity="warning" sx={{ mb: 3 }}>{loadingError}</Alert>
                    )}

          <Grid container spacing={3}>
            {/* --- Left Column: Control Panel --- */}
            {/* ปรับ Breakpoint: md={5} lg={5} เพื่อให้ panel ซ้ายกว้างพอดี ทำให้พื้นที่ Table และ panel สมส่วน */}
            <Grid item xs={12} md={4} lg={4} xl={4}>
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: 3, 
                        borderRadius: '16px', 
                        border: `1px solid ${theme.border}`,
                        height: '100%',
                        position: 'relative',
                        background: `linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)`,
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <Stack spacing={3}>
                        <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                            <Box sx={{ 
                                p: 1.5, borderRadius: '12px', 
                                background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
                                color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Settings size={20} />
                            </Box>
                            <Typography variant="h6" fontWeight="800" color={theme.primary}>Job Setup</Typography>
                        </Box>

                        <Divider sx={{ my: 0.5 }} />

                        {/* Quick actions */}
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Button size="small" variant="outlined" onClick={() => setForm({...form, cycle_type: 'laundry'})} sx={{ borderRadius: 1, textTransform: 'none' }}>Set Laundry</Button>
                            <Button size="small" variant="outlined" onClick={() => setForm({...form, cycle_type: 'sterile'})} sx={{ borderRadius: 1, textTransform: 'none' }}>Set Sterile</Button>
                            <Button size="small" variant="outlined" onClick={() => { navigator.clipboard?.writeText(form.job_no); setSnackbar({ open: true, message: 'คัดลอก Job No. แล้ว', severity: 'success' }); }} sx={{ borderRadius: 1, textTransform: 'none' }}>Copy Job</Button>
                        </Box>

                        <Box>
                            <Typography variant="caption" fontWeight="800" color={theme.primary} mb={1} display="block" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem' }}>
                                1. เลือกใบรับของ (Intake Ref.) <span style={{ color: 'red' }}>*</span>
                            </Typography>
                            <TextField 
                                select fullWidth 
                                value={form.intake_id}
                                onChange={(e) => handleIntakeChange(e.target.value)}
                                placeholder="เลือกรายการ"
                                SelectProps={{ displayEmpty: true }}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': { 
                                        borderRadius: '12px',
                                        backgroundColor: 'white',
                                        border: `2px solid ${theme.border}`,
                                        transition: 'all 0.2s',
                                        '&:hover': { borderColor: theme.accent },
                                        '&.Mui-focused': { 
                                            borderColor: theme.accent,
                                            boxShadow: `0 0 0 3px ${theme.accent}20`
                                        }
                                    }
                                }}
                            >
                                <MenuItem value="" disabled><em>กรุณาเลือกรายการ...</em></MenuItem>
                                {intakes.map((i: any) => (
                                <MenuItem key={i.id} value={i.id}>
                                    <Box>
                                        <Typography variant="body2" fontWeight="700">#{i.ref_no}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {i.department?.name}
                                        </Typography>
                                    </Box>
                                </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        <Box>
                            <Typography variant="caption" fontWeight="800" color={theme.primary} mb={1} display="block" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem' }}>
                                2. เลขที่ใบงาน (Job No.)
                            </Typography>
                            <TextField 
                                fullWidth value={form.job_no} 
                                InputProps={{ readOnly: true, startAdornment: <InputAdornment position="start"><Hash size={16}/></InputAdornment> }}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': { 
                                        borderRadius: '12px', 
                                        bgcolor: '#f0f4f8',
                                        border: `2px solid transparent`,
                                        transition: 'all 0.2s'
                                    },
                                    '& input': { fontWeight: '700', color: theme.primary }
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography variant="caption" fontWeight="800" color={theme.primary} mb={1} display="block" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem' }}>
                                3. ประเภทงาน (Process Type)
                            </Typography>
                            <TextField 
                                select fullWidth value={form.cycle_type}
                                onChange={e => setForm({...form, cycle_type: e.target.value})}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': { 
                                        borderRadius: '12px',
                                        backgroundColor: 'white',
                                        border: `2px solid ${theme.border}`,
                                        transition: 'all 0.2s',
                                        '&:hover': { borderColor: theme.accent },
                                        '&.Mui-focused': { 
                                            borderColor: theme.accent,
                                            boxShadow: `0 0 0 3px ${theme.accent}20`
                                        }
                                    }
                                }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">
                                        {form.cycle_type === 'laundry' ? <Waves size={18} color={theme.accent}/> : <Droplets size={18} color={theme.success}/>}
                                    </InputAdornment>,
                                }}
                            >
                                <MenuItem value="laundry">ซักฟอกทั่วไป (Laundry)</MenuItem>
                                <MenuItem value="sterile">ฆ่าเชื้อ (Sterile)</MenuItem>
                            </TextField>
                        </Box>

                         <Box>
                            <Typography variant="caption" fontWeight="800" color={theme.primary} mb={1} display="block" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.7rem' }}>
                                หมายเหตุ (Note)
                            </Typography>
                            <TextField 
                                fullWidth multiline rows={3}
                                placeholder="ระบุข้อความเพิ่มเติม..."
                                value={form.notes}
                                onChange={e => setForm({...form, notes: e.target.value})}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': { 
                                        borderRadius: '12px',
                                        border: `2px solid ${theme.border}`,
                                        transition: 'all 0.2s',
                                        '&:hover': { borderColor: theme.accent },
                                        '&.Mui-focused': { 
                                            borderColor: theme.accent,
                                            boxShadow: `0 0 0 3px ${theme.accent}20`
                                        }
                                    }
                                }}
                            />
                        </Box>

                        <Box pt={2}>
                            <Button 
                                variant="contained" fullWidth size="large"
                                onClick={handleSave}
                                disabled={!selectedIntake}
                                startIcon={<Save size={20} />}
                                sx={{ 
                                    borderRadius: '12px', 
                                    py: 1.5,
                                    background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
                                    boxShadow: `0 8px 20px ${theme.accent}30`,
                                    transition: 'all 0.3s',
                                    fontWeight: 700,
                                    letterSpacing: 0.5,
                                    '&:hover:not(:disabled)': { 
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 12px 28px ${theme.accent}40`
                                    },
                                    '&:disabled': { opacity: 0.5 }
                                }}
                            >
                                ยืนยันสร้างงาน
                            </Button>
                        </Box>
                    </Stack>
                </Paper>
            </Grid>

            {/* --- Right Column: Data Table --- */}
            <Grid item xs={12} md={8} lg={8} xl={8}>
                <Paper 
                    elevation={0} 
                    sx={{ 
                        borderRadius: '16px', 
                        border: `1px solid ${theme.border}`,
                        height: '100%',
                        overflow: 'hidden',
                        display: 'flex', 
                        flexDirection: 'column',
                        background: 'white'
                    }}
                >
                    {selectedIntake ? (
                        <>
                            <Box sx={{ px: 3, py: 2.5, borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, background: `linear-gradient(90deg, #f8fafc 0%, #f0f4f8 100%)` }}>
                                <Box>
                                    <Typography variant="h6" fontWeight="800" color={theme.primary}>รายการสินค้า (Items)</Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                        รับเข้าเมื่อ: {new Date(selectedIntake.received_at).toLocaleString('th-TH')}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <Chip 
                                        label={`${totalQty} ชิ้น`} 
                                        color="primary" 
                                        sx={{ 
                                            fontWeight: 700, 
                                            fontSize: '0.9rem',
                                            background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
                                            color: 'white'
                                        }} 
                                    />
                                    <Button size="small" variant="outlined" onClick={() => setSnackbar({ open: true, message: 'เริ่มกระบวนการ (Mock)', severity: 'success' })} sx={{ textTransform: 'none' }}>Start</Button>
                                    <Button size="small" variant="outlined" onClick={() => setSnackbar({ open: true, message: 'พิมพ์ใบงาน (Mock)', severity: 'success' })} sx={{ textTransform: 'none' }}>Print</Button>
                                </Box>
                            </Box>

                            <TableContainer sx={{ flexGrow: 1, px: 2 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow sx={{ 
                                            background: `linear-gradient(90deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`,
                                            '& .MuiTableCell-head': {
                                                color: 'white',
                                                fontWeight: 800,
                                                fontSize: '0.9rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.4px',
                                                borderBottom: `2px solid ${theme.accentHover}`,
                                                padding: '14px 16px'
                                            }
                                        }}>
                                            <TableCell>สินค้า (Item)</TableCell>
                                            <TableCell align="center" width="14%">รับมา (Recv.)</TableCell>
                                            <TableCell width="6%"></TableCell>
                                            <TableCell align="center" width="18%">จำนวนล้าง (Input)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {items.map((row, index) => (
                                            <TableRow key={index} sx={{
                                                transition: 'all 0.18s',
                                                backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FAFBFF',
                                                '&:hover': {
                                                    backgroundColor: '#F7FBFF',
                                                    transform: 'translateY(-1px)'
                                                },
                                                borderBottom: `1px solid ${theme.border}`
                                            }}>
                                                <TableCell sx={{ py: 2 }}>
                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                        <Box sx={{ 
                                                            width: 40, height: 40, borderRadius: '10px', 
                                                            background: `linear-gradient(135deg, #DBEAFE 0%, #E0F2FE 100%)`,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            color: theme.accent,
                                                            fontWeight: 700
                                                        }}>
                                                            <Shirt size={20} />
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight="800" sx={{ fontSize: '0.95rem', color: theme.primary }}>{row.item_name}</Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{row.item_code}</Typography>
                                                        </Box>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="center" sx={{ py: 2 }}>
                                                    <Box sx={{
                                                        bgcolor: '#E0F2FE',
                                                        borderRadius: '8px',
                                                        py: 0.75,
                                                        px: 1.5
                                                    }}>
                                                        <Typography variant="body2" fontWeight="800" sx={{ fontSize: '0.95rem', color: theme.accent }}>{row.qty_received}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center" sx={{ py: 2 }}>
                                                    <ArrowRight size={16} color={theme.accent} strokeWidth={2.5} />
                                                </TableCell>
                                                <TableCell align="center" sx={{ py: 2 }}>
                                                    <TextField 
                                                        type="number" size="small" fullWidth
                                                        value={row.qty_input}
                                                        onChange={(e) => {
                                                            const val = Math.max(0, parseInt(e.target.value) || 0);
                                                            const newItems = [...items];
                                                            newItems[index].qty_input = val;
                                                            setItems(newItems);
                                                        }}
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': { 
                                                                borderRadius: '10px', 
                                                                bgcolor: row.qty_input !== row.qty_received ? '#FEF2F2' : '#F0F9FF',
                                                                height: 40,
                                                                border: `2px solid ${row.qty_input !== row.qty_received ? '#FECACA' : '#DBEAFE'}`,
                                                                transition: 'all 0.2s',
                                                                '&:hover': {
                                                                    borderColor: theme.accent,
                                                                    boxShadow: `0 0 0 3px ${theme.accent}15`
                                                                },
                                                                '&.Mui-focused': { 
                                                                    borderColor: theme.accent,
                                                                    boxShadow: `0 0 0 3px ${theme.accent}25`,
                                                                },
                                                            },
                                                            '& input': { 
                                                                textAlign: 'center', 
                                                                fontWeight: 800, 
                                                                fontSize: '0.95rem',
                                                                color: row.qty_input !== row.qty_received ? theme.error : theme.accent
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* Footer: totals + save */}
                            <Box sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">รวมรายการ</Typography>
                                    <Typography fontWeight={800}>{items.length} รายการ • {totalQty} ชิ้น</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button variant="outlined" onClick={() => { setSelectedIntake(null); setItems([]); setForm({...form, intake_id: ''}); }} sx={{ textTransform: 'none' }}>Reset</Button>
                                    <Button variant="contained" startIcon={<Save size={16} />} onClick={handleSave} sx={{ background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accentHover} 100%)`, textTransform: 'none', fontWeight: 800 }}>Save Job</Button>
                                </Box>
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 5 }}>
                            <Box sx={{ 
                                width: 100, height: 100, 
                                borderRadius: '20px', 
                                background: `linear-gradient(135deg, ${theme.accent}15 0%, ${theme.accent}05 100%)`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                mb: 3,
                                border: `2px solid ${theme.accent}30`
                            }}>
                                <List size={50} color={theme.accent} opacity={0.4} />
                            </Box>
                            <Typography fontWeight="800" sx={{ fontSize: '1.1rem', color: theme.primary, mb: 1 }}>รอการเลือกใบงาน</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 400 }}>
                                กรุณาเลือกรายการ Intake จากแผนควบคุมด้านซ้าย เพื่อเริ่มสร้างใบงานซักฟอก
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Grid>
          </Grid>

          {/* Feedback */}
          <Snackbar 
            open={snackbar.open} autoHideDuration={4000} 
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: '10px' }}>
              {snackbar.message}
            </Alert>
          </Snackbar>

        </Box>
      </Fade>
    </Box>
  );
};

export default WashPage;