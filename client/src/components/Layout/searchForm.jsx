import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const SearchForm = ({ className }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/products?search=${query}`);

        // ✅ Fix: use res.data.products (not res.data directly)
        const products = res.data.products || [];
        setSuggestions(products);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 400); // debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setQuery("");
      setSuggestions([]);
    }
  };

  const handleSelect = (product) => {
    navigate(`/productsDetails/${product._id}`); // go to product details
    setQuery("");
    setSuggestions([]);
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Search Form */}
      <form
        onSubmit={handleSubmit}
        className={`flex w-full items-center border-b-2 border-gray-500/60 pb-1 ${className}`}
      >
        {/* Icon as submit button */}
        <button type="submit" className="mt-1 mr-2">
          <CiSearch className="h-5 w-5 text-black" />
        </button>

        {/* Input */}
        <input
          type="search"
          placeholder="Search ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 outline-none border-none bg-transparent"
        />
      </form>

      {/* Dropdown suggestions */}
      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0
         bg-white shadow-lg
          rounded-md mt-1 
          max-h-60 overflow-y-auto custom-scrollbar
           z-50 border border-gray-200">
          {suggestions.map((product) => (
            <li
              key={product._id}
              onClick={() => handleSelect(product)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {product.name || product.title}
            </li>
          ))}
        </ul>
      )}

      {/* Loading state */}
      {loading && (
        <div className="absolute left-0 right-0 bg-white shadow-md mt-1 p-2 text-sm text-gray-500 z-50">
          Searching...
        </div>
      )}
    </div>
  );
};

export default SearchForm;
