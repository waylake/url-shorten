import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI as string,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: false,
        tls: false,
        tlsAllowInvalidCertificates: true,
        serverSelectionTimeoutMS: 60000, // 타임아웃 시간 증가
      } as mongoose.ConnectOptions,
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
