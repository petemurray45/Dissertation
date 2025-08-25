import { sql } from "../../backend/config/db";

export async function resetDb() {
  await sql`BEGIN`;
  try {
    await sql`
        TRUNCATE TABLE
        likes,
        notes,
        enquiries,
        images,
        properties,
        agencies,
        users
        RESTART IDENTITY CASCADE`;
    await sql`COMMIT`;
  } catch (err) {
    await sql`ROLLBACK`;
    throw err;
  }
}

export async function seedDb() {
  //users
  const [user] = await sql`
    INSERT INTO users (full_name, email, password_hash)
    VALUES ('Test User', 'testuser@example.com', '$2b$10$abcdefghijklmnopQRSTUVWXyZ0123456789abc/defghijklm') 
    RETURNING id, email`;

  // admin
  const [admin] = await sql`
    INSERT INTO admins (username, email, password_hash)
    VALUES ('TestAdmin', 'test@admin.com', '$2b$10$abcdefghijklmnopQRSTUVWXyZ0123456789abc/defghijklm')
    RETURNING id, username`;

  // agency
  const [agency] = await sql`
    INSERT INTO agencies (agency_name, agency_email, phone, login_id_hash, website)
    VALUES ('Seed Agency', 'seed@agency.com', '0123456789', '$2b$10$abcdefghijklmnopQRSTUVWXyZ0123456789abc/defghijklm', 'www.seedexample.com')
    RETURNING id`;

  const [property] = await sql`
    INSERT INTO properties (title, description, price_per_month, location, latitude, longitude, bed_type, ensuite, wifi, pets, property_type, agency_id)
    VALUES (
      'Seed Property',
      'Nice seed property',
      900,
      'Belfast, NI',
      54.5973,
      -5.9301,
      'Double',
      true, true, false,
      'Detatched',  -- adjust to your enum
      ${agency.id}
    )
    RETURNING id`;

  await sql`
    INSERT INTO images (property_id, image_url)
    VALUES (${property.id}, 'https://picsum.photos/seed/seed/1200/800')`;

  return {
    userEmail: user.email,
    agencyId: agency.id,
    propertyId: property.id,
  };
}
