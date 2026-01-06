import React, { useState, useEffect, useMemo } from 'react';
import { 
  Container, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Dialog, 
  DialogTitle, DialogContent, TextField, Stack, Chip, 
  IconButton, InputAdornment, Card, Fade, CircularProgress,
  Switch, FormControlLabel, Box, Tooltip
} from '@mui/material';
import { 
  Plus, Search, X, LayoutGrid, Save, Edit3, Trash2, MapPin, CheckCircle, AlertCircle
} from 'lucide-react';
import { apiService } from '../../../api'; 

// --- Theme Constants ---
const theme = {
  primary: '#3f6094ff',    // Dark Navy
  secondary: '#64748b',  // Slate Grey
  bg: '#f8fafc',         // Very Light Grey
  accent: '#0ea5e9',     // Sky Blue
  success: '#dcfce7',    // Light Green (Bg)
  successText: '#166534',// Dark Green (Text)
  danger: '#ef4444',     // Red
  dangerBg: '#fef2f2'    // Light Red
};

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State สำหรับการแก้ไข
  const [editId, setEditId] = useState(null);

  // Form State
  const initialForm = { code: '', name: '', is_active: true };
  const [form, setForm] = useState(initialForm);

  // --- Load Data ---
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await apiService.getItemCategories();
      setCategories(res.data || []);
    } catch (err) { 
      console.error("โหลดข้อมูลไม่สำเร็จ", err); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // --- Filter Logic ---
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => 
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, categories]);

  // --- Handlers ---

  const handleOpenCreate = () => {
    setEditId(null);
    setForm(initialForm);
    setOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditId(item.id);
    setForm({
      code: item.code,
      name: item.name,
      is_active: item.is_active
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('คุณต้องการลบข้อมูลหมวดหมู่นี้ใช่หรือไม่?')) {
      try {
        await apiService.deleteItemCategory(id); // ตรวจสอบชื่อ function ใน apiService อีกครั้ง
        loadData();
      } catch (err) {
        alert("ลบไม่สำเร็จ: " + (err.message || "เกิดข้อผิดพลาด"));
      }
    }
  };

  const handleSave = async () => {
    try {
      if (editId) {
        // Update Logic
        await apiService.updateItemCategory(editId, form);
      } else {
        // Create Logic
        await apiService.createItemCategory(form);
      }
      
      setOpen(false);
      loadData();
      alert("บันทึกข้อมูลสำเร็จ");
    } catch (err) {
      console.error(err);
      alert("บันทึกไม่สำเร็จ: " + (err.response?.data?.message || "เกิดข้อผิดพลาด"));
    }
  };

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
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{ 
                bgcolor: '#e0f2fe', 
                p: 1.5, 
                borderRadius: '12px',
                color: theme.accent,
                display: 'flex',
                boxShadow: '0 2px 8px rgba(14, 165, 233, 0.15)'
              }}>
                <LayoutGrid size={28} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="800" color={theme.primary}>
                  หมวดหมู่สินค้า
                </Typography>
                <Typography variant="body2" color={theme.secondary}>
                  จัดการรายการหมวดหมู่ (Categories) ทั้งหมด
                </Typography>
              </Box>
            </Stack>

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
              เพิ่มหมวดหมู่ใหม่
            </Button>
          </Stack>

          {/* --- Content Card --- */}
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: '16px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)', 
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}
          >
            
            {/* Search Bar Area */}
            <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', bgcolor: '#fff' }}>
              <TextField
                placeholder="ค้นหาชื่อ หรือ รหัส..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ 
                  width: { xs: '100%', sm: '350px' },
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: '10px',
                    bgcolor: '#f8fafc',
                    '& fieldset': { borderColor: '#e2e8f0' }
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

            {/* Table Area */}
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#64748b', fontWeight: '600', py: 2 }}>รหัส (Code)</TableCell>
                    <TableCell sx={{ color: '#64748b', fontWeight: '600' }}>ชื่อหมวดหมู่ (Name)</TableCell>
                    <TableCell align="center" sx={{ color: '#64748b', fontWeight: '600' }}>สถานะ (Status)</TableCell>
                    <TableCell align="right" sx={{ color: '#64748b', fontWeight: '600' }}>จัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                        <CircularProgress size={30} sx={{ color: theme.secondary }} />
                      </TableCell>
                    </TableRow>
                  ) : filteredCategories.length > 0 ? (
                    filteredCategories.map((cat) => (
                      <TableRow 
                        key={cat.id} 
                        hover 
                        sx={{ 
                          '&:last-child td, &:last-child th': { border: 0 }, 
                          transition: '0.2s' 
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight="600" color={theme.primary}>
                            {cat.code}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="#334155">
                            {cat.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                           <Chip 
                            icon={cat.is_active ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                            label={cat.is_active ? 'Active' : 'Inactive'} 
                            size="small"
                            sx={{ 
                              borderRadius: '6px',
                              bgcolor: cat.is_active ? theme.success : '#f1f5f9',
                              color: cat.is_active ? theme.successText : '#94a3b8',
                              fontWeight: '600',
                              height: 24,
                              fontSize: '0.75rem',
                              '& .MuiChip-icon': { color: 'inherit' }
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <Tooltip title="แก้ไข">
                              <IconButton 
                                size="small" 
                                onClick={() => handleOpenEdit(cat)}
                                sx={{ color: '#64748b', '&:hover': { color: theme.accent, bgcolor: '#f0f9ff' } }}
                              >
                                <Edit3 size={16} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="ลบ">
                              <IconButton 
                                size="small" 
                                onClick={() => handleDelete(cat.id)}
                                sx={{ color: '#64748b', '&:hover': { color: theme.danger, bgcolor: theme.dangerBg } }}
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
                      <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                        <Box display="flex" flexDirection="column" alignItems="center" gap={1} color="#cbd5e1">
                          <MapPin size={48} strokeWidth={1.5} />
                          <Typography variant="body2">ไม่พบข้อมูลหมวดหมู่</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* --- Dialog (Modal) --- */}
          <Dialog 
            open={open} 
            onClose={() => setOpen(false)} 
            maxWidth="xs" 
            fullWidth
            PaperProps={{
              sx: { borderRadius: '16px', p: 1 }
            }}
          >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Typography variant="h6" fontWeight="bold" color={theme.primary}>
                {editId ? 'แก้ไขข้อมูลหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}
              </Typography>
              <IconButton onClick={() => setOpen(false)} size="small">
                <X size={20} />
              </IconButton>
            </DialogTitle>
            
            <DialogContent>
              <Typography variant="body2" color="text.secondary" mb={3}>
                {editId ? 'แก้ไขรายละเอียดข้อมูล' : 'กรุณากรอกข้อมูลหมวดหมู่สินค้าให้ครบถ้วน'}
              </Typography>
              
              <Stack spacing={2.5}>
                <TextField 
                  label="รหัสหมวดหมู่ (Code)" 
                  fullWidth 
                  size="small"
                  variant="outlined"
                  placeholder="เช่น CAT001"
                  value={form.code}
                  onChange={e => setForm({...form, code: e.target.value})}
                  InputProps={{ sx: { borderRadius: '8px' } }}
                />
                <TextField 
                  label="ชื่อหมวดหมู่ (Name)" 
                  fullWidth 
                  size="small"
                  variant="outlined"
                  placeholder="เช่น เวชภัณฑ์ยา"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  InputProps={{ sx: { borderRadius: '8px' } }}
                />

                <Box sx={{ p: 2, borderRadius: '10px', bgcolor: '#f8fafc', border: '1px dashed #e2e8f0' }}>
                  <FormControlLabel 
                    control={
                      <Switch 
                        checked={form.is_active} 
                        onChange={e => setForm({...form, is_active: e.target.checked})} 
                        color="success"
                      />
                    } 
                    label={<Typography variant="body2" fontWeight="500" color="#475569">เปิดใช้งานสถานะ (Active)</Typography>} 
                  />
                </Box>
              </Stack>

              <Button 
                variant="contained" 
                fullWidth
                size="large"
                onClick={handleSave}
                startIcon={<Save size={18} />}
                sx={{ 
                  mt: 3,
                  bgcolor: theme.primary, 
                  borderRadius: '10px',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#334155', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
                }}
              >
                บันทึกข้อมูล
              </Button>
            </DialogContent>
          </Dialog>

        </Container>
      </Fade>
    </Box>
  );
};

export default CategoryPage;