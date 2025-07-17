import { sql } from "../config/db.js";

export const checkLikes = async (req, res) => {
  try {
    const { userId, propertyId } = req.query;

    if (!userId || !propertyId) {
      return res.status(400).json({ message: "Missing userId or propertyId" });
    }

    const result =
      await sql`SELECT 1 FROM likes WHERE user_id = ${userId} AND property_id = ${propertyId}`;
    console.log("liked?", result);
    res.json({ liked: result.length > 0 });
  } catch (err) {
    console.log("Error checking like", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addToLikes = async (req, res) => {
  const { propertyId } = req.body;
  const userId = req.user.id;

  try {
    const likedProperty =
      await sql`INSERT INTO likes (user_id, property_id, created_at) VALUES (${userId}, ${propertyId}, NOW()) ON CONFLICT (user_id, property_id) DO NOTHING`;
    return res.status(201).json({ message: "Property Liked" });
  } catch (err) {
    console.error("Failed to like property", err);
  }
};

export const getAllLikedProperties = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId in query" });
  }

  try {
    const result =
      await sql`SELECT property_id FROM likes WHERE user_id = ${userId}`;
    const liked = result.map((row) => row.property_id);

    return res.status(200).json({ liked });
  } catch (err) {
    console.error("Failed to get liked properties", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeLike = async (req, res) => {
  const { userId, propertyId } = req.query;

  try {
    await sql`DELETE FROM likes WHERE user_id = ${userId} AND property_id = ${propertyId}`;
    return res.status(200).json({ message: "Property Unliked" });
  } catch (err) {
    console.log("Failed to like property", err);
    return res.status(500).json({ message: "Failed to unlike" });
  }
};
