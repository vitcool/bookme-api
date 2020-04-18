const express = require('express');

const TaskController = require('../controllers/task');

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
router.post('/tasks', auth, (req, res) => {
  TaskController.createTask(req, res);
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
  TaskController.getTasksList(req, res);
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
  TaskController.getTasksOfCurrentUser(req, res);
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
  TaskController.getTaskById(req, res);
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
  TaskController.updateTask(req, res);
});

module.exports = router;
