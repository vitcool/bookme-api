const mongoose = require('mongoose');

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
