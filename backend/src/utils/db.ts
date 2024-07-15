import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
      },
    });

    // Send a ping to confirm a successful connection
    const adminDb = mongoose.connection.db.admin();
    await adminDb.ping();
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit();
  }
};

const closeConnection = async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
  } finally {
    process.exit(0);
  }
};

// Handle application termination
process.on("SIGINT", closeConnection);
process.on("SIGTERM", closeConnection);

export { connectDB };

// Immediately invoke connectDB if this is the main module
if (require.main === module) {
  connectDB().catch(console.dir);
}
