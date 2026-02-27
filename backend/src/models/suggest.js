import mongoose from "mongoose";

const suggestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    suggestion: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Suggest = mongoose.model("Suggest", suggestSchema);

export default Suggest;
