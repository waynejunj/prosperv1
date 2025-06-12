import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDarkTheme(savedTheme === 'dark');
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
      setIsDarkTheme(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    const checkAuthStatus = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (err) {
          localStorage.removeItem('user');
        }
      }
    };

    const fetchCartCount = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCartCount(0);
        return;
      }

      try {
        const response = await axios.get(
          'https://prosperv21.pythonanywhere.com/api/cart',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartCount(response.data.items?.length || 0);
      } catch (err) {
        console.error('Error fetching cart count:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setCartCount(0);
          navigate('/signin');
        }
      }
    };

    checkAuthStatus();
    fetchCartCount();

    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        checkAuthStatus();
      }
    };

    const handleCartUpdate = () => fetchCartCount();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [navigate]);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
  const handleProfileToggle = () => setIsProfileOpen(!isProfileOpen);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setCartCount(0);
    navigate('/signin');
  };
  
  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    const theme = newTheme ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  const getAvatarInitial = () => {
    return user?.username?.charAt(0)?.toUpperCase() || '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top navbar-enhanced" aria-label="Main navigation">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3" to="/">
          Prosper
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={handleNavCollapse}
          aria-controls="mobileNav"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          {isNavCollapsed ? <FaBars /> : <FaTimes />}
        </button>

        <div className={`navbar-collapse ${isNavCollapsed ? 'collapse' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/men">Men</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/women">Women</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/kids">Kids</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/sale">Sale</Link>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            <button
              className="theme-toggle-btn me-2"
              onClick={toggleTheme}
              title={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`}
              aria-label={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`}
            >
              {isDarkTheme ? <FaSun /> : <FaMoon />}
            </button>
            {user ? (
              <>
                <Link to="/cart" className="btn btn-outline-dark me-2 position-relative" aria-label="View cart">
                  <FaShoppingCart />
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="dropdown">
                  <button
                    className="btn btn-outline-dark dropdown-toggle d-flex align-items-center profile-btn"
                    onClick={handleProfileToggle}
                    aria-haspopup="true"
                    aria-expanded={isProfileOpen}
                  >
                    {user.avatar_url ? (
                      <img
                        src={`https://prosperv21.pythonanywhere.com${user.avatar_url}`}
                        alt={`${user.username}'s avatar`}
                        className="rounded-circle me-2 navbar-avatar"
                      />
                    ) : (
                      <div className="avatar-placeholder me-2">
                        {getAvatarInitial()}
                      </div>
                    )}
                    <span className="username">{user.username || user.email}</span>
                  </button>

                  <div className={`dropdown-menu ${isProfileOpen ? 'show' : ''}`} style={{ right: 0, left: 'auto' }}>
                    <Link className="dropdown-item" to="/profile">Profile</Link>
                    <Link className="dropdown-item" to="/orders">My Orders</Link>
                    {user.is_admin && (
                      <Link className="dropdown-item" to="/admin">Admin Dashboard</Link>
                    )}
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>Logout</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/signin" className="btn btn-outline-dark me-2 signin-btn">Sign In</Link>
                <Link to="/signup" className="btn btn-dark signup-btn">Sign Up</Link>
              </>
            )}
          </div>
        </div>

        <div className={`offcanvas offcanvas-end ${isNavCollapsed ? '' : 'show'}`} id="mobileNav" aria-labelledby="mobileNavLabel">
          <div className="offcanvas-header">
            <Link className="navbar-brand fw-bold fs-3" to="/">Prosper</Link>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleNavCollapse}
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav">
              {user && (
                <li className="nav-item profile-section">
                  <Link className="nav-link profile-link" to="/profile" onClick={handleNavCollapse}>
                    {user.avatar_url ? (
                      <img
                        src={`https://prosperv21.pythonanywhere.com${user.avatar_url}`}
                        alt={`${user.username}'s avatar`}
                        className="rounded-circle me-2 offcanvas-avatar"
                      />
                    ) : (
                      <div className="avatar-placeholder me-2">
                        {getAvatarInitial()}
                      </div>
                    )}
                    <span className="username">{user.username || user.email}</span>
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={handleNavCollapse}>Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/men" onClick={handleNavCollapse}>Men</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/women" onClick={handleNavCollapse}>Women</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/kids" onClick={handleNavCollapse}>Kids</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/sale" onClick={handleNavCollapse}>Sale</Link>
              </li>
              {user && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/cart" onClick={handleNavCollapse}>
                      Cart {cartCount > 0 && `(${cartCount})`}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/orders" onClick={handleNavCollapse}>My Orders</Link>
                  </li>
                  {user.is_admin && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin" onClick={handleNavCollapse}>Admin Dashboard</Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <button className="nav-link logout-btn" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              )}
              {!user && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/signin" onClick={handleNavCollapse}>Sign In</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/signup" onClick={handleNavCollapse}>Sign Up</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;