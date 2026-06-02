import Grocery from "@/models/grocery.model";
import uploadOnCloudinary from "@/lib/claudinary";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { auth } from "@/auth";

export async function POST (req:Request) {
    try {
       await dbConnect()
       const session = await auth()
       if(!session || session.user?.role !== "admin"){
        return NextResponse.json({message: "You are not authorized to perform this action." }, {status: 400});
       }
    const formData = await req.formData()
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const file = formData.get("image") as Blob | null;
    const category = formData.get("category") as string; 
    const unit = formData.get("unit") as string;
    if (!name || !price || !file || !category || !unit) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }
    const imageUrl = await uploadOnCloudinary(file);
    if (!imageUrl) {
      return NextResponse.json({ message: "Failed to upload image" }, { status: 500 });
    }
    const grocery = await Grocery.create({name, price, image: imageUrl, category, unit});
    return NextResponse.json({success: true, message: "Grocery added successfully" ,status: 200, data: grocery});
    } catch (error: any) {
        return NextResponse.json({success: false, message: "Failed to add grocery" ,status: 500, error: error.message});
    }
}
