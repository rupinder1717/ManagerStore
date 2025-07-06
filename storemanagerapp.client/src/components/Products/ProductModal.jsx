import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    createProduct,
    updateProduct,
    fetchProducts,
    setShowModal,
    clearError,
} from '../../redux/productSlice';

const ProductModal = () => {
    const dispatch = useDispatch();
    const { showModal, modalType, selectedProduct, loading, error } = useSelector(state => state.products);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (modalType === 'edit' && selectedProduct) {
            setName(selectedProduct.name);
            setPrice(selectedProduct.price.toString());
        } else {
            setName('');
            setPrice('');
        }
        dispatch(clearError());
        setValidated(false);
    }, [modalType, selectedProduct, dispatch]);

    const handleClose = () => {
        dispatch(setShowModal(false));
        dispatch(clearError());
        setValidated(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || !price || isNaN(price) || parseFloat(price) <= 0) {
            setValidated(true);
            return;
        }

        try {
            const product = { name, price: parseFloat(price) };
            if (modalType === 'edit') {
                await dispatch(updateProduct({ ...selectedProduct, ...product })).unwrap();
            } else {
                await dispatch(createProduct(product)).unwrap();
            }
            await dispatch(fetchProducts());
            handleClose();
        } catch (err) {
            console.error("Error saving product:", err);
        }
    };

    return (
        <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{modalType === 'edit' ? 'Edit Product' : 'New Product'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="productName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter product name"
                            isInvalid={validated && !name.trim()}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">Name is required</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="productPrice">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            required
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Enter price"
                            isInvalid={validated && (!price || isNaN(price) || parseFloat(price) <= 0)}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">Price must be a positive number</Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit" variant="success" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : (modalType === 'edit' ? 'Update' : 'Create')}
                    </Button>{' '}
                    <Button variant="secondary" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ProductModal;
