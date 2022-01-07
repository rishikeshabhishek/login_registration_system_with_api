const router = require("express").Router();
const AuthController = require("../controllers/AuthController");
const verifySignup = require("../middlewares/verifySignup");


router.post("/signup", [verifySignup.checkDuplicateEntries], AuthController.signup);
router.get("/confirmation/:email/:token", AuthController.confirmation);
router.post("/signin", AuthController.signin);
module.exports = router;