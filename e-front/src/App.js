import "./App.css";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Shop from "./pages/shop";
import Cart from "./pages/cart";
import Product from "./pages/product";
import Checkout from "./pages/checkout";
import Admin from "./pages/admin";
import Profile from "./pages/profile";
import { UserProvider } from "./context/usercontext";
import { CartProvider } from "./context/cartcontext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Order from "./pages/order";

function App() {
  return (
    <Router>
      <CartProvider>
        <UserProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin/*" element={<Admin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/order" element={<Order />} />
          </Routes>
        </UserProvider>
      </CartProvider>
    </Router>
  );
}

export default App;
