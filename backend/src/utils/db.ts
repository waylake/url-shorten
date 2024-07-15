import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
mongoose.set("strictQuery", false);

export const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("Connected to MongoDB successfully");

    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
      // 연결이 끊어졌을 때 재연결 시도
      setTimeout(connectDB, 5000);
    });

    // 연결 상태 주기적 확인
    setInterval(() => {
      console.log(
        `MongoDB connection state: ${mongoose.connection.readyState}`,
      );
    }, 30000);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // 연결 실패 시 재시도
    console.log("Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

// 애플리케이션 종료 시 연결 종료
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed through app termination");
    process.exit(0);
  } catch (err) {
    console.error("Error closing MongoDB connection:", err);
    process.exit(1);
  }
});
