import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const defaultImage = '/assets/images/def.png';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const {
    id = 0,
    name = 'Product Name',
    price = 0,
    compare_price = 0,
    category_name = 'Uncategorized',
    short_description = '',
    description = '',
    is_featured = false,
    images = []
  } = product || {};

  const imageUrl = images.length > 0 
    ? `https://prosperv21.pythonanywhere.com/static/images/${images[0].image_url}`
    : defaultImage;

  const formatPrice = (amount) => {
    return parseFloat(amount || 0).toFixed(2);
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to add items to cart');
      navigate('/signin');
      return;
    }

    const formData = new FormData();
    formData.append('product_id', id);
    formData.append('quantity', 1);

    try {
      await axios.post(
        'https://prosperv21.pythonanywhere.com/api/cart/add',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success(`${name} added to cart`);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (err) {
      console.error('Add to cart error:', err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/signin');
      } else if (err.response?.status === 405) {
        toast.error('Server configuration error. Please contact support.');
      } else {
        toast.error(err.response?.data?.error || 'Failed to add to cart');
      }
    }
  };

  return (
    <div className="card h-100 border-0 shadow-sm">
      <div className="position-relative" style={{ height: '200px', overflow: 'hidden' }}>
        <img 
          src={imageUrl}
          alt={name}
          className="w-100 h-100 object-fit-cover"
          onError={(e) => {
            e.target.src = defaultImage;
            e.target.className = 'w-100 h-100 object-fit-contain p-3';
          }}
          loading="lazy"
        />
        {is_featured && (
          <span className="position-absolute top-0 start-0 bg-danger text-white px-2 py-1 small">
            Featured
          </span>
        )}
      </div>
      
      <div className="card-body">
        <div className="d-flex justify-content-between mb-2">
          <span className="badge bg-secondary">{category_name}</span>
        </div>
        
        <h5 className="card-title">
          <Link to={`/products/${id}`} className="text-decoration-none text-dark">
            {name}
          </Link>
        </h5>
        
        <p className="card-text text-muted small mb-2">
          {short_description || `${description.substring(0, 60)}...`}
        </p>
        
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="fw-bold text-primary">
              KES {formatPrice(price)}
            </span>
            {compare_price > price && (
              <span className="text-muted text-decoration-line-through ms-2">
                KES {formatPrice(compare_price)}
              </span>
            )}
          </div>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={handleAddToCart}
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;