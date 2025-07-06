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
    setShowDeleteModal,
} from '../../redux/saleSlice';
import SaleModal from './SaleModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { Button, Table, Alert, Spinner } from 'react-bootstrap';

const SaleList = () => {
    const dispatch = useDispatch();
    const {
        sale,
        loading,
        error,
        showModal,
        showDeleteModal,
        selectedSale,
    } = useSelector((state) => state.sale);

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

    const handleEdit = (s) => {
        dispatch(setModalType('edit'));
        dispatch(setSelectedSale(s));
        dispatch(setShowModal(true));
    };

    const handleDelete = (s) => {
        dispatch(setSelectedSale(s));
        dispatch(setShowDeleteModal(true));
    };

    const handleConfirmDelete = async () => {
        if (selectedSale?.id) {
            await dispatch(deleteSale(selectedSale.id)).unwrap();
            await dispatch(fetchSale());
        }
        dispatch(setShowDeleteModal(false));
        dispatch(setSelectedSale(null));
    };

    const handleCloseDelete = () => {
        dispatch(setShowDeleteModal(false));
        dispatch(setSelectedSale(null));
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Sale Records</h4>
                <Button variant="primary" onClick={handleAdd}>New Sale</Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th>Customer</th>
                            <th>Product</th>
                            <th>Store</th>
                            <th>Date Sold</th>
                            <th className="text-end">Actions</th> 
                                <th className="text-end">Actions</th> 
                        </tr>
                    </thead>
                    <tbody>
                        {sale.length > 0 ? (
                            sale.map((s) => (
                                <tr key={s.id}>
                                    <td>{s.customerName || s.customer?.name || 'N/A'}</td>
                                    <td>{s.productName || s.product?.name || 'N/A'}</td>
                                    <td>{s.storeName || s.store?.name || 'N/A'}</td>
                                    <td>{s.dateSold?.slice(0, 10)}</td>
                                    <td className="text-end">
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="me-1"
                                            onClick={() => handleEdit(s)}
                                        >
                                            ✏️ EDIT
                                        </Button>
                                    </td>
                                    <td className="text-end">
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(s)}
                                        >
                                            🗑️ DELETE
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No sales found.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}

            {showModal && <SaleModal />}
            {showDeleteModal && (
                <DeleteConfirmationModal
                    show={showDeleteModal}
                    onClose={handleCloseDelete}
                    onConfirm={handleConfirmDelete}
                    title="Delete Sale"
                    body="Are you sure you want to delete this sale?"
                />
            )}
        </div>
    );
};

export default SaleList;
