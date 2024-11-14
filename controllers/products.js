import WebSocket, { WebSocketServer } from "ws"; // Use named import for WebSocketServer
import http from "http";
import express from "express";

const getAllProducts = async (req, res) => {
  res.status(200).json({ msg: "getting products here" });
};

const getAllProductsTest = async (req, res) => {
  res.status(200).json({ msg: "getting test products here" });
};

export { getAllProducts, getAllProductsTest };
