import express from "express";
import Purchase from "../models/purchase.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const purchase = new Purchase(req.body);
    const saved = await purchase.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: "Error saving purchase" });
  }
});

router.get("/", async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ createdAt: -1 });
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: "Error fetching purchases" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Purchase.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.status(200).json({ message: "Purchase deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting purchase" });
  }
});

router.delete("/", async (req, res) => {
  try {
    await Purchase.deleteMany({});
    res.status(200).json({ message: "All purchases deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting all purchases" });
  }
});

export default router;
