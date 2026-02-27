import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  name: String,
  designation: String,
  department: String,
  purpose: String,

  items: [
    {
      name: String,
      price: Number,
      unit: String,
      quantity: Number,
    },
  ],

  totalAmount: Number,
  signatory: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Purchase", purchaseSchema);
