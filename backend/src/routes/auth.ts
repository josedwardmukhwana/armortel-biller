import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";
import { requireAuth } from "../middleware/auth.js";
import { UserModel } from "../models/User.js";
import { roles } from "../types/roles.js";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2),
  role: z.enum(roles).default("user")
});

function publicUser(user: { _id: unknown; name: string; email: string; role: string }) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role
  };
}

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid login details" });
  }

  const user = await UserModel.findOne({ email: parsed.data.email, active: true });

  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ sub: String(user._id), role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
  });

  return res.json({ token, user: publicUser(user) });
});

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid registration details" });
  }

  const exists = await UserModel.exists({ email: parsed.data.email });

  if (exists) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await UserModel.create({ ...parsed.data, passwordHash });

  return res.status(201).json({ user: publicUser(user) });
});

router.get("/me", requireAuth, async (req, res) => {
  const user = await UserModel.findById(req.auth?.userId).select("name email role");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ user: publicUser(user) });
});

export default router;
