import dotenv from 'dotenv';
import mongoose from "mongoose"



dotenv.config();


const uri = process.env.MONGODB_URI;

export default function connectDB(){
  mongoose.connect(uri)
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection error:', err));
}
