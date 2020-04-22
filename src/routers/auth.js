const express = require('express');

const UserController = require('../controllers/user');

const AuthService = require('../services/auth');

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
  try {
    const { body: userData } = req;
    const user = await AuthService.signUp(userData);
    res.status(201).send(user);
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
  try {
    const { body: loginPayload } = req;
    const user = await AuthService.login(loginPayload);
    res.send(user);
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
router.get('/users/me', auth, (req, res) => {
  UserController.getCurrentUserProfile(req, res);
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
router.get('/users/:id', auth, (req, res) => {
  UserController.getUserProfileById(req, res);
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
router.patch('/users/me', auth, (req, res) => {
  UserController.updateCurrentUser(req, res);
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
    const { user, token } = req;
    const loggedOutUser = AuthService.logout(user, token);
    await loggedOutUser.save();
    res.send();
  } catch (e) {
    res.status(400).send(e.message);
  }
});

/**
 * @swagger
 * /users/me:
 *  delete:
 *    summary: remove current user
 *    description: remove current token
 *    responses:
 *      '200':
 *        description: A successfully performed request
 *      '401':
 *        description: Unauth
 *      '500':
 *         description: Something went wrong
 */
router.delete('/users/me', auth, async (req, res) => {
  try {
    const { user } = req;
    await AuthService.remove(user);
    res.send();
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;
