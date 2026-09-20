const express = require('express');
const router = express.Router();
const { 
  getCampaigns, 
  createCampaign, 
  triggerAgent, 
  getCampaignById, 
  updateCampaign,
  updateCampaignStatus
} = require('../controllers/campaignController');
const verifyToken = require('../middleware/middleware');

router.use(verifyToken); 

router.get('/', getCampaigns);
router.post('/', createCampaign);
router.get('/:id', getCampaignById); // Fetch single campaign
router.put('/:id', updateCampaign);  // Update campaign
router.patch('/:id/status', updateCampaignStatus);
router.post('/:id/trigger-agent', triggerAgent);

module.exports = router;