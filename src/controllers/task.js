/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable consistent-return */
const Task = require('../models/task');

const createTask = async (req, res) => {
  const { body } = req;
  const { _id, fullName } = req.user;
  const task = new Task({ ...body, ownerId: _id, ownerFullName: fullName });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const getTasksList = async (req, res) => {
  const { status, skip, limit } = req.query;
  let total;
  try {
    const filter = {
      ...(status ? { status } : {}),
    };
    const pagination = {
      ...(skip ? { skip: +skip } : {}),
      ...(limit ? { limit: +limit } : {}),
    };
    if (req.user) {
      await Task.countDocuments({ ...filter }, (err, count) => {
        if (err) {
          console.log('error', err);
        }
        total = count;
      });
      const tasks = await Task.find({ ...filter }, null, pagination);
      res.status(200).send({ tasks, total });
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const getTasksOfCurrentUser = async (req, res) => {
  const { status, skip, limit } = req.query;
  let total;
  try {
    const filter = {
      ...(status ? { status } : {}),
    };
    const pagination = {
      ...(skip ? { skip: +skip } : {}),
      ...(limit ? { limit: +limit } : {}),
    };
    if (req.user) {
      const { isTasker } = req.user;
      const isBooker = !isTasker;
      if (isBooker) {
        await Task.countDocuments({ ...filter, ownerId: req.user._id }, (err, count) => {
          if (err) {
            console.log('error', err);
          }
          total = count;
        });
        await req.user
          .populate({
            path: 'tasks',
            match: filter,
            options: pagination,
          })
          .execPopulate();
        res.send({ tasks: req.user.tasks, total });
      }
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
};

const getTaskById = async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOne({ _id });
    if (!task) {
      return res.status(404).send();
    }
    return res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
};

const updateTask = async (req, res) => {
  const { body, user } = req;
  const { _id: userId } = user;
  const _id = req.params.id;
  const task = await Task.findOne({ _id });
  const { ownerId } = task;
  const isUpdateAllowwed = `${userId}` === `${ownerId}`;
  if (!task) {
    return res.status(404).send();
  }
  if (isUpdateAllowwed) {
    const allowedUpdates = ['title', 'description', 'status'];
    const updates = Object.keys(body);
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

    if (isValidUpdate) {
      updates.forEach((update) => {
        task[update] = body[update];
      });
      await task.save();
      return res.send(task);
    }
  }
  return res.status(400).send();
};

module.exports = {
  createTask,
  getTasksList,
  getTasksOfCurrentUser,
  getTaskById,
  updateTask,
};
