
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); 
        console.log("MongoDB connected...");

    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1); // Exit process if connection fails
    }
};

module.exports = connectDB;
