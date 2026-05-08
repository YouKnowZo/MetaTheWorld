# Spatial Service

The Spatial Service is responsible for managing all spatial data within the Meta The World metaverse. This includes virtual land parcels, their ownership, and performing various geographic queries. It leverages PostgreSQL with the PostGIS extension for robust spatial data handling.

## Features:

- **Parcel Management**: Full CRUD (Create, Read, Update, Delete) operations for virtual land parcels.
- **Ownership Tracking**: Associates parcels with specific owners (wallet addresses).
- **Spatial Queries**: Supports queries such as:
  - Retrieving parcels within a bounding box.
  - Retrieving parcels that intersect with a given GeoJSON polygon.
  - Fetching individual parcel details by ID or owner.
- **Tile Generation**: Provides functionality to generate map tiles for visualizing parcels.
- **Data Validation**: Uses Zod for robust input validation of API requests.

## Technologies:

- **TypeScript**: Primary language for development.
- **Express.js**: For building the RESTful API.
- **Knex.js**: A SQL query builder for interacting with the PostgreSQL database.
- **PostgreSQL/PostGIS**: Relational database with spatial capabilities.
- **Zod**: For schema validation and type-safe parsing.

## API Endpoints:

- `POST /parcels`: Create a new parcel.
  - Request Body: `CreateParcelSchema`
- `GET /parcels`: Get parcels within a bounding box.
  - Query Params: `minLat, minLon, maxLat, maxLon`
- `POST /parcels/geojson`: Get parcels within a GeoJSON polygon.
  - Request Body: `GeoJSONPolygonSchema`
- `GET /parcels/:id`: Get a parcel by its ID.
- `GET /parcels/owner/:ownerAddress`: Get all parcels owned by a specific address.
- `PUT /parcels/:id`: Update an existing parcel.
  - Request Body: `UpdateParcelSchema`
- `DELETE /parcels/:id`: Delete a parcel.
- `GET /parcels/:id/tiles`: Get map tiles for a specific parcel.
- `GET /parcels/tiles/:z/:x/:y`: Get a map tile by zoom, x, and y coordinates.

## Setup and Running:

1.  **Dependencies**: Ensure Node.js, PostgreSQL, and PostGIS are installed and configured.

2.  **Environment Variables**: The service typically connects to a PostgreSQL database. Configuration will be in `knexfile.ts` or via environment variables.

3.  **Install Dependencies**:
    ```bash
    cd services/spatial
    npm install
    ```

4.  **Database Migrations and Seeds**:
    Run database migrations to set up the schema and seed data.
    ```bash
    cd services/spatial
    npx knex migrate:latest
    npx knex seed:run
    ```

5.  **Run the service**:
    ```bash
    npm start
    ```
    The service will start and listen for incoming API requests.