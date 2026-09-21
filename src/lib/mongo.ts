import "server-only";
import { MongoClient, type Db } from "mongodb";

declare global {
  var _fanclubMongo: Promise<MongoClient> | undefined;
}

export function mongoConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

/** One shared client per server process (and across dev hot reloads). */
export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  console.log(uri)
  if (!uri) throw new Error("MONGODB_URI is not set");
  globalThis._fanclubMongo ??= new MongoClient(uri).connect();
  const client = await globalThis._fanclubMongo;
  return client.db(process.env.MONGODB_DB || "fanclub");
}
