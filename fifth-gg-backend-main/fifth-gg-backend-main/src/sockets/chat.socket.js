const chatService = require("../services/chat.service");

module.exports = (io, socket) => {
    // Join a chat room
    socket.on("chat:join", async ({ roomId, userId }) => {
        socket.join(roomId);

        console.log(`User ${userId} joined chat room ${roomId}`);

        // Fetch chat history from DB
        try {
            const messages = await chatService.getMessages(roomId);
            socket.emit("chat:history", {
                roomId,
                messages: messages || [],
            });
        } catch (err) {
            console.error("Error fetching chat history:", err);
        }
    });

    // Leave a chat room
    socket.on("chat:leave", ({ roomId, userId }) => {
        socket.leave(roomId);
        console.log(`User ${userId} left chat room ${roomId}`);
    });

    // Send a message
    socket.on("chat:message", async ({ roomId, userId, username, message }) => {
        try {
            // Save to DB
            // Note: Frontend sends 'message', we store as 'text'
            const savedMsg = await chatService.saveMessage(roomId, userId, username, message);

            const messageData = {
                id: savedMsg.id,
                userId: savedMsg.user_id, // Map DB column to frontend prop
                username: savedMsg.username,
                text: savedMsg.text,
                timestamp: savedMsg.created_at,
            };

            // Broadcast to room
            io.to(roomId).emit("chat:message", messageData);

            console.log(`Message saved in room ${roomId} for user ${userId}`);
        } catch (err) {
            console.error("Error saving message:", err);
            // Send error back to sender
            socket.emit("chat:message", {
                id: Date.now(),
                userId: 0,
                username: "SYSTEM",
                text: "Failed to save message: " + err.message,
                timestamp: new Date().toISOString(),
            });
        }
    });

    // Typing indicator
    socket.on("chat:typing", ({ roomId, userId, username, isTyping }) => {
        socket.to(roomId).emit("chat:typing", {
            userId,
            username,
            isTyping,
        });
    });
};
