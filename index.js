import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import productRoutes from "./routes/products.js";

import { setupWebSocket } from "./websocket.js";
import { error } from "console";

dotenv.config();

const app = express();

// CORS Middleware
app.use(cors({ origin: "http://localhost:5173" }));

// Initialize the HTTP server
const server = http.createServer(app);

// Set up WebSocket connection
setupWebSocket(server);

// Define API Routes
app.use("/api/products", productRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.stack) {
    throw new error(err.stack);
  }
  res.status(500).send("Something went wrong!");
});

// Set the server to listen on the specified port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
