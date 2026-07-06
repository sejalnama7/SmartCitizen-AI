import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

/**
 * Establishes the MongoDB Atlas connection via Mongoose.
 *
 * Expects MONGODB_URI to be set in server/.env, e.g.:
 *   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/smartcitizen-ai?retryWrites=true&w=majority
 *
 * Call this once from server.js before the Express app starts listening.
 */
async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error(
      "[db] MONGODB_URI is not set. Add it to server/.env before starting the server."
    );
    process.exit(1);
  }

  mongoose.set("strictQuery", true);

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[db] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[db] MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }

  // Log unexpected connection issues after the initial connect succeeds.
  mongoose.connection.on("error", (error) => {
    console.error(`[db] MongoDB connection error: ${error.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("[db] MongoDB disconnected.");
  });

  // Close the connection cleanly on process termination (e.g. nodemon restarts, deploy shutdowns).
  const shutdown = async (signal) => {
    try {
      await mongoose.connection.close();
      console.log(`[db] MongoDB connection closed on ${signal}.`);
      process.exit(0);
    } catch (error) {
      console.error(`[db] Error while closing MongoDB connection: ${error.message}`);
      process.exit(1);
    }
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

export default connectDB;