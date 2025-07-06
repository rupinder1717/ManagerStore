import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchCustomers,
    setShowModal,
    setModalType,
    setSelectedCustomer,
    setShowDeleteModal
} from '../../redux/customerSlice';
import CustomerModal from './CustomerModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { Button, Table } from 'react-bootstrap';

const CustomerList = () => {
    const dispatch = useDispatch();
    const customers = useSelector((state) => state.customers.customers);
    const showModal = useSelector((state) => state.customers.showModal);
    const showDeleteModal = useSelector((state) => state.customers.showDeleteModal);

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    const handleAdd = () => {
        dispatch(setModalType('create'));
        dispatch(setSelectedCustomer(null));
        dispatch(setShowModal(true));
    };

    const handleEdit = (customer) => {
        dispatch(setModalType('edit'));
        dispatch(setSelectedCustomer(customer));
        dispatch(setShowModal(true));
    };

    const handleDelete = (customer) => {
        dispatch(setSelectedCustomer(customer));
        dispatch(setShowDeleteModal(true));
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Customer List</h4>
                <Button variant="primary" onClick={handleAdd}>New Customer</Button>
            </div>

            <Table striped bordered hover responsive>
                <thead className="table-dark text-white">
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th className="text-center">Actions</th>
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(customers) && customers.length > 0 ? (
                        customers.map((customer) => (
                            <tr key={customer.id}>
                                <td>{customer.name}</td>
                                <td>{customer.address}</td>
                                <td className="text-center">
                                    <Button variant="warning" size="sm" onClick={() => handleEdit(customer)}>
                                        ✏️ EDIT
                                    </Button>
                                </td>
                                <td className="text-center">
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(customer)}>
                                        🗑️ DELETE
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">No customers found.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {showModal && <CustomerModal />}
            {showDeleteModal && <DeleteConfirmationModal />}
        </div>
    );
};

export default CustomerList;
