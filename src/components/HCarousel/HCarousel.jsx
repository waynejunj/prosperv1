import React from 'react';
import './HCarousel.css';
import { Link } from 'react-router-dom';

const HCarousel = () => {
  // Public URLs for the images
  const carouselItems = [
    {
      id: 1,
      image: '/assets/images/carousel-1.png',
      title: 'New Summer Collection',
      description: 'Discover our fresh styles for the season with up to 30% ',
      link: '/new-arrivals',
      btnText: 'Shop Now'
    },
    {
      id: 2,
      image: '/assets/images/carousel-2.png',
      title: 'Premium Quality Fabrics',
      description: 'Experience comfort that lasts with our sustainably sourced materials',
      link: '/collections',
      btnText: 'Explore'
    },
    {
      id: 3,
      image: '/assets/images/carousel-3.png',
      title: 'Limited Edition Styles',
      description: 'Exclusive designs available for a limited time only',
      link: '/limited-edition',
      btnText: 'View Collection'
    }
  ];

  return (
    <div className="hero-carousel-wrapper">
      <div id="hero" className="hero section">
        <div id="hero-carousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
          {/* Indicators */}
          <div className="carousel-indicators">
            {carouselItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                data-bs-target="#hero-carousel"
                data-bs-slide-to={index}
                className={index === 0 ? 'active' : ''}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Carousel Items */}
          <div className="carousel-inner">
            {carouselItems.map((item, index) => (
              <div key={item.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="carousel-image"
                  loading="lazy"
                />
                <div className="carousel-container">
                  <div className="carousel-content">
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                    <Link to={item.link} className="btn-get-started">
                      {item.btnText}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <button className="carousel-control-prev" type="button" data-bs-target="#hero-carousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#hero-carousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HCarousel;