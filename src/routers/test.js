const express = require('express');

const router = new express.Router();

router.get('/test', (req, res) => {
  try {
    res.send({ result: 'OK' });
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
