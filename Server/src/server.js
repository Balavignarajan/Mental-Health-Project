require("dotenv").config();
const { connectDb } = require("./config/db");
const { createApp } = require("./app");
const { cfg } = require("./config/config");

(async function startServer() {
  try {
    await connectDb(cfg.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.log("⚠️  MongoDB not available, running without database");
  }
  
  const app = await createApp();
  
  app.listen(cfg.PORT, () => {
    console.log(`✅ Server: http://localhost:${cfg.PORT}`);
    if (cfg.NODE_ENV === "development") {
      console.log(`🔥 Vite HMR ready`);
    }
  });
})().catch((startupErrorValue) => {
  console.error("❌ Startup error:", startupErrorValue);
  process.exit(1);
});
