/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
const User = require('../models/user');

class UserService {
  static async getUserProfileById(id) {
    try {
      const user = await User.findOne({ id });
      return user;
    } catch (e) {
      console.error(`UserService.getUserProfileById error - ${e.message}`);
      throw e;
    }
  }

  static async updateCurrentUser(user, updateFields) {
    try {
      const updates = Object.keys(updateFields);
      const allowedUpdates = ['firstName', 'secondName', 'email', 'password', 'isTasker'];
      const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

      if (isValidUpdate) {
        updates.forEach((update) => {
          user[update] = updateFields[update];
        });
        return user;
      }
      return null;
    } catch (e) {
      console.error(`UserService.updateCurrentUser error: ${e.message}`);
      throw e;
    }
  }
}

module.exports = UserService;
