import { sql } from "../config/db.js";

export const checkLikes = async (req, res) => {
  const { userId, propertyId } = req.query;
  const result =
    await sql`SELECT 1 FROM likes WHERE user_id = ${userId} AND property_id = ${propertyId}`;

  res.json({ liked: result.rowCount > 0 });
};

export const addToLikes = async (req, res) => {
  const { propertyId } = req.body;
  const userId = req.user.id;

  try {
    const likedProperty =
      await sql`INSERT INTO likes (user_id, property_id, created_at) VALUES (${userId}, ${propertyId}, NOW())`;
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
    const res =
      await sql`SELECT property_id FROM likes WHERE user_id = ${userId}`;
    const liked = res.map((row) => row.property_id);

    return res.status(200).json({ liked });
  } catch (err) {
    console.error("Failed to get liked properties", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
