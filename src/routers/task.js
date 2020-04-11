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
 *    parameters:
 *       - name: title
 *         description: Title of task
 *         in: formData
 *         required: true
 *         type: string
 *       - name: description
 *         description: Description of the task
 *         in: formData
 *         required: true
 *         type: string
 *       - name: status
 *         description: Status of the task
 *         in: formData
 *         required: true
 *         type: string
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

module.exports = router;
