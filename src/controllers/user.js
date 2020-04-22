/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const User = require('../models/user');

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

module.exports = {
  getCurrentUserProfile,
  getUserProfileById,
  updateCurrentUser,
};
