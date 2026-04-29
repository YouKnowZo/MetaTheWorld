import { Request, Response } from 'express';
import db from '../db'; // Re-add db import
import { z } from 'zod';
import * as parcelModel from '../db/models/parcelModel';
import { Parcel } from '../types';

const BBoxSchema = z.object({
  min_lng: z.coerce.number().min(-180).max(180),
  min_lat: z.coerce.number().min(-90).max(90),
  max_lng: z.coerce.number().min(-180).max(180),
  max_lat: z.coerce.number().min(-90).max(90),
});

const GeoJSONPolygonSchema = z.object({
  type: z.literal('Polygon'),
  coordinates: z.array(z.array(z.array(z.number()))),
});

const CreateParcelSchema = z.object({
  id: z.string(),
  token_id: z.string(),
  owner_address: z.string().optional(),
  tier: z.enum(['PLOT', 'DISTRICT', 'REGION', 'TERRITORY']),
  boundary: GeoJSONPolygonSchema,
  area_ha: z.number().positive(),
  country_code: z.string().optional(),
  city: z.string().optional(),
  biome: z.string().optional(),
  metadata_cid: z.string().optional(),
  minted_at: z.coerce.date().optional(),
});

const UpdateParcelSchema = z.object({
  owner_address: z.string().optional(),
  tier: z.enum(['PLOT', 'DISTRICT', 'REGION', 'TERRITORY']).optional(),
  boundary: GeoJSONPolygonSchema.optional(),
  area_ha: z.number().positive().optional(),
  country_code: z.string().optional(),
  city: z.string().optional(),
  biome: z.string().optional(),
  metadata_cid: z.string().optional(),
});

export const createParcelController = async (req: Request, res: Response) => {
  try {
    const newParcelData = CreateParcelSchema.parse(req.body);
    const parcel = await parcelModel.createParcel(newParcelData);
    res.status(201).json(parcel);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating parcel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getParcelByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parcel = await parcelModel.getParcelById(id);
    if (!parcel) {
      return res.status(404).json({ error: 'Parcel not found' });
    }
    res.json(parcel);
  } catch (error) {
    console.error('Error fetching parcel by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getParcelsByOwnerController = async (req: Request, res: Response) => {
  try {
    const { ownerAddress } = req.params;
    const parcels = await parcelModel.getParcelsByOwner(ownerAddress);
    res.json(parcels);
  } catch (error) {
    console.error('Error fetching parcels by owner:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateParcelController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = UpdateParcelSchema.parse(req.body);

    const updatedParcel = await parcelModel.updateParcel(id, updates);
    if (!updatedParcel) {
      return res.status(404).json({ error: 'Parcel not found' });
    }
    res.json(updatedParcel);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error updating parcel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteParcelController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await parcelModel.deleteParcel(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Parcel not found' });
    }
    res.status(204).send(); // No Content
  } catch (error) {
    console.error('Error deleting parcel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getParcelsByBBoxController = async (req: Request, res: Response) => {
  try {
    const validatedQuery = BBoxSchema.parse(req.query);
    const { min_lng, min_lat, max_lng, max_lat } = validatedQuery;

    const parcels = await parcelModel.getParcelsInBoundingBox(min_lat, min_lng, max_lat, max_lng);
    res.json(parcels);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error fetching parcels by BBox:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getParcelsInGeoJSONController = async (req: Request, res: Response) => {
  try {
    const validatedBody = GeoJSONPolygonSchema.parse(req.body);
    const parcels = await parcelModel.getParcelsInGeoJSONPolygon(validatedBody);
    res.json(parcels);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error fetching parcels by GeoJSON polygon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Keep existing tile functions, potentially adapting to use a tileModel if created

export const getParcelTiles = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // First verify parcel exists
    const parcel = await parcelModel.getParcelById(id);
    if (!parcel) {
      return res.status(404).json({ error: 'Parcel not found' });
    }

    // Query tile_index for tiles intersecting with parcel boundary
    // This part still directly uses db as there's no tileModel yet
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
