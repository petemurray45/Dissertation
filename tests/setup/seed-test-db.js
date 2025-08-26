import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
if (process.env.NODE_ENV !== "test") process.env.NODE_ENV = "test";

import { sql } from "../../backend/config/db.js";

export async function seedTestData() {
  console.log("[seed] start");

  const AGENCY = {
    agency_name: "Test Agency",
    agency_email: "testagency@test.com",
    phone: "07960692361",
    website: "testagency.com",
    loginId: "testlogin",
  };

  let agencyRow =
    await sql`SELECT id FROM agencies WHERE agency_name = ${AGENCY.agency_name} LIMIT 1`;
  if (agencyRow.length === 0) {
    const hash = await bcrypt.hash(AGENCY.loginId, 10);
    agencyRow = await sql`
    INSERT INTO agencies (agency_name, agency_email, phone, login_id_hash, website)
      VALUES (${AGENCY.agency_name}, ${AGENCY.agency_email}, ${AGENCY.phone}, ${hash}, ${AGENCY.website})
      RETURNING id`;
    console.log("[seed] inserted agency");
  } else {
    console.log("[seed] agency exists; reusing");
  }
  const agencyId = agencyRow[0].id;

  const existingProps = await sql`SELECT id FROM properties LIMIT 1`;
  if (existingProps.length === 0) {
    const properties = [
      {
        title: "Sunny Double Room",
        description: "Bright double room in shared flat.",
        price_per_month: 700,
        location: "Manchester, UK",
        latitude: 53.4808,
        longitude: -2.2426,
        bed_type: "Double",
        ensuite: true,
        wifi: true,
        pets: false,
        property_type: "Flat",
        images: [
          "https://picsum.photos/seed/p1/800/500",
          "https://picsum.photos/seed/p1b/800/500",
        ],
      },
      {
        title: "City Studio Apartment",
        description: "Compact studio close to transport.",
        price_per_month: 950,
        location: "Leeds, UK",
        latitude: 53.8008,
        longitude: -1.5491,
        bed_type: "Single",
        ensuite: true,
        wifi: true,
        pets: true,
        property_type: "Bungalow",
        images: ["https://picsum.photos/seed/p2/800/500"],
      },
    ];

    for (const p of properties) {
      const inserted = await sql`
        INSERT INTO properties (
          title, description, price_per_month, location, latitude, longitude,
          bed_type, ensuite, wifi, pets, property_type, agency_id
        )
        VALUES (
          ${p.title}, ${p.description}, ${p.price_per_month},
          ${p.location}, ${p.latitude}, ${p.longitude},
          ${p.bed_type}, ${p.ensuite}, ${p.wifi}, ${p.pets},
          ${p.property_type}::property_type_enum1, ${agencyId}
        )
        RETURNING id
        `;
      const propertyId = inserted[0].id;

      for (const url of p.images) {
        await sql`
            INSERT INTO images (property_id, image_url) VALUES (${propertyId}, ${url})`;
      }
    }
    console.log("[seed] inserted sample properties + images");
  } else {
    console.log("[seed] properties already present - skipping insert");
  }
  console.log("[seed] done");
  return { agencyId };
}

// allows running file directly to manually seed
if (import.meta.url === `file://${process.argv[1]}`) {
  seedTestData()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

export { seedTestData };
