const express = require('express');
const router = express.Router();
const { getCampaigns, triggerAgent } = require('../controllers/campaignController');
const verifyToken = require('../middleware/middleware');

router.use(verifyToken); 

router.get('/', getCampaigns);
router.post('/:id/trigger-agent', triggerAgent);

module.exports = router;