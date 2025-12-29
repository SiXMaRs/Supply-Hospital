import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiService } from "../../api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      localStorage.clear(); // ล้างสิทธิ์เก่าก่อน Login ใหม่
      const response = await apiService.login({ email, password });
      
      // ดึงค่า 'token' ตามรูป image_92bfc0.png
      const { token, user } = response.data; 

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // เช็ค Role 'supply' ตามรูป image_92bfc0.png
        const userRole = user.role.toLowerCase();
        if (userRole === 'supply' || userRole === 'admin') {
          navigate('/supply/master/items');
        } else {
          navigate('/ward/request');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login ล้มเหลว กรุณาตรวจสอบอีเมลและรหัสผ่าน');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={6} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
        <Box textAlign="center" mb={3}>
          <LockOutlined color="primary" sx={{ fontSize: 45 }} />
          <Typography variant="h5" fontWeight="bold">LAUNDRY SYSTEM</Typography>
          <Typography variant="body2" color="textSecondary">กรุณาเข้าสู่ระบบ</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth label="อีเมล" variant="outlined" margin="normal"
            value={email} onChange={(e) => setEmail(e.target.value)} required
          />
          <TextField
            fullWidth label="รหัสผ่าน" type={showPassword ? 'text' : 'password'}
            variant="outlined" margin="normal" value={password}
            onChange={(e) => setPassword(e.target.value)} required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit" fullWidth variant="contained" size="large"
            disabled={loading} sx={{ mt: 3, py: 1.5 }}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;