const express = require('express');
const { check } = require('express-validator');

const tripsControllers = require('../controllers/trips-controllers');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:pid', tripsControllers.getTripById);

router.get('/user/:uid', tripsControllers.getTripsByUserId);

router.use(checkAuth);

router.post(
  '/',
  fileUpload.single('image'),
  [check('title').not().isEmpty(), check('description').isLength({ min: 5 }), check('location').not().isEmpty()],
  tripsControllers.createTrip
);

router.patch(
  '/:pid',
  [check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
  tripsControllers.updateTrip
);

router.delete('/:pid', tripsControllers.deleteTrip);

module.exports = router;
