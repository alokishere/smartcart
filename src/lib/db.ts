import mongoose from "mongoose";
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/smartcart";

if(!mongoURI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

let cached = global.mongoose 

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
    
const dbConnect = async () => {
  if (cached.conn) {
    return cached.conn;
  }
if (!cached.promise) {
    cached.promise = mongoose.connect(mongoURI).then((conn) => { 
        cached.conn = conn;
        return conn;
    })
}
try {
    const conn = await cached.promise;
    return conn;
} catch (error) {
    console.error("Error connecting to MongoDB:", error);
    cached.promise = null;
}
};

export default dbConnect;