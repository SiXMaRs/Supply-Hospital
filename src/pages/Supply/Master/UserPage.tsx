import React, { useState, useEffect, useMemo } from 'react';
import { 
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, 
  TextField, Stack, MenuItem, Chip, Box, Card, Fade, Avatar, 
  IconButton, Grid, InputAdornment, FormControlLabel, Switch, CircularProgress, Tooltip
} from '@mui/material';
import { 
  Users, UserPlus, Search, X, Save, Edit3, Shield, Mail, Key, Briefcase, User, Trash2, CheckCircle, AlertCircle,
  Box as BoxIcon // ตั้งชื่อใหม่เพื่อไม่ให้ชนกับ Box ของ MUI
} from 'lucide-react';
import { apiService } from '../../../api';

// --- Theme Constants ---
const theme = {
  primary: '#3f6094ff', 
  secondary: '#64748b',
  bg: '#f8fafc',
  accent: '#0ea5e9',
  success: '#dcfce7',
  successText: '#166534',
  danger: '#ef4444',
  dangerBg: '#fef2f2',
  cardBorder: '#e2e8f0'
};

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State สำหรับแยกแยะว่ากำลัง เพิ่ม หรือ แก้ไข
  const [editId, setEditId] = useState(null);

  // Initial Form State
  const initialForm = { 
    email: '', 
    password: '', 
    name: '', 
    role: 'ward', 
    department_id: '',
    is_active: true
  };
  const [form, setForm] = useState(initialForm);

  // --- Load Data ---
  const loadData = async () => {
    setLoading(true);
    try {
      const [uRes, dRes] = await Promise.all([
        apiService.getUsers(),
        apiService.getDepartments()
      ]);
      setUsers(uRes.data || []);
      setDepartments(dRes.data || []);
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

  const handleOpenEdit = (user) => {
    setEditId(user.id);
    setForm({
      email: user.email,
      password: '', // ไม่ดึงรหัสผ่านเก่ามาแสดง
      name: user.name,
      role: user.role,
      department_id: user.department_id || '',
      is_active: Boolean(user.is_active)
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditId(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('คุณต้องการลบผู้ใช้งานรายนี้ใช่หรือไม่?')) {
      try {
        await apiService.deleteUser(id); // ต้องมี method นี้ใน apiService
        loadData();
      } catch (err) {
        alert("ลบไม่สำเร็จ: " + (err.message || "เกิดข้อผิดพลาด"));
      }
    }
  };

  const handleSave = async () => {
    try {
      // Basic Validation
      if (!form.name || !form.email) {
        alert("กรุณากรอกชื่อและอีเมล");
        return;
      }
      if (!editId && !form.password) {
        alert("กรุณากำหนดรหัสผ่านสำหรับการสร้างบัญชีใหม่");
        return;
      }

      const payload = {
        name: form.name,
        email: form.email,
        role: form.role,
        department_id: form.department_id ? Number(form.department_id) : null,
        is_active: form.is_active
      };

      // จัดการ Password: ส่งไปเฉพาะตอนสร้างใหม่ หรือตอนแก้ไขที่มีการกรอกค่ามาใหม่
      if (form.password) {
        payload.password = form.password;
      }

      if (editId) {
        // Update
        await apiService.updateUser(editId, payload);
      } else {
        // Create
        await apiService.createUser(payload);
      }

      handleClose();
      loadData();
      alert(editId ? "แก้ไขข้อมูลสำเร็จ" : "สร้างผู้ใช้งานสำเร็จ");

    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.response?.data?.detail || "เกิดข้อผิดพลาดในการบันทึก";
      alert(`บันทึกไม่สำเร็จ: ${errorMsg}`);
    }
  };

  // --- Filter Logic ---
  const filteredUsers = useMemo(() => {
    return users.filter((user) => 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // --- Helper: Role Config ---
  const getRoleConfig = (role) => {
    switch(role) {
        case 'admin': return { label: 'Admin', color: '#7c3aed', bg: '#f3e8ff', icon: <Shield size={14} /> };
        case 'supply': return { label: 'Supply Staff', color: '#ea580c', bg: '#ffedd5', icon: <BoxIcon size={14} /> };
        case 'ward': return { label: 'Ward Staff', color: '#059669', bg: '#d1fae5', icon: <User size={14} /> };
        default: return { label: role, color: '#64748b', bg: '#f1f5f9', icon: <User size={14} /> };
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.bg, pt: 4, pb: 8 }}>
      <Fade in={true}>
        <Container maxWidth="lg">
          
          {/* --- Header --- */}
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
                <Users size={28} strokeWidth={1.5} />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="800" color={theme.primary}>
                  จัดการผู้ใช้งาน (Users)
                </Typography>
                <Typography variant="body2" color={theme.secondary}>
                  บริหารจัดการบัญชีผู้ใช้ สิทธิ์การเข้าถึง และสังกัด
                </Typography>
              </Box>
            </Box>

            <Button 
              variant="contained" 
              startIcon={<UserPlus size={20} />}
              onClick={handleOpenCreate}
              sx={{ 
                bgcolor: theme.primary,
                borderRadius: '10px',
                px: 3, py: 1.2,
                textTransform: 'none', fontWeight: '600',
                boxShadow: '0 4px 6px rgba(30, 41, 59, 0.2)',
                '&:hover': { bgcolor: '#334155', transform: 'translateY(-1px)' },
                transition: 'all 0.2s'
              }}
            >
              เพิ่มผู้ใช้งาน
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
             {/* Search Bar */}
             <Box sx={{ p: 3, borderBottom: `1px solid ${theme.cardBorder}`, bgcolor: '#fff' }}>
               <TextField
                placeholder="ค้นหาชื่อ หรือ อีเมล..."
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
                    <TableCell sx={{ fontWeight: '600', color: theme.secondary }}>ชื่อ-นามสกุล</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: theme.secondary }}>บัญชีผู้ใช้</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: theme.secondary }}>สิทธิ์</TableCell>
                    <TableCell sx={{ fontWeight: '600', color: theme.secondary }}>แผนก</TableCell>
                    <TableCell align="center" sx={{ fontWeight: '600', color: theme.secondary }}>สถานะ</TableCell>
                    <TableCell align="right" sx={{ fontWeight: '600', color: theme.secondary }}>จัดการ</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                        <CircularProgress size={30} sx={{ color: theme.secondary }} />
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                      const roleConfig = getRoleConfig(user.role);
                      return (
                        <TableRow key={user.id} hover sx={{ transition: 'background 0.2s' }}>
                          <TableCell>
                             <Stack direction="row" alignItems="center" spacing={1.5}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: roleConfig.color, fontSize: 14, fontWeight: 'bold' }}>
                                    {user.name?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Typography variant="body2" fontWeight="600" color={theme.primary}>{user.name}</Typography>
                             </Stack>
                          </TableCell>
                          <TableCell>
                             <Typography variant="body2" color="#334155">{user.email}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              icon={roleConfig.icon}
                              label={roleConfig.label} 
                              size="small" 
                              sx={{ 
                                bgcolor: roleConfig.bg, 
                                color: roleConfig.color, 
                                fontWeight: '700',
                                borderRadius: '6px',
                                border: '1px solid transparent',
                                '& .MuiChip-icon': { color: 'inherit' }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                             {user.department ? (
                                <Chip label={user.department.name} size="small" variant="outlined" sx={{ borderRadius: '6px', color: theme.secondary, borderColor: theme.cardBorder }} />
                             ) : (
                                <Typography variant="caption" color="#cbd5e1">-</Typography>
                             )}
                          </TableCell>
                          <TableCell align="center">
                              <Chip 
                                icon={user.is_active ? <CheckCircle size={12}/> : <AlertCircle size={12}/>}
                                label={user.is_active ? 'Active' : 'Inactive'} 
                                size="small"
                                sx={{ 
                                  borderRadius: '6px',
                                  bgcolor: user.is_active ? theme.success : '#f1f5f9',
                                  color: user.is_active ? theme.successText : '#94a3b8',
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
                                        onClick={() => handleOpenEdit(user)}
                                        sx={{ color: theme.secondary, '&:hover': { color: theme.accent, bgcolor: '#f0f9ff' } }}
                                    >
                                       <Edit3 size={16} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="ลบ">
                                    <IconButton 
                                        size="small" 
                                        onClick={() => handleDelete(user.id)}
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
                                <Users size={48} strokeWidth={1.5} />
                                <Typography variant="body2">ไม่พบรายชื่อผู้ใช้งาน</Typography>
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
            onClose={handleClose} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{ sx: { borderRadius: '16px', p: 1 } }}
          >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Typography variant="h6" fontWeight="bold" color={theme.primary}>
                {editId ? 'แก้ไขข้อมูลผู้ใช้' : 'สร้างบัญชีผู้ใช้ใหม่'}
              </Typography>
              <IconButton onClick={handleClose} size="small">
                  <X size={20} />
              </IconButton>
            </DialogTitle>

            <DialogContent>
              <Stack spacing={2.5} mt={1}>
                
                <Typography variant="caption" color={theme.secondary} fontWeight="bold">ข้อมูลบัญชี (Account)</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label="อีเมล (Email / Username)" 
                            fullWidth size="small"
                            required
                            disabled={!!editId} // ห้ามแก้ email หากเป็น edit mode (เอาออกได้ถ้าต้องการให้แก้)
                            placeholder="user@example.com"
                            value={form.email} 
                            onChange={e => setForm({...form, email: e.target.value})} 
                            InputProps={{ 
                                startAdornment: <InputAdornment position="start"><Mail size={16} color="#94a3b8"/></InputAdornment>,
                                sx: { borderRadius: '8px' } 
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label={editId ? "รหัสผ่านใหม่ (ว่างไว้ถ้าไม่เปลี่ยน)" : "รหัสผ่าน (Password)"}
                            type="password" 
                            fullWidth size="small"
                            required={!editId} // จำเป็นเฉพาะตอนสร้างใหม่
                            placeholder="******"
                            value={form.password} 
                            onChange={e => setForm({...form, password: e.target.value})} 
                            InputProps={{ 
                                startAdornment: <InputAdornment position="start"><Key size={16} color="#94a3b8"/></InputAdornment>,
                                sx: { borderRadius: '8px' } 
                            }}
                        />
                    </Grid>
                </Grid>

                <Box my={1} borderBottom={`1px dashed ${theme.cardBorder}`} />

                <Typography variant="caption" color={theme.secondary} fontWeight="bold">ข้อมูลส่วนตัว (Profile & Role)</Typography>
                <TextField 
                    label="ชื่อ-นามสกุล (Full Name)" 
                    fullWidth size="small"
                    required
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})} 
                    InputProps={{ sx: { borderRadius: '8px' } }}
                />

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            select 
                            label="สิทธิ์การใช้งาน (Role)" 
                            fullWidth size="small"
                            value={form.role} 
                            onChange={e => setForm({...form, role: e.target.value})}
                            InputProps={{ 
                                startAdornment: <InputAdornment position="start"><Shield size={16} color="#94a3b8"/></InputAdornment>,
                                sx: { borderRadius: '8px' } 
                            }}
                        >
                            <MenuItem value="admin">Admin (ผู้ดูแลระบบ)</MenuItem>
                            <MenuItem value="supply">Supply (เจ้าหน้าที่ห้องผ้า)</MenuItem>
                            <MenuItem value="ward">Ward (เจ้าหน้าที่วอร์ด)</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            select 
                            label="แผนกสังกัด (Department)" 
                            fullWidth size="small"
                            value={form.department_id} 
                            onChange={e => setForm({...form, department_id: e.target.value})}
                            InputProps={{ 
                                startAdornment: <InputAdornment position="start"><Briefcase size={16} color="#94a3b8"/></InputAdornment>,
                                sx: { borderRadius: '8px' } 
                            }}
                        >
                            <MenuItem value="">-- ไม่ระบุ --</MenuItem>
                            {departments.map((d) => (
                            <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>

                <FormControlLabel 
                    control={<Switch checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />} 
                    label={<Typography variant="body2" color="#334155">เปิดใช้งานบัญชี (Active)</Typography>} 
                />

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
                  {editId ? 'บันทึกการแก้ไข' : 'ยืนยันการสร้าง'}
                </Button>
              </Stack>
            </DialogContent>
          </Dialog>
        </Container>
      </Fade>
    </Box>
  );
};

export default UserPage;