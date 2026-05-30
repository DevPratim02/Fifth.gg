const registerMatchSockets = require("./match.socket");
const registerChatSockets = require("./chat.socket");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Client connected", socket.id);
    registerMatchSockets(io, socket);
    registerChatSockets(io, socket);

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
      // later: clean up availability / presence
    });
  });
};
