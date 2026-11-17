const taskModel = require("../models/taskModels");

function getAllTasks(req, res) {
  const tasks = taskModel.getAllTasks();
  res
    .status(200)
    .json({ success: true, message: "Tasks Returned", data: tasks });
}

function getTaskById(req, res) {
  let id = req.params.id;
  const task = taskModel.getTaskById(id);
  if (!task) {
    return res.status(404).json({ success: false, message: "Task not Found" });
  }
  res.status(200).json(task);
}

function createTask(req, res) {
  let task = req.body;
  const createdTasks = taskModel.createTask(task);
  res
    .status(201)
    .json({ success: true, message: "Task Created", data: createdTasks });
}

function updatedTask(req, res) {
  let id = req.params.id;
  const { id: ignoredId, ...updatedTask } = req.body;
  const updateTask = taskModel.updateTask(id, updatedTask);
  if (!updateTask) {
    return res.status(404).json({ success: false, message: "Task not Found" });
  }
  res
    .status(200)
    .json({ success: true, message: "Task Updated", data: updateTask });
}

function patchTask(req, res) {
  let id = req.params.id;
  const { id: ignoredId, ...updates } = req.body;
  const patchTask = taskModel.patchTask(id, updates);

  if (!patchTask) {
    return res.status(404).json({ success: false, message: "Task not Found" });
  }

  res
    .status(200)
    .json({ success: true, message: "Task Updated", data: patchTask });
}

function deleteTask(req, res) {
  let id = req.params.id;
  const deleteTask = taskModel.deleteTask(id);

  if (!deleteTask) {
    return res.status(404).json({ success: false, message: "Task not Found" });
  }

  res
    .status(200)
    .json({ success: true, message: "Task Updated", data: deleteTask });
}

function filterByStatus(req, res) {
  let status = req.params.status;
  const filterByStatus = taskModel.filterByStatus(status);
  res
    .status(200)
    .json({ success: true, message: "Task Returned", data: filterByStatus });
}

function filterByPriority(req, res) {
  let priority = req.params.priority;
  const filterByPriority = taskModel.filterByPriority(priority);
  res
    .status(200)
    .json({ success: true, message: "Task Returned", data: filterByPriority });
}

function totalTasks(req, res) {
  const totalTasks = taskModel.totalTasks();
  res
    .status(200)
    .json({ success: true, message: "Task Returned", data: totalTasks });
}

function employeeTasks(req, res) {
  let employeeName = req.params.name;
  const employeeTasks = taskModel.employeeTasks(employeeName);

  res
    .status(200)
    .json({ success: true, message: "Task Returned", data: employeeTasks });
}

function overdueTasks(req, res) {
  const overdueTasks = taskModel.overdueTasks();
  res
    .status(200)
    .json({ success: true, message: "Task Returned", data: overdueTasks });
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updatedTask,
  patchTask,
  deleteTask,
  filterByStatus,
  filterByPriority,
  totalTasks,
  employeeTasks,
  overdueTasks,
};
