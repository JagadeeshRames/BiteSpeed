import express, { Request, Response } from "express";
import sqlite3 from "sqlite3";
import bodyParser from "body-parser";

const app = express();
const port = 8000;
// Database setup
const db = new sqlite3.Database("database/db.sqlite", (err) => {
  if (err) {
    console.error("Error opening database");
    return;
  }
  console.log("Connected to SQLite database");
});

// Create a table to store records (You can customize this schema according to your requirements)
db.run(`
    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL
    )
  `);

// Middleware for parsing incoming JSON data
app.use(bodyParser.json());

// Create a POST endpoint to store records
app.post("/biteSpeed/identity", (req: Request, res: Response) => {
  const { name, age } = req.body;

  if (!name || !age) {
    return res.status(400).json({ error: "Name and age are required" });
  }

  db.run(
    "INSERT INTO records (name, age) VALUES (?, ?)",
    [name, age],
    function (err) {
      if (err) {
        console.error("Error inserting record into the database", err);
        return res.status(500).json({ error: "Unable to store the record" });
      }

      res.json({ id: this.lastID, name, age });
    }
  );
});

// get Api for server check
app.get("/biteSpeed", (req: Request, res: Response) => {
  res.send("Hello, this is your backend server!");
});

// Create a GET endpoint to fetch all records
app.get("/biteSpeed/records", (req: Request, res: Response) => {
  db.all("SELECT * FROM records", (err, rows) => {
    if (err) {
      console.error("Error fetching records from the database", err);
      return res.status(500).json({ error: "Unable to fetch records" });
    }

    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
