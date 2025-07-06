import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    createStore,
    updateStore,
    fetchStores,
    setShowModal,
    clearError,
} from '../../redux/storeSlice';

const StoreModal = () => {
    const dispatch = useDispatch();
    const { showModal, modalType, selectedStore, loading, error } = useSelector(state => state.stores);

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (modalType === 'edit' && selectedStore) {
            setName(selectedStore.name);
            setAddress(selectedStore.address);
        } else {
            setName('');
            setAddress('');
        }
        dispatch(clearError());
        setValidated(false);
    }, [modalType, selectedStore, dispatch]);

    const handleClose = () => {
        dispatch(setShowModal(false));
        dispatch(clearError());
        setValidated(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim() || !address.trim()) {
            setValidated(true);
            return;
        }

        try {
            if (modalType === 'edit') {
                await dispatch(updateStore({ ...selectedStore, name, address })).unwrap();
            } else {
                await dispatch(createStore({ name, address })).unwrap();
            }
            await dispatch(fetchStores());
            handleClose();
        } catch (err) {
            // error handled in slice state and displayed
            console.error("Error saving store:", err);
        }
    };

    return (
        <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{modalType === 'edit' ? 'Edit Store' : 'New Store'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="storeName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter store name"
                            isInvalid={validated && !name.trim()}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">Name is required</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="storeAddress">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter address"
                            isInvalid={validated && !address.trim()}
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">Address is required</Form.Control.Feedback>
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

export default StoreModal;
