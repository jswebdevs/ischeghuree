import { Router } from 'express';
import { getSpecialCollection, getCollectionByTag } from '../controllers/special.controller';

const router = Router();

router.get('/tag/:tag', getCollectionByTag);

router.get('/:type', getSpecialCollection);

export default router;