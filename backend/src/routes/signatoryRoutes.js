import express from "express";
import Signatory from "../models/signatory.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const newSignatory = new Signatory({ name });
    const saved = await newSignatory.save();

    res.status(201).json(saved);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const signatories = await Signatory.find().sort({ createdAt: -1 });
    res.json(signatories);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const updated = await Signatory.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Signatory not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
