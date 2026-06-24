import bcrypt from "bcryptjs";
import mongoose, { HydratedDocument, InferSchemaType } from "mongoose";
import { roles } from "../types/roles.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: roles, default: "user", required: true },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function comparePassword(password: string) {
  return bcrypt.compare(password, this.passwordHash);
};

export type User = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<User> & {
  comparePassword(password: string): Promise<boolean>;
};

export const UserModel = mongoose.model<User>("User", userSchema);
