const express = require('express');

const router = new express.Router();

/**
 * @swagger
 * /test:
 *  get:
 *    description: Use to test all of the stafff
 *    responses:
 *      '200':
 *        description: A successful response
 *      '500':
 *         description: Something went wrong
 */
router.get('/test', (req, res) => {
  try {
    res.send({ result: 'OK' });
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
