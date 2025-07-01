require('dotenv').config({ path: './backend/.env' });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./db");

//Import multiple routes
const userRoutes = require("./routes/userRoutes");
const bugRoutes = require("./routes/bugRoutes");

const app = express();
app.use(express.json()); //To acsess Body of request
app.use(cors());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

//Route for running User Requests
app.use("/api/users", userRoutes);

//Route for running Bug Routes 
app.use("/api/bugs", bugRoutes);

//Test to check if server is working
app.get("/", (req, res) => {
  res.send("Bug Tracking System API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
