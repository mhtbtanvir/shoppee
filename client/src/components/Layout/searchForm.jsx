import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const SearchForm = ({ className }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setQuery("");
    }
  };

  return (
    
    <form
      onSubmit={handleSubmit}
      className={`bg-gray-200 rounded-xl flex items-center border ${className}`}
    >
      <CiSearch className="mx-3 h-4 w-4" />
      <input
        type="search"
        placeholder="Search Products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 outline-none bg-gray-200"
      />
      <button
        type="submit"
        className="ml-auto py-1 text-white  h-full items-center bg-gray-500/50 px-4 rounded-l-none rounded-r-xl"
      >
        Search
      </button>
    </form>
  );
};

export default SearchForm;
