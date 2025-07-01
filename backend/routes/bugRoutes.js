const express = require("express");
const Bug = require("../models/Bug");
const User = require("../models/User");  
const authMiddleware = require("../middleware/authMiddleware");
const mongoose = require("mongoose");


const router = express.Router();

// Create a Bug (Only Testers can create)
router.post("/", authMiddleware, async (req, res) => {
    
    const title = req.body.title;
    const description = req.body.description;

  if (req.user.role !== "tester") {
    return res.status(403).json({ message: "Only testers can create bugs" });
  }

  try {
    const newBug = new Bug({
      title,
      description,
      createdBy: req.user.userId,
    });

    await newBug.save();
    res.status(201).json(newBug);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get All Bugs (Anyone can view)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bugs = await Bug.find().populate("createdBy", "name").populate("assignedTo", "name");
    res.json(bugs);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

//Assign bug to a developer
router.put("/:id/assign", authMiddleware, async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied" });
    }

    const { assignedTo } = req.body; // Email from frontend
    const bugId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(bugId)) {
        return res.status(400).json({ message: "Invalid bug ID" });
    }

    try {
        // Find the developer's ObjectId using email
        const developer = await User.findOne({ email: assignedTo });

        if (!developer) {
            return res.status(404).json({ message: "Developer not found" });
        }

        // Assign the found ObjectId instead of email
        const updatedBug = await Bug.findByIdAndUpdate(
            bugId,
            { assignedTo: developer._id }, 
            { new: true }
        );

        if (!updatedBug) {
            return res.status(404).json({ message: "Bug not found" });
        }

        res.json(updatedBug);
    } catch (err) {
        console.error("Error assigning bug:", err);
        res.status(500).json({ message: "Error assigning bug" });
    }
});

// Update Bug Status (Only Developers can change status)
router.put("/:bugId/status", authMiddleware, async (req, res) => {
  if (req.user.role !== "developer") {
    return res.status(403).json({ message: "Only developers can update status" });
  }

  const { status } = req.body;
  try {
    const bug = await Bug.findByIdAndUpdate(req.params.bugId, { status }, { new: true });
    res.json(bug);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
  }

  try {
      await Bug.findByIdAndDelete(req.params.id);
      res.json({ message: "Bug deleted successfully" });
  } catch (err) {
      res.status(500).json({ message: "Error deleting bug" });
  }
});


module.exports = router;