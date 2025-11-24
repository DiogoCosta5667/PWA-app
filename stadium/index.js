const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const path = require("path");
const config = require("./config");
const socketIo = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./router");

const hostname = process.env.HOSTNAME || "127.0.0.1";
const port = process.env.PORT || 3000;
const customFrontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

mongoose.set("strictQuery", true);
mongoose
  .connect(config.db)
  .then(() => console.log("Connection successful!"))
  .catch((err) => console.error(err));

const app = express();
const server = http.Server(app);

//  Initialize Socket.IO first
const io = socketIo(server, {
  cors: {
    origin: customFrontendUrl,
  },
});

// Middleware
app.use(
  cors({
    origin: customFrontendUrl,
    credentials: true,
  })
);
app.options("*", cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());

//  Now that 'io' exists, you can safely pass it to the router
app.use(router.init(io));

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
