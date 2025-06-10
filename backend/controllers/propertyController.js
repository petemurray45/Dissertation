import { sql } from "../config/db.js";
import axios from "axios";
import dotenv from "dotenv";
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

export const getProperty = async (req, res) => {
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
    const { lat, lang } = results[0].geometry.location;
  } catch (err) {
    console.log("Error adding property to database");
  }
};

export const createProperty = async (req, res) => {};
export const updateProperty = async (req, res) => {};
export const deleteProperty = async (req, res) => {};
