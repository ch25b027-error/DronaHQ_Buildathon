const express = require('express');
const router = express.Router();
const { getPendingApprovals, updateApproval, getSettings, updateSettings } = require('../controllers/approvalController');

router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.get('/', getPendingApprovals);
router.put('/:id', updateApproval);

module.exports = router;

