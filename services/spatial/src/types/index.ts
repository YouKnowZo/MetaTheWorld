export interface Parcel {
  id: string;
  token_id: string;
  owner_address?: string;
  tier: 'PLOT' | 'DISTRICT' | 'REGION' | 'TERRITORY';
  boundary: any; // GeoJSON Polygon
  area_ha: number;
  country_code?: string;
  city?: string;
  biome?: string;
  metadata_cid?: string;
  minted_at?: Date;
  updated_at: Date;
}

export interface SpatialTile {
  tile_key: string;
  lod_level: number;
  s3_uri: string;
  bbox: any; // GeoJSON Polygon
  last_updated: Date;
}
