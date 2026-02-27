import mongoose from "mongoose";

const signatorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Signatory = mongoose.model("Signatory", signatorySchema);

export default Signatory;
