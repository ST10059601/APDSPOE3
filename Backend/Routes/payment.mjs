// Routes/payment.mjs
import express from "express";
import db from "../db/conn.mjs";
import checkauth from "../check-auth.mjs";

const router = express.Router();

router.post("/request", checkauth, async (req, res) => {
  const { amount, currency, provider, recipientAccount, swiftCode } = req.body;
  if (!amount || !currency || !provider || !recipientAccount || !swiftCode) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const paymentRequest = {
      amount,
      currency,
      provider,
      recipientAccount,
      swiftCode,
      requestedBy: req.userData.userId,
      status: "pending",
      createdAt: new Date(),
    };

    const collection = await db.collection("paymentRequests");
    const result = await collection.insertOne(paymentRequest);

    res.status(201).json({
      message: "Payment request submitted successfully",
      requestId: result.insertedId,
    });
  } catch (error) {
    console.error("Payment request error:", error);
    res.status(500).json({ message: "Payment request failed" });
  }
});

router.get("/notifications", checkauth, async (req, res) => {
  try {
    const collection = await db.collection("notifications");
    const notifications = await collection
      .find({ userId: req.userData.userId })
      .sort({ createdAt: -1 }) 
      .toArray();

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Error fetching notifications" });
  }
});

router.put("/notifications/mark-read", checkauth, async (req, res) => {
  try {
    const collection = await db.collection("notifications");
    const result = await collection.updateMany(
      { userId: req.userData.userId, read: false }, // Find unread notifications for the user
      { $set: { read: true } } // Set them as read
    );

    res.status(200).json({
      message: "Notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error marking notifications as read" });
  }
});

export default router;
