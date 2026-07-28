import mongoose from "mongoose";

const PendingUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-delete expired pending users
PendingUserSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.PendingUser ||
  mongoose.model("PendingUser", PendingUserSchema);