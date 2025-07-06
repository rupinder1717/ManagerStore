import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './components/Navbar';
import CustomerPage from './pages/CustomerPage';
import ProductPage from './pages/ProductPage';
import SalePage from './pages/SalePage';
import StorePage from './pages/StorePage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <Router>
            <div className="d-flex flex-column min-vh-100">
                <NavigationBar />
                <div className="flex-grow-1 px-4 py-3 bg-light">
                    <Routes>
                        <Route path="/" element={<Navigate to="/customers" />} />
                        <Route path="/customers" element={<CustomerPage />} />
                        <Route path="/products" element={<ProductPage />} />
                        <Route path="/sale" element={<SalePage />} />
                        <Route path="/stores" element={<StorePage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
