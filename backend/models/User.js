const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["tester", "developer", "admin"], default: "tester" },
});

module.exports = mongoose.model("User", userSchema);
