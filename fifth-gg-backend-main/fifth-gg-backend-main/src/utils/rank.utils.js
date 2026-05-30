/**
 * Rank tiers for the game
 */
const RANK_TIERS = [
    { name: "Iron", minMMR: 0, maxMMR: 999 },
    { name: "Bronze", minMMR: 1000, maxMMR: 1499 },
    { name: "Silver", minMMR: 1500, maxMMR: 1999 },
    { name: "Gold", minMMR: 2000, maxMMR: 2499 },
    { name: "Platinum", minMMR: 2500, maxMMR: 2999 },
    { name: "Diamond", minMMR: 3000, maxMMR: 3499 },
    { name: "Immortal", minMMR: 3500, maxMMR: 3999 },
    { name: "Radiant", minMMR: 4000, maxMMR: Infinity },
];

/**
 * Get rank name from MMR
 */
function getRankFromMMR(mmr) {
    const tier = RANK_TIERS.find(
        (t) => mmr >= t.minMMR && mmr <= t.maxMMR
    );
    return tier ? tier.name : "Unranked";
}

/**
 * Calculate MMR change based on match result
 * @param {boolean} won - Whether the player won
 * @param {number} playerMMR - Player's current MMR
 * @param {number} opponentAvgMMR - Average MMR of opponents
 * @returns {number} MMR change (positive or negative)
 */
function calculateMMRChange(won, playerMMR, opponentAvgMMR) {
    const K_FACTOR = 32; // Standard ELO K-factor

    // Expected score (probability of winning)
    const expectedScore = 1 / (1 + Math.pow(10, (opponentAvgMMR - playerMMR) / 400));

    // Actual score (1 for win, 0 for loss)
    const actualScore = won ? 1 : 0;

    // MMR change
    const change = Math.round(K_FACTOR * (actualScore - expectedScore));

    return change;
}

/**
 * Check if two players are in similar rank range
 * @param {number} mmr1 - First player's MMR
 * @param {number} mmr2 - Second player's MMR
 * @param {number} maxDifference - Maximum allowed MMR difference
 * @returns {boolean}
 */
function isInRankRange(mmr1, mmr2, maxDifference = 500) {
    return Math.abs(mmr1 - mmr2) <= maxDifference;
}

/**
 * Get rank tier info
 */
function getRankTierInfo(rankName) {
    return RANK_TIERS.find((t) => t.name === rankName) || null;
}

module.exports = {
    RANK_TIERS,
    getRankFromMMR,
    calculateMMRChange,
    isInRankRange,
    getRankTierInfo,
};
