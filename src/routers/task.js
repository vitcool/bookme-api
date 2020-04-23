const express = require('express');

const TaskService = require('../services/task');

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
router.post('/tasks', auth, async (req, res) => {
  try {
    const { body, user } = req;
    const task = TaskService.createTask(body, user);
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
  try {
    const { query, user } = req;
    const tasksList = await TaskService.getTasksList(query, user);
    if (tasksList) {
      res.status(200).send(tasksList);
    }
    if (!tasksList) {
      res.status(400).send();
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
  try {
    const { query, user } = req;
    const tasksList = await TaskService.getCurrentUserTasks(query, user);
    if (tasksList) {
      res.status(200).send(tasksList);
    }
    if (!tasksList) {
      res.status(400).send();
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
router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const { _id: id } = req.params;
    const task = await TaskService.getTaskById(id);
    if (!task) {
      return res.status(404).send();
    }
    return res.send(task);
  } catch (e) {
    return res.status(500).send(e);
  }
});

/**
 * @swagger
 * /tasks/{id}:
 *  patch:
 *    summary: update task by id
 *    description: Use to update the task by id
 *    requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/Task'
 *    responses:
 *      '200':
 *        description: A successfully performed request
 *      '401':
 *        description: Unauth
 *      '500':
 *         description: Something went wrong
 */
router.patch('/tasks/:id', auth, async (req, res) => {
  try {
    const { body, user } = req;
    const { id } = req.params;
    const task = TaskService.updateTask(id, body, user);
    if (!task) {
      return res.status(404).send();
    }
    await task.save();
    return res.send(task);
  } catch (e) {
    return res.status(500).send(e);
  }
});

module.exports = router;
