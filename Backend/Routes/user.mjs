import express from "express";
import db from "../db/conn.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";
import { checkWhitelist } from "../utils/validation.mjs";

const router = express.Router();
const JWT_SECRET = "this_secret_should_be_longer_than_it_is";

// Brute-force protection setup
var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store, {
  freeRetries: 5,
  minWait: 1000 * 60,
  maxWait: 1000 * 60 * 15
});

// Register route (for customers)
router.post("/register", async (req, res) => {
  const { name, password } = req.body;
  const role = "customer"; // Default role for registration

  if (!checkWhitelist(name)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let newDocument = {
      name: name.trim(),
      password: hashedPassword,
      role: role
    };

    const collection = await db.collection("users");
    const result = await collection.insertOne(newDocument);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Signup failed" });
  }
});

// Login route with role-based token generation
router.post("/login", bruteforce.prevent, async (req, res) => {
  const { name, password } = req.body;

  if (!checkWhitelist(name)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const collection = await db.collection("users");
    const user = await collection.findOne({ name: name.trim() });

    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const token = jwt.sign(
      { userId: user._id, username: name, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Authentication successful",
      token: token,
      name: name,
      role: user.role
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

export default router;
