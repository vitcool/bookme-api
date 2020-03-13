const express = require('express');

const User = require('../models/user');

const router = new express.Router();

router.post('/users', async (req, res) => {
  const { body } = req;
  const user = new User(body);

  try {
    await user.save();
    res.status(201).send({ user });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;
