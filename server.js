const path = require("path");
const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const port = Number(process.env.APP_PORT || 4173);

const mongoUri = process.env.MONGO_URI || "mongodb://root:root@127.0.0.1:27017/ui_playwright_tests?authSource=admin";
const dbName = process.env.DB_NAME || "ui_playwright_tests";

let client;
let db;

async function connectDatabase() {
  client = new MongoClient(mongoUri);
  await client.connect();
  db = client.db(dbName);
}

async function ensureSchema() {
  const collection = db.collection("greetings");
  // Create index on created_at for sorting
  await collection.createIndex({ created_at: -1 });
}

async function waitForDatabase(maxAttempts = 20, delayMs = 1500) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await connectDatabase();
      return;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError || new Error("Database did not become ready in time");
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "demo-app")));

app.get("/api/health", async (_req, res) => {
  try {
    await db.admin().ping();
    res.status(200).json({ status: "ok", db: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", db: "disconnected", message: error.message });
  }
});

app.post("/api/greet", async (req, res) => {
  const nameInput = (req.body?.name || "").toString().trim();
  const resolvedName = nameInput || "Guest";
  const greeting = `Hello, ${resolvedName}!`;

  try {
    const collection = db.collection("greetings");
    const result = await collection.insertOne({
      name_input: nameInput,
      resolved_name: resolvedName,
      greeting_text: greeting,
      created_at: new Date()
    });

    res.status(201).json({
      id: result.insertedId.toString(),
      greeting,
      resolvedName
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to save greeting", detail: error.message });
  }
});

app.get("/api/greetings/latest", async (_req, res) => {
  try {
    const collection = db.collection("greetings");
    const greeting = await collection
      .find({})
      .sort({ created_at: -1 })
      .limit(1)
      .toArray();

    if (!greeting || greeting.length === 0) {
      return res.status(404).json({ message: "No greetings found" });
    }

    return res.status(200).json({
      id: greeting[0]._id.toString(),
      name_input: greeting[0].name_input,
      resolved_name: greeting[0].resolved_name,
      greeting_text: greeting[0].greeting_text,
      created_at: greeting[0].created_at
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch latest greeting", detail: error.message });
  }
});

async function startServer() {
  try {
    await waitForDatabase();
    await ensureSchema();
    app.listen(port, () => {
      console.log(`UI + API server running on http://127.0.0.1:${port}`);
    });
  } catch (error) {
    console.error("Could not start server:", error.message);
    process.exit(1);
  }
}

startServer();
