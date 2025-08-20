import React, { useState, useEffect } from 'react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null); // API-level RBAC or validation error

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    stock: '',
    isFeatured: false,
  });
  const [images, setImages] = useState([]);
  const [editId, setEditId] = useState(null);

  // Fetch products with RBAC and validation error handling
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:5000/api/admin/products', {
        credentials: 'include', // JWT cookie
      });
      const data = await res.json();

      if (!res.ok) {
        // Backend returned 401, 403, or validation errors
        throw new Error(data.message || 'Access denied or validation error');
      }

      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Form handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageChange = (e) => setImages([...e.target.files]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      brand: '',
      stock: '',
      isFeatured: false,
    });
    setImages([]);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      images.forEach((img) => data.append('images', img));

      const url = editId
        ? `http://localhost:5000/api/admin/products/${editId}`
        : 'http://localhost:5000/api/admin/products';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: data, credentials: 'include' });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || 'Operation failed');

      setMessage({ type: 'success', text: editId ? 'Product updated' : 'Product created' });
      resetForm();
      fetchProducts();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      brand: product.brand || '',
      stock: product.stock,
      isFeatured: product.isFeatured || false,
    });
    setImages([]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Delete failed');

      setMessage({ type: 'success', text: 'Product deleted' });
      fetchProducts();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Products</h1>

      {message && (
        <div className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Form */}
        <div className="p-6 bg-white shadow-lg rounded-md">
          <h2 className="text-xl font-semibold mb-4">{editId ? 'Edit Product' : 'Create Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded" />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="w-full p-2 border rounded" />
            <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="w-full p-2 border rounded" />
            <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required className="w-full p-2 border rounded" />
            <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} className="w-full p-2 border rounded" />
            <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required min="0" className="w-full p-2 border rounded" />
            <div className="flex items-center space-x-2">
              <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
              <label>Featured</label>
            </div>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded" />
            <button type="submit" disabled={loading} className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700">{loading ? 'Processing...' : editId ? 'Update Product' : 'Create Product'}</button>
            {editId && <button type="button" onClick={resetForm} className="w-full p-2 bg-gray-400 text-white rounded hover:bg-gray-500 mt-2">Cancel Edit</button>}
          </form>
        </div>

        {/* Product List */}
        <div className="p-6 bg-white shadow-lg rounded-md overflow-x-auto col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          {loading ? <p>Loading...</p> : (
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Category</th>
                  <th className="p-2 border">Brand</th>
                  <th className="p-2 border">Price</th>
                  <th className="p-2 border">Stock</th>
                  <th className="p-2 border">Featured</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} className="hover:bg-gray-100">
                    <td className="p-2 border">{p.name}</td>
                    <td className="p-2 border">{p.category}</td>
                    <td className="p-2 border">{p.brand}</td>
                    <td className="p-2 border">${p.price}</td>
                    <td className="p-2 border">{p.stock}</td>
                    <td className="p-2 border">{p.isFeatured ? 'Yes' : 'No'}</td>
                    <td className="p-2 border space-x-2">
                      <button onClick={() => handleEdit(p)} className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
