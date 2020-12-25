require("dotenv").config();
const express = require("express"),
  socket = require("socket.io"),
  path = require("path"),
  { createClient } = require("redis"),
  REDIS_HOST = process.env.REDIS_HOST,
  REDIS_PORT = process.env.REDIS_PORT || 6379,
  REDIS_CHANNEL = process.env.REDIS_CHANNEL || "events",
  redis = createClient({ host: REDIS_HOST, port: REDIS_PORT }),
  cors = require("cors");
redis.on("connect", () => {
  console.log("==> connected to redis");
});
// App setup
const PORT = process.env.PORT || 5000;
const app = express();
app
  .use(cors())
  .use(express.static(path.join(__dirname, "./redis-events/build")));

// if invalid endpoint is called
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./redis-events/build"));
});

const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Socket setup
const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
  },
});

io.on("connection", function (socket) {
  console.log("Client connected");
  redis.subscribe(REDIS_CHANNEL);
  redis.on("message", (channel, message) => {
    if (channel !== REDIS_CHANNEL) return;
    socket.emit("FromAPI", message);
  });
  redis.on("error", (err) => {
    console.log("Error while getting data: ", err);
    redis.unsubscribe(REDIS_CHANNEL);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    redis.unsubscribe(REDIS_CHANNEL);
  });
});
