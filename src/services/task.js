/* eslint-disable no-console */
const Task = require('../models/task');

class TaskService {
  static async createTask(taskDetails, currentUser) {
    try {
      const { _id, fullName } = currentUser;
      const task = new Task({
        ...taskDetails,
        ownerId: _id,
        ownerFullName: fullName,
      });
      return task;
    } catch (e) {
      console.error(`TaskService.createTask error - ${e.message}`);
      throw e;
    }
  }

  static async getTasksList(query, user) {
    const { status, skip, limit } = query;
    let total;
    try {
      const filter = {
        ...(status ? { status } : {}),
      };
      const pagination = {
        ...(skip ? { skip: +skip } : {}),
        ...(limit ? { limit: +limit } : {}),
      };
      if (user) {
        await Task.countDocuments({ ...filter }, (err, count) => {
          if (err) {
            console.log('error', err);
          }
          total = count;
        });
        const tasks = await Task.find({ ...filter }, null, pagination);
        return { tasks, total };
      }
      return null;
    } catch (e) {
      console.error(`TaskService.getTasksList error - ${e.message}`);
      throw e;
    }
  }

  static async getCurrentUserTasks(query, user) {
    const { status, skip, limit } = query;
    let total;
    try {
      const filter = {
        ...(status ? { status } : {}),
      };
      const pagination = {
        ...(skip ? { skip: +skip } : {}),
        ...(limit ? { limit: +limit } : {}),
      };
      if (user) {
        const { isTasker, _id: id } = user;
        const isBooker = !isTasker;
        if (isBooker) {
          await Task.countDocuments(
            { ...filter, ownerId: id },
            (err, count) => {
              if (err) {
                console.log('error', err);
              }
              total = count;
            },
          );
          await user
            .populate({
              path: 'tasks',
              match: filter,
              options: pagination,
            })
            .execPopulate();
          return { tasks: user.tasks, total };
        }
      }
      return null;
    } catch (e) {
      console.error(`TaskService.getCurrentUserTasks error - ${e.message}`);
      throw e;
    }
  }

  static async getTaskById(id) {
    try {
      const task = await Task.findOne({ _id: id });
      return task;
    } catch (e) {
      console.error(`TaskService.getTaskById error - ${e.message}`);
      throw e;
    }
  }

  static async updateTask(id, updateFields, user) {
    try {
      const { _id: userId } = user;
      const task = await Task.findOne({ _id: id });
      const { ownerId } = task;
      const isUpdateAllowwed = `${userId}` === `${ownerId}`;
      if (isUpdateAllowwed) {
        const allowedUpdates = ['title', 'description', 'status'];
        const updates = Object.keys(updateFields);
        const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

        if (isValidUpdate) {
          updates.forEach((update) => {
            task[update] = updateFields[update];
          });
          return task;
        }
      }
      return null;
    } catch (e) {
      console.error(`TaskService.updateTask error - ${e.message}`);
      throw e;
    }
  }
}

module.exports = TaskService;
