import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import mongoose from "mongoose";


interface IGrocery {
  _id?: mongoose.Types.ObjectId;
  name: string;
  price: string;
  image: string;
  category: string;
  quantity:number;
  unit: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ICartSlice{
    cartData : IGrocery[]
}

const initialState:ICartSlice = {
    cartData : []
}

const cartSlice = createSlice({
    name:"cart",
    initialState,
    reducers:{
        addToCart:(state,action)=>{
            state.cartData.push(action.payload)
        },
        increaseCartQuantity:(state,action:PayloadAction<mongoose.Types.ObjectId>)=>{
            const item = state.cartData.find((item)=>item._id == action.payload)
            if(item){
                item.quantity += 1
            }
        },  
        decreaseCartQuantity:(state,action:PayloadAction<mongoose.Types.ObjectId>)=>{
            const item = state.cartData.find((item)=>item._id == action.payload)
            if(item && item.quantity > 1){
                item.quantity -= 1
            }
        },
        removeCartItem:(state,action:PayloadAction<mongoose.Types.ObjectId>) => {
          state.cartData = state.cartData.filter((item) => item._id !== action.payload);
        },

    }

})

export const {addToCart,increaseCartQuantity,decreaseCartQuantity,removeCartItem} = cartSlice.actions
export default cartSlice.reducer