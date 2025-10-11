import mongoose, { Schema } from "mongoose";
import { Icategory } from "./category.interface";
const categorySchema =new Schema<Icategory>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const categoryModel = mongoose.model("category", categorySchema);
