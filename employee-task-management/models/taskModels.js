const tasks = require("../data/taskData");

function getAllTasks() {
  return tasks;
}

function getTaskById(id) {
  let returnedTask = tasks.find((task) => {
    return task.id === Number(id);
  });

  return returnedTask;
}

function createTask(task) {
  const newId =
    tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;

  let newTask = { id: newId, ...task };
  tasks.push(newTask);

  return newTask;
}

function updateTask(id, updatedTask) {
  let searchedTask = tasks.find((task) => {
    return task.id === Number(id);
  });

  if (!searchedTask) {
    return null;
  }

  return Object.assign(searchedTask, updatedTask);
}

function patchTask(id, updates) {
  let searchedTask = tasks.find((task) => {
    return task.id === Number(id);
  });

  if (!searchedTask) {
    return null;
  }

  return Object.assign(searchedTask, updates);
}

function deleteTask(id) {
  let searchedTask = tasks.find((task) => {
    return task.id === Number(id);
  });

  if (!searchedTask) {
    return null;
  }

  let index = tasks.indexOf(searchedTask);

  return tasks.splice(index, 1)[0];
}

function filterByStatus(status) {
  let filteredTask = tasks.filter((task) => {
    return task.status === status;
  });

  return filteredTask;
}

function filterByPriority(priority) {
  let filteredTask = tasks.filter((task) => {
    return task.priority === priority;
  });

  return filteredTask;
}

function totalTasks() {
  let pendingTasks = 0;
  let inProgressTasks = 0;
  let completedTasks = 0;

  let taskCounting = tasks.length;

  tasks.forEach((task) => {
    if (task.status === "Pending") {
      pendingTasks++;
    } else if (task.status === "In Progress") {
      inProgressTasks++;
    } else if (task.status === "Completed") {
      completedTasks++;
    }
  });

  return {
    taskCounting,
    pendingTasks,
    inProgressTasks,
    completedTasks,
  };
}

function employeeTasks(employeeName) {
  let filteredTasks = tasks.filter((task) => {
    return task.assignedTo === employeeName;
  });

  return filteredTasks;
}

function overdueTasks() {
  const today = new Date();

  let filteredTask = tasks.filter((task) => {
    const dueDate = new Date(task.dueDate);

    return dueDate < today && task.status !== "Completed";
  });

  return filteredTask;
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  patchTask,
  deleteTask,
  filterByStatus,
  filterByPriority,
  totalTasks,
  employeeTasks,
  overdueTasks,
};
