import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Enable PostGIS extension
  await knex.raw('CREATE EXTENSION IF NOT EXISTS postgis');

  // Create parcels table
  await knex.schema.createTable('parcels', (table) => {
    table.text('id').primary(); // geohash-derived identifier
    table.specificType('token_id', 'NUMERIC(78, 0)').unique(); // on-chain ERC-721 token ID
    table.text('owner_address'); // current owner wallet address
    table.text('tier').notNullable(); // PLOT | DISTRICT | REGION | TERRITORY
    table.specificType('boundary', 'GEOMETRY(POLYGON, 4326)').notNullable();
    table.double('area_ha').notNullable();
    table.string('country_code', 2);
    table.text('city');
    table.text('biome');
    table.text('metadata_cid'); // IPFS CID for ERC-721 metadata JSON
    table.timestamp('minted_at');
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Indices
    table.index(['owner_address'], 'idx_parcels_owner');
  });

  // Create spatial index
  await knex.raw('CREATE INDEX idx_parcels_boundary ON parcels USING GIST (boundary)');

  // Create tile_index table for spatial data streaming
  await knex.schema.createTable('tile_index', (table) => {
    table.text('tile_key').primary(); // "{zoom}/{x}/{y}"
    table.smallint('lod_level').notNullable();
    table.text('s3_uri').notNullable(); // s3://bucket/path/to/tile.json
    table.specificType('bbox', 'GEOMETRY(POLYGON, 4326)').notNullable();
    table.timestamp('last_updated').defaultTo(knex.fn.now());
  });

  // Create spatial index for tile_index
  await knex.raw('CREATE INDEX idx_tile_index_bbox ON tile_index USING GIST (bbox)');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tile_index');
  await knex.schema.dropTableIfExists('parcels');
  await knex.raw('DROP EXTENSION IF EXISTS postgis');
}
