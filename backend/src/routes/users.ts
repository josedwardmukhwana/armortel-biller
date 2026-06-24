import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { allowRoles, requireAuth } from "../middleware/auth.js";
import { UserModel } from "../models/User.js";
import { roles } from "../types/roles.js";

const router = Router();

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(roles)
});

router.use(requireAuth);

router.get("/", allowRoles("admin", "vendor"), async (_req, res) => {
  const users = await UserModel.find().select("name email role active createdAt").sort({ createdAt: -1 });
  return res.json({ users });
});

router.post("/", allowRoles("admin"), async (req, res) => {
  const parsed = createUserSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid user details" });
  }

  const exists = await UserModel.exists({ email: parsed.data.email });

  if (exists) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const user = await UserModel.create({ ...parsed.data, passwordHash });

  return res.status(201).json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active
    }
  });
});

export default router;
