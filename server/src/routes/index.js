const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");

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

module.exports = router;
