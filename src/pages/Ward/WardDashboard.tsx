import React from 'react';
import { 
  Container, Grid, Paper, Typography, Box, 
  Chip, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton, LinearProgress, 
  Stack, Card, CardContent
} from '@mui/material';
import { 
  Clock, Truck, CheckCircle2, AlertCircle, 
  FileText, MoreHorizontal, ArrowRight, Activity, CalendarDays 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Type Definitions ---
type RequestStatus = 'Pending' | 'Delivering' | 'Completed' | 'Rejected';

interface RequestItem {
  id: string;
  items: string;
  count: string;
  status: RequestStatus;
  time: string;
}

const WardDashboard = () => {
  const navigate = useNavigate();
  
  // วันที่ปัจจุบันแบบภาษาไทย
  const today = new Date().toLocaleDateString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // --- Mock Data ---
  const stats = [
    { 
      title: 'รออนุมัติ', 
      count: 3, 
      icon: <Clock size={24} />, 
      color: '#f59e0b', 
      bg: '#fff7ed', 
      desc: 'ใบเบิกที่รอดำเนินการ' 
    },
    { 
      title: 'กำลังจัดส่ง', 
      count: 1, 
      icon: <Truck size={24} />, 
      color: '#3b82f6', 
      bg: '#eff6ff', 
      desc: 'ของกำลังเดินทางมา' 
    },
    { 
      title: 'รับของแล้ววันนี้', 
      count: 12, 
      icon: <CheckCircle2 size={24} />, 
      color: '#10b981', 
      bg: '#ecfdf5', 
      desc: 'รายการที่สำเร็จ' 
    },
  ];

  const recentRequests: RequestItem[] = [
    { id: 'REQ-240105-001', items: 'ผ้าปูที่นอน, ปลอกหมอน', count: '50 ชิ้น', status: 'Pending', time: '10:30 น.' },
    { id: 'REQ-240105-002', items: 'ชุดกาวน์ผ่าตัด (XL)', count: '20 ชุด', status: 'Delivering', time: '09:15 น.' },
    { id: 'REQ-240104-009', items: 'ผ้าเช็ดตัวผู้ป่วย', count: '30 ผืน', status: 'Completed', time: 'เมื่อวาน' },
    { id: 'REQ-240104-005', items: 'ผ้าห่มนวม', count: '10 ผืน', status: 'Rejected', time: 'เมื่อวาน' },
  ];

  // --- Helper Functions ---
  const getStatusStyles = (status: RequestStatus) => {
    switch (status) {
      case 'Pending': 
        return { label: 'รออนุมัติ', color: '#b45309', bgcolor: '#fffbeb', border: '1px solid #fcd34d' };
      case 'Delivering': 
        return { label: 'กำลังส่ง', color: '#1d4ed8', bgcolor: '#eff6ff', border: '1px solid #bfdbfe' };
      case 'Completed': 
        return { label: 'สำเร็จ', color: '#047857', bgcolor: '#ecfdf5', border: '1px solid #6ee7b7' };
      case 'Rejected': 
        return { label: 'ไม่อนุมัติ', color: '#b91c1c', bgcolor: '#fef2f2', border: '1px solid #fecaca' };
      default: 
        return { label: status, color: '#374151', bgcolor: '#f3f4f6', border: '1px solid #e5e7eb' };
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 5, bgcolor: '#f8fafc' }}>
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        
        {/* --- Header Section --- */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', md: 'center' }, 
          gap: 2,
          mb: 4 
        }}>
          <Box>
            <Typography variant="h4" fontWeight="800" sx={{ color: '#0f172a', letterSpacing: '-0.5px' }}>
              Ward Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', mt: 0.5 }}>
              ภาพรวมการเบิกจ่ายประจำวัน | <strong style={{ color: '#334155' }}>Ward 4 (ศัลยกรรมชาย)</strong>
            </Typography>
          </Box>

          {/* ส่วนแสดงวันที่ แทนปุ่มกด */}
          <Paper elevation={0} sx={{ 
            px: 2.5, py: 1, 
            bgcolor: '#fff', 
            border: '1px solid #e2e8f0', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5
          }}>
             <CalendarDays size={20} color="#64748b" />
             <Typography variant="body2" fontWeight="600" color="#334155">
               {today}
             </Typography>
          </Paper>
        </Box>

        {/* --- Stats Cards --- */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                elevation={0}
                sx={{ 
                  borderRadius: '20px', 
                  border: '1px solid #e2e8f0',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.01)' }
                }}
              >
                <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" fontWeight="600" sx={{ color: '#64748b', mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.75rem' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="h3" fontWeight="800" sx={{ color: '#0f172a', lineHeight: 1 }}>
                      {item.count}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1, fontSize: '0.875rem' }}>
                      {item.desc}
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    p: 2, 
                    borderRadius: '16px', 
                    bgcolor: item.bg, 
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {item.icon}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* --- Main Content: Recent Requests --- */}
          <Grid item xs={12} lg={8}>
            <Paper elevation={0} sx={{ borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#fff' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ p: 1, bgcolor: '#f1f5f9', borderRadius: '8px', color: '#64748b' }}>
                    <FileText size={20} />
                  </Box>
                  <Typography variant="h6" fontWeight="700" color="#1e293b">
                    สถานะการเบิกล่าสุด
                  </Typography>
                </Box>
                <Box 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5, 
                        cursor: 'pointer',
                        color: '#64748b',
                        '&:hover': { color: '#0f172a' }
                    }}
                    onClick={() => navigate('/ward/history')} // สมมติว่ามีหน้าประวัติ
                >
                    <Typography variant="body2" fontWeight="600">ดูทั้งหมด</Typography>
                    <ArrowRight size={16} />
                </Box>
              </Box>
              
              <TableContainer sx={{ flexGrow: 1 }}>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead sx={{ bgcolor: '#f8fafc' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: '#475569', py: 2 }}>เลขที่ใบเบิก</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569', py: 2 }}>รายการ</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569', py: 2 }}>จำนวน</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569', py: 2 }}>เวลา</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569', py: 2 }}>สถานะ</TableCell>
                      <TableCell align="right" sx={{ py: 2 }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentRequests.map((row) => {
                       const style = getStatusStyles(row.status);
                       return (
                        <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, transition: 'background-color 0.2s' }}>
                          <TableCell sx={{ fontWeight: 600, color: '#334155' }}>{row.id}</TableCell>
                          <TableCell sx={{ color: '#475569' }}>{row.items}</TableCell>
                          <TableCell sx={{ color: '#475569' }}>{row.count}</TableCell>
                          <TableCell sx={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Clock size={14} /> {row.time}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ 
                                display: 'inline-flex',
                                px: 1.5, py: 0.5, 
                                borderRadius: '99px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                ...style 
                            }}>
                                {style.label}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton size="small" sx={{ color: '#94a3b8', '&:hover': { color: '#334155', bgcolor: '#f1f5f9' } }}>
                                <MoreHorizontal size={18} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                       );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* --- Right Column: Quota & Alerts --- */}
          <Grid item xs={12} lg={4}>
            
            {/* Alert Card - ย้ายมาไว้บนสุดเพื่อให้เห็นชัด */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', bgcolor: '#fef2f2', border: '1px solid #fee2e2', position: 'relative', overflow: 'hidden', mb: 3 }}>
               <Box sx={{ position: 'absolute', top: -10, right: -10, width: 60, height: 60, borderRadius: '50%', bgcolor: '#fee2e2', zIndex: 0 }} />
               <Box sx={{ display: 'flex', gap: 2, position: 'relative', zIndex: 1 }}>
                  <Box sx={{ minWidth: 40, height: 40, borderRadius: '10px', bgcolor: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <AlertCircle color="#dc2626" size={24} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="800" color="#991b1b">
                      ประกาศจากจ่ายกลาง
                    </Typography>
                    <Typography variant="body2" color="#b91c1c" sx={{ mt: 1, lineHeight: 1.6 }}>
                      ผ้าห่มนวม ขาดสต็อกชั่วคราว คาดว่าจะเข้าอีกทีเวลา 14:00 น.
                    </Typography>
                  </Box>
               </Box>
            </Paper>

            {/* Daily Quota Card */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid #e2e8f0' }}>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <Box sx={{ p: 1, bgcolor: '#f0fdf4', borderRadius: '8px', color: '#16a34a' }}>
                    <Activity size={20} />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="700" color="#1e293b">
                        โควต้าประจำวัน
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontSize="0.875rem">
                        (Daily Quota)
                    </Typography>
                  </Box>
               </Box>

               <Stack spacing={3}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" fontWeight={600} color="#334155">ผ้าปูที่นอน</Typography>
                        <Typography variant="body2" fontWeight={700} color="#16a34a">80/100</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={80} sx={{ borderRadius: 2, height: 8, bgcolor: '#dcfce7', '& .MuiLinearProgress-bar': { bgcolor: '#16a34a' } }} />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" fontWeight={600} color="#334155">ปลอกหมอน</Typography>
                        <Typography variant="body2" fontWeight={700} color="#2563eb">45/100</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={45} sx={{ borderRadius: 2, height: 8, bgcolor: '#dbeafe', '& .MuiLinearProgress-bar': { bgcolor: '#2563eb' } }} />
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" fontWeight={600} color="#334155">ชุดผู้ป่วย</Typography>
                        <Typography variant="body2" fontWeight={700} color="#d97706">95/100</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={95} sx={{ borderRadius: 2, height: 8, bgcolor: '#fef3c7', '& .MuiLinearProgress-bar': { bgcolor: '#d97706' } }} />
                  </Box>
               </Stack>
            </Paper>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
};

export default WardDashboard;