require("dotenv").config(); // Load environment variables from .env
const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.hl8mn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the MongoDB server
    // await client.connect();

    // Access the desired database
    const database = client.db("Task-it-DB");
    const tasks = database.collection("Tasks");
    const users = database.collection("Users");
    const activity = database.collection("Activity");

    //** Adding a new Task
    app.post("/task", async (req, res) => {
      const task = req.body;
      const result = await tasks.insertOne(task);
      res.send(result);
    });

    app.get("/tasks/:uid", async (req, res) => {
      const uid = req.params.uid;
      const cursor = tasks.find({ uid: uid });
      const result = await cursor.toArray();
      res.send(result);
    });

    //** Adding a new User
    app.post("/users", async (req, res) => {
      console.log("hit");
      const user = req.body;
      const result = await users.insertOne(user);
      res.send(result);
    });
    // Example API route: Check server connection
    app.get("/", (req, res) => {
      res.send("Hello Worlds!");
    });

    // Add more API routes for database interaction here
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Start the server and connect to the database
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
