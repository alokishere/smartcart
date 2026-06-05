import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";

interface IGrocery {
  _id?: mongoose.Types.ObjectId;
  name: string;
  price: string;
  image: string;
  category: string;
  quantity: number;
  unit: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ICartSlice {
  cartData: IGrocery[];
  subTotal: number;
  deliveryFee: number;
  discount: number;
  finalTotal: number;
  // promoApplied:boolean,
}

const initialState: ICartSlice = {
  cartData: [],
  subTotal: 0,
  deliveryFee: 40,
  discount: 0,
  finalTotal: 40,
  // promoApplied:false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.cartData.push(action.payload);
      cartSlice.caseReducers.calculateTotal(state);
    },
    increaseCartQuantity: (
      state,
      action: PayloadAction<mongoose.Types.ObjectId>,
    ) => {
      const item = state.cartData.find((item) => item._id == action.payload);
      if (item) {
        item.quantity += 1;
      }
      cartSlice.caseReducers.calculateTotal(state);
    },
    decreaseCartQuantity: (
      state,
      action: PayloadAction<mongoose.Types.ObjectId>,
    ) => {
      const item = state.cartData.find((item) => item._id == action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
      cartSlice.caseReducers.calculateTotal(state);
    },
    removeCartItem: (state, action: PayloadAction<mongoose.Types.ObjectId>) => {
      state.cartData = state.cartData.filter(
        (item) => item._id !== action.payload,
      );
      cartSlice.caseReducers.calculateTotal(state);
    },
    calculateTotal: (state) => {
      state.subTotal = state.cartData.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0,
      );
      state.deliveryFee = state.subTotal > 500 ? 0 : 40;
      state.finalTotal = state.subTotal + state.deliveryFee - state.discount;
    },
  },
});

export const {
  addToCart,
  increaseCartQuantity,
  decreaseCartQuantity,
  removeCartItem,
  calculateTotal,
} = cartSlice.actions;
export default cartSlice.reducer;
