import "server-only";
import mongoose, { type Mongoose } from "mongoose";

function getMongoDbUri(): string {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable.");
  }

  return uri;
}

const mongodbUri = getMongoDbUri();

interface MongooseCache {
  connection: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Keep the cache on globalThis so Fast Refresh reuses the existing connection.
const globalWithMongoose = globalThis as typeof globalThis & {
  mongoose?: MongooseCache;
};

const cache = (globalWithMongoose.mongoose ??= {
  connection: null,
  promise: null,
});

/** Connect to MongoDB once and reuse the established Mongoose connection. */
export async function connectToDatabase(): Promise<Mongoose> {
  if (cache.connection) {
    return cache.connection;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(mongodbUri, {
      bufferCommands: false,
    });
  }

  try {
    cache.connection = await cache.promise;
  } catch (error: unknown) {
    // Allow a later request to retry if the initial connection attempt fails.
    cache.promise = null;
    throw error;
  }

  return cache.connection;
}

export default connectToDatabase;
