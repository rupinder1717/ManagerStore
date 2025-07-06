import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchSale,
    fetchCustomers,
    fetchProducts,
    fetchStores,
    deleteSale,
    setShowModal,
    setModalType,
    setSelectedSale,
    setShowDeleteModal
} from "../../redux/saleSlice.js";

import SaleModal from './SaleModal.jsx';
import DeleteConfirmationModal from './DeleteConfirmationModal.jsx';
import { Button, Table } from 'react-bootstrap';

const SaleList = () => {
    const dispatch = useDispatch();

    const {
        sale = [],
        customers = [],
        products = [],
        stores = [],
        showModal,
        showDeleteModal,
        selectedSale
    } = useSelector((state) => state.sale || {});

    useEffect(() => {
        dispatch(fetchSale());
        dispatch(fetchCustomers());
        dispatch(fetchProducts());
        dispatch(fetchStores());
    }, [dispatch]);

    const handleAdd = () => {
        dispatch(setModalType('create'));
        dispatch(setSelectedSale(null));
        dispatch(setShowModal(true));
    };

    const handleEdit = (saleItem) => {
        dispatch(setModalType('edit'));
        dispatch(setSelectedSale(saleItem));
        dispatch(setShowModal(true));
    };

    const handleDelete = (saleItem) => {
        dispatch(setSelectedSale(saleItem));
        dispatch(setShowDeleteModal(true));
    };

    const handleConfirmDelete = async () => {
        if (selectedSale?.id) {
            await dispatch(deleteSale(selectedSale.id));
            await dispatch(fetchSale());
        }
        dispatch(setShowDeleteModal(false));
        dispatch(setSelectedSale(null));
    };

    const handleCloseDelete = () => {
        dispatch(setShowDeleteModal(false));
        dispatch(setSelectedSale(null));
    };

    const getNameById = (list, id) => list.find(item => item.id === id)?.name || 'N/A';

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Sale Records</h4>
                <Button variant="primary" onClick={handleAdd}>New Sale</Button>
            </div>

            <Table striped bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Store</th>
                        <th>Date Sold</th>
                        <th className="text-center" colSpan="2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sale.length > 0 ? (
                        sale.map((saleItem) => (
                            <tr key={saleItem.id}>
                                <td>{getNameById(customers, saleItem.customerId)}</td>
                                <td>{getNameById(products, saleItem.productId)}</td>
                                <td>{getNameById(stores, saleItem.storeId)}</td>
                                <td>{new Date(saleItem.dateSold).toLocaleDateString()}</td>
                                <td className="text-center">
                                    <Button variant="warning" size="sm" onClick={() => handleEdit(saleItem)}>✏️ EDIT</Button>
                                </td>
                                <td className="text-center">
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(saleItem)}>🗑️ DELETE</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">No sales found.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {showModal && <SaleModal />}
            <DeleteConfirmationModal
                show={showDeleteModal}
                onClose={handleCloseDelete}
                onConfirm={handleConfirmDelete}
                title="Delete Sale"
                body="Are you sure you want to delete this sale record?"
            />
        </div>
    );
};

export default SaleList;