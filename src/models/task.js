const mongoose = require('mongoose');

/**
 * @swagger
 *  components:
 *    schemas:
 *      Task:
 *        type: object
 *        required:
 *          - title
 *          - description
 *          - status
 *        properties:
 *          title:
 *            type: string
 *            description: Title of the task
 *          description:
 *            type: string
 *            description: Description of the task
 *          status:
 *            type: string
 *            description: Status of the task
 *        example:
 *           name: Test
 *           description: Test task description
 *           status: open
 */

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      reuqired: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
