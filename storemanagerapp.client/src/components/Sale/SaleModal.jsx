import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    createSale, updateSale, fetchSale, setShowModal
} from '../../redux/saleSlice';

const SaleModal = () => {
    const dispatch = useDispatch();
    const { showModal, modalType, selectedSale, customers, products, stores } = useSelector(state => state.sale);

    const [customerId, setCustomerId] = useState('');
    const [productId, setProductId] = useState('');
    const [storeId, setStoreId] = useState('');
    const [dateSold, setDateSold] = useState('');

    useEffect(() => {
        if (modalType === 'edit' && selectedSale) {
            setCustomerId(selectedSale.customerId);
            setProductId(selectedSale.productId);
            setStoreId(selectedSale.storeId);
            setDateSold(selectedSale.dateSold.slice(0, 10)); // format as yyyy-mm-dd
        } else {
            setCustomerId('');
            setProductId('');
            setStoreId('');
            setDateSold('');
        }
    }, [modalType, selectedSale]);

    const handleClose = () => dispatch(setShowModal(false));

    const handleSubmit = async () => {
        // ✅ Frontend Validation
        if (!customerId) {
            alert("Please select a customer.");
            return;
        }

        if (!productId) {
            alert("Please select a product.");
            return;
        }

        if (!storeId) {
            alert("Please select a store.");
            return;
        }

        if (!dateSold) {
            alert("Please select a date.");
            return;
        }

        const sale = { customerId, productId, storeId, dateSold };

        if (modalType === 'edit') {
            await dispatch(updateSale({ ...selectedSale, ...sale }));
        } else {
            await dispatch(createSale(sale));
        }

        await dispatch(fetchSale());
        handleClose();
    };

    return (
        <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{modalType === 'edit' ? 'Edit Sale' : 'New Sale'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-2">
                        <Form.Label>Customer</Form.Label>
                        <Form.Select
                            value={customerId}
                            onChange={(e) => setCustomerId(e.target.value)}
                            required
                        >
                            <option value="">Select Customer</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Product</Form.Label>
                        <Form.Select
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            required
                        >
                            <option value="">Select Product</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Store</Form.Label>
                        <Form.Select
                            value={storeId}
                            onChange={(e) => setStoreId(e.target.value)}
                            required
                        >
                            <option value="">Select Store</option>
                            {stores.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Date Sold</Form.Label>
                        <Form.Control
                            type="date"
                            value={dateSold}
                            onChange={(e) => setDateSold(e.target.value)}
                            required
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="success" onClick={handleSubmit}>
                    {modalType === 'edit' ? 'Update' : 'Create'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SaleModal;