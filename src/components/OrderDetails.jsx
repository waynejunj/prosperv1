import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import axios from 'axios';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/orders/${id}`);
        setOrder(response.data);
        setStatus(response.data.status);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusChange = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await axios.put(`/api/orders/${id}/status`, { status });
      setOrder(prev => ({ ...prev, status }));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading && !order) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <p className="text-danger">Order not found</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12 mb-4">
          <button 
            className="btn btn-outline-secondary"
            onClick={() => navigate('/admin/orders')}
          >
            <FaArrowLeft className="me-2" />
            Back to Orders
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Order #{order.order_number}</h4>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={item.product_image || '/placeholder-product.jpg'} 
                              alt={item.product_name}
                              style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                            />
                            {item.product_name}
                          </div>
                        </td>
                        <td>${item.product_price.toFixed(2)}</td>
                        <td>{item.quantity}</td>
                        <td>${item.total_price.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Order Summary</h4>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <h5>Status</h5>
                <span className={`badge ${
                  order.status === 'completed' ? 'bg-success' :
                  order.status === 'processing' ? 'bg-primary' :
                  order.status === 'shipped' ? 'bg-info' :
                  order.status === 'delivered' ? 'bg-success' :
                  order.status === 'cancelled' ? 'bg-danger' :
                  'bg-warning' // pending
                }`}>
                  {order.status}
                </span>
              </div>

              <div className="mb-3">
                <h5>Payment</h5>
                <span className={`badge ${
                  order.payment_status === 'paid' ? 'bg-success' :
                  'bg-danger' // unpaid
                }`}>
                  {order.payment_status || 'unpaid'}
                </span>
              </div>

              <div className="mb-3">
                <h5>Date</h5>
                <p>{new Date(order.created_at).toLocaleString()}</p>
              </div>

              <div className="mb-3">
                <h5>Customer</h5>
                <p>{order.user?.username || 'Guest'}</p>
                {order.user?.email && <p>{order.user.email}</p>}
              </div>

              <div className="mb-3">
                <h5>Shipping Address</h5>
                <p>{order.shipping_address}</p>
              </div>

              <div className="mb-3">
                <h5>Order Totals</h5>
                <table className="table table-sm">
                  <tbody>
                    <tr>
                      <td>Subtotal:</td>
                      <td className="text-end">${order.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Shipping:</td>
                      <td className="text-end">${order.shipping_amount.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td>Tax:</td>
                      <td className="text-end">${order.tax_amount.toFixed(2)}</td>
                    </tr>
                    <tr className="fw-bold">
                      <td>Total:</td>
                      <td className="text-end">${order.total_amount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Update Status</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleStatusChange}>
                <div className="mb-3">
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={updating}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={updating || status === order.status}
                >
                  {updating ? (
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  ) : (
                    <FaCheck className="me-2" />
                  )}
                  Update Status
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;