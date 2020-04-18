/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - firstName
 *          - secondName
 *          - email
 *          - password
 *          - isTasker
 *        properties:
 *          firstName:
 *            type: string
 *            description: First name of the user
 *          secondName:
 *            type: string
 *            description: Second name of the user
 *          email:
 *            type: string
 *            description: Email of the user
 *          password:
 *            type: string
 *            description: Password of the user
 *          isTasker:
 *            type: boolean
 *            description: Define is user tasker or no
 *        example:
 *           firstName: Test
 *           secondName: Test
 *           email: test@test.com
 *           password: testtest
 *           isTasker: false
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      UserLogin:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          email:
 *            type: string
 *            description: Email of the user
 *          password:
 *            type: string
 *            description: Password of the user
 *        example:
 *           email: test@test.com
 *           password: testtest
 */

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    secondName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lovercase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    isTasker: {
      type: Boolean,
      required: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'ownerId',
});

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.secondName}`;
});

userSchema.methods.toJSON = function () {
  const user = this;
  const publicUser = user.toObject();

  delete publicUser.password;
  delete publicUser.tokens;

  return publicUser;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error('Unable to login');
    }

    return user;
  }
  throw new Error('Unable to login');
};

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
