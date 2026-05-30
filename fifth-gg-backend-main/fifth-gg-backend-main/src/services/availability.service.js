const availabilityModel = require("../models/availability.model");
const userService = require("./user.service");

/**
 * Mark user as ready for matchmaking
 */
async function markUserReady(userId, { gameMode, rankRange, region }) {
    if (region) {
        // Save their preferred server to their profile
        await userService.updateUserProfile(userId, { region });
    }
    return await availabilityModel.setUserAvailability({
        userId,
        isReady: true,
        gameMode,
        rankRange,
    });
}

/**
 * Mark user as not ready
 */
async function markUserNotReady(userId) {
    return await availabilityModel.setUserAvailability({
        userId,
        isReady: false,
        gameMode: null,
        rankRange: null,
    });
}

/**
 * Remove user from availability pool
 */
async function removeUser(userId) {
    return await availabilityModel.removeUserAvailability(userId);
}

/**
 * Get all ready users for a game mode
 */
async function getReadyUsers(gameMode) {
    return await availabilityModel.getReadyUsers(gameMode);
}

/**
 * Check if user is ready
 */
async function isUserReady(userId) {
    const availability = await availabilityModel.getUserAvailability(userId);
    return availability?.is_ready || false;
}

module.exports = {
    markUserReady,
    markUserNotReady,
    removeUser,
    getReadyUsers,
    isUserReady,
};
