import express from "express";
import Suggest from "../models/suggest.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, suggestion } = req.body;

    if (!name || !suggestion) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const newSuggest = new Suggest({
      name,
      suggestion,
    });

    const savedSuggest = await newSuggest.save();
    res.status(201).json(savedSuggest);
  } catch (error) {
    console.error("Error saving suggestion:", error);
    res.status(500).json({
      message: "Server error while saving suggestion",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const suggestions = await Suggest.find().sort({ createdAt: -1 });
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({
      message: "Server error while fetching suggestions",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Suggest.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Suggestion not found",
      });
    }

    res.json({
      message: "Suggestion deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting suggestion:", error);
    res.status(500).json({
      message: "Server error while deleting suggestion",
    });
  }
});

router.delete("/", async (req, res) => {
  try {
    await Suggest.deleteMany({});
    res.json({
      message: "All suggestions deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting all suggestions:", error);
    res.status(500).json({
      message: "Server error while deleting suggestions",
    });
  }
});

export default router;
