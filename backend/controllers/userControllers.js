import { sql } from "../config/db.js";
import bcrypt from "bcrypt";

export const checkLikes = async (req, res) => {
  try {
    const { propertyId } = req.query;
    const uid = req.auth?.userId ?? req.auth?.id ?? null;
    if (!uid || !propertyId) {
      return res.status(400).json({ message: "Missing userId or propertyId" });
    }

    const result =
      await sql`SELECT 1 FROM likes WHERE user_id = ${uid} AND property_id = ${propertyId}`;
    console.log("liked?", result);
    res.status(200).json({ liked: result.length > 0 });
  } catch (err) {
    console.log("Error checking like", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addToLikes = async (req, res) => {
  const { propertyId } = req.body;
  const uid = req.auth?.userId ?? req.auth?.id ?? null;

  if (!uid || !propertyId) {
    return res.status(400).json({ error: "Missing userId or propertyId" });
  }

  try {
    const likedProperty =
      await sql`INSERT INTO likes (user_id, property_id, created_at) VALUES (${uid}, ${propertyId}, NOW()) ON CONFLICT (user_id, property_id) DO NOTHING`;
    return res.status(201).json({ message: "Property Liked" });
  } catch (err) {
    console.error("Failed to like property", err);
  }
};

export const getAllLikedProperties = async (req, res) => {
  const uid = req.auth?.userId ?? req.auth?.id ?? null;
  if (!uid) {
    return res.status(400).json({ error: "Unauthorized" });
  }

  try {
    const result =
      await sql`SELECT property_id FROM likes WHERE user_id = ${uid}`;
    const liked = result.map((row) => row.property_id);

    return res.status(200).json({ liked });
  } catch (err) {
    console.error("Failed to get liked properties", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeLike = async (req, res) => {
  const propertyId = req.body?.propertyId ?? req.query?.propertyId;
  const uid = req.auth?.userId ?? req.auth?.id ?? null;

  if (!uid || !propertyId) {
    return res.status(400).json({ error: "Missing userId or propertyId" });
  }

  try {
    await sql`DELETE FROM likes WHERE user_id = ${uid} AND property_id = ${propertyId}`;
    return res.status(200).json({ message: "Property Unliked" });
  } catch (err) {
    console.log("Failed to like property", err);
    return res.status(500).json({ message: "Failed to unlike" });
  }
};

export const addNote = async (req, res) => {
  const property_id =
    req.params.property_id ??
    req.params.propertyId ??
    req.body?.property_id ??
    req.body?.propertyId;

  const { content } = req.body ?? {};
  const uid = req.auth?.userId ?? req.auth?.id ?? null;

  if (!uid || !property_id || !content) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [note] = await sql`
      INSERT INTO notes (user_id, property_id, content)
      VALUES (${uid}, ${property_id}, ${content})
      RETURNING id, user_id, property_id, content, created_at
    `;
    return res.status(201).json({ note });
  } catch (err) {
    console.log("Error adding note", err);
    return res.status(500).json({ error: "Failed to add note" });
  }
};

export const getNotes = async (req, res) => {
  const property_id = req.params.property_id ?? req.params.propertyId;

  const uid = req.auth?.userId ?? req.auth?.id ?? null;

  if (!uid || !property_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const notes = await sql`
      SELECT id, user_id, property_id, content, created_at
      FROM notes
      WHERE user_id = ${uid} AND property_id = ${property_id}
      ORDER BY created_at
    `;
    return res.status(200).json({ notes });
  } catch (err) {
    console.error("Error getting notes", err);
    return res.status(500).json({ error: "Failed to fetch notes" });
  }
};

export const getAllNotes = async (req, res) => {
  const uid = req.auth?.userId ?? req.auth?.id ?? null;

  if (!uid) {
    return res.status(400).json({ error: "Missing required fields" });
  }

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
      WHERE n.user_id = ${uid}
      ORDER BY n.created_at
    `;
    console.log("Notes result", result);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error getting all notes", err);
    res.status(500).json({ error: "Failed to fetch all notes" });
  }
};

export const deleteNote = async (req, res) => {
  const { note_id } = req.params;
  const uid = req.auth?.userId ?? req.auth?.id ?? null;

  if (!uid) return res.status(401).json({ error: "Unauthorized" });

  try {
    const result = await sql`
      DELETE FROM notes 
      WHERE id = ${note_id} AND user_id = ${uid}
      RETURNING id
    `;

    if (result.length === 0) {
      return res.status(403).json({ error: "Forbidden" });
    }

    return res.status(200).json({ success: true, id: result[0].id });
  } catch (err) {
    console.log("Error deleting note", err);
    res.status(500).json({ error: "Failed to delete note" });
  }
};

export const updateProfile = async (req, res) => {
  const uid = req.auth?.userId ?? req.auth?.id ?? null;

  if (!uid) return res.status(401).json({ error: "Unauthorized" });

  const { full_name, email, password, photoUrl } = req.body ?? {};

  // reject empty payload
  const hasAnyField =
    full_name !== undefined ||
    email !== undefined ||
    password !== undefined ||
    photoUrl !== undefined;

  if (!hasAnyField) {
    return res.status(400).json({ error: "No fields to update" });
  }

  try {
    let hashed = null;
    if (password && password.trim()) {
      const salt = await bcrypt.genSalt(10);
      hashed = await bcrypt.hash(password, salt);
    }

    const [updated] = await sql`
      UPDATE users SET
        full_name     = COALESCE(${full_name}, full_name),
        email         = COALESCE(${email}, email),
        photo_url     = COALESCE(${photoUrl}, photo_url),  
        password_hash = COALESCE(${hashed}, password_hash)
      WHERE id = ${uid}
      RETURNING id, full_name, email, photo_url
    `;

    if (!updated) return res.status(404).json({ error: "User not found" });

    return res.status(200).json({ user: updated });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email already in use" });
    }
    console.error("updateProfile error:", err);
    return res.status(500).json({ error: "Failed to update profile" });
  }
};
