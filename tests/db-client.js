const { MongoClient } = require("mongodb");

const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const dbName = process.env.DB_NAME || "ui_playwright_tests";

let client;
let db;

async function connect() {
  if (!client) {
    client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db(dbName);
  }
  return db;
}

async function clearGreetings() {
  const database = await connect();
  const collection = database.collection("greetings");
  await collection.deleteMany({});
}

async function getLatestGreeting() {
  const database = await connect();
  const collection = database.collection("greetings");
  const greeting = await collection
    .find({})
    .sort({ created_at: -1 })
    .limit(1)
    .toArray();
  
  return greeting[0] || null;
}

async function closePool() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

module.exports = {
  clearGreetings,
  getLatestGreeting,
  closePool
};
