import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    deleteProduct,
    setShowDeleteModal,
    setSelectedProduct
} from '../../redux/productSlice';

const DeleteConfirmationModal = () => {
    const dispatch = useDispatch();
    const showDeleteModal = useSelector(state => state.products.showDeleteModal);
    const selectedProduct = useSelector(state => state.products.selectedProduct);

    const handleClose = () => {
        dispatch(setShowDeleteModal(false));
        dispatch(setSelectedProduct(null));
    };

    const handleDelete = () => {
        dispatch(deleteProduct(selectedProduct.id));
        handleClose();
    };

    return (
        <Modal show={showDeleteModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete <strong>{selectedProduct?.name}</strong>?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    ❌ Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    🗑️ Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteConfirmationModal;
