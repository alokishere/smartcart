import { timeStamp } from "console";
import mongoose from "mongoose";

interface IOder {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: [
    {
      grocery: mongoose.Types.ObjectId;
      name: string;
      price: string;
      image: string;
      category: string;
      unit: string;
      quantity: Number;
    },
  ];
  totalAmount: string;
  paymentMethod: "cod" | "online";
  address: {
    fullname: string;
    city: string;
    mobile: string;
    pincode: string;
    state: string;
    fullAddress: string;
    latitude: number;
    longitude: number;
  };
  status: "pending" | "out for delivery" | "delivered" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

const oderschema = new mongoose.Schema<IOder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        grocery: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Grocery",
          required:true
        },
        name: { type: String},
        price: { type: String},
        image: { type: String },
        category: { type: String},
        unit: { type: String },
        quantity: { type: Number,required: true },
      },
    ],
    totalAmount: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum:["cod","online"],
      default: 'cod',
    },
     address: {
    fullname: { type: String},
    city: { type: String},
    mobile: { type: String},
    pincode: { type: String},
    state: { type: String},
    fullAddress: { type: String},
    latitude: {type:Number},
    longitude: {type:Number},
  },
    status: {
      type: String,
      enum:["pending", "out for delivery", "delivered", "cancelled"],
      default: 'pending',
    },
  },
  { timestamps: true },
);

const Order = mongoose.models.Order || mongoose.model("Order", oderschema);
export default Order;