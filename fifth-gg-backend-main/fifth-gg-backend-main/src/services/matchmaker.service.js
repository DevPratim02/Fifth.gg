const availabilityService = require("./availability.service");
const matchService = require("./match.service");

// Match size config
const MATCH_SIZE = process.env.MIN_PLAYERS_TO_MATCH
    ? parseInt(process.env.MIN_PLAYERS_TO_MATCH)
    : (process.env.NODE_ENV === 'development' ? 2 : 5);

// Rank System Logic
const RANK_VALUES = {
    "iron 1": 10, "iron 2": 20, "iron 3": 30,
    "bronze 1": 40, "bronze 2": 50, "bronze 3": 60,
    "silver 1": 70, "silver 2": 80, "silver 3": 90,
    "gold 1": 100, "gold 2": 110, "gold 3": 120,
    "platinum 1": 130, "platinum 2": 140, "platinum 3": 150,
    "diamond 1": 160, "diamond 2": 170, "diamond 3": 180,
    "ascendant 1": 190, "ascendant 2": 200, "ascendant 3": 210,
    "immortal 1": 220, "immortal 2": 230, "immortal 3": 240,
    "radiant": 250
};

// Base allowed rank difference (3 tiers = 30 points)
const BASE_RANK_WINDOW = 30;

function getRankValue(rank) {
    if (!rank) return 0; // Unranked or wildcard
    return RANK_VALUES[rank.toLowerCase()] || 0;
}

/**
 * Calculates the allowed rank difference for a group of players based on how long they've been waiting.
 */
function getAllowedDiffForWindow(window) {
    const now = new Date();
    // Find the maximum wait time among the players in the window (in seconds)
    const maxWaitSeconds = Math.max(...window.map(u => (now - new Date(u.updated_at)) / 1000));

    if (maxWaitSeconds > 60) {
        return Infinity; // Wildcard phase: Ignore rank completely after 60s
    } else if (maxWaitSeconds > 30) {
        return BASE_RANK_WINDOW * 2; // Relaxed phase: Double the allowed difference after 30s
    }
    return BASE_RANK_WINDOW; // Strict phase: Normal rank rules
}

/**
 * Core matchmaking algorithm for a specific group of ready users
 */
async function findMatchesInPool(users) {
    const createdMatches = [];
    
    // Sort users by Rank Value (Ascending)
    users.sort((a, b) => getRankValue(a.rank_range) - getRankValue(b.rank_range));

    // We mutate the users array as we form matches, so we use a while loop
    while (users.length >= MATCH_SIZE) {
        let matchedUsers = null;

        // Sliding Window to find compatible group
        for (let i = 0; i <= users.length - MATCH_SIZE; i++) {
            const window = users.slice(i, i + MATCH_SIZE);

            const rankedUsers = window.filter(u => getRankValue(u.rank_range) > 0);
            let diff = 0;
            
            if (rankedUsers.length >= 2) {
                const minRank = getRankValue(rankedUsers[0].rank_range);
                const maxRank = getRankValue(rankedUsers[rankedUsers.length - 1].rank_range);
                diff = maxRank - minRank;
            }

            const allowedDiff = getAllowedDiffForWindow(window);

            if (diff <= allowedDiff) {
                matchedUsers = window;
                console.log(`Matchmaker: Match found with rank diff ${diff} (Allowed: ${allowedDiff})`);
                break;
            }
        }

        if (!matchedUsers) {
            break; // No more compatible groups found in this pool
        }

        // We found a match! Create it.
        const playerIds = matchedUsers.map(u => u.user_id);
        const gameMode = matchedUsers[0].game_mode;
        
        const match = await matchService.createMatch(gameMode, playerIds);
        
        // Remove from availability
        for (const userId of playerIds) {
            await availabilityService.removeUser(userId);
            // Also remove them from our local array so they aren't matched again
            const idx = users.findIndex(u => u.user_id === userId);
            if (idx !== -1) users.splice(idx, 1);
        }

        const matchWithParticipants = await matchService.getMatchById(match.id);
        createdMatches.push(matchWithParticipants);
    }
    
    return createdMatches;
}

/**
 * Process the entire queue across all game modes and regions
 */
async function processQueue() {
    console.log("Matchmaker: Running background queue check...");
    const readyUsers = await availabilityService.getReadyUsers();
    
    if (readyUsers.length < MATCH_SIZE) {
        return []; // Not enough players online
    }

    // Group by Game Mode -> Region
    const buckets = {};
    for (const user of readyUsers) {
        const mode = user.game_mode || 'unknown';
        const region = user.region || 'unknown';
        
        if (!buckets[mode]) buckets[mode] = {};
        if (!buckets[mode][region]) buckets[mode][region] = [];
        
        buckets[mode][region].push(user);
    }

    const allCreatedMatches = [];

    // Find matches in each bucket
    for (const mode in buckets) {
        for (const region in buckets[mode]) {
            const usersInBucket = buckets[mode][region];
            if (usersInBucket.length >= MATCH_SIZE) {
                const matches = await findMatchesInPool(usersInBucket);
                allCreatedMatches.push(...matches);
            }
        }
    }

    return allCreatedMatches;
}

/**
 * Legacy support for immediate match check on join
 */
async function tryMatch(gameMode) {
    // We just run the global queue processor and return the first match for convenience
    // In reality, the background job handles it better.
    const matches = await processQueue();
    if (matches.length > 0) {
        // Return the first match for the immediate socket response
        return matches[0];
    }
    return null;
}

/**
 * Starts the background matchmaking loop
 */
let intervalId = null;
function startBackgroundMatchmaker(io, userSockets) {
    if (intervalId) return;
    
    console.log("Matchmaker: Background loop started.");
    intervalId = setInterval(async () => {
        try {
            const newMatches = await processQueue();
            
            // Notify players of newly created matches
            for (const match of newMatches) {
                match.participants.forEach((participant) => {
                    const playerSocketId = userSockets.get(participant.user_id);
                    if (playerSocketId) {
                        io.to(playerSocketId).emit("match:found", {
                            matchId: match.id,
                            matchCode: match.match_code,
                            gameMode: match.game_mode,
                            participants: match.participants,
                        });
                    }
                });
            }
        } catch (error) {
            console.error("Matchmaker Background Error:", error);
        }
    }, 10000); // Run every 10 seconds
}

module.exports = {
    tryMatch,
    processQueue,
    startBackgroundMatchmaker
};
