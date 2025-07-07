import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    createSale,
    updateSale,
    fetchSale,
    setShowModal,
    clearError,
} from '../../redux/saleSlice';

const SaleModal = () => {
    const dispatch = useDispatch();
    const { showModal, modalType, selectedSale, customers, products, stores, loading, error } = useSelector(state => state.sale);

    const [customerId, setCustomerId] = useState('');
    const [productId, setProductId] = useState('');
    const [storeId, setStoreId] = useState('');
    const [dateSold, setDateSold] = useState('');
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (modalType === 'edit' && selectedSale) {
            setCustomerId(selectedSale.customerId);
            setProductId(selectedSale.productId);
            setStoreId(selectedSale.storeId);
            setDateSold(selectedSale.dateSold.slice(0, 10));
        } else {
            setCustomerId('');
            setProductId('');
            setStoreId('');
            setDateSold('');
        }
        dispatch(clearError());
        setValidated(false);
    }, [modalType, selectedSale, dispatch]);

    const handleClose = () => {
        dispatch(setShowModal(false));
        dispatch(clearError());
        setValidated(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!customerId || !productId || !storeId || !dateSold) {
            setValidated(true);
            return;
        }

        try {
            const sale = { customerId, productId, storeId, dateSold };

            if (modalType === 'edit') {
                await dispatch(updateSale({ ...selectedSale, ...sale })).unwrap();
            } else {
                await dispatch(createSale(sale)).unwrap();
            }
            await dispatch(fetchSale());
            handleClose();
        } catch (err) {
            console.error("Error saving sale:", err);
        }
    };

    return (
        <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{modalType === 'edit' ? 'Edit Sale' : 'New Sale'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-2">
                        <Form.Label>Customer</Form.Label>
                        <Form.Select
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                            isInvalid={validated && !customerId}
                            disabled={loading}
                            required
                        >
                            <option value="">Select Customer</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">Customer is required</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Product</Form.Label>
                        <Form.Select
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            isInvalid={validated && !productId}
                            disabled={loading}
                            required
                        >
                            <option value="">Select Product</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">Product is required</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Store</Form.Label>
                        <Form.Select
                            value={storeId}
                            onChange={(e) => setStoreId(e.target.value)}
                            isInvalid={validated && !storeId}
                            disabled={loading}
                            required
                        >
                            <option value="">Select Store</option>
                            {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">Store is required</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Date Sold</Form.Label>
                        <Form.Control
                            type="date"
                            value={dateSold}
                            onChange={(e) => setDateSold(e.target.value)}
                            isInvalid={validated && !dateSold}
                            disabled={loading}
                            required
                        />
                        <Form.Control.Feedback type="invalid">Date is required</Form.Control.Feedback>
                    </Form.Group>

                    <div className="mt-3">
                        <Button variant="success" type="submit" disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : (modalType === 'edit' ? 'Update' : 'Create')}
                        </Button>{' '}
                        <Button variant="secondary" onClick={handleClose} disabled={loading}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default SaleModal;
