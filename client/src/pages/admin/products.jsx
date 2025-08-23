import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaStar } from 'react-icons/fa';
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', discount: '', category: '',
    brand: '', stock: '', isFeatured: false, size: [], color: [],
  });
  const [images, setImages] = useState([]);
  const [editId, setEditId] = useState(null);
  const [availableOptions, setAvailableOptions] = useState({ sizes: [], colors: [], brands: [] });
const [dropdownOpen, setDropdownOpen] = useState(false);  
  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/products/allproducts', { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch');
      setProducts(data.products || []);

      // Extract unique sizes, colors, brands
      const sizes = new Set(), colors = new Set(), brands = new Set();
      data.products.forEach(p => {
        p.size?.forEach(s => sizes.add(s));
        p.color?.forEach(c => colors.add(c));
        if (p.brand) brands.add(p.brand);
      });
      setAvailableOptions({ sizes: [...sizes], colors: [...colors], brands: [...brands] });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  // Handlers
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };
const [sizeInput, setSizeInput] = useState("");
const [colorInput, setColorInput] = useState("");

// Input handler (keeps arrays)


  const handleImageChange = e => setImages([...e.target.files]);

  const resetForm = () => {
    setFormData({ name:'', description:'', price:'', discount:'', category:'', brand:'', stock:'', isFeatured:false, size:[""], color:[""] });
    setImages([]); setEditId(null);
  };

  const submitForm = async e => {
    e.preventDefault();
    setLoading(true); setMessage(null);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (Array.isArray(val)) val.forEach(v => data.append(key, v));
        else data.append(key, val);
      });
      images.forEach(img => data.append('images', img));

      const url = editId 
        ? `http://localhost:5000/api/admin/products/${editId}` 
        : 'http://localhost:5000/api/admin/products';
      const res = await fetch(url, { method: editId ? 'PUT' : 'POST', body: data, credentials: 'include' });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Operation failed');

      setMessage({ type: 'success', text: editId ? 'Product updated' : 'Product created' });
      resetForm(); fetchProducts();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally { setLoading(false); }
  };

  const editProduct = p => {
    setEditId(p._id);
    setFormData({
      name: p.name, description: p.description, price: p.price, discount: p.discount || '',
      category: p.category, brand: p.brand || '', stock: p.stock, isFeatured: p.isFeatured || false,
      size: (p.size || []),   // 👈 convert array → string
    color: (p.color || [])
    });
    setImages([]);
  };

  const deleteProduct = async id => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/products/${id}`, { method: 'DELETE', credentials: 'include' });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Delete failed');
      setMessage({ type: 'success', text: 'Product deleted' });
      fetchProducts();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };


return (
  <div className="min-h-screen flex flex-col items-center m-6 bg-gradient-to-b from-gray-100 to-gray-50">
    <h1 className="text-4xl font-bold py-6 text-gray-800">CRUD Products</h1>

    {message && (
      <div className={`mb-4 p-3 rounded ${message.type==='success'?'bg-green-100 text-green-800':'bg-red-100 text-red-800'}`}>
        {message.text}
      </div>
    )}

    <div className="w-full max-w-6xl flex flex-col gap-6">
      <h2 className="text-xl font-semibold text-gray-700">{editId ? 'Edit Product' : 'Create Product'}</h2>

      {/* Form */}
     {/* Form */}
<div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
  <form onSubmit={submitForm} className="space-y-4">
    <input
      className="w-full p-3 rounded-lg border  border-blue-400 bg-gray-800/10 text-black placeholder-green-600 focus:ring-2 focus:ring-blue-400"
      type="text"
      name="name"
      placeholder="Name"
      value={formData.name}
      onChange={handleChange}
      required
    />
    <textarea
      className="w-full p-3 rounded-lg border  border-blue-400 bg-gray-800/10 text-black placeholder-green-600 focus:ring-2 focus:ring-blue-400"
      name="description"
      placeholder="Description"
      value={formData.description}
      onChange={handleChange}
      required
    />
    <input
      className="w-full p-3 rounded-lg border  border-blue-400 bg-gray-800/10 text-black placeholder-green-600 focus:ring-2 focus:ring-blue-400"
      type="number"
      name="price"
      placeholder="Price"
      value={formData.price}
      onChange={handleChange}
      required
    />
    <input
      className="w-full p-3 rounded-lg border border-white/30 bg-gray-800/30 text-gray-100 placeholder-black focus:ring-2 focus:ring-blue-400"
      type="number"
      name="discount"
      placeholder="Discount %"
      value={formData.discount}
      onChange={handleChange}
    />
    <input
      className="w-full p-3 rounded-lg border border-blue-400 bg-gray-800/10 text-black placeholder-green-600 focus:ring-2 focus:ring-blue-400"
      type="text"
      name="category"
      placeholder="Category"
      value={formData.category}
      onChange={handleChange}
      required
    />

<div className="relative">
  <input
    type="text"
    value={formData.brand}
    onChange={handleChange}
    name="brand"
    placeholder="Select or type brand"
    className="w-full p-3 placeholder-black rounded-lg border border-white/30 bg-gray-800/30 text-black focus:ring-2 focus:ring-blue-400"
    onFocus={() => setDropdownOpen(true)}   // 👈 show on focus
    onBlur={() => setTimeout(() => setDropdownOpen(false), 150)} // 👈 hide after blur
  />

  {dropdownOpen && formData.brand && (   // 👈 only show when open
    <ul className="absolute z-10 w-full max-h-40 overflow-auto bg-gray-900/80 text-white rounded-lg mt-1 shadow-lg">
      {availableOptions.brands
        .filter((b) => b.toLowerCase().includes(formData.brand.toLowerCase()))
        .map((b) => (
          <li
            key={b}
            className="p-2 cursor-pointer hover:bg-blue-600"
            onClick={() => {
              setFormData({ ...formData, brand: b });
              setDropdownOpen(false); // 👈 close after select
            }}
          >
            {b}
          </li>
        ))}
    </ul>
  )}
</div>

    <input
      className="w-full p-3 rounded-lg border border-white/30 bg-gray-800/30 text-black placeholder-black focus:ring-2 focus:ring-blue-400"
      type="number"
      name="stock"
      placeholder="Stock > 0"
      value={formData.stock}
      onChange={handleChange}
      required
    />
{/* Sizes */}
{/* Sizes */}
<input
  className="w-full p-3 rounded-lg border border-white/30 bg-gray-800/20 
             text-black placeholder-blue-400 focus:ring-2 focus:ring-blue-400"
  type="text"
  name="size"
  placeholder={`Sizes (${availableOptions.sizes.join(", ")})`}
  value={sizeInput}
  onChange={(e) => {
    const value = e.target.value;
    setSizeInput(value);
    setFormData({
      ...formData,
      size: value.split(",").map((v) => v.trim()).filter(Boolean),
    });
  }}
/>

{/* Colors */}
<input
  className="w-full p-3 rounded-lg border border-white/30 bg-gray-800/20 
             text-black placeholder-blue-400 focus:ring-2 focus:ring-blue-400"
  type="text"
  name="color"
  placeholder={`Colors (${availableOptions.colors.join(", ")})`}
  value={colorInput}
  onChange={(e) => {
    const value = e.target.value;
    setColorInput(value);
    setFormData({
      ...formData,
      color: value.split(",").map((v) => v.trim()).filter(Boolean),
    });
  }}
/>



    <div className="flex items-center space-x-3">
      <input  type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 accent-white focus:ring-2 focus:ring-blue" />
      <label className=" font-medium flex items-center gap-2"><FaStar className="text-yellow-400" /> Featured ?</label>
    </div>

    <input
      className="w-full p-3 rounded-lg border border-white/30 bg-gray-800/30 text-gray-100 placeholder-gray-300 cursor-pointer focus:ring-2 focus:ring-blue-400"
      type="file"
      multiple
      accept="image/*"
      onChange={handleImageChange}
    />

    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 transition"
    >
      {loading ? 'Processing...' : editId ? 'Update Product' : 'Create Product'}
    </button>

    {editId && (
      <button
        type="button"
        onClick={resetForm}
        className="w-full py-3 bg-gray-700 text-gray-100 font-semibold rounded-xl shadow-md hover:bg-gray-600 transition"
      >
        Cancel Edit
      </button>
    )}
  </form>
</div>

      {/* Product List */}
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl overflow-x-auto border border-white/20">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Products</h2>
        {loading ? <p className="text-gray-600">Loading...</p> :
          <table className="min-w-full border-collapse border border-gray-200 text-gray-800">
            <thead className="bg-white/20 backdrop-blur-md text-blue-800">
              <tr>
                {['Name','Category','Brand','Price','Discount','Stock','Sizes','Colors','Featured','Actions'].map(h => <th key={h} className="p-3 border text-left">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} className="hover:bg-white/20 transition-all">
                  <td className="p-2 border">{p.name}</td>
                  <td className="p-2 border">{p.category}</td>
                  <td className="p-2 border">{p.brand}</td>
                  <td className="p-2 border">${p.price}</td>
                  <td className="p-2 border">{p.discount || 0}%</td>
                  <td className="p-2 border">{p.stock}</td>
                  <td className="p-2 border">{p.size?.join(', ')}</td>
                  <td className="p-2 border">{p.color?.join(', ')}</td>
                  <td className="p-2 border flex items-center gap-1">{p.isFeatured && <FaStar className="text-yellow-400" />}{p.isFeatured ? 'Yes' : 'No'}</td>
                  <td className="p-2 border space-x-2 flex items-center">
                    <button onClick={() => editProduct(p)} className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"><FaEdit /> Edit</button>
                    <button onClick={() => deleteProduct(p._id)} className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"><FaTrash /> Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </div>
  </div>
);


};

export default AdminProducts;
