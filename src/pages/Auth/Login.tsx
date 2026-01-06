import React, { useState } from 'react';
import { 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert, 
  InputAdornment, 
  IconButton,
  Avatar,
  CssBaseline,
  Fade,
  CircularProgress
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  LocalLaundryService,
  Login as LoginIcon
} from '@mui/icons-material';
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
      localStorage.clear(); 
      const response = await apiService.login({ email, password });
      
      const { token, user } = response.data; 

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        const userRole = user.role.toLowerCase();
        // หน่วงเวลาเล็กน้อยให้ User เห็น Feedback ว่าสำเร็จ
        setTimeout(() => {
            if (userRole === 'supply' || userRole === 'admin') {
              navigate('/supply/master/items');
            } else {
              navigate('/ward/request');
            }
        }, 500);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1976D2 0%, #64B5F6 100%)', // สีฟ้าไต่ระดับสวยงาม
        overflow: 'hidden'
      }}
    >
      <CssBaseline />
      
      <Fade in={true} timeout={1000}>
        <Paper 
          elevation={24} 
          sx={{ 
            p: 5, 
            width: '100%',
            maxWidth: 420, // จำกัดความกว้างให้พอดีสวย
            borderRadius: 5, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)', // เงานุ่มลึก
            mx: 2 // เผื่อดูในมือถือไม่ให้ชิดขอบเกินไป
          }}
        >
          {/* Logo Section */}
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: 'primary.main', 
                width: 70, 
                height: 70,
                boxShadow: '0 4px 20px rgba(25, 118, 210, 0.5)'
              }}
            >
              <LocalLaundryService sx={{ fontSize: 35 }} />
            </Avatar>
          </Box>
          
          {/* ชื่อระบบแก้กลับเป็นแบบเดิม */}
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#1565C0', letterSpacing: 1 }}>
            LAUNDRY SYSTEM
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>
            ระบบบริหารจัดการงานซักฟอก
          </Typography>

          {error && (
            <Alert severity="error" variant="filled" sx={{ width: '100%', mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="อีเมล / Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                sx: { borderRadius: 3, bgcolor: '#F5F9FF' } // พื้นหลังช่องกรอกสีฟ้าอ่อนจางๆ
              }}
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              label="รหัสผ่าน / Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                sx: { borderRadius: 3, bgcolor: '#F5F9FF' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              startIcon={!loading && <LoginIcon />}
              sx={{ 
                mt: 4, 
                mb: 2, 
                py: 1.8, 
                borderRadius: 3,
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                background: 'linear-gradient(45deg, #1976D2 30%, #42A5F5 90%)',
                boxShadow: '0 3px 15px rgba(25, 118, 210, 0.3)',
                transition: '0.3s',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565C0 30%, #1976D2 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'เข้าสู่ระบบ (Login)'}
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default LoginPage;