import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchStores,
    deleteStore,
    setShowModal,
    setModalType,
    setSelectedStore,
    setShowDeleteModal,
} from '../../redux/storeSlice';
import StoreModal from './StoreModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { Button, Table, Alert, Spinner } from 'react-bootstrap';

const StoreList = () => {
    const dispatch = useDispatch();
    const {
        stores,
        loading,
        error,
        showModal,
        showDeleteModal,
        selectedStore,
    } = useSelector((state) => state.stores);

    useEffect(() => {
        dispatch(fetchStores());
    }, [dispatch]);

    const handleAdd = () => {
        dispatch(setModalType('create'));
        dispatch(setSelectedStore(null));
        dispatch(setShowModal(true));
    };

    const handleEdit = (store) => {
        dispatch(setModalType('edit'));
        dispatch(setSelectedStore(store));
        dispatch(setShowModal(true));
    };

    const handleDelete = (store) => {
        dispatch(setSelectedStore(store));
        dispatch(setShowDeleteModal(true));
    };

    const handleConfirmDelete = async () => {
        if (selectedStore?.id) {
            await dispatch(deleteStore(selectedStore.id)).unwrap();
            await dispatch(fetchStores());
        }
        dispatch(setShowDeleteModal(false));
        dispatch(setSelectedStore(null));
    };

    const handleCloseDelete = () => {
        dispatch(setShowDeleteModal(false));
        dispatch(setSelectedStore(null));
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Store List</h4>
                <Button variant="primary" onClick={handleAdd}>New Store</Button>
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
                            <th>Name</th>
                            <th>Address</th>
                            <th className="text-end">Actions</th>
                                <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.length > 0 ? (
                            stores.map((s) => (
                                <tr key={s.id}>
                                    <td>{s.name}</td>
                                    <td>{s.address}</td>
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
                                <td colSpan="3" className="text-center">No stores found.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}

            {showModal && <StoreModal />}
            {showDeleteModal && (
                <DeleteConfirmationModal
                    show={showDeleteModal}
                    onClose={handleCloseDelete}
                    onConfirm={handleConfirmDelete}
                    title="Delete Store"
                    body="Are you sure you want to delete this store?"
                />
            )}
        </div>
    );
};

export default StoreList;
