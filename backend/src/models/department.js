import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Department", departmentSchema);
