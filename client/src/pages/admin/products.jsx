import React, { useState, useEffect } from 'react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/products', {
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch');
      setProducts(data.products || []);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
    if (!window.confirm('Are you sure?')) return;
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col m-6 border-2 border-gray-500">
      <h1 className="text-3xl font-bold text-center py-6">Admin Products</h1>

      {message && (
        <div className={`mx-6 mb-4 p-3 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 px-6 pb-6">
        {/* Form */}
        <div className="flex-1 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">{editId ? 'Edit Product' : 'Create Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded" />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required className="w-full p-2 border rounded" />
            <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required className="w-full p-2 border rounded" />
            <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required className="w-full p-2 border rounded" />
            <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} className="w-full p-2 border rounded" />
            <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required className="w-full p-2 border rounded" />
            <div className="flex items-center space-x-2">
              <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
              <label>Featured</label>
            </div>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded" />
            <button type="submit" disabled={loading} className="w-full p-2 bg-black text-white rounded hover:bg-gray-800">
              {loading ? 'Processing...' : editId ? 'Update Product' : 'Create Product'}
            </button>
            {editId && <button type="button" onClick={resetForm} className="w-full p-2 bg-gray-300 rounded mt-2 hover:bg-gray-400">Cancel Edit</button>}
          </form>
        </div>

        {/* Product List */}
        <div className="flex-2 bg-white p-6 shadow-sm overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4">Products</h2>
          {loading ? <p>Loading...</p> : (
            <table className="min-w-full border-collapse border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 border text-left">Name</th>
                  <th className="p-2 border text-left">Category</th>
                  <th className="p-2 border text-left">Brand</th>
                  <th className="p-2 border text-left">Price</th>
                  <th className="p-2 border text-left">Stock</th>
                  <th className="p-2 border text-left">Featured</th>
                  <th className="p-2 border text-left">Actions</th>
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
