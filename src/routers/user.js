/* eslint-disable consistent-return */
const express = require('express');

const UserService = require('../services/user');

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
  const { _id: id } = req.params.id;
  try {
    const user = await UserService.getUserProfileById(id);
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
  try {
    const updatedUser = UserService.updateCurrentUser(user, body);
    if (updatedUser) {
      await updatedUser.save();
      return res.send(updatedUser);
    }
    return res.status(400).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
