import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchProducts,
    deleteProduct,
    setShowModal,
    setModalType,
    setSelectedProduct,
    setShowDeleteModal,
} from '../../redux/productSlice';
import ProductModal from './ProductModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { Button, Table, Alert, Spinner } from 'react-bootstrap';

const ProductList = () => {
    const dispatch = useDispatch();
    const {
        products,
        loading,
        error,
        showModal,
        showDeleteModal,
        selectedProduct,
    } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleAdd = () => {
        dispatch(setModalType('create'));
        dispatch(setSelectedProduct(null));
        dispatch(setShowModal(true));
    };

    const handleEdit = (product) => {
        dispatch(setModalType('edit'));
        dispatch(setSelectedProduct(product));
        dispatch(setShowModal(true));
    };

    const handleDelete = (product) => {
        dispatch(setSelectedProduct(product));
        dispatch(setShowDeleteModal(true));
    };

    const handleConfirmDelete = async () => {
        if (selectedProduct?.id) {
            await dispatch(deleteProduct(selectedProduct.id)).unwrap();
            await dispatch(fetchProducts());
        }
        dispatch(setShowDeleteModal(false));
        dispatch(setSelectedProduct(null));
    };

    const handleCloseDelete = () => {
        dispatch(setShowDeleteModal(false));
        dispatch(setSelectedProduct(null));
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Product List</h4>
                <Button variant="primary" onClick={handleAdd}>New Product</Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th className="text-end">Actions</th> 
                            <th className="text-end">Actions</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.name}</td>
                                    <td>${p.price.toFixed(2)}</td>
                                    <td className="text-end">
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="me-1"
                                            onClick={() => handleEdit(p)}
                                        >
                                            ✏️ EDIT
                                        </Button>
                                    </td>
                                    <td className="text-end">
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(p)}
                                        >
                                            🗑️ DELETE
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">No products found.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}

            {showModal && <ProductModal />}
            {showDeleteModal && (
                <DeleteConfirmationModal
                    show={showDeleteModal}
                    onClose={handleCloseDelete}
                    onConfirm={handleConfirmDelete}
                    title="Delete Product"
                    body="Are you sure you want to delete this product?"
                />
            )}
        </div>
    );
};

export default ProductList;
