const router = require("express").Router();
const UserController = require("../controllers/UserController");
const AuthController = require("../controllers/AuthController");

router.get("/", UserController.index);
router.get("/user-dashboard", UserController.userAuth, UserController.userDashboard);
router.get("/logout", UserController.logout);

module.exports = router;