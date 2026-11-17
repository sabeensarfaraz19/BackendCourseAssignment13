const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskControllers");

router.get("/summary", taskController.totalTasks);
router.get("/employee/:name", taskController.employeeTasks);
router.get("/overdue", taskController.overdueTasks);
router.get("/status/:status", taskController.filterByStatus);
router.get("/priority/:priority", taskController.filterByPriority);

router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updatedTask);
router.patch("/:id", taskController.patchTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
