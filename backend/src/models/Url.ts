import mongoose, { Document, Schema } from "mongoose";

export interface IClick {
  timestamp: Date;
  ip?: string;
  userAgent?: string;
  referer?: string;
  country?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  browser?: string;
  os?: string;
  device?: string;
}

export interface IUrl extends Document {
  longUrl: string;
  shortUrl: string;
  userId: string;
  createdAt: Date;
  clicks: IClick[];
}

const clickSchema = new Schema<IClick>({
  timestamp: { type: Date, required: true },
  ip: String,
  userAgent: String,
  referer: String,
  country: String,
  city: String,
  latitude: Number,
  longitude: Number,
  browser: String,
  os: String,
  device: String,
});

const urlSchema = new Schema<IUrl>({
  longUrl: { type: String, required: true },
  shortUrl: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  clicks: [clickSchema],
});

export const Url = mongoose.model<IUrl>("Url", urlSchema);
