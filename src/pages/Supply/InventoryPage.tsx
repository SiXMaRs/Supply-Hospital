import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Tabs, Tab, Box, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Chip, TextField, MenuItem 
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import HistoryIcon from '@mui/icons-material/History';
import { apiService } from '../../api';

const InventoryPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [availableStock, setAvailableStock] = useState([]);
  const [stockMoves, setStockMoves] = useState([]);
  const [items, setItems] = useState([]);
  const [filterItemId, setFilterItemId] = useState('');

  useEffect(() => {
    loadItems();
    loadData();
  }, [tabValue, filterItemId]);

  const loadItems = async () => {
    try {
      const res = await apiService.getItems();
      setItems(res.data);
    } catch (err) { console.error("Load items failed"); }
  };

  const loadData = async () => {
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
    } catch (err) { console.error("Load inventory data failed"); }
  };

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <InventoryIcon /> ระบบจัดการคลังสินค้า (Inventory & Ledger)
      </Typography>

      <Paper sx={{ width: '100%', mt: 3 }} elevation={2}>
        <Tabs value={tabValue} onChange={(_, val) => setTabValue(val)} variant="fullWidth">
          <Tab icon={<InventoryIcon />} label="สต็อกสินค้าคงเหลือ (Available)" />
          <Tab icon={<HistoryIcon />} label="ประวัติเคลื่อนไหว (Stock Ledger)" />
        </Tabs>

        {/* ส่วนที่ 1: ตาราง Batch คงเหลือ */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            <Box mb={3} display="flex" justifyContent="flex-end">
              <TextField
                select
                size="small"
                label="กรองตามรายการสินค้า"
                sx={{ width: 250 }}
                value={filterItemId}
                onChange={(e) => setFilterItemId(e.target.value)}
              >
                <MenuItem value="">ทั้งหมด</MenuItem>
                {items.map((it: any) => (
                  <MenuItem key={it.id} value={it.id}>{it.name}</MenuItem>
                ))}
              </TextField>
            </Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell><b>สินค้า</b></TableCell>
                    <TableCell><b>Batch ID</b></TableCell>
                    <TableCell><b>จุดจัดเก็บ</b></TableCell>
                    <TableCell align="right"><b>จำนวนคงเหลือ</b></TableCell>
                    <TableCell align="center"><b>สถานะ</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availableStock.length > 0 ? availableStock.map((row: any) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.item_name || 'ไม่ระบุ'}</TableCell>
                      <TableCell><code>{row.batch_no || row.id}</code></TableCell>
                      <TableCell>{row.location_name || 'คลังสะอาด'}</TableCell>
                      <TableCell align="right"><b>{row.qty_available}</b></TableCell>
                      <TableCell align="center">
                        <Chip 
                          size="small" 
                          label={row.qty_available > 0 ? "พร้อมเบิก" : "หมด"} 
                          color={row.qty_available > 0 ? "success" : "default"} 
                        />
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={5} align="center">ไม่พบข้อมูลสต็อก</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* ส่วนที่ 2: ตารางประวัติเคลื่อนไหว */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                  <TableRow>
                    <TableCell><b>วัน-เวลา</b></TableCell>
                    <TableCell><b>รายการ</b></TableCell>
                    <TableCell><b>ประเภท</b></TableCell>
                    <TableCell align="right"><b>จำนวน</b></TableCell>
                    <TableCell><b>เหตุผล/กิจกรรม</b></TableCell>
                    <TableCell><b>โดย</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stockMoves.length > 0 ? stockMoves.map((row: any) => (
                    <TableRow key={row.id}>
                      <TableCell>{new Date(row.created_at).toLocaleString('th-TH')}</TableCell>
                      <TableCell>{row.item_name}</TableCell>
                      <TableCell>
                        <Chip 
                          size="small" 
                          label={row.qty_change > 0 ? "IN" : "OUT"} 
                          color={row.qty_change > 0 ? "success" : "error"} 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <b style={{ color: row.qty_change > 0 ? 'green' : 'red' }}>
                          {row.qty_change > 0 ? `+${row.qty_change}` : row.qty_change}
                        </b>
                      </TableCell>
                      <TableCell>{row.reason_type}</TableCell>
                      <TableCell>{row.user_name || 'System'}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={6} align="center">ไม่พบประวัติการเคลื่อนไหว</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default InventoryPage;