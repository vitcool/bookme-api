/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const express = require('express');

const User = require('../models/user');

const auth = require('../middlewares/auth');

const router = new express.Router();

/**
 * @swagger
 * /users:
 *  post:
 *    summary: signup new user
 *    description: Use to create new user
 *    requestBody:
 *         required: true
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *    responses:
 *      '201':
 *        description: A successfully created user
 *      '401':
 *        description: Unauth
 *      '500':
 *         description: Something went wrong
 */
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

/**
 * @swagger
 * /users/login:
 *  post:
 *    summary: login the user
 *    description: Use to login new user
 *    requestBody:
 *         required: true
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserLogin'
 *    responses:
 *      '201':
 *        description: A logged in user
 *      '401':
 *        description: Unauth
 *      '500':
 *         description: Something went wrong
 */
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

/**
 * @swagger
 * /users/me:
 *  get:
 *    summary: get current user profile
 *    description: Use to display all of the user profile data
 *    responses:
 *      '200':
 *        description: A successfully performed request
 *      '401':
 *        description: Unauth
 *      '500':
 *         description: Something went wrong
 */
router.get('/users/me', auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

/**
 * @swagger
 * /users/{id}:
 *  get:
 *    summary: Get a user by ID
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: integer
 *        required: true
 *        description: Numeric ID of the user to get
 *    responses:
 *      '200':
 *        description: A successfully performed request
 *      '401':
 *        description: Unauth
 *      '500':
 *        description: Something went wrong
 */
router.get('/users/:id', auth, async (req, res) => {
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
});

/**
 * @swagger
 * /users/me:
 *  patch:
 *    summary: update current user profile
 *    description: Use to update user profile fields
 *    requestBody:
 *      required: true
 *      content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/User'
 *    responses:
 *      '200':
 *        description: A successfully performed request
 *      '401':
 *        description: Unauth
 *      '500':
 *         description: Something went wrong
 */
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
      res.status(500).send(e);
    }
  }
  return res.status(400).send();
});

/**
 * @swagger
 * /users/logout:
 *  post:
 *    summary: logout current user
 *    description: kills current token
 *    responses:
 *      '200':
 *        description: A successfully performed request
 *      '401':
 *        description: Unauth
 *      '500':
 *         description: Something went wrong
 */
router.post('/users/logout', auth, async (req, res) => {
  try {
    const newTokens = req.user.tokens.filter((token) => token.token !== req.token);
    req.user.tokens = newTokens;

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
