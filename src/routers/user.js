const express = require('express');

const UserController = require('../controllers/user');

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
router.post('/users', (req, res) => {
  UserController.createUser(req, res);
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
router.post('/users/login', (req, res) => {
  UserController.login(req, res);
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
router.post('/users/logout', auth, (req, res) => {
  UserController.logout(req, res);
});

/**
 * @swagger
 * /users/logout:
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
router.delete('/users/me', auth, (req, res) => {
  try {
    UserController.deleteCurrentUser(req, res);
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

module.exports = router;
