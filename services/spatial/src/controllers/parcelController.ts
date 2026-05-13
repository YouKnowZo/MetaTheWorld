import { Request, Response } from 'express';
import db from '../db';
import { z } from 'zod';

const BBoxSchema = z.object({
  min_lng: z.coerce.number().min(-180).max(180),
  min_lat: z.coerce.number().min(-90).max(90),
  max_lng: z.coerce.number().min(-180).max(180),
  max_lat: z.coerce.number().min(-90).max(90),
});

export const getParcelsByBBox = async (req: Request, res: Response) => {
  try {
    const validatedQuery = BBoxSchema.parse(req.query);
    const { min_lng, min_lat, max_lng, max_lat } = validatedQuery;

    // Use PostGIS ST_Intersects and ST_MakeEnvelope
    // ST_MakeEnvelope(min_lng, min_lat, max_lng, max_lat, srid)
    const parcels = await db('parcels')
      .select(
        'id',
        'token_id',
        'owner_address',
        'tier',
        'area_ha',
        'country_code',
        'city',
        'biome',
        'metadata_cid',
        db.raw('ST_AsGeoJSON(boundary)::json as boundary'),
        'minted_at',
        'updated_at'
      )
      .where(
        db.raw(
          'ST_Intersects(boundary, ST_MakeEnvelope(?, ?, ?, ?, 4326))',
          [min_lng, min_lat, max_lng, max_lat]
        )
      );

    res.json(parcels);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error fetching parcels by BBox:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getParcelById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parcel = await db('parcels')
      .select(
        'id',
        'token_id',
        'owner_address',
        'tier',
        'area_ha',
        'country_code',
        'city',
        'biome',
        'metadata_cid',
        db.raw('ST_AsGeoJSON(boundary)::json as boundary'),
        'minted_at',
        'updated_at'
      )
      .where({ id })
      .first();

    if (!parcel) {
      return res.status(404).json({ error: 'Parcel not found' });
    }

    res.json(parcel);
  } catch (error) {
    console.error('Error fetching parcel by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getParcelTiles = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // First verify parcel exists
    const parcel = await db('parcels').where({ id }).first();
    if (!parcel) {
      return res.status(404).json({ error: 'Parcel not found' });
    }

    // Query tile_index for tiles intersecting with parcel boundary
    const tiles = await db('tile_index')
      .select('tile_key', 'lod_level', 's3_uri', db.raw('ST_AsGeoJSON(bbox)::json as bbox'), 'last_updated')
      .where(
        db.raw(
          'ST_Intersects(bbox, (SELECT boundary FROM parcels WHERE id = ?))',
          [id]
        )
      );

    res.json({
      parcel_id: id,
      tiles
    });
  } catch (error) {
    console.error('Error fetching parcel tiles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTileByKey = async (req: Request, res: Response) => {
  try {
    const { z, x, y } = req.params;
    const tileKey = `${z}/${x}/${y}`;
    
    const tile = await db('tile_index')
      .where({ tile_key: tileKey })
      .first();

    if (!tile) {
      return res.status(404).json({ error: 'Tile not found' });
    }

    // In a real implementation, this might proxy to S3 or redirect
    res.json({
      tile_key: tile.tile_key,
      lod_level: tile.lod_level,
      s3_uri: tile.s3_uri,
      message: "In production, this would return the 3D tile data or redirect to S3."
    });
  } catch (error) {
    console.error('Error fetching tile by key:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
