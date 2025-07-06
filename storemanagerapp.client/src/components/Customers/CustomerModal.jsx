import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    createCustomer,
    updateCustomer,
    setShowModal
} from '../../redux/customerSlice';

/**
 * CustomerModal now has client‑side validation and basic exception handling.
 *   • Name and Address are required.
 *   • Inline errors appear once the user touches a field.
 *   • Submit button is disabled until the form is valid and not submitting.
 *   • Any async thunk rejection is shown as an alert at the top.
 */
const CustomerModal = () => {
    const dispatch = useDispatch();
    const {
        showModal,
        modalType,
        selectedCustomer,
        error: apiError
    } = useSelector((state) => state.customers);

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [touched, setTouched] = useState({ name: false, address: false });
    const [submitting, setSubmitting] = useState(false);
    const [localError, setLocalError] = useState('');

    // Populate fields when editing.
    useEffect(() => {
        if (modalType === 'edit' && selectedCustomer) {
            setName(selectedCustomer.name);
            setAddress(selectedCustomer.address);
        } else {
            setName('');
            setAddress('');
        }
        setTouched({ name: false, address: false });
        setLocalError('');
    }, [modalType, selectedCustomer]);

    const handleClose = () => dispatch(setShowModal(false));

    const isNameValid = name.trim().length > 0;
    const isAddressValid = address.trim().length > 0;
    const formIsValid = isNameValid && isAddressValid;

    const handleSubmit = async () => {
        // Show validation errors if user somehow clicks when disabled (race)
        if (!formIsValid) {
            setTouched({ name: true, address: true });
            return;
        }

        const customer = { name: name.trim(), address: address.trim() };
        setSubmitting(true);
        setLocalError('');

        try {
            if (modalType === 'edit' && selectedCustomer?.id) {
                await dispatch(updateCustomer({ ...customer, id: selectedCustomer.id })).unwrap();
            } else {
                await dispatch(createCustomer(customer)).unwrap();
            }
            handleClose();
        } catch (err) {
            // err.message is either from thunk or network
            setLocalError(err?.message || 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={showModal} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{modalType === 'edit' ? 'Edit Customer' : 'New Customer'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* API‑level or local errors */}
                {(apiError || localError) && (
                    <Alert variant="danger">{localError || apiError}</Alert>
                )}

                <Form noValidate>
                    <Form.Group controlId="formCustomerName" className="mb-3">
                        <Form.Label>Name<span className="text-danger ms-1">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter customer name"
                            value={name}
                            isInvalid={touched.name && !isNameValid}
                            onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Name is required.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formCustomerAddress" className="mb-3">
                        <Form.Label>Address<span className="text-danger ms-1">*</span></Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter address"
                            value={address}
                            isInvalid={touched.address && !isAddressValid}
                            onBlur={() => setTouched((prev) => ({ ...prev, address: true }))}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Address is required.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={submitting}>
                    Cancel
                </Button>
                <Button
                    variant="success"
                    onClick={handleSubmit}
                    disabled={!formIsValid || submitting}
                >
                    {submitting && <Spinner animation="border" size="sm" className="me-2" />} {modalType === 'edit' ? 'Update' : 'Create'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CustomerModal;
