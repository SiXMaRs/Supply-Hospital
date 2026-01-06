import React from 'react';
import { Container, Typography, Grid, Paper, List, ListItemButton, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SupplyDashboard = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">Supply Dashboard</Typography>
      <Divider sx={{ mb: 4 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>การจัดการ Master Data</Typography>
            <List>
              <ListItemButton onClick={() => navigate('/supply/master/categories')}>
                <ListItemText primary="จัดการหมวดหมู่สินค้า" />
              </ListItemButton>
              <ListItemButton onClick={() => navigate('/supply/master/items')}>
                <ListItemText primary="จัดการรายการสิ่งของ" />
              </ListItemButton>
              <ListItemButton onClick={() => navigate('/supply/master/departments')}>
                <ListItemText primary="จัดการแผนก" />
              </ListItemButton>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SupplyDashboard;