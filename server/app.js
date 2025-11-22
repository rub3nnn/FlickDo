const express = require("express");
const cors = require("cors");
const config = require("./src/config");
const routes = require("./src/routes");
const { errorHandler, notFound } = require("./src/middleware/error.middleware");

const app = express();

// Middlewares
app.use(
  cors({
    origin: "*", //config.clientUrl
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging en desarrollo
if (config.nodeEnv === "development") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Ruta raíz
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FlickDo API v1.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
    },
  });
});

// API Routes
app.use("/api", routes);

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

// Iniciar servidor
app.listen(config.port, () => {
  console.log(`
╔════════════════════════════════════════╗
║   FlickDo API Server                   ║
╠════════════════════════════════════════╣
║   Environment: ${config.nodeEnv.padEnd(24)} ║
║   Port: ${config.port.toString().padEnd(31)} ║
║   Client URL: ${config.clientUrl.padEnd(22)} ║
╚════════════════════════════════════════╝
  `);
});
