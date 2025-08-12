import { sql } from "../config/db.js";
import axios from "axios";
import dotenv from "dotenv";
import { sendEnquiryConfirmation } from "../utils/sendEmail.js";

dotenv.config();

const GEOCODE_BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export const getAllProperties = async (req, res) => {
  const { page = 1, limit = 6 } = req.query;
  const offset = (page - 1) * limit;
  try {
    const [properties, [{ count }]] = await Promise.all([
      sql`SELECT * FROM properties ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
      sql`SELECT COUNT(*)::int FROM properties`,
    ]);

    const propertyIds = properties.map((p) => Number(p.id));
    let images = [];
    console.log("property ids", propertyIds);

    if (propertyIds.length > 0) {
      console.log("Type of first property ID:", typeof propertyIds[0]);

      images = await sql`
      SELECT property_id, image_url
      FROM images
      WHERE property_id = ANY(${propertyIds}::integer[])
      ORDER BY property_id, id;`;
    }

    const propertyWithImages = properties.map((property) => {
      const propertyImages = images
        .filter((img) => img.property_id === property.id)
        .map((img) => img.image_url);

      return {
        ...property,
        imageUrls: propertyImages,
      };
    });

    return res.status(200).json({
      success: true,
      data: propertyWithImages,
      totalCount: count,
    });
  } catch (err) {
    console.log("Error fetching properties");
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const createProperty = async (req, res) => {
  const { role, agencyId } = req.auth;
  const agency_id = role === "admin" ? (req.body.agency_id ?? null) : agencyId;

  if (!agency_id)
    return res
      .status(400)
      .json({ success: false, message: "Missing agency id" });
  console.log("REQ.BODY:", req.body);
  const {
    title,
    description,
    price_per_month,
    propertyType,
    ensuite,
    bedType,
    wifi,
    pets,
    location,
    latitude,
    longitude,
    images,
  } = req.body;

  const ensuiteBool = ensuite === "Yes" ? true : false;
  const wifiBool = wifi === "Yes" ? true : false;
  const petsBool = pets === "Yes" ? true : false;

  if (
    !title ||
    !description ||
    !price_per_month ||
    !propertyType ||
    ensuite == null ||
    !bedType ||
    wifi == null ||
    pets == null ||
    !location ||
    !latitude ||
    !longitude ||
    !images
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields required" });
  }

  try {
    const insertedProperties = await sql`
        INSERT INTO properties (title, description, price_per_month, location, latitude, longitude, bed_type, ensuite, wifi, pets, property_type, agency_id)
        VALUES (${title}, ${description}, ${price_per_month},  ${location}, ${latitude}, ${longitude}, ${bedType}, ${ensuiteBool}, ${wifiBool}, ${petsBool}, ${propertyType}::property_type_enum1, ${agency_id})
        RETURNING id;
      `;
    const propertyId = insertedProperties[0].id;

    if (images.length > 0) {
      const imageInsertPromises = images.map(
        (url) => sql`
          INSERT INTO images (property_id, image_url)
          VALUES (${propertyId}, ${url});
        `
      );
      await Promise.all(imageInsertPromises);
    }

    console.log("New property added", insertedProperties);
    res.status(201).json({ success: true, data: insertedProperties });
  } catch (err) {
    console.log("Error creating property", err);
    res
      .status(500)
      .json({ success: false, message: "Error creating property" });
  }
};

export const getProperty = async (req, res) => {
  const { id } = req.params;

  try {
    const property = await sql`
    SELECT * FROM properties WHERE id = ${id}`;

    const fetchedProperty = property[0];

    const imagesResult = await sql`
      SELECT image_url
      FROM images
      WHERE property_id = ${id}
      ORDER BY id; 
    `;
    console.log("Fetched images for property", id, ":", imagesResult);

    fetchedProperty.images = imagesResult.map((img) => img.image_url);
    res.status(200).json({ success: true, data: fetchedProperty });
  } catch (err) {
    console.log("Error gettingg property");
    res.status(500).json({
      success: false,
      message: "Error gettingg property",
      error: err.message,
      id,
    });
  }
};

export const updateProperty = async (req, res) => {
  const { id } = req.params;
  const { role, agencyId } = req.auth || {};

  if (role !== "admin") {
    const property =
      await sql`SELECT agency_id FROM properties WHERE id = ${id}`;
    if (!property.length) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }
    if (String(property[0].agency_id) !== String(agencyId)) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Not your property" });
    }
  }

  const {
    title,
    description,
    price_per_month,
    propertyType,
    ensuite,
    bedType,
    wifi,
    pets,
    location,
    latitude,
    longitude,
    imageUrls,
  } = req.body;

  console.log("propertyType:", propertyType, typeof propertyType);
  console.log(
    "Char codes:",
    propertyType.split("").map((c) => c.charCodeAt(0))
  );

  try {
    const updatedProperty = await sql`
      UPDATE properties SET title=${title}, description=${description}, price_per_month=${price_per_month},  location=${location}, latitude=${latitude}, longitude=${longitude}, ensuite=${ensuite}, bed_type=${bedType}, wifi=${wifi}, pets=${pets}, property_type=${propertyType} WHERE id=${id} RETURNING *`;

    if (updatedProperty.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }
    res.status(200).json({ success: true, data: updatedProperty[0] });
  } catch (err) {
    console.log("Error updating product", err);
    res.status(500).json({ success: false, message: "Error updating product" });
  }
};

export const deleteProperty = async (req, res) => {
  const { role, agencyId } = req.auth || {};
  const { id } = req.params;

  if (role !== "admin") {
    const property =
      await sql`SELECT agency_id FROM properties WHERE id = ${id}`;
    if (!property.length) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found." });
    }
    if (String(property[0].agency_id) !== String(agencyId)) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Not your property." });
    }
  }

  try {
    const deletedProperty = await sql`
    DELETE FROM properties WHERE id=${id} RETURNING *`;

    if (deletedProperty.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }
    res.status(200).json({ success: true, data: deletedProperty[0] });
  } catch (err) {
    console.log("Error in delete property controller", err);
    res
      .status(500)
      .json({ success: false, message: "Error deleting property" });
  }
};

export const getPropertiesWithTravelTime = async (req, res) => {
  const { destinations, modes = ["DRIVING"] } = req.body;
  console.log("Recieved", modes);

  console.log("destinations", destinations);

  if (
    !destinations ||
    !Array.isArray(destinations) ||
    destinations.length === 0
  ) {
    return res
      .status(400)
      .json({ error: "At least one destination is required" });
  }

  try {
    const properties =
      await sql`SELECT * FROM properties ORDER BY created_at DESC`;

    // fetch properties with images
    const propertyIds = properties.map((property) => Number(property.id));
    let images = [];

    if (propertyIds.length > 0) {
      images =
        await sql`SELECT property_id, image_url FROM images WHERE property_id = ANY(${propertyIds}::integer[]) ORDER BY property_id, id;`;
    }

    // combine properties with images
    const propertiesWithImages = properties.map((p) => {
      const propertyImages = images
        .filter((img) => img.property_id === p.id)
        .map((img) => img.image_url);

      return {
        ...p,
        imageUrls: propertyImages,
      };
    });

    const travelTimes = await Promise.all(
      propertiesWithImages.map(async (property) => {
        if (!property.latitude || !property.longitude) {
          return { ...property, travelTimes: [] };
        }
        const origin = `${property.latitude},${property.longitude}`;

        const travelResults = [];

        for (const destination of destinations) {
          const destinationLabel =
            typeof destination === "string"
              ? destination
              : destination.label ||
                `${destination.latitude},${destination.longitude}`;

          const destCoordinates =
            typeof destination === "string"
              ? destination
              : `${destination.latitude},${destination.longitude}`;

          for (const mode of modes) {
            try {
              console.log(
                "Mode =",
                mode,
                "Destination =",
                destination,
                "Origin =",
                origin
              );
              const apiRes = await axios.get(
                "https://maps.googleapis.com/maps/api/directions/json",
                {
                  params: {
                    origin,
                    destination: destCoordinates,
                    mode,
                    key: API_KEY,
                  },
                }
              );
              console.log(
                "API response:",
                JSON.stringify(apiRes.data, null, 2)
              );
              console.log(
                `Google returned:`,
                apiRes.data.routes?.[0]?.legs?.[0]?.duration?.text,
                "for mode:",
                mode
              );
              console.log("Full URL:", apiRes.request?.path);

              const duration =
                apiRes.data.routes?.[0]?.legs?.[0]?.duration?.text || null;
              travelResults.push({
                destination: destinationLabel,
                mode: mode.toLowerCase(),
                duration,
              });
              console.log(
                `Got duration: ${duration} for mode: ${mode}, destination: ${destinationLabel}`
              );
            } catch (err) {
              console.error(
                `Error fetching ${mode} time to ${destinationLabel}`,
                err.message
              );
              travelResults.push({
                destination: destinationLabel,
                mode: mode.toLowerCase(),
                duration: null,
              });
            }
          }
        }
        return { ...property, travelTimes: travelResults };
      })
    );

    // google directions api to calculate travel times for each destination

    res.status(200).json(travelTimes);
  } catch (err) {
    console.error("Error calculating travel time", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPlaces = async (req, res) => {
  console.log("Incoming query:", req.query);
  const { lat, lng, type = "tourist_attraction" } = req.query;

  if (!lat || !lng) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }

  try {
    const radius = 1500; //metres

    const googleUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
    const response = await axios.get(googleUrl, {
      params: {
        location: `${lat},${lng}`,
        radius,
        type,
        key: API_KEY,
      },
    });

    if (!response.data.results) {
      return res
        .status(500)
        .json({ error: "Unexpected response from Google Places API" });
    }

    const places = response.data.results.map((place) => ({
      place_id: place.place_id,
      name: place.name,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      vicinity: place.vicinity,
      types: place.types,
      photoUrl: place.photos?.[0]?.photo_reference
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${API_KEY}`
        : null,
    }));
    console.log("Google places response", response.data);
    res.json({ places });
  } catch (err) {
    console.error("Error fetching places", err);
    res.status(500).json({ error: "Failed to get nearby places" });
  }
};

