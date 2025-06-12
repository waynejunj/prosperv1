import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaLock, FaMobileAlt, FaSpinner } from 'react-icons/fa';
import Navbar from './Navbar/Navbar';
import Footer from './Footer';
import './Makepayment.css';

const MakePayment = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('mpesa');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [processing, setProcessing] = useState(false);
    const [orderSummary, setOrderSummary] = useState({
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0
    });

    useEffect(() => {
        const fetchCartAndTotals = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('Please login to proceed with payment');
                    navigate('/signin');
                    return;
                }

                const response = await axios.get(
                    'https://prosperv21.pythonanywhere.com/api/cart',
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setCartItems(response.data.items || []);

                const subtotal = response.data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const shipping = subtotal > 1000 ? 0 : 49.99;
                const tax = subtotal * 0.1;
                const total = subtotal + shipping + tax;

                setOrderSummary({
                    subtotal,
                    shipping,
                    tax,
                    total
                });
            } catch (err) {
                console.error('Error fetching cart:', err);
                toast.error(err.response?.data?.error || 'Failed to load payment details');
            } finally {
                setLoading(false);
            }
        };

        fetchCartAndTotals();
    }, [navigate]);

    const handlePayment = async () => {
        if (!phoneNumber && paymentMethod === 'mpesa') {
            toast.error('Please enter your phone number');
            return;
        }

        if (paymentMethod === 'mpesa' && !/^254[17]\d{8}$/.test(phoneNumber)) {
            toast.error('Please enter a valid M-Pesa phone number in format 2547XXXXXX');
            return;
        }

        setProcessing(true);

        try {
            const token = localStorage.getItem('token');

            const orderResponse = await axios.post(
                'https://prosperv21.pythonanywhere.com/api/orders',
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const payload = new URLSearchParams();
            payload.append('order_id', orderResponse.data.order_id);
            payload.append('phone', phoneNumber);
            payload.append('amount', Math.floor(orderSummary.total));

            const paymentResponse = await axios.post(
                'https://prosperv21.pythonanywhere.com/api/payments/mpesa',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            if (paymentResponse.status === 200) {
                toast.success(
                    <div>
                        <div>Payment initiated successfully!</div>
                        <button
                            className="btn btn-sm btn-outline-light mt-2"
                            onClick={() => navigate('/')}
                        >
                            Return to Homepage
                        </button>
                    </div>,
                    {
                        autoClose: 10000,
                        closeButton: false
                    }
                );

                window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { count: 0 } }));
                navigate('/payment-success', {
                    state: {
                        order: {
                            orderId: orderResponse.data.order_id,
                            date: new Date().toLocaleDateString(),
                            total: orderSummary.total,
                            items: cartItems,
                            shippingAddress: 'Nairobi, Kenya',
                            paymentMethod: 'M-Pesa'
                        }
                    }
                });
            } else {
                throw new Error(paymentResponse.data?.error || 'Payment failed. Please try again.');
            }
        } catch (err) {
            console.error('Payment error:', err);
            const errorMessage = err.response?.data?.error ||
                                err.message ||
                                'Payment failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex flex-column bg-dark text-light">
                <Navbar />
                <main className="flex-grow-1 d-flex justify-content-center align-items-center">
                    <FaSpinner className="animate-spin me-2 text-danger" size={24} />
                    <span>Loading payment details...</span>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-vh-100 d-flex flex-column bg-dark text-light">
            <Navbar />
            <main className="flex-grow-1 py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="card bg-dark border-danger shadow-lg mb-4">
                                <div className="card-body p-4">
                                    <h2 className="fw-bold mb-4 text-danger">Complete Your Purchase</h2>
                                    <div className="row">
                                        <div className="col-md-7">
                                            <div className="mb-4">
                                                <h4 className="text-danger mb-3">Payment Method</h4>
                                                <div className="form-check bg-dark p-3 rounded mb-3 border border-danger">
                                                    <input
                                                        className="form-check-input"
                                                        type="radio"
                                                        id="mpesa"
                                                        checked={paymentMethod === 'mpesa'}
                                                        onChange={() => setPaymentMethod('mpesa')}
                                                    />
                                                    <label className="form-check-label d-flex align-items-center" htmlFor="mpesa">
                                                        <FaMobileAlt className="text-danger me-2" size={20} />
                                                        <span>M-Pesa</span>
                                                    </label>
                                                    {paymentMethod === 'mpesa' && (
                                                        <div className="mt-2">
                                                            <label htmlFor="phone" className="form-label text-muted">Phone Number</label>
                                                            <input
                                                                type="text"
                                                                className="form-control bg-dark border-danger text-light"
                                                                placeholder="e.g. 254712345678"
                                                                value={phoneNumber}
                                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                            />
                                                            <small className="text-muted">Format: 2547XXXXXXX</small>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="d-flex align-items-center text-muted mb-4">
                                                <FaLock className="me-2 text-danger" />
                                                <small>Your payment is secure and encrypted</small>
                                            </div>
                                        </div>
                                        <div className="col-md-5">
                                            <div className="card bg-dark border-danger h-100">
                                                <div className="card-body">
                                                    <h4 className="text-danger mb-3">Order Summary</h4>
                                                    <div className="mb-3">
                                                        {cartItems.map(item => (
                                                            <div key={item.id} className="d-flex justify-content-between mb-2">
                                                                <span>
                                                                    {item.product_name} × {item.quantity}
                                                                </span>
                                                                <span>KES {(item.price * item.quantity).toLocaleString()}</span>
                                                            </div>
                                                        ))}
                                                        <hr className="border-danger" />
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <span>Subtotal</span>
                                                            <span>KES {orderSummary.subtotal.toLocaleString()}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-2">
                                                            <span>Shipping</span>
                                                            <span>KES {orderSummary.shipping.toLocaleString()}</span>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-3">
                                                            <span>Tax (10%)</span>
                                                            <span>KES {orderSummary.tax.toLocaleString()}</span>
                                                        </div>
                                                        <hr className="border-danger" />
                                                        <div className="d-flex justify-content-between fw-bold fs-5">
                                                            <span>Total</span>
                                                            <span className="text-danger">KES {orderSummary.total.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="btn btn-danger w-100 py-3 fw-bold"
                                                        onClick={handlePayment}
                                                        disabled={processing || cartItems.length === 0}
                                                    >
                                                        {processing ? (
                                                            <>
                                                                <FaSpinner className="animate-spin me-2" />
                                                                Processing...
                                                            </>
                                                        ) : (
                                                            `Pay KES ${orderSummary.total.toLocaleString()}`
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default MakePayment;