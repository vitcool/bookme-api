/* eslint-disable no-underscore-dangle */
const express = require('express');

const Task = require('../models/task');

const auth = require('../middlewares/auth');

const router = new express.Router();

/**
 * @swagger
 * /task:
 *  post:
 *    description: Use to create new task
 *    requestBody:
 *         required: true
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Task'
 *    responses:
 *      '201':
 *        description: A successfully created task
 *      '401':
 *        description: Unauth
 *      '500':
 *         description: Something went wrong
 */
router.post('/task', auth, async (req, res) => {
  const { body } = req;
  const task = new Task({ ...body, owner: req.user._id });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e.message);
  }
});


//need to add count for the great FE pagination + docsumentation
router.get('/tasks', auth, async (req, res) => {
  const { status, skip, limit } = req.query;
  try {
    const filter = {
      ...(status ? { status } : {}),
    };
    const pagination = {
      ...(skip ? { skip: +skip } : {}),
      ...(limit ? { limit: +limit } : {}),
    };
    const tasks = await Task.find({ ...filter }, null, pagination);
    res.status(200).send(tasks);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;
