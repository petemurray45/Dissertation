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

export const addNote = async (req, res) => {
  console.log("POST /notes hit");
  const { property_id, content } = req.body;
  const user_id = req.user.id;

  if (!user_id || !property_id || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await sql`INSERT INTO notes (user_id, property_id, content) VALUES (${user_id}, ${property_id}, ${content})`;
    res.status(201).json({ success: true });
  } catch (err) {
    console.log("Error adding note", err);
    return res.status(500).json({ error: "Failed to add note" });
  }
};

export const getNotes = async (req, res) => {
  const { user_id, property_id } = req.params;

  try {
    const result =
      await sql`SELECT * FROM notes WHERE user_id = ${user_id} AND property_id = ${property_id}`;
    console.log(result);
    res.json(result);
  } catch (err) {
    console.error("Error getting notes", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
};

export const getAllNotes = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await sql`
      SELECT 
        n.id,
        n.content,
        n.property_id,
        p.location,
        n.created_at
      FROM notes n
      LEFT JOIN properties p
        ON n.property_id = p.id
      WHERE n.user_id = ${user_id}
      ORDER BY n.created_at
    `;
    console.log("Notes result", result);
    res.json(result);
  } catch (err) {
    console.error("Error getting all notes", err);
    res.status(500).json({ error: "Failed to fetch all notes" });
  }
};

export const deleteNote = async (req, res) => {
  const { note_id } = req.params;

  try {
    await sql`DELETE FROM notes WHERE id = ${note_id}`;
    res.json({ success: true, message: "Note deleted" });
  } catch (err) {
    console.log("Error deleting note", err);
    res.status(500).json({ error: "Failed to delete note" });
  }
};

export const updateProfile = async (req, res) => {
  const { id } = req.params;
  let { full_name, email, password, photoUrl } = req.body;

  let hashed = null;
  if (password) hashed = await bcrypt.hash(password, 10);

  const result = await sql`
    UPDATE users SET
      full_name     = COALESCE(${full_name}, full_name),
      email         = COALESCE(${email}, email),
      photo_url     = COALESCE(${photoUrl}, photo_url),
      password_hash = COALESCE(${hashed}, password_hash)
    WHERE id = ${id}
    RETURNING id, full_name, email, photo_url
  `;

  res.json({ user: result[0] });
};
