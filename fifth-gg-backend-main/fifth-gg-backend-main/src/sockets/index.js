const registerMatchSockets = require("./match.socket");
const registerChatSockets = require("./chat.socket");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Client connected", socket.id);

    // Global User Identification for notifications
    socket.on("user:identify", (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`User ${userId} joined their personal notification room.`);
      }
    });
    registerMatchSockets(io, socket);
    registerChatSockets(io, socket);

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
      // later: clean up availability / presence
    });
  });
};
