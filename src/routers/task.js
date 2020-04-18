/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const Task = require('../models/task');

const auth = require('../middlewares/auth');

const router = new express.Router();

/**
 * @swagger
 * /task:
 *  post:
 *    summary: create new task
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
  const { _id, fullName } = req.user;
  const task = new Task({ ...body, ownerId: _id, ownerFullName: fullName });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

/**
 * @swagger
 * /tasks:
 *  get:
 *    summary: get list of tasks
 *    description: Use to get list of tasks
 *    parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *         description: The number of items to skip before starting to collect the result set
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The numbers of items to return
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: status of tasks to return
 *    responses:
 *      '200':
 *        description: A successfully performed request
 *      '401':
 *        description: Unauth
 *      '500':
 *         description: Something went wrong
 */
router.get('/tasks', auth, async (req, res) => {
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
});


/**
 * @swagger
 * /tasks:
 *  get:
 *    summary: get list of tasks created by current user
 *    description: Use to get list of tasks
 *    parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *         description: The number of items to skip before starting to collect the result set
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The numbers of items to return
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: status of tasks to return
 *    responses:
 *      '200':
 *        description: A successfully performed request
 *      '401':
 *        description: Unauth
 *      '500':
 *         description: Something went wrong
 */
router.get('/tasks/my', auth, async (req, res) => {
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
});

/**
 * @swagger
 * /tasks/{id}:
 *  get:
 *    summary: Get a task by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric ID of the task to get
 *    responses:
 *      '200':
 *        description: A successfully performed request
 *      '401':
 *        description: Unauth
 *      '500':
 *        description: Something went wrong
 */
// need to add documentation
router.get('/task/:id', auth, async (req, res) => {
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
});

module.exports = router;
