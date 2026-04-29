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
    {
      id: "dr5reg", // Example geohash for New York
      token_id: "3",
      owner_address: "0xabcdef1234567890abcdef1234567890abcdef12",
      tier: "DISTRICT",
      area_ha: 1.2,
      country_code: "US",
      city: "New York",
      biome: "Metropolitan",
      boundary: knex.raw("ST_GeomFromText('POLYGON((-74.01 40.70, -74.00 40.70, -74.00 40.71, -74.01 40.71, -74.01 40.70))', 4326)"),
    },
    {
      id: "xn76s4", // Example geohash for Tokyo
      token_id: "4",
      owner_address: "0x1234567890abcdef1234567890abcdef12345678",
      tier: "PLOT",
      area_ha: 0.05,
      country_code: "JP",
      city: "Tokyo",
      biome: "Dense Urban",
      boundary: knex.raw("ST_GeomFromText('POLYGON(((139.70 35.60, 139.71 35.60, 139.71 35.61, 139.70 35.61, 139.70 35.60))', 4326)"),
    },
    {
      id: "u4pruw", // Example geohash for Amazon Rainforest
      token_id: "5",
      owner_address: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      tier: "WILDERNESS",
      area_ha: 100.0,
      country_code: "BR",
      city: "Manaus", // Closest major city
      biome: "Rainforest",
      boundary: knex.raw("ST_GeomFromText('POLYGON(((-60.05 3.05, -60.00 3.05, -60.00 3.10, -60.05 3.10, -60.05 3.05))', 4326)"),
    },
    {
      id: "u0h6n0", // Example geohash for Sahara Desert
      token_id: "6",
      owner_address: "0xcccccccccccccccccccccccccccccccccccccccc",
      tier: "DESERT",
      area_ha: 50.0,
      country_code: "DZ",
      city: "Tamanrasset", // Closest major city
      biome: "Desert",
      boundary: knex.raw("ST_GeomFromText('POLYGON(((5.50 22.80, 5.60 22.80, 5.60 22.90, 5.50 22.90, 5.50 22.80))', 4326)"),
    },
  ]);
}
