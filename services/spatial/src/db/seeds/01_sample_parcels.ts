import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("tile_index").del();
  await knex("parcels").del();

  // Inserts seed entries
  // Sample parcels in Paris
  await knex("parcels").insert([
    {
      id: "u09tvm7", // Example geohash for Paris centroid
      token_id: "1",
      owner_address: "0x1234567890123456789012345678901234567890",
      tier: "PLOT",
      area_ha: 0.01,
      country_code: "FR",
      city: "Paris",
      biome: "Urban",
      boundary: knex.raw("ST_GeomFromText('POLYGON((2.350 48.850, 2.351 48.850, 2.351 48.851, 2.350 48.851, 2.350 48.850))', 4326)"),
    },
    {
      id: "u09tvm8",
      token_id: "2",
      owner_address: "0x0987654321098765432109876543210987654321",
      tier: "DISTRICT",
      area_ha: 0.5,
      country_code: "FR",
      city: "Paris",
      biome: "Urban",
      boundary: knex.raw("ST_GeomFromText('POLYGON((2.352 48.852, 2.353 48.852, 2.353 48.853, 2.352 48.853, 2.352 48.852))', 4326)"),
    },
  ]);
}
