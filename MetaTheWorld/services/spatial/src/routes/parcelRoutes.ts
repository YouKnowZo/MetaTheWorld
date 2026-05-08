import { Router } from 'express';
<<<<<<< HEAD
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
=======
import { getParcelsByBBox, getParcelById, getParcelTiles } from '../controllers/parcelController';

const router = Router();

router.get('/', getParcelsByBBox);
router.get('/:id', getParcelById);
router.get('/:id/tiles', getParcelTiles);
>>>>>>> e76a24433985ea600e5c84e9fa8c50aa7df308f7

export default router;
