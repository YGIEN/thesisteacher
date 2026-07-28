import mongoose from "mongoose";

const VerificationTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  token: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
});

VerificationTokenSchema.index({ email: 1, token: 1 });
VerificationTokenSchema.index(
  { expires: 1 },
  { expireAfterSeconds: 0 }
);

export default mongoose.models.VerificationToken ||
  mongoose.model("VerificationToken", VerificationTokenSchema);