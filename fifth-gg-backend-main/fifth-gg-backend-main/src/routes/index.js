const express = require("express");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");
const availabilityRoutes = require("./availability.routes");
const matchRoutes = require("./match.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/availability", availabilityRoutes);
router.use("/match", matchRoutes);

module.exports = router;
