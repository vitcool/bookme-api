const express = require('express');

const User = require('../models/user');

const auth = require('../middlewares/auth');

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

router.get('/users/me', auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch('/users/me', auth, async (req, res) => {
  const { user, body } = req;
  const updates = Object.keys(body);

  const allowedUpdates = ['firstName', 'secondName', 'email', 'password', 'isTasker'];
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

  if (isValidUpdate) {
    try {
      updates.forEach((update) => {
        user[update] = body[update];
      });

      await req.user.save();
      return res.send(req.user);
    } catch (e) {
      req.status(500).send(e);
    }
  }
  return req.status(400).send();
});

// add user middleware
// add get user info endpoint
// add the ability to create two types of users - bookers and taskers
// add update user endpoint

module.exports = router;
