const express = require('express');
const router = express.Router();
const {
    createAndSendNewsletter,
    getAllNewsletters,
    deleteNewsletter
} = require('../controllers/newsletterController');

router.post('/', createAndSendNewsletter);              

router.get('/', getAllNewsletters);              

router.delete('/:newsletterId', deleteNewsletter);  // Adjusted to use newsletterId as per controller

module.exports = router;
