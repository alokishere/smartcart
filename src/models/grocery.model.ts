import mongoose from "mongoose";

interface IGrocery {
  _id?: mongoose.Types.ObjectId;
  name: string;
  price: string;
  image: string;
  category: string;
  unit: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const grocerySchema = new mongoose.Schema<IGrocery>(
  {
    _id: { type: mongoose.Types.ObjectId },
    name: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Fruits & Vegetables",
        "Dairy & Eggs",
        "Rice, Atta & Grains",
        "Biscuits, Snacks & Chocolate",
        "Beverages",
        "Personal Care",
        "Household",
        "Instant & Packaged Food",
        "Baby & Pet Care",
        "Foods & Drinks"      
      ],
      required: true,
    },
    unit: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

const Grocery = mongoose.models.Grocery || mongoose.model<IGrocery>("Grocery", grocerySchema);
export default Grocery;
