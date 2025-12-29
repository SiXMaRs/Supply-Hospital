import React from 'react';
import { Container, Typography, Paper, Box, Button, Stack, Divider } from '@mui/material';
import { AddCircleOutline, History } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const WardDashboard = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="success.main">
        Ward Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        ระบบจัดการผ้าและเครื่องมือแพทย์ (สำหรับหอผู้ป่วย)
      </Typography>
      <Divider sx={{ my: 3 }} />

      <Stack spacing={3}>
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, textAlign: 'center', border: '1px dashed #ccc' }}>
          <Typography variant="h6" gutterBottom>คุณต้องการเบิกของใหม่ใช่หรือไม่?</Typography>
          <Button 
            variant="contained" 
            color="success" 
            size="large" 
            startIcon={<AddCircleOutline />}
            onClick={() => navigate('/ward/request')}
            sx={{ px: 4, py: 1.5, borderRadius: 10 }}
          >
            สร้างใบขอเบิกของ (New Request)
          </Button>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <History /> ประวัติการทำรายการล่าสุด
          </Typography>
          <Box sx={{ py: 4, textAlign: 'center', color: 'text.disabled' }}>
            ยังไม่มีรายการล่าสุดในวันนี้
          </Box>
        </Paper>
      </Stack>
    </Container>
  );
};

export default WardDashboard;