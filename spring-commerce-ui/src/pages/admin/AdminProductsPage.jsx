import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminOrdersPage.css'; // Reuse table styles for now

const AdminProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({
        name: '',
        description: '',
        price: '',
        stockQuantity: '',
        categoryId: '',
        imageUrl: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data.data.content || response.data.data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct({ ...currentProduct, [name]: value });
    };

    const handleEdit = (product) => {
        setCurrentProduct({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stockQuantity: product.stockQuantity,
            categoryId: product.categoryId,
            imageUrl: product.imageUrl
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error("Failed to delete product", error);
                alert("Failed to delete product");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/products/${currentProduct.id}`, currentProduct);
            } else {
                await api.post('/products', currentProduct);
            }
            setIsModalOpen(false);
            setCurrentProduct({
                name: '',
                description: '',
                price: '',
                stockQuantity: '',
                categoryId: '',
                imageUrl: ''
            });
            setIsEditing(false);
            fetchProducts();
        } catch (error) {
            console.error("Failed to save product", error);
            alert("Failed to save product");
        }
    };

    const openNewModal = () => {
        setCurrentProduct({
            name: '',
            description: '',
            price: '',
            stockQuantity: '',
            categoryId: categories[0]?.id || '', // Default to first category
            imageUrl: ''
        });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    if (loading) return <div>Loading products...</div>;

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1>Product Management</h1>
                <button className="add-btn" onClick={openNewModal}>+ Add Product</button>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <img src={product.imageUrl} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                </td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td>{product.stockQuantity}</td>
                                <td>{product.category?.name || product.categoryName}</td>
                                <td>
                                    <button className="action-btn" onClick={() => handleEdit(product)} style={{ marginRight: '10px' }}>Edit</button>
                                    <button className="action-btn delete-btn" onClick={() => handleDelete(product.id)} style={{ backgroundColor: '#ff4d4f', color: 'white' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className="modal-content" style={{
                        backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '500px', maxHeight: '90vh', overflowY: 'auto'
                    }}>
                        <h2>{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label>Name</label>
                                <input type="text" name="name" value={currentProduct.name} onChange={handleInputChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                            </div>
                            <div>
                                <label>Description</label>
                                <textarea name="description" value={currentProduct.description} onChange={handleInputChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label>Price</label>
                                    <input type="number" name="price" value={currentProduct.price} onChange={handleInputChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label>Stock</label>
                                    <input type="number" name="stockQuantity" value={currentProduct.stockQuantity} onChange={handleInputChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                                </div>
                            </div>
                            <div>
                                <label>Category</label>
                                <select name="categoryId" value={currentProduct.categoryId} onChange={handleInputChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Image URL</label>
                                <input type="text" name="imageUrl" value={currentProduct.imageUrl} onChange={handleInputChange} required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc', background: 'white' }}>Cancel</button>
                                <button type="submit" style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#007bff', color: 'white' }}>Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProductsPage;
