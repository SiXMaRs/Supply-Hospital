import React, { useState, useEffect, useMemo } from 'react';
import { 
  Container, Typography, Table, TableBody, TableCell, 
  TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, 
  TextField, Stack, Switch, FormControlLabel, Box, Card, 
  Avatar, Chip, IconButton, TableContainer, InputAdornment, Fade,
  CircularProgress, Tooltip
} from '@mui/material';
import { 
  Building2, Plus, Search, X, Save, Edit3, Trash2, MapPin, CheckCircle, AlertCircle
} from 'lucide-react'; 
import { apiService } from '../../../api'; 

// --- Theme Constants (Moved outside to prevent re-creation) ---
const theme = {
  primary: '#3f6094ff',     // Dark Navy
  secondary: '#64748b',  // Slate Grey
  bg: '#f8fafc',         // Very Light Grey
  accent: '#0ea5e9',     // Sky Blue
  success: '#dcfce7',    // Light Green (Bg)
  successText: '#166534',// Dark Green (Text)
  danger: '#ef4444',     // Red
  dangerBg: '#fef2f2'    // Light Red
};

const DepartmentPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit State
  const [editId, setEditId] = useState(null); // null = Create Mode, ID = Edit Mode

  // Form State
  const initialForm = { code: '', name: '', type: 'ward', is_active: true };
  const [form, setForm] = useState(initialForm);

  // --- Load Data ---
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await apiService.getDepartments();
      setData(res.data || []);
    } catch (err) {
      console.error("Load failed", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { loadData(); }, []);

  // --- Filter Logic (useMemo for better performance) ---
  const filteredData = useMemo(() => {
    return data.filter((item) => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

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
      type: item.type,
      is_active: item.is_active
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('คุณต้องการลบข้อมูลนี้ใช่หรือไม่?')) {
        try {
            await apiService.deleteDepartment(id); // สมมติว่ามี API นี้
            loadData();
        } catch (err) {
            alert('ลบไม่สำเร็จ');
        }
    }
  };

  const handleSave = async () => {
    try {
      if (editId) {
        // Update Logic
        await apiService.updateDepartment(editId, form); // ต้องตรวจสอบว่า API รับ id แบบไหน
      } else {
        // Create Logic
        await apiService.createDepartment(form);
      }
      
      setOpen(false);
      loadData();
      alert('บันทึกสำเร็จ');
    } catch (err) { 
      console.error(err);
      alert('บันทึกไม่สำเร็จ: ' + (err.message || 'Error')); 
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
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar 
                variant="rounded" 
                sx={{ 
                  bgcolor: '#fff', 
                  color: theme.primary, 
                  width: 56, 
                  height: 56,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  border: '1px solid #e2e8f0'
                }}
              >
                <Building2 size={28} />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="800" color={theme.primary}>
                  จัดการแผนก (Departments)
                </Typography>
                <Typography variant="body2" color={theme.secondary}>
                  รายชื่อแผนกและหน่วยงานทั้งหมดในระบบ
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
              เพิ่มแผนกใหม่
            </Button>
          </Stack>

          {/* --- Main Content Card --- */}
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: '16px', 
              border: '1px solid #e2e8f0', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              overflow: 'hidden'
            }}
          >
            {/* Search Bar */}
            <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', bgcolor: '#fff' }}>
               <TextField
                placeholder="ค้นหาชื่อแผนก หรือ รหัส..."
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

            {/* Table */}
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: '600', color: '#64748b', py: 2 }}>รหัส (Code)</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: '#64748b' }}>ชื่อแผนก (Name)</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: '#64748b' }}>ประเภท (Type)</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: '#64748b' }} align="center">สถานะ</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: '#64748b' }} align="right">จัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <CircularProgress size={30} sx={{ color: theme.secondary }} />
                      </TableCell>
                    </TableRow>
                  ) : filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <TableRow 
                        key={item.id} 
                        hover
                        sx={{ 
                          '&:last-child td, &:last-child th': { border: 0 },
                          transition: 'background 0.2s'
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight="600" color={theme.primary}>
                            {item.code}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="#334155">
                            {item.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={item.type} 
                            size="small"
                            variant="outlined"
                            sx={{ 
                              borderRadius: '6px', 
                              borderColor: '#e2e8f0',
                              color: '#64748b',
                              textTransform: 'capitalize',
                              height: 24,
                              fontSize: '0.75rem'
                            }} 
                          />
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
                                onClick={() => handleOpenEdit(item)}
                                sx={{ color: '#64748b', '&:hover': { color: theme.accent, bgcolor: '#f0f9ff' } }}
                              >
                                <Edit3 size={16} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="ลบ">
                              <IconButton 
                                size="small" 
                                onClick={() => handleDelete(item.id)}
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
                      <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                          <Box display="flex" flexDirection="column" alignItems="center" gap={1} color="#cbd5e1">
                            <MapPin size={48} strokeWidth={1.5} />
                            <Typography variant="body2">ไม่พบข้อมูลแผนก</Typography>
                          </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* --- Modal / Dialog --- */}
          <Dialog 
            open={open} 
            onClose={() => setOpen(false)}
            maxWidth="xs"
            fullWidth
            PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
          >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Typography variant="h6" fontWeight="bold" color={theme.primary}>
                {editId ? 'แก้ไขข้อมูลแผนก' : 'เพิ่มแผนกใหม่'}
              </Typography>
              <IconButton onClick={() => setOpen(false)} size="small">
                <X size={20} />
              </IconButton>
            </DialogTitle>
            
            <DialogContent>
               <Typography variant="body2" color="text.secondary" mb={3}>
                {editId ? 'แก้ไขรายละเอียดของแผนก' : 'กรอกข้อมูลรายละเอียดแผนกให้ครบถ้วน'}
              </Typography>

              <Stack spacing={2.5}>
                <TextField 
                  label="รหัสแผนก (Code)" 
                  fullWidth 
                  size="small"
                  placeholder="เช่น W01, OPD"
                  value={form.code} 
                  onChange={e => setForm({...form, code: e.target.value})} 
                  InputProps={{ sx: { borderRadius: '8px' } }}
                />
                
                <TextField 
                  label="ชื่อแผนก (Name)" 
                  fullWidth 
                  size="small"
                  placeholder="เช่น แผนกผู้ป่วยในชาย"
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  InputProps={{ sx: { borderRadius: '8px' } }}
                />
                
                <TextField 
                  label="ประเภท (Type)" 
                  fullWidth 
                  size="small"
                  select
                  SelectProps={{ native: true }}
                  value={form.type} 
                  onChange={e => setForm({...form, type: e.target.value})} 
                  InputProps={{ sx: { borderRadius: '8px' } }}
                >
                  <option value="ward">Ward (หอผู้ป่วย)</option>
                  <option value="office">Office (สำนักงาน)</option>
                  <option value="supply">Supply (จ่ายกลาง)</option>
                  <option value="other">Other (อื่นๆ)</option>
                </TextField>
                
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

                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={handleSave}
                  startIcon={<Save size={18} />}
                  sx={{ 
                    mt: 2,
                    borderRadius: '10px', 
                    bgcolor: theme.primary,
                    textTransform: 'none',
                    fontWeight: 'bold',
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

export default DepartmentPage;