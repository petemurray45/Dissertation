import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
if (process.env.NODE_ENV !== "test") process.env.NODE_ENV = "test";

import { sql } from "../../backend/config/db.js";

export async function seedTestData() {
  console.log("[seed] start");

  // seed agency

  const AGENCY = {
    agency_name: "Test Agency",
    agency_email: "testagency@test.com",
    phone: "07960692361",
    website: "testagency.com",
    loginId: "testlogin",
  };

  const agencyHash = await bcrypt.hash(AGENCY.loginId, 10);
  const agencyRow = await sql`
    INSERT INTO agencies (agency_name, agency_email, phone, login_id_hash, website)
    VALUES (${AGENCY.agency_name}, ${AGENCY.agency_email}, ${AGENCY.phone}, ${agencyHash}, ${AGENCY.website})
    ON CONFLICT (agency_email) DO UPDATE SET
      agency_name   = EXCLUDED.agency_name,
      phone         = EXCLUDED.phone,
      website       = EXCLUDED.website,
      login_id_hash = EXCLUDED.login_id_hash
    RETURNING id`;

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

  // seed user

  const USER = {
    name: "Test User",
    email: "testuser@example.com",
    password: "password123",
  };

  let userRow =
    await sql`SELECT id FROM users WHERE email = ${USER.email} LIMIT 1`;
  if (userRow.length === 0) {
    const hash = await bcrypt.hash(USER.password, 10);
    userRow = await sql`
      INSERT INTO users (full_name, email, password_hash)
      VALUES (${USER.name}, ${USER.email}, ${hash})
      RETURNING id`;
    console.log("[seed] inserted test user");
  } else {
    console.log("[seed] test user exists; reusing");
  }

  console.log("[seed] done");
  return { agencyId, userId: userRow[0].id };
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
