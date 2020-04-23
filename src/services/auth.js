/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
const User = require('../models/user');

const EmailService = require('../services/email');

class AuthService {
  static async signUp(userData) {
    try {
      const { firstName, email } = userData;
      const user = new User(userData);
      const token = await user.generateAuthToken();
      EmailService.sendWelcomeEmail(email, firstName);
      return { user, token };
    } catch (e) {
      console.error(`AuthService.signUp error - ${e.message}`);
      throw e;
    }
  }

  static async login({ email, password }) {
    try {
      const user = await User.findByCredentials(email, password);
      const token = await user.generateAuthToken();
      return { user, token };
    } catch (e) {
      console.error(`AuthService.login error - ${e.message}`);
      throw e;
    }
  }

  static logout(user, token) {
    try {
      const newTokens = user.tokens.filter((t) => t.token !== token);
      user.tokens = newTokens;
      return user;
    } catch (e) {
      console.error(`AuthService.logout error - ${e.message}`);
      throw e;
    }
  }

  static async delete(user) {
    try {
      await user.remove();
    } catch (e) {
      console.error(`AuthService.delete error - ${e.message}`);
      throw e;
    }
  }
}

module.exports = AuthService;
