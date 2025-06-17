import { sql } from "../config/db.js";
import axios from "axios";
import dotenv from "dotenv";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
dotenv.config();

const GEOCODE_BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const API_KEY = process.env.MAPS_API_KEY;

export const getAllProperties = async (req, res) => {
  try {
    const properties = await sql`
    SELECT * FROM properties
    ORDER BY created_at DESC`;

    console.log("Fetched Properties", properties);
    res.status(200).json({ success: true, data: properties });
  } catch (err) {
    console.log("Error fetching properties", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createProperty = async (req, res) => {
  const {
    title,
    description,
    price,
    bedrooms,
    location,
    latitude,
    longitude,
    image,
  } = req.body;

  if (
    !title ||
    !description ||
    !price ||
    !bedrooms ||
    !location ||
    !latitude ||
    !longitude ||
    !image
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields required" });
  }

  try {
    const property = await sql`
      INSERT INTO properties (title, description, price_per_month, bedrooms, location, latitude, longitude)
      VALUES (${title}, ${description}, ${price}, ${bedrooms}, ${location}, ${latitude}, ${longitude}), ${image} RETURNING id`;

    console.log("New property added", property);
    res.status(201).json({ success: true, data: property });
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
    res.status(200).json({ success: true, data: property[0] });
  } catch (err) {
    console.log("Error getting product");
    res
      .status(500)
      .json({ success: false, message: "Error getting property", id });
  }
};

export const updateProperty = async (req, res) => {
  const { id } = req.params;

  const { title, description, price, bedrooms, location, latitude, longitude } =
    req.body;

  try {
    const updatedProperty = await sql`
      UPDATE properties SET title=${title}, description=${description}, price_per_month=${price}, bedrooms=${bedrooms}, location=${location}, latitude=${latitude}, longitude=${longitude} WHERE id=${id} RETURNING *`;

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
