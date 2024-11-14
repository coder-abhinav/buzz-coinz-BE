const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();

require("dotenv").config();

app.use(cors({ origin: "http://localhost:5173" }));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const prices = {};

const symbols = ["dogeusdt", "ethusdt"];
const binanceWs = new WebSocket(
  `wss://stream.binance.com:9443/stream?streams=${symbols
    .map((symbol) => `${symbol}@trade`)
    .join("/")}`
);

binanceWs.on("message", (data) => {
  const message = JSON.parse(data);
  const symbol = message.stream.split("@")[0];
  const price = message.data.p;
  prices[symbol.toUpperCase()] = price;

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ symbol: symbol.toUpperCase(), price }));
    }
  });
});

binanceWs.on("open", () => {
  console.log("Connected to Binance WebSocket");
});

binanceWs.on("close", () => {
  console.log("Disconnected from Binance WebSocket");
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
