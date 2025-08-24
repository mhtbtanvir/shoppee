import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, decreaseQuantity, addToCart, clearCart } from "@/store/cart-slice";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { selectAuth } from "../../store/auth-slice";


const CartPage = () => {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated} = useSelector(selectAuth); // 👈 from Redux
  
const handleCheckout = () => {
  if (isAuthenticated) {
    navigate("/cart/checkout");
  } else {
    navigate("/auth/login");
  }
};


  return (
            <div className="m-6 border-2 border-gray-500/30 shadow-xl p-6">

    <div className="max-w-5xl mx-auto p-6">
          <button
        onClick={() => navigate(-1)}
        className="flex my-8 items-center gap-2 text-gray-700 hover:text-gray-900 mb-6"
      >
        <IoArrowBackOutline className="w-6 h-6" />
        <span className="font-medium">Back to Products</span>
      </button>
      <h2 className="text-4xl font-bold mb-8 text-gray-900">Your Cart</h2>

      {items.length === 0 ? (
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-6">
            {items.map((item) => (
              <li
                key={item.productId}
                className="flex flex-col md:flex-row items-center justify-between bg-white shadow-lg rounded-xl p-4 hover:shadow-2xl transition-shadow duration-300"
              >
                {/* Image + Details */}
                <div className="flex items-center gap-4 w-full md:w-2/3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg shadow-sm"
                  />
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ${item.price} × {item.quantity}
                    </p>
                    {/* Color & Size */}
                    {item.color && (
                      <span className="text-xs text-gray-700">
                        Color: <span className="font-medium">{item.color}</span>
                      </span>
                    )}
                    {item.size && (
                      <span className="text-xs text-gray-700">
                        Size: <span className="font-medium">{item.size}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 mt-4 md:mt-0">
                  <button
                    onClick={() => dispatch(decreaseQuantity(item.productId))}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200 transition"
                  >
                    -
                  </button>
                  <span className="text-gray-900 font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(addToCart(item))}
                    className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200 transition"
                  >
                    +
                  </button>
                  <button
                    onClick={() => dispatch(removeFromCart(item.productId))}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Cart Summary */}
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-2xl font-bold text-gray-900">
              Total: ${totalAmount.toFixed(2)}
            </span>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => dispatch(clearCart())}
                className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 shadow-md transition"
              >
                Clear Cart
              </button>

              <button
                onClick={handleCheckout}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-5 py-2 rounded-lg shadow-md flex items-center gap-2 hover:from-yellow-500 hover:to-yellow-600 transition"
              >
                 <ShoppingBag className="w-5 h-5" />

                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
    </div>
  );
};

export default CartPage;
