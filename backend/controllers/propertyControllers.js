import { sql } from "../config/db.js";
import axios from "axios";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

const GEOCODE_BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export const getAllProperties = async (req, res) => {
  const { minPrice = 0, maxPrice = 10000 } = req.query;
  try {
    const properties = await sql`
    SELECT * FROM properties WHERE price_per_month >= ${minPrice} AND price_per_month <= ${maxPrice}
    ORDER BY created_at DESC`;

    let images = [];

    const propertyIds = properties.map((p) => Number(p.id));
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

    console.log("Fetched Properties", propertyWithImages);
    res.status(200).json({ success: true, data: propertyWithImages });
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

  if (
    !title ||
    !description ||
    !price_per_month ||
    !propertyType ||
    !ensuite ||
    !bedType ||
    !wifi ||
    !pets ||
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
        INSERT INTO properties (title, description, price_per_month,  location, latitude, longitude, bed_type, ensuite, wifi, pets, property_type)
        VALUES (${title}, ${description}, ${price_per_month},  ${location}, ${latitude}, ${longitude}, ${bedType}, ${ensuite}, ${wifi}, ${pets}, ${propertyType})
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
    res.status(200).json({ success: true, data: updateProperty[0] });
  } catch (err) {
    console.log("Error updating product", err);
    res.status(500).json({ success: false, message: "Error updating product" });
  }
};

export const deleteProperty = async (req, res) => {
  const { id } = req.params;

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
  const { destination, minPrice = 0, maxPrice = 10000 } = req.query;

  console.log("destination", destination);

  const min = Number(minPrice);
  const max = Number(maxPrice);

  if (!destination) {
    return res.status(400).json({ error: "Destination is required" });
  }

  try {
    // select all properties in price range

    const response =
      await sql`SELECT * FROM properties WHERE price_per_month >= ${min} AND price_per_month <= ${max}`;

    const properties = response.rows || response;
    console.log("Properties", properties);

    // get property ids
    const propertyIds = properties.map((p) => Number(p.id));
    let images = [];

    if (propertyIds.length === 0) {
      console.log("No property ids");
    }

    if (propertyIds.length > 0) {
      images = await sql`SELECT property_id, image_url
      FROM images
      WHERE property_id = ANY(${propertyIds}::integer[])
      ORDER BY property_id, id;`;
    }

    const propertiesWithImages = properties.map((property) => {
      const propertyImages = images
        .filter((img) => img.property_id === property.id)
        .map((img) => img.image_url);

      return {
        ...property,
        imageUrls: propertyImages,
      };
    });

    //call maps api
    if (!Array.isArray(propertiesWithImages)) {
      console.log(
        "No properties returned or not an array",
        propertiesWithImages
      );
      return res.status(500).json({ error: "Failed to load properties" });
    }
    const results = await Promise.all(
      propertiesWithImages.map(async (property) => {
        if (!property.latitude || !property.longitude) {
          return { ...property, travelTime: null };
        }
        console.log(property.latitude, property.longitude);

        try {
          const origin = `${property.latitude}, ${property.longitude}`;
          const apiRes = await axios.get(
            "https://maps.googleapis.com/maps/api/directions/json",
            {
              params: {
                origin,
                destination,
                key: API_KEY,
              },
            }
          );

          const travel_time =
            apiRes.data.routes?.[0]?.legs?.[0]?.duration?.text || null;

          return { ...property, travelTime: travel_time };
        } catch (err) {
          console.log("Error fetching travel time", err.message);
          return { ...property, travelTime: null };
        }
      })
    );
    res.json(results);
  } catch (err) {
    console.log("Error fetching properties ", err.message);
    res.status(500).json({ error: "Server Error" });
  }
};
