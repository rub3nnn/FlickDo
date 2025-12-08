const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const listsRoutes = require("./lists.routes");
const tasksRoutes = require("./tasks.routes");
const profilesRoutes = require("./profiles.routes");
const usersRoutes = require("./users.routes");

// Health check
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "FlickDo API está funcionando",
    timestamp: new Date().toISOString(),
  });
});

// Rutas
router.use("/auth", authRoutes);
router.use("/lists", listsRoutes); // Las rutas de tags están anidadas aquí: /lists/:listId/tags
router.use("/tasks", tasksRoutes);
router.use("/profiles", profilesRoutes);
router.use("/users", usersRoutes);

module.exports = router;
