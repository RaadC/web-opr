import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import connectDB from "./config/db.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import excelRoutes from "./routes/excelRoutes.js";
import suggestRoutes from "./routes/suggestRoutes.js";
import signatoryRoutes from "./routes/signatoryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}

app.use(express.json());

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use("/api/departments", departmentRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/purchase-request", purchaseRoutes);
app.use("/api/purchase-request", excelRoutes);
app.use("/api/suggest", suggestRoutes);
app.use("/api/signatory", signatoryRoutes);
app.use("/api/admin", adminRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB(); //do not start server if DB fails

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
