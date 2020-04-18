/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const User = require('../models/user');

const createUser = async (req, res) => {
  const { body } = req;
  const user = new User(body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const login = async (req, res) => {
  const { body } = req;
  const { email, password } = body;

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ token, user });
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const getCurrentUserProfile = async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
};

const getUserProfileById = async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findOne({ _id });
    if (!user) {
      return res.status(404).send();
    }
    return res.send(user);
  } catch (e) {
    res.status(500).send(e);
  }
};

const updateCurrentUser = async (req, res) => {
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
      res.status(500).send(e);
    }
  }
  return res.status(400).send();
};

const logout = async (req, res) => {
  try {
    const newTokens = req.user.tokens.filter((token) => token.token !== req.token);
    req.user.tokens = newTokens;

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
};

const deleteCurrentUser = async (req, res) => {
  try {
    await req.user.remove();
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUserProfile,
  getUserProfileById,
  updateCurrentUser,
  logout,
  deleteCurrentUser,
};
