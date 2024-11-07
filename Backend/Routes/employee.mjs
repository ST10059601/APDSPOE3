// Routes/employee.mjs
import express from "express";
import db from "../db/conn.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import checkauth from "../check-auth.mjs";
import { checkWhitelist } from "../utils/validation.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();
const JWT_SECRET = "this_secret_should_be_longer_than_it_is";

// Employee login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!checkWhitelist(username)) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const collection = await db.collection("employees");
    const employee = await collection.findOne({ username: username.trim() });

    if (!employee) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const passwordMatch = await bcrypt.compare(password, employee.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const token = jwt.sign(
      { userId: employee._id, username: username, role: "employer" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Login successful", token, role: "employer" });
  } catch (error) {
    console.error("Employee login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

// Fetch all pending payments for verification with customer username
router.get("/payments", checkauth, async (req, res) => {
  if (req.userData.role !== "employer") return res.status(403).json({ message: "Forbidden" });

  try {
    const paymentRequests = await db.collection("paymentRequests").find({ status: "pending" }).toArray();

    // Get user details for each payment request
    const userIds = paymentRequests.map(payment => payment.requestedBy);
    const users = await db.collection("users").find({ _id: { $in: userIds.map(id => new ObjectId(id)) } }).toArray();

    // Map user data to payment requests
    const paymentsWithUsernames = paymentRequests.map(payment => {
      const user = users.find(user => user._id.toString() === payment.requestedBy.toString());
      return {
        ...payment,
        username: user ? user.name : "Unknown",
      };
    });

    res.status(200).json(paymentsWithUsernames);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payments" });
  }
});

// Verify a payment
router.put("/payments/verify/:id", checkauth, async (req, res) => {
  if (req.userData.role !== "employer") return res.status(403).json({ message: "Forbidden" });

  const paymentId = req.params.id;

  try {
    const paymentCollection = await db.collection("paymentRequests");
    const notificationCollection = await db.collection("notifications");

    const result = await paymentCollection.updateOne(
      { _id: new ObjectId(paymentId) },
      { $set: { status: "verified" } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Payment not found or already verified" });
    }

    const payment = await paymentCollection.findOne({ _id: new ObjectId(paymentId) });
    const notification = {
      userId: payment.requestedBy,
      message: `Your payment of ${payment.amount} ${payment.currency} has been verified.`,
      createdAt: new Date(),
      read: false,
    };
    await notificationCollection.insertOne(notification);

    res.status(200).json({ message: "Payment verified successfully" });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
});

// Reject a payment with notification
router.put("/payments/reject/:id", checkauth, async (req, res) => {
  if (req.userData.role !== "employer") return res.status(403).json({ message: "Forbidden" });

  const paymentId = req.params.id;

  try {
    const paymentCollection = await db.collection("paymentRequests");
    const notificationCollection = await db.collection("notifications");

    const result = await paymentCollection.updateOne(
      { _id: new ObjectId(paymentId) },
      { $set: { status: "rejected" } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Payment not found or already rejected" });
    }

    const payment = await paymentCollection.findOne({ _id: new ObjectId(paymentId) });
    const notification = {
      userId: payment.requestedBy,
      message: `Your payment of ${payment.amount} ${payment.currency} has been rejected.`,
      createdAt: new Date(),
      read: false,
    };
    await notificationCollection.insertOne(notification);

    res.status(200).json({ message: "Payment rejected successfully" });
  } catch (error) {
    console.error("Payment rejection error:", error);
    res.status(500).json({ message: "Payment rejection failed" });
  }
});

export default router;
