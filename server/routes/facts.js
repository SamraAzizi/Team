const express = require('express');
const router = express.Router();
const factsController = require('../controllers/factsController');

// GET all science facts
router.get('/', factsController.getAllFacts);

// GET a random science fact
router.get('/random', factsController.getRandomFact);

// GET a specific fact by ID
router.get('/:id', factsController.getFactById);

// POST a new science fact
router.post('/', factsController.createFact);

// PUT/update an existing fact
router.put('/:id', factsController.updateFact);

// DELETE a fact
router.delete('/:id', factsController.deleteFact);

module.exports = router;