import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCustomer, setShowDeleteModal } from "../../redux/customerSlice";

const DeleteConfirmationModal = () => {
    const dispatch = useDispatch();
    const showDeleteModal = useSelector(state => state.customers.showDeleteModal);
    const selectedCustomer = useSelector(state => state.customers.selectedCustomer);

    const handleClose = () => dispatch(setShowDeleteModal(false));

    const handleDelete = () => {
        dispatch(deleteCustomer(selectedCustomer.id));
        handleClose();
    };

    return (
        <Modal show={showDeleteModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete <strong>{selectedCustomer?.name}</strong>?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteConfirmationModal;
