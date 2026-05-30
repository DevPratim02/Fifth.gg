const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const config = require("./config");
const registerSockets = require("./sockets");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

registerSockets(io);

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port} (${config.env})`);
});
