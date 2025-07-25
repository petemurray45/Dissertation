import { sql } from "../config/db.js";
import axios from "axios";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import { type } from "os";
import { Resend } from "resend";
dotenv.config();

const GEOCODE_BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json";
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const resend = new Resend(process.env.RESEND_API_KEY);

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
        INSERT INTO properties (title, description, price_per_month, location, latitude, longitude, bed_type, ensuite, wifi, pets, property_type)
        VALUES (${title}, ${description}, ${price_per_month},  ${location}, ${latitude}, ${longitude}, ${bedType}, ${ensuiteBool}, ${wifiBool}, ${petsBool}, ${propertyType})
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
  {
    /*}
  try {
    // select all properties in price range

    const response =
      await sql`SELECT * FROM properties ORDER BY created_at DESC`;

    const properties = response.rows || response;
    console.log("Properties", properties);

    // get property ids
    const responseResults = await Promise.all(
      pro
    )
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
    */
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

  try {
    await sql`INSERT INTO enquiries (property_id, user_id, full_name, email, message) VALUES (${property_id}, ${
      user_id || null
    }, ${full_name}, ${email}, ${message})`;
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("Error inserting enquiry", err);
    res.status(500).json({ error: "Failed to create enquiry" });
  }
};

export const getEnquiries = async (req, res) => {
  const { user_id } = req.params;
  try {
    const result =
      await sql`SELECT * FROM enquiries WHERE user_id = ${user_id} ORDER BY created_at DESC`;
    res.json(result.rows);
  } catch (err) {
    console.error("Error getting enquiries", err);
    res.status(500).json({ error: "Failed to fetch enquiries" });
  }
};
