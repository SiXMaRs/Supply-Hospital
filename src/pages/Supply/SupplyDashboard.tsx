import React from 'react';
import {
   Container,
   Grid,
   Paper,
   Typography,
   Box,
   Stack,
   Avatar,
   LinearProgress,
   Button,
   IconButton,
   alpha,
   Chip,
   Divider,
} from '@mui/material';
import {
   Truck,
   Waves,
   AlertCircle,
   ShoppingCart,
   TrendingUp,
   Clock,
   MoreHorizontal,
   Package,
   ChevronRight,
   Calendar,
   ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Mock Data ---
const stats = [
  { title: 'รออนุมัติเบิก', value: '12', unit: 'ใบ', icon: <ShoppingCart size={22} />, color: '#f59e0b', bg: '#fff7ed', trend: '+4 Requests', trendUp: true },
  { title: 'กำลังซัก/อบ', value: '5', unit: 'Jobs', icon: <Waves size={22} />, color: '#3b82f6', bg: '#eff6ff', trend: '2 Machines Free', trendUp: false },
  { title: 'รับผ้าวันนี้', value: '450', unit: 'กก.', icon: <Truck size={22} />, color: '#10b981', bg: '#ecfdf5', trend: '+12% vs yesterday', trendUp: true },
  { title: 'สต็อกวิกฤต', value: '3', unit: 'รายการ', icon: <AlertCircle size={22} />, color: '#ef4444', bg: '#fef2f2', trend: 'Action Needed', trendUp: false, isAlert: true },
];

const lowStockItems = [
  { name: 'ผ้าเช็ดตัวผู้ป่วย (L)', current: 15, min: 50, percent: 30 },
  { name: 'ชุดกาวน์ผ่าตัด (XL)', current: 8, min: 40, percent: 20 },
  { name: 'ผ้าห่มนวม', current: 12, min: 30, percent: 40 },
];

const recentActivities = [
  { id: 1, title: 'Ward 4 ขอเบิกวัสดุ', desc: 'รายการ: ผ้าปูที่นอน (50 ผืน)', time: '10 นาทีที่แล้ว', type: 'req' },
  { id: 2, title: 'รับผ้าเปื้อน (Intake)', desc: 'จาก: OR (ห้องผ่าตัด) 120 กก.', time: '35 นาทีที่แล้ว', type: 'in' },
  { id: 3, title: 'จบงานซัก #WSH-17675', desc: 'เครื่องซักเบอร์ 1 (ซักผ้าติดเชื้อ)', time: '1 ชม. ที่แล้ว', type: 'wash' },
  { id: 4, title: 'ตัดจำหน่าย (Loss)', desc: 'ปลอกหมอนชำรุด 2 ชิ้น', time: '2 ชม. ที่แล้ว', type: 'loss' },
];

const SupplyDashboard: React.FC = () => {
   const navigate = useNavigate();

   const cardShadow = '0px 6px 18px rgba(21, 28, 38, 0.08)';
   const hoverShadow = '0px 10px 30px rgba(21, 28, 38, 0.12)';

   const StatCard: React.FC<any> = ({ stat }) => (
      <Paper
         sx={{
            p: 3,
            borderRadius: 2.5,
            boxShadow: cardShadow,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'transform 0.22s, box-shadow 0.22s',
            '&:hover': { transform: 'translateY(-6px)', boxShadow: hoverShadow },
         }}
      >
         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{
               width: 56,
               height: 56,
               borderRadius: 2,
               bgcolor: stat.bg,
               color: stat.color,
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
            }}>
               {stat.icon}
            </Box>
            {stat.trendUp ? (
               <Chip label={stat.trend} size="small" sx={{ fontWeight: 700, borderRadius: 1, bgcolor: alpha('#10b981', 0.12), color: '#10b981', px: 1 }} />
            ) : (
               stat.isAlert && <Chip label="Alert" color="error" size="small" sx={{ fontWeight: 700, borderRadius: 1 }} />
            )}
         </Box>

         <Box>
            <Typography variant="h4" fontWeight={800} color="#212B36" sx={{ lineHeight: 1, mb: 0.6 }}>
               {stat.value}
            </Typography>
            <Typography variant="body2" color="#637381" fontWeight={600} sx={{ mb: 2 }}>
               {stat.title} <Typography component="span" variant="caption" color="#919EAB">({stat.unit})</Typography>
            </Typography>
         </Box>

         <Divider sx={{ borderStyle: 'dashed', mb: 1 }} />

         <Typography variant="caption" color={stat.isAlert ? 'error.main' : '#919EAB'} fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {stat.isAlert ? <AlertCircle size={14} /> : <Clock size={14} />}
            {stat.trend}
         </Typography>
      </Paper>
   );

    const InventoryItem: React.FC<any> = ({ item }) => (
      <Box sx={{ p: 2, borderRadius: 2, '&:hover': { bgcolor: alpha('#919EAB', 0.04) }, transition: 'all 0.15s' }}>
         <Grid container alignItems="center" spacing={2}>
            <Grid item>
               <Box sx={{ width: 48, height: 48, borderRadius: 1.5, bgcolor: '#F7F9FA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#637381' }}>
                  <Package size={22} />
               </Box>
            </Grid>
            <Grid item xs>
               <Typography variant="subtitle2" fontWeight={700} color="#212B36">{item.name}</Typography>
               <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                  <Chip label={`Min: ${item.min}`} size="small" sx={{ height: 24, fontSize: '0.72rem', bgcolor: '#F4F6F8' }} />
                  <Chip label={`Current: ${item.current}`} size="small" sx={{ height: 24, fontSize: '0.72rem', fontWeight: 700, bgcolor: alpha('#ef4444', 0.08), color: '#ef4444' }} />
               </Stack>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
               <Stack alignItems="flex-end">
                  <Typography variant="caption" fontWeight={700} color={item.percent < 30 ? 'error.main' : 'warning.main'} sx={{ mb: 0.5 }}>Stock Level: {item.percent}%</Typography>
                  <LinearProgress variant="determinate" value={item.percent} sx={{ width: '100%', height: 8, borderRadius: 3, bgcolor: alpha('#919EAB', 0.12), '& .MuiLinearProgress-bar': { bgcolor: item.percent < 30 ? '#ef4444' : '#f59e0b' } }} />
               </Stack>
            </Grid>
         </Grid>
      </Box>
   );

   const ActivityItem: React.FC<any> = ({ act, last }) => (
      <Box sx={{ position: 'relative', pb: last ? 0 : 4 }}>
         {!last && <Box sx={{ position: 'absolute', left: 22, top: 44, bottom: -4, width: 2, bgcolor: alpha('#919EAB', 0.12), zIndex: 0 }} />}
         <Stack direction="row" spacing={2.5} alignItems="flex-start">
            <Box sx={{ position: 'relative', zIndex: 1 }}>
               <Avatar sx={{ width: 44, height: 44, bgcolor: act.type === 'req' ? '#fff7ed' : act.type === 'in' ? '#eff6ff' : act.type === 'wash' ? '#ecfdf5' : '#fef2f2', color: act.type === 'req' ? '#f59e0b' : act.type === 'in' ? '#3b82f6' : act.type === 'wash' ? '#10b981' : '#ef4444', boxShadow: '0 6px 16px rgba(2,6,23,0.06)', border: '1px solid', borderColor: alpha('#919EAB', 0.08) }}>
                  {act.type === 'req' ? <ShoppingCart size={18} /> : act.type === 'in' ? <Truck size={18} /> : act.type === 'wash' ? <Waves size={18} /> : <AlertCircle size={18} />}
               </Avatar>
            </Box>
            <Box sx={{ pt: 0.5, width: '100%' }}>
               <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Typography variant="subtitle2" fontWeight={700} color="#212B36">{act.title}</Typography>
                  <Typography variant="caption" color="#919EAB" fontWeight={500}>{act.time}</Typography>
               </Stack>
               <Typography variant="body2" color="#637381" sx={{ mb: 1, fontSize: '0.88rem' }}>{act.desc}</Typography>
            </Box>
         </Stack>
      </Box>
   );

   return (
      <Box sx={{ bgcolor: '#F6F8FA', minHeight: '100vh', pb: 10, pt: 6 }}>
         <Container maxWidth="lg">
            {/* Header */}
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'start', sm: 'center' }} mb={4} spacing={2}>
               <Box>
                  <Typography variant="h4" fontWeight={800} color="#0F172A">Supply Dashboard</Typography>
                  <Typography variant="body2" color="#6B7280" sx={{ mt: 0.5 }}>ภาพรวมการดำเนินงานจ่ายกลาง (Central Supply Overview)</Typography>
               </Box>
               <Stack direction="row" spacing={1} alignItems="center">
                  <Button variant="outlined" startIcon={<Calendar size={18} />} sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, color: '#475569', borderColor: alpha('#94A3B8', 0.24), height: 44 }}>Today</Button>
                  <Button variant="contained" color="primary" onClick={() => navigate('/supply/inventory')} sx={{ borderRadius: 2, textTransform: 'none', height: 44 }}>New Intake</Button>
               </Stack>
            </Stack>

            {/* Compact stat bar */}
            <Box sx={{ overflowX: 'auto', mb: 4 }}>
               <Stack direction="row" spacing={2} sx={{ pb: 1 }}>
                  {stats.map((s, idx) => (
                     <Paper key={idx} sx={{ minWidth: 220, p: 2, borderRadius: 2, boxShadow: cardShadow, display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Box sx={{ width: 56, height: 56, borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: s.bg, color: s.color }}>{s.icon}</Box>
                        <Box sx={{ flex: 1 }}>
                           <Typography variant="h5" fontWeight={800} color="#0F172A">{s.value}</Typography>
                           <Typography variant="caption" color="#6B7280">{s.title} • <Typography component="span" variant="caption" color="#94A3B8">{s.unit}</Typography></Typography>
                        </Box>
                        <Box>
                           {s.trendUp ? <Chip label={s.trend} size="small" sx={{ bgcolor: alpha('#10b981', 0.08), color: '#10b981', fontWeight: 700 }} /> : s.isAlert && <Chip label="Alert" color="error" size="small" />}
                        </Box>
                     </Paper>
                  ))}
               </Stack>
            </Box>

            {/* Main area */}
            <Grid container spacing={3}>
               <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2.5, borderRadius: 2.5, boxShadow: cardShadow }}>
                     <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                           <Avatar sx={{ bgcolor: alpha('#ef4444', 0.08), color: '#ef4444' }}><AlertCircle size={18} /></Avatar>
                           <Typography variant="h6" fontWeight={700}>Inventory Alerts</Typography>
                        </Stack>
                        <Button size="small" endIcon={<ChevronRight size={16} />} sx={{ textTransform: 'none' }} onClick={() => navigate('/supply/inventory')}>View all</Button>
                     </Stack>

                     <Stack spacing={1}>
                        {lowStockItems.map((it, i) => (
                           <Paper key={i} sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Stack direction="row" spacing={2} alignItems="center">
                                 <Box sx={{ width: 48, height: 48, borderRadius: 1.5, bgcolor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package size={20} /></Box>
                                 <Box>
                                    <Typography variant="subtitle1" fontWeight={700}>{it.name}</Typography>
                                    <Typography variant="caption" color="#6B7280">Min: {it.min} • Current: {it.current}</Typography>
                                 </Box>
                              </Stack>
                              <Box sx={{ width: 220 }}>
                                 <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                                    <Typography variant="caption" color={it.percent < 30 ? 'error.main' : 'warning.main'} fontWeight={700}>Stock: {it.percent}%</Typography>
                                    <LinearProgress variant="determinate" value={it.percent} sx={{ width: 140, height: 8, borderRadius: 3, bgcolor: alpha('#94A3B8', 0.12), '& .MuiLinearProgress-bar': { bgcolor: it.percent < 30 ? '#ef4444' : '#f59e0b' } }} />
                                 </Stack>
                              </Box>
                           </Paper>
                        ))}
                     </Stack>

                     <Divider sx={{ my: 2 }} />

                     <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Quick Actions</Typography>
                     <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                           <Paper onClick={() => navigate('/supply/wash-jobs')} sx={{ p: 2, borderRadius: 2, display: 'flex', gap: 2, alignItems: 'center', cursor: 'pointer', '&:hover': { boxShadow: hoverShadow } }}>
                              <Box sx={{ width: 52, height: 52, borderRadius: 1.5, bgcolor: '#0F172A', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Waves size={20} /></Box>
                              <Box>
                                 <Typography fontWeight={800}>Create Wash Job</Typography>
                                 <Typography variant="caption" color="#6B7280">เปิดใบงานซัก/อบ/ฆ่าเชื้อใหม่</Typography>
                              </Box>
                           </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                           <Paper onClick={() => navigate('/ward/request')} sx={{ p: 2, borderRadius: 2, display: 'flex', gap: 2, alignItems: 'center', cursor: 'pointer', '&:hover': { boxShadow: hoverShadow } }}>
                              <Box sx={{ width: 52, height: 52, borderRadius: 1.5, bgcolor: '#EFF6FF', color: '#0B61FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ShoppingCart size={20} color="#0B61FF" /></Box>
                              <Box>
                                 <Typography fontWeight={800}>Check Requests</Typography>
                                 <Typography variant="caption" color="#6B7280">อนุมัติใบเบิกจาก Ward</Typography>
                              </Box>
                           </Paper>
                        </Grid>
                     </Grid>
                  </Paper>
               </Grid>

               <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2.5, borderRadius: 2.5, boxShadow: cardShadow, height: '100%', display: 'flex', flexDirection: 'column' }}>
                     <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2, flexShrink: 0 }}>
                        <Typography variant="h6" fontWeight={700}>Recent Activity</Typography>
                        <IconButton size="small"><MoreHorizontal size={18} color="#94A3B8" /></IconButton>
                     </Stack>
                     <Box sx={{ overflowY: 'auto', flex: 1, pr: 1, '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-track': { bgcolor: 'transparent' }, '&::-webkit-scrollbar-thumb': { bgcolor: alpha('#94A3B8', 0.2), borderRadius: 1, '&:hover': { bgcolor: alpha('#94A3B8', 0.3) } } }}>
                        <Stack spacing={1.5}>
                           {recentActivities.map((a) => (
                              <Paper key={a.id} sx={{ p: 1.5, borderRadius: 2, display: 'flex', gap: 1.5, alignItems: 'flex-start', bgcolor: '#F8FAFC' }}>
                                 <Avatar sx={{ width: 40, height: 40, bgcolor: a.type === 'req' ? '#FFF7ED' : a.type === 'in' ? '#EFF6FF' : a.type === 'wash' ? '#ECFDF5' : '#FEF2F2', color: a.type === 'req' ? '#F59E0B' : a.type === 'in' ? '#3B82F6' : a.type === 'wash' ? '#10B981' : '#EF4444', flexShrink: 0 }}>{a.type === 'req' ? <ShoppingCart size={16} /> : a.type === 'in' ? <Truck size={16} /> : a.type === 'wash' ? <Waves size={16} /> : <AlertCircle size={16} />}</Avatar>
                                 <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                                       <Typography variant="subtitle2" fontWeight={700} sx={{ flex: 1 }}>{a.title}</Typography>
                                       <Typography variant="caption" color="#94A3B8" sx={{ whiteSpace: 'nowrap' }}>{a.time}</Typography>
                                    </Stack>
                                    <Typography variant="caption" color="#6B7280" sx={{ display: 'block', mt: 0.5 }}>{a.desc}</Typography>
                                 </Box>
                              </Paper>
                           ))}
                        </Stack>
                     </Box>
                  </Paper>
               </Grid>
            </Grid>
         </Container>
      </Box>
   );
};

export default SupplyDashboard;