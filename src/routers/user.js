const express = require('express');

const User = require('../models/user');

const router = new express.Router();

router.post('/users', async (req, res) => {
  const { body } = req;
  const user = new User(body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.post('/users/login', async (req, res) => {
  const { body } = req;
  const { email, password } = body;

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ token, user });
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;
