import { useDispatch } from "react-redux";
import { useState } from "react";
import { addToCart } from "@/store/cart-slice";

const AddToCartButton = ({ product, selectedColor, selectedSize }) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: product.discountPrice || product.price,
        image: product.images[0]?.url || "",
        color: selectedColor || null,
        size: selectedSize || null,
      })
    );

    // toggle state for feedback
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`w-full py-2 rounded-lg font-semibold shadow transition-all duration-300 ${
        added
          ? "bg-green-500 text-white"
          : "bg-yellow-500 text-white hover:bg-yellow-600"
      }`}
    >
      {added ? "✓ Added to Cart" : "Add to Cart"}
    </button>
  );
};

export default AddToCartButton;
