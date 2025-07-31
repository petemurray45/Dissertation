import { OpenAI } from "openai/client.js";
import { sql } from "../config/db.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const botChat = async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are PropPal, an AI assistant helping users search for rooms for rent in Northern Ireland. You can filter by location, price, amenities, poximity to key landmarks (like Queens University), travel time, etc.",
        },
        { role: "user", content: message },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "search_properties",
            description:
              "Search properties using filters like location, maxPrice etc.",
            parameters: {
              type: "object",
              properties: {
                location: { type: "string", description: "City or landmark" },
                maxPrice: { type: "number" },
                minPrice: { type: "number" },
                ensuite: { type: "boolean" },
                wifi: { type: "boolean" },
                pets: { type: "boolean" },
                bedType: {
                  type: "string",
                  enum: ["Single", "Double", "King", "Queen", "Bunk-Bed"],
                  description: "Type of bed the user prefers",
                },
                travelTimeto: {
                  type: "string",
                  description: "Place user wants to travel to",
                },
              },
              required: [],
            },
          },
        },
      ],
      tool_choice: "auto",
    });

    const toolCall = response.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.name === "search_properties") {
      const args = JSON.parse(toolCall.function.arguments);
      const { location, minPrice, maxPrice, ensuite, wifi, pets, bedType } =
        args;
      let filters = [];
      if (location) filters.push(sql`location ILIKE ${"%" + location + "%"}`);
      if (minPrice !== undefined)
        filters.push(sql`price_per_month >= ${minPrice}`);
      if (maxPrice !== undefined)
        filters.push(sql`price_per_month <= ${maxPrice}`);
      if (ensuite !== undefined) filters.push(sql`ensuite = ${ensuite}`);
      if (wifi !== undefined) filters.push(sql`wifi = ${wifi}`);
      if (pets !== undefined) filters.push(sql`pets = ${pets}`);
      if (bedType !== undefined) filters.push(sql`bed_type = ${bedType}`);

      let whereClause = sql``;

      if (filters.length > 0) {
        const [first, ...rest] = filters;
        whereClause = rest.reduce(
          (acc, clause) => sql`${acc} AND ${clause}`,
          first
        );
      }

      const results =
        await sql`SELECT * FROM properties ${filters.length > 0 ? sql`WHERE ${whereClause}` : sql``} ORDER BY price_per_month ASC LIMIT 10`;

      if (results.length === 0) {
        return res.json({
          reply:
            "Sorry, I couldn't find any properties that match your criteria.",
          properties: [],
        });
      } else {
        const propertyIds = results.map((property) => Number(property.id));

        const images =
          await sql`SELECT property_id, image_url FROM images WHERE property_id = ANY(${propertyIds}::integer[]) ORDER BY property_id, id`;

        const propertiesWithImages = results.map((property) => {
          const propertyImages = images
            .filter((image) => image.property_id === property.id)
            .map((image) => image.image_url);
          return {
            ...property,
            imageUrls: propertyImages,
          };
        });

        console.log("props with images:", propertiesWithImages);

        return res.json({
          reply: "Here are some properties that match your search:",
          properties: propertiesWithImages,
        });
      }
    }
    return res.json({
      reply: response.choices[0].message.content,
      properties: [],
    });
  } catch (err) {
    console.error("Chat error", err);
    res.status(500).json({ error: "Failed to generate response" });
  }
};
