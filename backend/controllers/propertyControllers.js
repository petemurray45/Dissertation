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
    console.log("Error fetching properties", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createProperty = async (req, res) => {
  const {
    title,
    description,
    price_per_month,
    bedrooms,
    location,
    latitude,
    longitude,
    images,
  } = req.body;

  if (
    !title ||
    !description ||
    !price_per_month ||
    !bedrooms ||
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
        INSERT INTO properties (title, description, price_per_month, bedrooms, location, latitude, longitude)
        VALUES (${title}, ${description}, ${price_per_month}, ${bedrooms}, ${location}, ${latitude}, ${longitude})
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

  /*
  const {
    title,
    description,
    price,
    bedrooms,
    street_address1,
    streed_address2,
    city,
    county,
    postcode,
    country,
  } = req.body;

  // files stored in req.files due to multer middleware
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: "At least one image is required" });
  }

  if (
    !title ||
    !description ||
    !price ||
    !bedrooms ||
    !street_address1 ||
    !city ||
    !postcode ||
    !country
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill in required fields" });
  }

  // extract address details for geocode API to get lat/long
  const addressComponents = [
    street_address1,
    streed_address2,
    city,
    county,
    postcode,
    country,
  ].filter(Boolean); // removes any falsy values (null, undefined, empty strings)

  const location = addressComponents.join(", "); // joins with a comma and space
  console.log("Concatonated Address for Geocoding", location);

  // code to get geocoded coordinates from address entered on form and push property details to database
  try {
    const response = await axios.get(
      `${GEOCODE_BASE_URL}?address=${encodeURIComponent(
        location
      )}&key=${API_KEY}`
    );

    const results = response.data.results;
    if (!results || results.length === 0) {
      return res
        .status(400)
        .json({ message: "Could not geocode provided address" });
    }
    const { lat, long } = results[0].geometry.location;
  } catch (err) {
    console.log("Error geocoding address");
  }

  try {
    const propertyResult = await sql`
    INSERT INTO properties (title, description, price_per_month, bedrooms, location, latitude, longitude)
    VALUES (${title}, ${description}, ${price}, ${bedrooms}, ${location}, ${lat}, ${long}, NOW())
    RETURNING id;`;

    const propertyID = propertyResult[0].id;

    /////// need to loop and upload images and then insert into images
  } catch (err) {
    console.log("Error adding property to database");
  }

  */
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
    console.log("Error getting product");
    res
      .status(500)
      .json({ success: false, message: "Error getting property", id });
  }
};

export const updateProperty = async (req, res) => {
  const { id } = req.params;

  const {
    title,
    description,
    price_per_month,
    bedrooms,
    location,
    latitude,
    longitude,
    imageUrls,
  } = req.body;

  try {
    const updatedProperty = await sql`
      UPDATE properties SET title=${title}, description=${description}, price_per_month=${price_per_month}, bedrooms=${bedrooms}, location=${location}, latitude=${latitude}, longitude=${longitude} WHERE id=${id} RETURNING *`;

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

export const getTravelTime = async (req, res) => {
  console.log("getTraveltime initialised");
  const { origin, destination } = req.query;

  console.log("Received origin:", origin);
  console.log("Received destination:", destination);
  console.log("Using API key:", process.env.GOOGLE_MAPS_API_KEY);

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json`,
      {
        params: {
          origins: origin,
          destinations: destination,
          key: API_KEY,
        },
      }
    );

    console.log("Distance matrix response", response.data);

    const duration = response.data.rows[0].elements[0].duration.text;

    if (!duration) {
      return res.status(400).json({ error: "No duration returned from API" });
    }

    res.json({ travelTime: duration });
  } catch (err) {
    console.log("Distance API error", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch travel time" });
  }
};
