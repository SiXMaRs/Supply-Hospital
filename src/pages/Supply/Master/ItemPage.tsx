import React, { useState, useEffect, useMemo } from 'react';
import { 
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, 
  TextField, Stack, MenuItem, FormControlLabel, Switch, Box, Card, Fade, Chip, 
  IconButton, Grid, InputAdornment, Avatar, CircularProgress, Tooltip
} from '@mui/material';
import { 
  Package, Plus, Search, X, Save, Edit3, Trash2, Box as BoxIcon, FileText, CheckCircle, AlertCircle
} from 'lucide-react'; 
import { apiService } from '../../../api';

// --- Theme Constants ---
const theme = {
  primary: '#3f6094ff',     // Slate Dark
  secondary: '#64748b',  // Slate Gray
  bg: '#f8fafc',         // Very Light Gray
  accent: '#0ea5e9',     // Sky Blue
  success: '#dcfce7',    // Light Green (Bg)
  successText: '#166534',// Dark Green (Text)
  danger: '#ef4444',     // Red
  dangerBg: '#fef2f2',   // Light Red
  cardBorder: '#e2e8f0'
};

const ItemPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State สำหรับแยกแยะว่ากำลัง เพิ่ม หรือ แก้ไข
  const [editId, setEditId] = useState(null);

  // Form Initial State
  const initialForm = { 
    category_id: '', code: '', name: '', uom: 'PCS', 
    standard_par_qty: 0, track_by_piece: false, sterile_required: false, is_active: true 
  };
  const [form, setForm] = useState(initialForm);

  // --- Load Data ---
  const loadData = async () => {
    setLoading(true);
    try {
      const [itRes, catRes] = await Promise.all([
        apiService.getItems(),
        apiService.getItemCategories()
      ]);
      setItems(itRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) { 
      console.error("โหลดข้อมูลล้มเหลว", err); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // --- Handlers ---
  const handleOpenCreate = () => {
    setEditId(null);
    setForm(initialForm);
    setOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditId(item.id);
    setForm({
      category_id: item.category_id || '',
      code: item.code,
      name: item.name,
      uom: item.uom,
      standard_par_qty: item.standard_par_qty || 0,
      track_by_piece: Boolean(item.track_by_piece),
      sterile_required: Boolean(item.sterile_required),
      is_active: Boolean(item.is_active)
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('คุณต้องการลบสินค้ารายการนี้ใช่หรือไม่?')) {
      try {
        await apiService.deleteItem(id); // ตรวจสอบชื่อ API ให้ตรงกับ service ของคุณ
        loadData();
      } catch (err) {
        alert("ลบไม่สำเร็จ: " + (err.message || "เกิดข้อผิดพลาด"));
      }
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        category_id: Number(form.category_id), 
        standard_par_qty: Number(form.standard_par_qty) || 0,
        track_by_piece: Boolean(form.track_by_piece),
        sterile_required: Boolean(form.sterile_required),
        is_active: Boolean(form.is_active)
      };

      if (editId) {
        // กรณีแก้ไข
        await apiService.updateItem(editId, payload);
      } else {
        // กรณีสร้างใหม่
        await apiService.createItem(payload);
      }

      setOpen(false);
      loadData();
      alert("บันทึกข้อมูลสำเร็จ");
    } catch (err) {
      console.error(err);
      alert(`บันทึกไม่สำเร็จ: ${err.response?.data?.message || 'ตรวจสอบข้อมูล'}`);
    }
  };

  // --- Filter Logic ---
  const filteredItems = useMemo(() => {
    return items.filter((item) => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.bg, pt: 4, pb: 8 }}>
      <Fade in={true}>
        <Container maxWidth="lg">
          
          {/* --- Header Section --- */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            justifyContent="space-between" 
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
            mb={4}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar 
                variant="rounded" 
                sx={{ 
                  bgcolor: '#fff', 
                  color: theme.primary, 
                  width: 56, 
                  height: 56,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  border: `1px solid ${theme.cardBorder}`
                }}
              >
                <Package size={28} strokeWidth={1.5} />
              </Avatar>
              <Box>
                 <Typography variant="h5" fontWeight="800" color={theme.primary}>
                  รายการสินค้า (Master Items)
                 </Typography>
                 <Typography variant="body2" color={theme.secondary}>
                  จัดการข้อมูลพื้นฐาน ผ้า/เครื่องมือแพทย์ ทั้งหมด
                 </Typography>
              </Box>
            </Box>

            <Button 
              variant="contained" 
              startIcon={<Plus size={20} />}
              onClick={handleOpenCreate}
              sx={{ 
                bgcolor: theme.primary,
                borderRadius: '10px',
                px: 3, py: 1.2,
                textTransform: 'none', 
                fontWeight: '600',
                boxShadow: '0 4px 6px rgba(30, 41, 59, 0.2)',
                '&:hover': { bgcolor: '#334155', transform: 'translateY(-1px)' },
                transition: 'all 0.2s'
              }}
            >
              เพิ่มรายการใหม่
            </Button>
          </Stack>

          {/* --- Content Card --- */}
          <Card 
            elevation={0} 
            sx={{ 
                borderRadius: '16px', 
                border: `1px solid ${theme.cardBorder}`, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                overflow: 'hidden'
            }}
          >
            {/* Search Bar Area */}
            <Box sx={{ p: 3, borderBottom: `1px solid ${theme.cardBorder}`, bgcolor: '#fff' }}>
               <TextField
                placeholder="ค้นหารหัส หรือ ชื่อรายการ..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ 
                  width: { xs: '100%', sm: '350px' },
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: '10px',
                    bgcolor: '#f8fafc',
                    '& fieldset': { borderColor: theme.cardBorder }
                  } 
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={18} color="#94a3b8" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Table */}
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: '600', color: theme.secondary }}>รหัส (Code)</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: theme.secondary }}>ชื่อรายการ (Name)</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: theme.secondary }}>หมวดหมู่ (Category)</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: theme.secondary }} align="center">หน่วย</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: theme.secondary }} align="right">Par Qty</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: theme.secondary }} align="center">สถานะ</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: theme.secondary }} align="right">จัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                        <CircularProgress size={30} sx={{ color: theme.secondary }} />
                      </TableCell>
                    </TableRow>
                  ) : filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <TableRow 
                        key={item.id} 
                        hover 
                        sx={{ 
                            '&:last-child td, &:last-child th': { border: 0 },
                            transition: 'background 0.2s'
                        }}
                      >
                        <TableCell>
                            <Typography variant="body2" fontWeight="600" color={theme.primary}>{item.code}</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body2" color="#334155">{item.name}</Typography>
                        </TableCell>
                        <TableCell>
                            <Chip 
                                label={item.category?.name || '-'} 
                                size="small" 
                                variant="outlined"
                                sx={{ 
                                    borderColor: theme.cardBorder, 
                                    color: theme.secondary, 
                                    borderRadius: '6px',
                                    height: 24, fontSize: '0.75rem'
                                }}
                            />
                        </TableCell>
                        <TableCell align="center" sx={{ color: theme.secondary }}>{item.uom}</TableCell>
                        <TableCell align="right">
                             <Typography fontWeight="bold" color={theme.accent}>{item.standard_par_qty}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip 
                            icon={item.is_active ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                            label={item.is_active ? 'Active' : 'Inactive'} 
                            size="small"
                            sx={{ 
                              borderRadius: '6px',
                              bgcolor: item.is_active ? theme.success : '#f1f5f9',
                              color: item.is_active ? theme.successText : '#94a3b8',
                              fontWeight: '600',
                              height: 24, fontSize: '0.75rem',
                              '& .MuiChip-icon': { color: 'inherit' }
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                             <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Tooltip title="แก้ไข">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleOpenEdit(item)}
                                    sx={{ color: theme.secondary, '&:hover': { color: theme.accent, bgcolor: '#f0f9ff' } }}
                                  >
                                    <Edit3 size={16} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="ลบ">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleDelete(item.id)}
                                    sx={{ color: theme.secondary, '&:hover': { color: theme.danger, bgcolor: theme.dangerBg } }}
                                  >
                                    <Trash2 size={16} />
                                  </IconButton>
                                </Tooltip>
                             </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                             <Box display="flex" flexDirection="column" alignItems="center" gap={1} color="#cbd5e1">
                                <BoxIcon size={48} strokeWidth={1.5} />
                                <Typography variant="body2">ไม่พบข้อมูลสินค้า</Typography>
                             </Box>
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* --- Dialog Form --- */}
          <Dialog 
              open={open} 
              onClose={() => setOpen(false)} 
              maxWidth="sm" 
              fullWidth
              PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
          >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Typography variant="h6" fontWeight="bold" color={theme.primary}>
                {editId ? 'แก้ไขรายการสินค้า' : 'เพิ่มรายการใหม่'}
              </Typography>
              <IconButton onClick={() => setOpen(false)} size="small">
                  <X size={20} />
              </IconButton>
            </DialogTitle>
            
            <DialogContent>
              <Stack spacing={2.5} mt={1}>
                {/* Category Selection */}
                <TextField 
                  select 
                  label="หมวดหมู่ (Category)" 
                  fullWidth 
                  size="small"
                  value={form.category_id} 
                  onChange={e => setForm({...form, category_id: e.target.value})}
                  InputProps={{ sx: { borderRadius: '8px' } }}
                >
                  {categories.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
                </TextField>
                
                {/* Code & UOM Row */}
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <TextField 
                            label="รหัสสินค้า" 
                            fullWidth size="small"
                            placeholder="เช่น TOWEL-01"
                            value={form.code}
                            onChange={e => setForm({...form, code: e.target.value})} 
                            InputProps={{ sx: { borderRadius: '8px' } }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField 
                            label="หน่วย (UOM)" 
                            fullWidth size="small"
                            placeholder="PCS"
                            value={form.uom} 
                            onChange={e => setForm({...form, uom: e.target.value})} 
                            InputProps={{ sx: { borderRadius: '8px' } }}
                        />
                    </Grid>
                </Grid>

                <TextField 
                  label="ชื่อสินค้า (Item Name)" 
                  fullWidth size="small"
                  placeholder="เช่น ผ้าเช็ดตัวผู้ป่วย"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})} 
                  InputProps={{ sx: { borderRadius: '8px' } }}
                />
                
                <TextField 
                  label="จำนวน Par มาตรฐาน (Standard Par)" 
                  type="number" 
                  fullWidth size="small"
                  helperText="จำนวนตั้งต้นที่ควรมีในแต่ละวอร์ด"
                  value={form.standard_par_qty}
                  onChange={e => setForm({...form, standard_par_qty: Number(e.target.value)})} 
                  InputProps={{ sx: { borderRadius: '8px' } }}
                />
                
                {/* Settings Box */}
                <Box sx={{ p: 2, borderRadius: '10px', bgcolor: '#f8fafc', border: `1px dashed ${theme.cardBorder}` }}>
                    <Typography variant="caption" color={theme.secondary} fontWeight="600" display="block" mb={1}>
                        การตั้งค่าเพิ่มเติม (Additional Settings)
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <FormControlLabel 
                            control={<Switch size="small" checked={form.sterile_required} onChange={e => setForm({...form, sterile_required: e.target.checked})} />} 
                            label={<Typography variant="body2" color="#334155">ต้องฆ่าเชื้อ (Sterile)</Typography>} 
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControlLabel 
                            control={<Switch size="small" checked={form.track_by_piece} onChange={e => setForm({...form, track_by_piece: e.target.checked})} />} 
                            label={<Typography variant="body2" color="#334155">นับรายชิ้น (Track ID)</Typography>} 
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel 
                            control={<Switch size="small" color="success" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />} 
                            label={<Typography variant="body2" color="#334155">สถานะใช้งาน (Active)</Typography>} 
                        />
                      </Grid>
                    </Grid>
                </Box>

                <Button 
                  variant="contained" 
                  size="large" 
                  startIcon={<Save size={18} />}
                  onClick={handleSave} 
                  fullWidth
                  sx={{ 
                    mt: 2,
                    py: 1.2, 
                    borderRadius: '10px', 
                    bgcolor: theme.primary,
                    fontWeight: 'bold',
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#334155', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                  }}
                >
                  บันทึกข้อมูล
                </Button>
              </Stack>
            </DialogContent>
          </Dialog>
        </Container>
      </Fade>
    </Box>
  );
};

export default ItemPage;