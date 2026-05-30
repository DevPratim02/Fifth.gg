const chatService = require('./src/services/chat.service');

async function test() {
    try {
        console.log("Saving test message...");
        // Use ID 1, assuming it fits INTEGER
        const res = await chatService.saveMessage("test_room_1", 1, "TestUser", "Hello DB");
        console.log("Saved message ID:", res.id);

        console.log("Fetching messages...");
        const msgs = await chatService.getMessages("test_room_1");
        console.log("Found messages:", msgs.length);
        console.log("First message text:", msgs[0].text);

        process.exit(0);
    } catch (e) {
        console.error("Test failed:", e);
        process.exit(1);
    }
}
test();
