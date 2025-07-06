import React from 'react';
import ProductList from '../components/Products/ProductList';

const ProductPage = () => {
    return (
        <div className="container mt-4">
            <h3>Products</h3>
            <ProductList />
        </div>
    );
};

export default ProductPage;
