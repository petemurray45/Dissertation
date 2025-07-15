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
