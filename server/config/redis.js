import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        console.log("Redis: Max retries reached");
        return false;
      }

      console.log(`Redis: Retry attempt ${retries}`);

      return Math.min(retries * 100, 3000);
    },
  },
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});

redis.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

export async function connectRedis() {
  try {
    await redis.connect();
  } catch (err) {
    console.error("Failed to connect Redis:", err.message);
  }
}

export default redis;