const router = require("express").Router();
const AuthApi = require("../api/AuthApi");
const UserApi = require("../api/UserApi");
const verifySignup = require("../middlewares/verifySignupApi");

router.get("/", UserApi.index);
router.post("/signup", [verifySignup.checkDuplicateEntries], AuthApi.signup);
router.get("/confirmation/:email/:token", AuthApi.confirmation);
router.post("/signin", AuthApi.signin);
router.get("/logout", UserApi.logout);

module.exports = router;