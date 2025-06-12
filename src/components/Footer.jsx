import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4">
      <div className="container">
        <div className="row">
          {/* Brand Column */}
          <div className="col-md-3 mb-4">
            <h5 className="mb-3">Prosper</h5>
            <p className="text-muted">
              Elevating your style with premium, ethically-made clothing that combines comfort, quality, and timeless design.
            </p>
            <div className="mt-3">
              <span className="fw-bold text-white">Free Shipping</span>
              <p className="text-muted small">On all orders over $50</p>
            </div>
          </div>

          {/* Shop Column */}
          <div className="col-md-3 mb-4">
            <h5 className="mb-3">Shop</h5>
            <ul className="list-unstyled">
              <li><Link to="/new-arrivals" className="text-muted text-decoration-none">New Arrivals</Link></li>
              <li><Link to="/men" className="text-muted text-decoration-none">Men's Collection</Link></li>
              <li><Link to="/women" className="text-muted text-decoration-none">Women's Collection</Link></li>
              <li><Link to="/kids" className="text-muted text-decoration-none">Kids' Collection</Link></li>
              <li><Link to="/accessories" className="text-muted text-decoration-none">Accessories</Link></li>
              <li><Link to="/sale" className="text-muted text-decoration-none">Clearance Sale</Link></li>
            </ul>
          </div>

          {/* Customer Service Column */}
          <div className="col-md-3 mb-4">
            <h5 className="mb-3">Customer Service</h5>
            <ul className="list-unstyled">
              <li><Link to="/contact" className="text-muted text-decoration-none">Contact Us</Link></li>
              <li><Link to="/faq" className="text-muted text-decoration-none">FAQs</Link></li>
              <li><Link to="/shipping" className="text-muted text-decoration-none">Shipping Policy</Link></li>
              <li><Link to="/returns" className="text-muted text-decoration-none">Returns & Exchanges</Link></li>
              <li><Link to="/size-guide" className="text-muted text-decoration-none">Size Guide</Link></li>
              <li><Link to="/gift-cards" className="text-muted text-decoration-none">Gift Cards</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="col-md-3 mb-4">
            <h5 className="mb-3">Stay Connected</h5>
            <p className="text-muted">
              Subscribe to our newsletter for exclusive offers and style tips
            </p>
            <div className="input-group mb-3">
              <input 
                type="email" 
                className="form-control" 
                placeholder="Your email" 
                aria-label="Your email"
              />
              <button className="btn btn-primary" type="button">
                Join
              </button>
            </div>
            <div className="mt-4">
              <h6 className="text-white">Customer Care</h6>
              <p className="text-muted mb-1">
                <i className="bi bi-envelope me-2"></i> help@prosperfashion.com
              </p>
              <p className="text-muted">
                <i className="bi bi-telephone me-2"></i> (888) 123-4567
              </p>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="mb-md-0">
              © {new Date().getFullYear()} Prosper Fashion. All rights reserved.
            </p>
            <div className="d-flex flex-wrap mt-2">
              <Link to="/privacy" className="text-muted text-decoration-none me-3 small">Privacy Policy</Link>
              <Link to="/terms" className="text-muted text-decoration-none me-3 small">Terms of Service</Link>
              <Link to="/sustainability" className="text-muted text-decoration-none small">Sustainability</Link>
            </div>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <a href="https://facebook.com" className="text-white mx-2" aria-label="Facebook">
              <i className="bi bi-facebook fs-5"></i>
            </a>
            <a href="https://instagram.com" className="text-white mx-2" aria-label="Instagram">
              <i className="bi bi-instagram fs-5"></i>
            </a>
            <a href="https://twitter.com" className="text-white mx-2" aria-label="Twitter">
              <i className="bi bi-twitter fs-5"></i>
            </a>
          
            <a href="https://tiktok.com" className="text-white mx-2" aria-label="TikTok">
              <i className="bi bi-tiktok fs-5"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;