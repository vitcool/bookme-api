const User = require('../models/user');

class UserService {
  static async signUp(userData) {
    try {
      const user = new User(userData);
      const token = await user.generateAuthToken();
      return { user, token };
    } catch (e) {
      console.error(`AuthService.signUp error - ${e.message}`);
      throw e;
    }
  }
}

module.exports = UserService;
