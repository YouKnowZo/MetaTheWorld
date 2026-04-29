import db from 'e:/Creations_by_Alonzo/Meta_The_World/MetaTheWorld/services/spatial/src/db';
import { Parcel } from 'e:/Creations_by_Alonzo/Meta_The_World/MetaTheWorld/services/spatial/src/types';

export async function createParcel(parcel: Omit<Parcel, 'updated_at'>): Promise<Parcel> {
  const [newParcel] = await db('parcels')
    .insert({
      ...parcel,
      updated_at: db.fn.now(),
    })
    .returning('*');
  return newParcel;
}

export async function getParcelById(id: string): Promise<Parcel | undefined> {
  return db('parcels').where({ id }).first();
}

export async function getParcelsByOwner(ownerAddress: string): Promise<Parcel[]> {
  return db('parcels').where({ owner_address: ownerAddress });
}

export async function updateParcel(id: string, updates: Partial<Omit<Parcel, 'id' | 'updated_at'>>): Promise<Parcel | undefined> {
  const [updatedParcel] = await db('parcels')
    .where({ id })
    .update({
      ...updates,
      updated_at: db.fn.now(),
    })
    .returning('*');
  return updatedParcel;
}

export async function deleteParcel(id: string): Promise<boolean> {
  const count = await db('parcels').where({ id }).del();
  return count > 0;
}

export async function getParcelsInBoundingBox(minLat: number, minLon: number, maxLat: number, maxLon: number): Promise<Parcel[]> {
  // Construct a bounding box polygon in EWKT format
  const bboxPolygon = `POLYGON(( ${minLon} ${minLat}, ${maxLon} ${minLat}, ${maxLon} ${maxLat}, ${minLon} ${maxLat}, ${minLon} ${minLat} ))`;

  // Use ST_Intersects to find parcels that intersect with the bounding box
  return db('parcels')
    .whereRaw('ST_Intersects(boundary, ST_SetSRID(ST_GeomFromEWKT(?), 4326))', [bboxPolygon])
    .select('*');
}

export async function getParcelsInGeoJSONPolygon(geojsonPolygon: any): Promise<Parcel[]> {
  const polygonWKT = `SRID=4326;${JSON.stringify(geojsonPolygon)}`;
  return db('parcels')
    .whereRaw('ST_Intersects(boundary, ST_GeomFromGeoJSON(?))', [JSON.stringify(geojsonPolygon)])
    .select('*');
}