const User = require('../Models/User')
const { PriorityQueue } = require('@datastructures-js/priority-queue');

class SocialGraph {
    constructor() {
        this.adjacencyList = new Map();
    }

    addNode(userId) {
        if (!this.adjacencyList.has(userId)) {
            this.adjacencyList.set(userId, []);
        }
    }

    addEdge(userId1, userId2) {
        if (this.adjacencyList.has(userId1) && this.adjacencyList.has(userId2)) {
            this.adjacencyList.get(userId1).push(userId2);
            this.adjacencyList.get(userId2).push(userId1);
        }
    }

    getMutualFriends(userId1, userId2) {
        const friends1 = new Set(this.adjacencyList.get(userId1) || []);
        const friends2 = new Set(this.adjacencyList.get(userId2) || []);

        return [...friends1].filter(friend => friends2.has(friend));
    }

    getMutualFriendsCount(userId, potentialFriendId, directFriends) {
        const potentialFriend = this.adjacencyList.get(potentialFriendId) || [];
        const mutualFriends = potentialFriend.filter(friend => directFriends.has(friend));
        return mutualFriends.length;
    }

    async getFriendSuggestions(userId, {
        popularityScores = {},
        mutualFriendWeight = 1,
        popularityWeight = 1,
        locationWeight = 1,
        history = new Set(),
        decayFactor = 0.9,
        maxSuggestions = 10,
    } = {}) {
        const user = await User.findById(userId).populate('friends', '_id').lean();
        if (!user) throw new Error('User not found');

        const userLocation = user.location || '';
        const directFriends = new Set(user.friends.map(friend => friend._id.toString()));
        const suggestionsQueue = new PriorityQueue((a, b) => b.score - a.score);

        const suggestedUsers = new Set(); // To track suggested users and avoid duplicates
        const otherSuggestions = []; // To collect lower-priority suggestions

        for (const friendId of directFriends) {
            const friend = await User.findById(friendId).populate('friends', '_id location').lean();
            if (!friend) {
                console.warn(`Friend with ID ${friendId} not found.`);
                continue;
            }

            friend.friends.forEach(potentialFriend => {
                const potentialFriendId = potentialFriend._id.toString();

                if (this.shouldSkipSuggestion(potentialFriendId, userId, directFriends, history, suggestedUsers)) return;

                const adjustedScore = this.calculateSuggestionScore({
                    userId,
                    potentialFriendId,
                    directFriends,
                    popularityScores,
                    userLocation,
                    potentialFriendLocation: potentialFriend.location,
                    weights: { mutualFriendWeight, popularityWeight, locationWeight },
                    decayFactor,
                    history,
                });

                if (adjustedScore > 0) {
                    suggestionsQueue.enqueue({ userId: potentialFriendId, score: adjustedScore });
                    suggestedUsers.add(potentialFriendId);
                } else {
                    otherSuggestions.push(potentialFriendId); // Lower priority suggestions
                }
            });
        }

        const suggestions = [];

        // First, add higher-priority suggestions
        while (!suggestionsQueue.isEmpty() && suggestions.length < maxSuggestions) {
            const { userId: suggestedUserId } = suggestionsQueue.dequeue();
            suggestions.push(suggestedUserId);
            history.add(suggestedUserId);
        }

        // Then, add lower-priority suggestions (if there is space)
        for (const userId of otherSuggestions) {
            if (suggestions.length < maxSuggestions) {
                suggestions.push(userId);
                history.add(userId);
            } else {
                break; // Stop if we reached the max suggestions limit
            }
        }

        return suggestions;
    }


    shouldSkipSuggestion(potentialFriendId, userId, directFriends, history, suggestedUsers) {
        return (
            potentialFriendId === userId ||        // Skip the user themselves
            directFriends.has(potentialFriendId) || // Skip direct friends
            history.has(potentialFriendId) ||       // Skip users already suggested
            suggestedUsers.has(potentialFriendId)   // Skip users already suggested in this round
        );
    }

    calculateSuggestionScore({
                                 userId,
                                 potentialFriendId,
                                 directFriends,
                                 popularityScores,
                                 userLocation,
                                 potentialFriendLocation,
                                 weights,
                                 decayFactor,
                                 history,
                             }) {
        const mutualFriends = this.getMutualFriendsCount(userId, potentialFriendId, directFriends);
        const popularityScore = popularityScores[potentialFriendId] || 0;
        const locationScore = this.calculateLocationScore(userLocation, potentialFriendLocation);

        const rawScore =
            weights.mutualFriendWeight * mutualFriends +
            weights.popularityWeight * popularityScore +
            weights.locationWeight * locationScore;

        return rawScore * Math.pow(decayFactor, history.size);
    }

    collectSuggestions(queue, history, maxSuggestions) {
        const suggestions = [];
        while (!queue.isEmpty() && suggestions.length < maxSuggestions) {
            const { userId: suggestedUserId } = queue.dequeue();
            suggestions.push(suggestedUserId);
            history.add(suggestedUserId);
        }
        return suggestions;
    }

    calculateLocationScore(userLocation, potentialFriendLocation) {
        if (!userLocation || !potentialFriendLocation) return 0;
        return userLocation.trim().toLowerCase() === potentialFriendLocation.trim().toLowerCase() ? 1 : 0;
    }
}

module.exports = SocialGraph;