const express = require("express");
const router = express.Router();
const { registerUser, authUser, allUsers } = require("../controllers/usersController");
const { protect } = require("../middileware/authMiddileware");

router.route("/").post(registerUser).get(protect,allUsers);
router.post('/login', authUser);

module.exports = router;

