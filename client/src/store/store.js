import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/index.js";
import cartReducer from "./cart-slice/index.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,

  },
});

export default store;