export const insertEnquiries = async (req, res) => {
  const { property_id, full_name, email, message, user_id } = req.body;

  if (!property_id || !full_name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (req.auth?.role === "user" && req.auth.userId) {
    if (user_id && String(user_id) !== String(req.auth.userId)) {
      return res.status(403).json({ error: "Forbidden: mismatched user_id" });
    }
  }

  try {
    await sql`INSERT INTO enquiries (property_id, user_id, full_name, email, message) VALUES (${property_id}, ${
      user_id || null
    }, ${full_name}, ${email}, ${message})`;

    const propertyRequest =
      await sql`SELECT location FROM properties WHERE id = ${property_id}`;

    const propertyTitle = propertyRequest[0]?.location || "a property.";

    await sendEnquiryConfirmation(email, full_name, propertyTitle);

    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Error inserting enquiry", err);
    res.status(500).json({ error: "Failed to create enquiry" });
  }
};

export const getEnquiries = async (req, res) => {
  const { userId, role, agencyId } = req.auth || {};
  try {
    if (role === "admin") {
      const rows = await sql`SELECT * from enquiries ORDER BY created_at DESC`;
      return res.json(rows);
    }

    if (role === "agent") {
      const rows = await sql`SELECT e.*
        FROM enquiries e
        JOIN properties p ON p.id = e.property_id
        WHERE p.agency_id = ${agencyId}
        ORDER BY e.created_at DESC;`;
      return res.json(rows);
    }

    if (role === "user") {
      const rows = await sql`
        SELECT * FROM enquiries
        WHERE user_id = ${userId}
        ORDER BY created_at DESC`;
      return res.json(rows);
    }

    return res.sendStatus(403);
  } catch (err) {
    console.error("Error getting enquiries", err);
    res.status(500).json({ error: "Failed to fetch enquiries" });
  }
};

export const searchWithRadius = async (req, res) => {
  const { lat, lng, radius } = req.query;

  const minPrice =
    req.query.minPrice && req.query.minPrice !== ""
      ? Number(req.query.minPrice)
      : null;

  const maxPrice =
    req.query.maxPrice && req.query.maxPrice !== ""
      ? Number(req.query.maxPrice)
      : null;

  if (!lat || !lng || !radius) {
    return res.status(400).json({ error: "Missing location or radius" });
  }

  try {
    const filters = [];

    if (minPrice !== null) filters.push(sql`price_per_month >= ${minPrice}`);
    if (maxPrice !== null) filters.push(sql`price_per_month <= ${maxPrice}`);

    filters.push(sql`distance <= ${radius}`);

    const whereClause =
      filters.length > 0
        ? filters.reduce((acc, cur) => sql`${acc} AND ${cur}`)
        : sql`TRUE`;

    console.log("Final WHERE:", whereClause); // ✅ Works

    const properties = await sql`
      SELECT * FROM (
        SELECT *,
          (6371 * acos(
            cos(radians(${lat})) * cos(radians(latitude)) *
            cos(radians(longitude) - radians(${lng})) +
            sin(radians(${lat})) * sin(radians(latitude))
          )) AS distance
        FROM properties
      ) AS subquery
      WHERE ${whereClause}
      ORDER BY distance ASC
    `;

    const propertyIds = properties.map((property) => property.id);
    let images = [];

    if (propertyIds.length > 0) {
      images = await sql`
        SELECT property_id, image_url
        FROM images
        WHERE property_id = ANY(${propertyIds}::int[])
        ORDER BY property_id, id;
      `;
    }

    const propertiesWithImages = properties.map((p) => {
      const propertyImages = images
        .filter((img) => img.property_id === p.id)
        .map((img) => img.image_url);

      return {
        ...p,
        imageUrls: propertyImages,
      };
    });

    res.status(200).json(propertiesWithImages);
  } catch (err) {
    console.error("Search error", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
