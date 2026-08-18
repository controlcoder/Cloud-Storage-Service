import { createClient } from "redis";

const redis = createClient();

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