const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "assesmentdb",
});

app.get("/events", async (req, res) => {
  const { title, location, from, to, status } = req.query;
  let query = "SELECT * FROM events WHERE 1=1";
  const params = [];

  if (title) {
    query += " AND title LIKE ?";
    params.push(`%${title}%`);
  }
  if (location) {
    query += " AND location LIKE ?";
    params.push(`%${location}%`);
  }
  if (from && to) {
    query += " AND datetime BETWEEN ? AND ?";
    params.push(from, to);
  }
  if (status && status !== "all") {
    query += " AND status = ?";
    params.push(status);
  }

  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/events", async (req, res) => {
  const { title, datetime, location, description, status } = req.body;

  if (!title || !datetime || !location) {
    return res
      .status(400)
      .json({ error: "Required fields: title, datetime, location" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO events (title, datetime, location, description, status) VALUES (?, ?, ?, ?, ?)",
      [title, datetime, location, description, status || "upcoming"]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/events/:id", async (req, res) => {
  const { title, datetime, location, description, status } = req.body;
  const { id } = req.params;

  try {
    await db.query(
      "UPDATE events SET title = ?, datetime = ?, location = ?, description = ?, status = ? WHERE id = ?",
      [title, datetime, location, description, status, id]
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/events/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM events WHERE id = ?", [id]);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  try {
    const [existing] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "Username already exists." });
    }

    await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      password,
    ]);
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await db.query(
      "SELECT * FROM users WHERE username = ? AND password = ?",
      [username, password]
    );
    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json({
      message: "Login successful",
      user: { id: users[0].id, username: users[0].username },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
