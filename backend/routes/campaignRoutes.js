const express = require('express');
const router = express.Router();
const { 
  getCampaigns, 
  createCampaign, 
  triggerAgent, 
  getCampaignById, 
  updateCampaign,
  updateCampaignStatus,
  globalPause,
  getCampaignIntelligence,
  getCampaignProspects,
  testAgentPipeline,
} = require('../controllers/campaignController');
const verifyToken = require('../middleware/middleware');

router.use(verifyToken); 

router.get('/', getCampaigns);
router.post('/', createCampaign);
router.patch('/pause-all', globalPause);
router.post('/:id/test-pipeline', testAgentPipeline);
router.get('/:id', getCampaignById); 
router.get('/:id/intelligence', getCampaignIntelligence);
router.get('/:id/prospects', getCampaignProspects);
router.put('/:id', updateCampaign);  
router.patch('/:id/status', updateCampaignStatus);
router.post('/:id/trigger-agent', triggerAgent);

module.exports = router;