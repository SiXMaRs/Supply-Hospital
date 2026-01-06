import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, 
  TextField, Stack, MenuItem, FormControlLabel, Switch, Box, Card, 
  Fade, Chip, IconButton, InputAdornment, Avatar, CircularProgress, Tooltip,
  Grid // <--- เพิ่ม Grid เข้ามาตรงนี้ครับ
} from '@mui/material';
import { 
  MapPin, Plus, Search, X, Save, Edit3, Building, 
  Layers, Trash2, AlertCircle, Warehouse
} from 'lucide-react'; 
import { apiService } from '../../../api'; 

// --- Theme Constants ---
const theme = {
  primary: '#3f6094ff', 
  secondary: '#64748b',
  bg: '#f8fafc',
  cardBorder: '#e2e8f0',
  danger: '#ef4444',
  dangerBg: '#fee2e2'
};

const LocationPage = () => {
  // --- State Management ---
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit Mode State
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({ 
    code: '', 
    name: '', 
    type: 'STORE', 
    department_id: '', 
    parent_id: '', 
    is_active: true 
  });

  // --- API Functions ---
  const loadData = async () => {
    setLoading(true);
    try {
      const [lRes, dRes] = await Promise.all([
        apiService.getLocations(),
        apiService.getDepartments()
      ]);
      setLocations(lRes.data);
      setDepartments(dRes.data);
    } catch (err) { 
      console.error("โหลดข้อมูลล้มเหลว", err); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // --- Handlers ---
  const handleOpenAdd = () => {
    setIsEditMode(false);
    setEditId(null);
    setForm({ code: '', name: '', type: 'STORE', department_id: '', parent_id: '', is_active: true });
    setOpen(true);
  };

  const handleOpenEdit = (loc: any) => {
    setIsEditMode(true);
    setEditId(loc.id);
    setForm({
      code: loc.code,
      name: loc.name,
      type: loc.type,
      department_id: loc.department_id || '', 
      parent_id: loc.parent_id || '',       
      is_active: loc.is_active
    });
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบจุดเก็บนี้?')) return;
    try {
      await apiService.deleteLocation(id); 
      alert("ลบข้อมูลสำเร็จ");
      loadData();
    } catch (err: any) {
      alert(`ลบไม่สำเร็จ: ${err.response?.data?.message || 'เกิดข้อผิดพลาด'}`);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        code: form.code,
        name: form.name,
        type: form.type,
        department_id: form.department_id ? Number(form.department_id) : null,
        parent_id: form.parent_id ? Number(form.parent_id) : null,
        is_active: form.is_active
      };

      if (isEditMode && editId) {
        // กรณีแก้ไข (Update)
        await apiService.updateLocation(editId, payload);
        alert("แก้ไขข้อมูลสำเร็จ!");
      } else {
        // กรณีสร้างใหม่ (Create)
        await apiService.createLocation(payload);
        alert("สร้างจุดเก็บสำเร็จ!");
      }

      setOpen(false);
      loadData();
    } catch (err: any) {
      alert(`${isEditMode ? 'แก้ไข' : 'สร้าง'}ไม่สำเร็จ: ${err.response?.data?.message || 'ข้อมูลผิดรูปแบบ'}`);
    }
  };

  // Filter Logic
  const filteredLocations = locations.filter((loc:any) => 
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    loc.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function for Type Color
  const getTypeColor = (type: string) => {
    switch (type) {
        case 'STORE': return { bg: '#e0f2fe', color: '#0284c7', label: 'คลัง (Store)' };
        case 'WARD': return { bg: '#dcfce7', color: '#166534', label: 'วอร์ด (Ward)' };
        case 'SHELF': return { bg: '#ffedd5', color: '#c2410c', label: 'ชั้นวาง (Shelf)' };
        default: return { bg: '#f1f5f9', color: '#64748b', label: 'พื้นที่ (Area)' };
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.bg, pt: 4, pb: 8 }}>
      <Fade in={true}>
        <Container maxWidth="lg">
          
          {/* Header */}
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
                  width: 56, height: 56,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  border: `1px solid ${theme.cardBorder}`
                }}
              >
                <MapPin size={28} strokeWidth={1.5} />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="800" color={theme.primary}>
                  จัดการจุดเก็บ (Locations)
                </Typography>
                <Typography variant="body2" color={theme.secondary}>
                  กำหนดตำแหน่ง คลังสินค้า, วอร์ด, และชั้นวางของ
                </Typography>
              </Box>
            </Box>

            <Button 
              variant="contained" 
              startIcon={<Plus size={20} />}
              onClick={handleOpenAdd}
              sx={{ 
                bgcolor: theme.primary,
                borderRadius: '10px',
                px: 3, py: 1.2,
                textTransform: 'none', fontWeight: '600',
                boxShadow: '0 4px 6px rgba(30, 41, 59, 0.2)',
                '&:hover': { bgcolor: '#334155' }
              }}
            >
              เพิ่มจุดเก็บ
            </Button>
          </Stack>

          {/* Content Card */}
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: '16px', 
              border: `1px solid ${theme.cardBorder}`, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              overflow: 'hidden'
            }}
          >
            {/* Search Bar */}
            <Box sx={{ p: 3, borderBottom: `1px solid ${theme.cardBorder}`, bgcolor: '#fff' }}>
               <TextField
                placeholder="ค้นหารหัส หรือ ชื่อจุดเก็บ..."
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

            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: '600', color: theme.secondary }}>รหัส</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: theme.secondary }}>ชื่อตำแหน่ง</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: theme.secondary }}>ประเภท</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: theme.secondary }}>รายละเอียด</TableCell>
                    <TableCell align="center" sx={{ fontWeight: '600', color: theme.secondary }}>สถานะ</TableCell>
                    <TableCell align="right" sx={{ fontWeight: '600', color: theme.secondary }}>จัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <CircularProgress size={30} sx={{ color: theme.secondary }} />
                        <Typography variant="body2" color={theme.secondary} mt={1}>กำลังโหลดข้อมูล...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredLocations.length > 0 ? (
                    filteredLocations.map((loc: any) => {
                      const typeStyle = getTypeColor(loc.type);
                      return (
                        <TableRow key={loc.id} hover sx={{ transition: 'background 0.2s' }}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold" color={theme.primary}>
                              {loc.code}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="#334155">{loc.name}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={typeStyle.label} 
                              size="small"
                              sx={{ 
                                bgcolor: typeStyle.bg, 
                                color: typeStyle.color, 
                                fontWeight: '600', 
                                borderRadius: '6px',
                                fontSize: '0.75rem'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box display="flex" flexDirection="column" gap={0.5}>
                                {loc.department && (
                                    <Box display="flex" alignItems="center" gap={0.5} color={theme.secondary}>
                                        <Building size={12} />
                                        <Typography variant="caption">{loc.department.name}</Typography>
                                    </Box>
                                )}
                                {loc.parent && (
                                    <Box display="flex" alignItems="center" gap={0.5} color={theme.secondary}>
                                        <Layers size={12} />
                                        <Typography variant="caption">ใน: {loc.parent.name}</Typography>
                                    </Box>
                                )}
                                {!loc.department && !loc.parent && <Typography variant="caption" color="#cbd5e1">-</Typography>}
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                             <Chip 
                                label={loc.is_active ? 'Active' : 'Inactive'} 
                                size="small"
                                sx={{ 
                                  borderRadius: '6px',
                                  bgcolor: loc.is_active ? '#dcfce7' : '#f1f5f9',
                                  color: loc.is_active ? '#166534' : '#94a3b8',
                                  fontWeight: '600',
                                  height: 24, fontSize: '0.75rem'
                                }}
                              />
                          </TableCell>
                          <TableCell align="right">
                             <Stack direction="row" justifyContent="flex-end" spacing={1}>
                                <Tooltip title="แก้ไข">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleOpenEdit(loc)}
                                    sx={{ color: theme.secondary, '&:hover': { color: '#0ea5e9', bgcolor: '#f0f9ff' } }}
                                  >
                                    <Edit3 size={16} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="ลบ">
                                  <IconButton 
                                    size="small" 
                                    onClick={() => handleDelete(loc.id)}
                                    sx={{ color: theme.secondary, '&:hover': { color: theme.danger, bgcolor: theme.dangerBg } }}
                                  >
                                    <Trash2 size={16} />
                                  </IconButton>
                                </Tooltip>
                             </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                             <Box display="flex" flexDirection="column" alignItems="center" gap={1} color="#cbd5e1">
                                <Warehouse size={48} strokeWidth={1.5} />
                                <Typography variant="body2">ไม่พบข้อมูลตำแหน่ง</Typography>
                             </Box>
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Dialog Form */}
          <Dialog 
            open={open} 
            onClose={() => setOpen(false)} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
          >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Typography variant="h6" fontWeight="bold" color={theme.primary}>
                {isEditMode ? 'แก้ไขจุดเก็บ' : 'เพิ่มจุดเก็บใหม่'}
              </Typography>
              <IconButton onClick={() => setOpen(false)} size="small">
                  <X size={20} />
              </IconButton>
            </DialogTitle>

            <DialogContent>
              <Stack spacing={2.5} mt={1}>
                {isEditMode && (
                   <Box display="flex" alignItems="center" gap={1} p={1.5} bgcolor="#eff6ff" borderRadius={2}>
                      <AlertCircle size={18} color="#2563eb"/>
                      <Typography variant="caption" color="#1e40af">
                        คุณกำลังแก้ไขรหัส: <b>{form.code}</b>
                      </Typography>
                   </Box>
                )}

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField 
                            label="รหัส (Code)" 
                            placeholder="A01"
                            fullWidth size="small"
                            required
                            disabled={isEditMode}
                            value={form.code} 
                            onChange={e => setForm({...form, code: e.target.value})} 
                            InputProps={{ sx: { borderRadius: '8px' } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                        <TextField 
                            label="ชื่อตำแหน่ง (Name)" 
                            placeholder="ตู้เก็บของชั้น 1"
                            fullWidth size="small"
                            required
                            value={form.name} 
                            onChange={e => setForm({...form, name: e.target.value})} 
                            InputProps={{ sx: { borderRadius: '8px' } }}
                        />
                    </Grid>
                </Grid>

                <TextField 
                  select 
                  label="ประเภทตำแหน่ง (Type)" 
                  fullWidth size="small"
                  value={form.type} 
                  onChange={e => setForm({...form, type: e.target.value})}
                  InputProps={{ sx: { borderRadius: '8px' } }}
                >
                  <MenuItem value="STORE">คลังสินค้า (Store)</MenuItem>
                  <MenuItem value="WARD">วอร์ด/ตึก (Ward)</MenuItem>
                  <MenuItem value="SHELF">ชั้นวาง (Shelf)</MenuItem>
                  <MenuItem value="AREA">พื้นที่ทั่วไป (Area)</MenuItem>
                </TextField>

                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: '10px', border: `1px dashed ${theme.cardBorder}` }}>
                    <Typography variant="caption" color={theme.secondary} fontWeight="600" mb={1} display="block">
                        ความสัมพันธ์ (Relations)
                    </Typography>
                    <Stack spacing={2}>
                        <TextField 
                            select 
                            label="แผนกที่เกี่ยวข้อง (Department)" 
                            fullWidth size="small"
                            value={form.department_id} 
                            onChange={e => setForm({...form, department_id: e.target.value})}
                            InputProps={{ sx: { borderRadius: '8px', bgcolor: '#fff' } }}
                        >
                            <MenuItem value="">-- ไม่ระบุ --</MenuItem>
                            {departments.map((d: any) => (
                            <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                            ))}
                        </TextField>

                        <TextField 
                            select 
                            label="จุดเก็บหลัก (Parent Location)" 
                            fullWidth size="small"
                            value={form.parent_id} 
                            onChange={e => setForm({...form, parent_id: e.target.value})}
                            helperText="เลือกหากจุดนี้เป็นจุดย่อยของจุดอื่น"
                            InputProps={{ sx: { borderRadius: '8px', bgcolor: '#fff' } }}
                        >
                            <MenuItem value="">-- เป็นจุดเก็บหลัก (Main) --</MenuItem>
                            {locations
                                .filter((l: any) => l.id !== editId && !l.parent_id) 
                                .map((l: any) => (
                                <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </Box>

                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1 }}>
                      <FormControlLabel 
                        control={<Switch size="small" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />} 
                        label={<Typography variant="body2">เปิดใช้งาน (Active)</Typography>} 
                    />
                </Stack>

                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={handleSave} 
                  startIcon={<Save size={18} />}
                  fullWidth
                  sx={{ 
                    mt: 1, py: 1.2, 
                    borderRadius: '10px', 
                    bgcolor: theme.primary,
                    fontWeight: 'bold',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#334155' }
                  }}
                >
                  {isEditMode ? 'บันทึกการแก้ไข' : 'สร้างข้อมูล'}
                </Button>
              </Stack>
            </DialogContent>
          </Dialog>
        </Container>
      </Fade>
    </Box>
  );
};

export default LocationPage; 