import { env } from "./config/env.js";
import { connectDatabase } from "./config/db.js";
import { createApp } from "./app.js";

async function bootstrap() {
  await connectDatabase();

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`Armortel API running on port ${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start Armortel API", error);
  process.exit(1);
});
