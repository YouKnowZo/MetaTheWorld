import { Router } from 'express';
import {
  createParcelController,
  getParcelByIdController,
  getParcelsByOwnerController,
  updateParcelController,
  deleteParcelController,
  getParcelsByBBoxController,
  getParcelsInGeoJSONController,
  getParcelTiles,
  getTileByKey,
} from '../controllers/parcelController';

const router = Router();

router.post('/', createParcelController);
router.get('/', getParcelsByBBoxController);
router.post('/geojson', getParcelsInGeoJSONController);
router.get('/:id', getParcelByIdController);
router.get('/owner/:ownerAddress', getParcelsByOwnerController);
router.put('/:id', updateParcelController);
router.delete('/:id', deleteParcelController);
router.get('/:id/tiles', getParcelTiles);
router.get('/tiles/:z/:x/:y', getTileByKey);

export default router;
