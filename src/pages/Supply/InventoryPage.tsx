import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Card, Tabs, Tab, Box, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Chip, TextField, MenuItem,
  InputAdornment, Fade, Avatar, Stack
} from '@mui/material';
import { 
  Package, History, Search, Archive, MapPin, 
  ArrowUpCircle, ArrowDownCircle, AlertCircle, Calendar, RefreshCw
} from 'lucide-react';
import { apiService } from '../../api';

// --- Theme Constants ---
const theme = {
  primary: '#0f172a',    // Slate 900
  secondary: '#64748b',  // Slate 500
  bg: '#f8fafc',         // Slate 50
  cardBorder: '#e2e8f0', // Slate 200
  accent: '#3b82f6',     // Blue 500
  success: '#10b981',    // Emerald 500
  danger: '#ef4444',     // Red 500
  warning: '#f59e0b',    // Amber 500
};

const InventoryPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [availableStock, setAvailableStock] = useState([]);
  const [stockMoves, setStockMoves] = useState([]);
  const [items, setItems] = useState([]);
  const [filterItemId, setFilterItemId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    loadData();
  }, [tabValue, filterItemId]);

  const loadItems = async () => {
    try {
      const res = await apiService.getItems();
      setItems(res.data);
    } catch (err) { console.error("Load items failed"); }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      if (tabValue === 0) {
        // ดึง Batch สะอาดคงเหลือ
        const res = await apiService.getAvailableInventory(filterItemId ? Number(filterItemId) : undefined);
        setAvailableStock(res.data);
      } else {
        // ดึงประวัติการเคลื่อนไหว 100 รายการล่าสุด
        const res = await apiService.getStockMoves();
        setStockMoves(res.data);
      }
    } catch (err) { 
      console.error("Load inventory data failed"); 
    } finally {
      setLoading(false);
    }
  };

  // Helper สำหรับ Tabs
  const CustomTab = ({ icon: Icon, label, ...props }) => (
    <Tab 
      {...props} 
      label={
        <Box display="flex" alignItems="center" gap={1} textTransform="none" fontWeight="bold">
          <Icon size={18} /> {label}
        </Box>
      } 
      sx={{ 
        minHeight: 60,
        '&.Mui-selected': { color: theme.accent },
      }}
    />
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.bg, py: 4 }}>
      <Fade in={true}>
        <Container maxWidth="lg">
          
          {/* --- Header --- */}
          <Stack direction="row" alignItems="center" spacing={2} mb={4}>
            <Box 
              sx={{ 
                p: 1.5, borderRadius: '12px', bgcolor: '#fff', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: `1px solid ${theme.cardBorder}`, color: theme.accent
              }}
            >
              <Package size={32} />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight="800" color={theme.primary}>
                คลังสินค้า (Inventory)
              </Typography>
              <Typography variant="body2" color={theme.secondary}>
                ตรวจสอบยอดคงเหลือตาม Batch และประวัติการเบิกจ่าย
              </Typography>
            </Box>
          </Stack>

          {/* --- Main Card --- */}
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: '16px', 
              border: `1px solid ${theme.cardBorder}`, 
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
            }}
          >
            {/* Tabs Header */}
            <Box sx={{ borderBottom: 1, borderColor: theme.cardBorder, bgcolor: '#fff', px: 2 }}>
              <Tabs 
                value={tabValue} 
                onChange={(_, val) => setTabValue(val)} 
                TabIndicatorProps={{ sx: { bgcolor: theme.accent, height: 3, borderRadius: '3px 3px 0 0' } }}
              >
                <CustomTab icon={Archive} label="สต็อกคงเหลือ (Available)" />
                <CustomTab icon={History} label="ประวัติเคลื่อนไหว (Ledger)" />
              </Tabs>
            </Box>

            {/* --- View 1: Available Stock --- */}
            {tabValue === 0 && (
              <Box sx={{ p: 3 }}>
                <Box mb={3} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                     <Typography variant="subtitle1" fontWeight="bold" color={theme.primary}>
                        รายการสินค้าคงคลัง
                     </Typography>
                     <Chip label={`${availableStock.length} Batches`} size="small" sx={{ bgcolor: theme.bg, fontWeight: 600 }} />
                  </Box>
                  
                  <TextField
                    select
                    size="small"
                    placeholder="กรองสินค้า"
                    value={filterItemId}
                    onChange={(e) => setFilterItemId(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Search size={18} color={theme.secondary}/></InputAdornment>,
                      sx: { borderRadius: '10px', minWidth: 280, bgcolor: theme.bg }
                    }}
                  >
                    <MenuItem value="">
                      <Typography color="text.secondary">แสดงทั้งหมด</Typography>
                    </MenuItem>
                    {items.map((it) => (
                      <MenuItem key={it.id} value={it.id}>{it.name}</MenuItem>
                    ))}
                  </TextField>
                </Box>

                <TableContainer sx={{ border: `1px solid ${theme.cardBorder}`, borderRadius: '12px' }}>
                  <Table>
                    <TableHead sx={{ bgcolor: theme.bg }}>
                      <TableRow>
                        <TableCell width="35%" sx={{ fontWeight: 600, color: theme.secondary }}>สินค้า (Item)</TableCell>
                        <TableCell width="20%" sx={{ fontWeight: 600, color: theme.secondary }}>รหัส Batch</TableCell>
                        <TableCell width="20%" sx={{ fontWeight: 600, color: theme.secondary }}>จุดจัดเก็บ</TableCell>
                        <TableCell width="15%" align="right" sx={{ fontWeight: 600, color: theme.secondary }}>จำนวนคงเหลือ</TableCell>
                        <TableCell width="10%" align="center" sx={{ fontWeight: 600, color: theme.secondary }}>สถานะ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {availableStock.length > 0 ? availableStock.map((row) => (
                        <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar 
                                  variant="rounded" 
                                  sx={{ bgcolor: '#e0f2fe', color: theme.accent, width: 32, height: 32 }}
                                >
                                  <Package size={18} />
                                </Avatar>
                                <Typography fontWeight="600" color={theme.primary}>
                                  {row.item_name || 'ไม่ระบุชื่อ'}
                                </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box 
                                component="span" 
                                sx={{ 
                                    fontFamily: 'monospace', bgcolor: theme.bg, 
                                    px: 1, py: 0.5, borderRadius: '6px', 
                                    border: `1px solid ${theme.cardBorder}`,
                                    color: theme.secondary, fontSize: '0.85rem'
                                }}
                            >
                                {row.batch_no || row.id}
                            </Box>
                          </TableCell>
                          <TableCell>
                             <Box display="flex" alignItems="center" gap={1} color={theme.secondary}>
                                <MapPin size={16} />
                                {row.location_name || 'คลังสะอาด'}
                             </Box>
                          </TableCell>
                          <TableCell align="right">
                             <Typography variant="h6" fontWeight="bold" color={theme.primary}>
                                {row.qty_available.toLocaleString()}
                             </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip 
                              size="small" 
                              label={row.qty_available > 0 ? "พร้อมเบิก" : "หมด"} 
                              sx={{ 
                                fontWeight: 600,
                                bgcolor: row.qty_available > 0 ? '#dcfce7' : '#f1f5f9',
                                color: row.qty_available > 0 ? '#166534' : '#94a3b8'
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow>
                           <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                              <Box display="flex" flexDirection="column" alignItems="center" gap={1} color={theme.secondary}>
                                 <AlertCircle size={40} opacity={0.5} />
                                 <Typography>ไม่พบข้อมูลสต็อกสินค้า</Typography>
                              </Box>
                           </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* --- View 2: Stock Ledger --- */}
            {tabValue === 1 && (
              <Box sx={{ p: 3 }}>
                <Box mb={3} display="flex" alignItems="center" gap={1}>
                     <Typography variant="subtitle1" fontWeight="bold" color={theme.primary}>
                        รายการเคลื่อนไหวล่าสุด
                     </Typography>
                     <Chip label="Latest 100" size="small" variant="outlined" />
                </Box>
                
                <TableContainer sx={{ border: `1px solid ${theme.cardBorder}`, borderRadius: '12px' }}>
                  <Table>
                    <TableHead sx={{ bgcolor: theme.bg }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: theme.secondary }}>วัน-เวลา</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: theme.secondary }}>ประเภท</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: theme.secondary }}>สินค้า</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600, color: theme.secondary }}>จำนวนเปลี่ยนแปลง</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: theme.secondary }}>เหตุผล/กิจกรรม</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: theme.secondary }}>ผู้ทำรายการ</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stockMoves.length > 0 ? stockMoves.map((row) => {
                        const isPositive = row.qty_change > 0;
                        return (
                          <TableRow key={row.id} hover>
                            <TableCell>
                                <Box display="flex" alignItems="center" gap={1} color={theme.secondary}>
                                   <Calendar size={16} />
                                   <Typography variant="body2">
                                     {new Date(row.created_at).toLocaleString('th-TH', { 
                                       day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute:'2-digit'
                                     })}
                                   </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    {isPositive ? (
                                        <ArrowUpCircle size={20} color={theme.success} />
                                    ) : (
                                        <ArrowDownCircle size={20} color={theme.danger} />
                                    )}
                                    <Typography 
                                        fontWeight="600" 
                                        color={isPositive ? theme.success : theme.danger}
                                        variant="body2"
                                    >
                                        {isPositive ? "รับเข้า (IN)" : "เบิกออก (OUT)"}
                                    </Typography>
                                </Stack>
                            </TableCell>
                            <TableCell>
                                <Typography fontWeight="500">{row.item_name}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography 
                                fontWeight="bold" 
                                sx={{ 
                                    color: isPositive ? theme.success : theme.danger,
                                    bgcolor: isPositive ? '#ecfdf5' : '#fef2f2',
                                    display: 'inline-block', px: 1.5, py: 0.5, borderRadius: '6px'
                                }}
                              >
                                {isPositive ? `+${row.qty_change}` : row.qty_change}
                              </Typography>
                            </TableCell>
                            <TableCell>
                                <Chip 
                                    label={row.reason_type} 
                                    size="small" 
                                    variant="outlined" 
                                    sx={{ borderColor: theme.cardBorder, color: theme.secondary }} 
                                />
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                    {row.user_name || 'System'}
                                </Typography>
                            </TableCell>
                          </TableRow>
                        );
                      }) : (
                        <TableRow>
                           <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                              <Typography color="text.secondary">ไม่พบประวัติการเคลื่อนไหว</Typography>
                           </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Card>
        </Container>
      </Fade>
    </Box>
  );
};

export default InventoryPage;