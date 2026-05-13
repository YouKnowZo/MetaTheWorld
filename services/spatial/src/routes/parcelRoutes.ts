import { Router } from 'express';
import { getParcelsByBBox, getParcelById, getParcelTiles } from '../controllers/parcelController';

const router = Router();

router.get('/', getParcelsByBBox);
router.get('/:id', getParcelById);
router.get('/:id/tiles', getParcelTiles);

export default router;
