import React from 'react';
import carousel1 from '../assets/images/carousel-1.png'
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="hero-section bg-dark text-white py-5 mx-3">
      <div className="container py-5">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold mb-4">Welcome to Prosper</h1>
            <p className="lead mb-4">
              Discover amazing products at unbeatable prices. Shop now and experience the best in online shopping.
            </p>
            <div className="d-flex gap-3">
              <Link to="/products" className="btn btn-primary btn-lg px-4">
                Shop Now
              </Link>
              <Link to="/signup" className="btn btn-outline-light btn-lg px-4">
                Join Now
              </Link>
            </div>
          </div>
          <div className="col-lg-6 d-none d-lg-block">
            <img 
              src={carousel1} 
              alt="Shopping" 
              className="img-fluid rounded shadow"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;