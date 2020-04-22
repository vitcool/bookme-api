const express = require('express');

const UserController = require('../controllers/user');

// const UserService = require('../services/user');

const auth = require('../middlewares/auth');

const router = new express.Router();

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

module.exports = router;
