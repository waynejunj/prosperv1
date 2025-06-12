import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
  Grid,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { CameraAlt, Visibility, VisibilityOff } from '@mui/icons-material';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    avatar_url: '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState({
    profile: false,
    password: false,
    avatar: false,
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({
    profile: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('https://prosperv21.pythonanywhere.com/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (err) {
        console.error('Error fetching user data:', err);
        setErrors(e => ({ ...e, server: 'Failed to fetch profile data' }));
      }
    };
    fetchUserData();
  }, [navigate]);

  const validateProfile = () => {
    const newErrors = {};
    if (!user.username) newErrors.username = 'Username is required';
    if (!user.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!user.first_name) newErrors.first_name = 'First name is required';
    return newErrors;
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!passwordData.current_password) newErrors.current_password = 'Current password is required';
    if (!passwordData.new_password) newErrors.new_password = 'New password is required';
    if (passwordData.new_password.length < 8) newErrors.new_password = 'Password must be at least 8 characters';
    if (passwordData.new_password !== passwordData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    return newErrors;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validatePassword();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading({ ...loading, password: true });
    setSuccess({ ...success, password: false });

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://prosperv21.pythonanywhere.com/api/auth/change-password',
        {
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess({ ...success, password: true });
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (err) {
      setErrors(e => ({ ...e, server: err.response?.data?.error || 'Failed to change password' }));
    } finally {
      setLoading({ ...loading, password: false });
    }
  };

  const handleTogglePassword = (field) => {
    setShowPassword({ ...showPassword, [field]: !showPassword[field] });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateProfile();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading({ ...loading, profile: true });
    setSuccess({ ...success, profile: false });

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      Object.keys(user).forEach((key) => {
        if (user[key] !== null && user[key] !== undefined) {
          formData.append(key, user[key]);
        }
      });

      const response = await axios.put(
        'https://prosperv21.pythonanywhere.com/api/users/me',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setSuccess({ ...success, profile: true });
    } catch (err) {
      setErrors(e => ({
        ...e,
        server: err.response?.data?.error || 'Failed to update profile',
      }));
    } finally {
      setLoading({ ...loading, profile: false });
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading({ ...loading, avatar: true });

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.post(
        'https://prosperv21.pythonanywhere.com/api/users/me/avatar',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUser({ ...user, avatar_url: response.data.avatar_url });
      localStorage.setItem('user', JSON.stringify({ ...user, avatar_url: response.data.avatar_url }));
    } catch (err) {
      setErrors(e => ({
        ...e,
        avatar: err.response?.data?.error || 'Failed to upload avatar',
      }));
    } finally {
      setLoading({ ...loading, avatar: false });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 'bold', color: 'var(--text-primary)', textAlign: 'center' }}
      >
        My Profile
      </Typography>

      {errors.server && (
        <Alert severity="error" sx={{ mb: 3, mx: 'auto', maxWidth: '600px' }}>
          {errors.server}
        </Alert>
      )}

      <Grid container spacing={4} justifyContent="center">
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              background: 'var(--bg-primary)',
              boxShadow: 'var(--shadow)',
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 'medium', color: 'var(--text-primary)' }}
            >
              Personal Information
            </Typography>
            <Divider sx={{ mb: 3, background: 'var(--border-color)' }} />

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, position: 'relative' }}>
              <label htmlFor="avatar-upload">
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleAvatarChange}
                />
                <IconButton
                  component="span"
                  disabled={loading.avatar}
                  sx={{
                    position: 'relative',
                    '&:hover .avatar-overlay': {
                      opacity: 1,
                    },
                  }}
                >
                  <Avatar
                    src={user.avatar_url ? `https://prosperv21.pythonanywhere.com${user.avatar_url}` : '/default-avatar.jpg'}
                    sx={{
                      width: 120,
                      height: 120,
                      border: '2px solid var(--border-color)',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                  <Box
                    className="avatar-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.4)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    <CameraAlt sx={{ color: 'white' }} />
                  </Box>
                </IconButton>
              </label>
              {loading.avatar && (
                <CircularProgress size={24} sx={{ position: 'absolute', bottom: 10 }} />
              )}
            </Box>
            {errors.avatar && (
              <Typography color="error" variant="caption" sx={{ display: 'block', textAlign: 'center', mb: 2 }}>
                {errors.avatar}
              </Typography>
            )}

            <Box component="form" onSubmit={handleProfileSubmit}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="first_name"
                    value={user.first_name}
                    onChange={handleProfileChange}
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                    required
                    sx={{ input: { color: 'var(--text-primary)' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="last_name"
                    value={user.last_name}
                    onChange={handleProfileChange}
                    sx={{ input: { color: 'var(--text-primary)' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={user.username}
                    onChange={handleProfileChange}
                    error={!!errors.username}
                    helperText={errors.username}
                    required
                    sx={{ input: { color: 'var(--text-primary)' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={user.email}
                    onChange={handleProfileChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                    sx={{ input: { color: 'var(--text-primary)' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={user.phone}
                    onChange={handleProfileChange}
                    sx={{ input: { color: 'var(--text-primary)' } }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading.profile}
                    fullWidth
                    sx={{
                      mt: 2,
                      py: 1.5,
                      background: 'var(--gradient-primary)',
                      color: 'white',
                      '&:hover': {
                        background: 'var(--gradient-primary)',
                        opacity: 0.9,
                      },
                    }}
                  >
                    {loading.profile ? <CircularProgress size={24} color="inherit" /> : 'Update Profile'}
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {success.profile && (
              <Alert severity="success" sx={{ mt: 3, mx: 'auto', maxWidth: '600px' }}>
                Profile updated successfully!
              </Alert>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              background: 'var(--bg-primary)',
              boxShadow: 'var(--shadow)',
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 'medium', color: 'var(--text-primary)' }}
            >
              Change Password
            </Typography>
            <Divider sx={{ mb: 3, background: 'var(--border-color)' }} />

            <Box component="form" onSubmit={handlePasswordSubmit}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="current_password"
                    type={showPassword.current ? 'text' : 'password'}
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    error={!!errors.current_password}
                    helperText={errors.current_password}
                    required
                    sx={{ input: { color: 'var(--text-primary)' } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleTogglePassword('current')} edge="end">
                            {showPassword.current ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="new_password"
                    type={showPassword.new ? 'text' : 'password'}
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    error={!!errors.new_password}
                    helperText={errors.new_password || 'At least 8 characters'}
                    required
                    sx={{ input: { color: 'var(--text-primary)' } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleTogglePassword('new')} edge="end">
                            {showPassword.new ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirm_password"
                    type={showPassword.confirm ? 'text' : 'password'}
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    error={!!errors.confirm_password}
                    helperText={errors.confirm_password}
                    required
                    sx={{ input: { color: 'var(--text-primary)' } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleTogglePassword('confirm')} edge="end">
                            {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading.password}
                    fullWidth
                    sx={{
                      mt: 2,
                      py: 1.5,
                      background: 'var(--gradient-primary)',
                      color: 'white',
                      '&:hover': {
                        background: 'var(--gradient-primary)',
                        opacity: 0.9,
                      },
                    }}
                  >
                    {loading.password ? <CircularProgress size={24} color="inherit" /> : 'Change Password'}
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {success.password && (
              <Alert severity="success" sx={{ mt: 3, mx: 'auto', maxWidth: '600px' }}>
                Password changed successfully!
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;