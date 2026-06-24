import bcrypt from "bcryptjs";
import { connectDatabase } from "./config/db.js";
import { UserModel } from "./models/User.js";

const seedUsers = [
  { name: "Armortel Admin", email: "admin@armortel.local", password: "password123", role: "admin" },
  { name: "Vendor Desk", email: "vendor@armortel.local", password: "password123", role: "vendor" },
  { name: "Network User", email: "user@armortel.local", password: "password123", role: "user" }
] as const;

async function seed() {
  await connectDatabase();

  for (const user of seedUsers) {
    const passwordHash = await bcrypt.hash(user.password, 12);

    await UserModel.updateOne(
      { email: user.email },
      {
        $set: {
          name: user.name,
          email: user.email,
          role: user.role,
          passwordHash,
          active: true
        }
      },
      { upsert: true }
    );
  }

  console.log("Seeded Armortel users:");
  seedUsers.forEach((user) => console.log(`- ${user.email} / ${user.password} (${user.role})`));
  process.exit(0);
}

seed().catch((error) => {
  console.error("Failed to seed Armortel users", error);
  process.exit(1);
});
