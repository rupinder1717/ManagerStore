import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    deleteStore,
    setShowDeleteModal,
    setSelectedStore
} from '../../redux/storeSlice';

const DeleteConfirmationModal = () => {
    const dispatch = useDispatch();
    const showDeleteModal = useSelector(state => state.store.showDeleteModal);
    const selectedStore = useSelector(state => state.store.selectedStore);

    const handleClose = () => {
        dispatch(setShowDeleteModal(false));
        dispatch(setSelectedStore(null));
    };

    const handleDelete = () => {
        dispatch(deleteStore(selectedStore.id));
        handleClose();
    };

    return (
        <Modal show={showDeleteModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete <strong>{selectedStore?.name}</strong>?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>❌ Cancel</Button>
                <Button variant="danger" onClick={handleDelete}>🗑️ Delete</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteConfirmationModal;
