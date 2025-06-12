import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js'
import Homepage from './components/Homepage';
import AdminDashboard from './components/AdminDashboard';
import Signup from './components/Signup/Signup';
import Signin from './components/Signin/Signin';
import Cart from './components/Cart';
import AddProductForm from './components/AddProductForm';
import EditProductForm from './components/EditProductForm';
import OrderDetails from './components/OrderDetails';
import UserDetails from './components/UserDetails';
import Profile from './components/Profile'; // Import the Profile component
import MakePayment from './components/Makepayment';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <Routes>
          <Route path='/' element={<Homepage />} />
          <Route path='/admin' element={<AdminDashboard />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/cart' element ={<Cart />} />
          <Route path='/payment' element ={<MakePayment/>} />
          <Route path='/admin/products/new' element={<AddProductForm />} />
          <Route path="/admin/products/edit/:id" element={<EditProductForm />} />
          <Route path="/admin/orders/:id" element={<OrderDetails />} />
          <Route path="/admin/users/:id" element={<UserDetails />} />
          <Route path="/profile" element={<Profile />} /> {/* Add Profile route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
