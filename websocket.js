import WebSocket, { WebSocketServer } from "ws";

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });
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

    // Broadcast price updates to all connected WebSocket clients
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

  return wss;
}
