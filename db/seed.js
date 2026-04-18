const { MongoClient } = require("mongodb");

/**
 * MongoDB seed script for initializing the ui_playwright_tests database.
 * This script ensures the database and collection are created with proper indexes.
 * 
 * Usage: node db/seed.js
 * 
 * Environment variables:
 * - MONGO_URI: MongoDB connection string (default: mongodb://root:root@127.0.0.1:27017/ui_playwright_tests?authSource=admin)
 * - DB_NAME: Database name (default: ui_playwright_tests)
 */

require("dotenv").config();

const mongoUri = process.env.MONGO_URI || "mongodb://root:root@127.0.0.1:27017/ui_playwright_tests?authSource=admin";
const dbName = process.env.DB_NAME || "ui_playwright_tests";

async function seed() {
  let client;
  try {
    client = new MongoClient(mongoUri);
    await client.connect();
    
    const db = client.db(dbName);
    const collection = db.collection("greetings");
    
    console.log(`Connected to MongoDB: ${dbName}`);
    
    // Create index on created_at for sorting
    await collection.createIndex({ created_at: -1 });
    console.log("Created index on created_at");
    
    // Optional: Insert sample data
    const sampleGreetings = [
      {
        name_input: "Alice",
        resolved_name: "Alice",
        greeting_text: "Hello, Alice!",
        created_at: new Date()
      },
      {
        name_input: "",
        resolved_name: "Guest",
        greeting_text: "Hello, Guest!",
        created_at: new Date()
      }
    ];
    
    const result = await collection.insertMany(sampleGreetings);
    console.log(`Inserted ${result.insertedIds.length} sample documents`);
    
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error during database seeding:", error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

seed();
