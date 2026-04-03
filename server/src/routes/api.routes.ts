import { Router } from 'express';
import { postCampaign, getCampaigns, postEvent, getStats, deleteCampaign } from '../controllers/api.controller';

const router = Router();

router.post('/campaigns', postCampaign);
router.get('/campaigns', getCampaigns);
router.delete('/campaigns/:id', deleteCampaign);
router.post('/events', postEvent);
router.get('/stats', getStats);

export default router;
