const express = require('express');
const router = express.Router();
const { getPendingApprovals, updateApproval } = require('../controllers/approvalController');

router.get('/', getPendingApprovals);
router.put('/:id', updateApproval);

module.exports = router;

