/**
 * GameStats - Tracks player performance and game statistics
 */
class GameStats {
    constructor() {
        this.reset();
    }
    
    /**
     * Reset all statistics
     */
    reset() {
        this.correctIdentifications = {};
        this.incorrectIdentifications = {};
        this.missedFallacies = {};
        this.reactionTimes = [];
        this.totalFallaciesEncountered = 0;
        this.totalFallaciesCorrect = 0;
        this.totalFallaciesIncorrect = 0;
        this.totalFallaciesMissed = 0;
    }
    
    /**
     * Track when a fallacy is correctly identified
     * @param {string} fallacyType - The type of fallacy identified
     */
    trackCorrectIdentification(fallacyType) {
        if (!this.correctIdentifications[fallacyType]) {
            this.correctIdentifications[fallacyType] = 0;
        }
        this.correctIdentifications[fallacyType]++;
        this.totalFallaciesCorrect++;
        this.totalFallaciesEncountered++;
    }
    
    /**
     * Track when a fallacy is incorrectly identified
     * @param {string} selectedFallacy - The fallacy type selected by the player
     * @param {string} actualFallacy - The actual fallacy type in the post
     */
    trackIncorrectIdentification(selectedFallacy, actualFallacy) {
        const key = `${selectedFallacy}:${actualFallacy}`;
        if (!this.incorrectIdentifications[key]) {
            this.incorrectIdentifications[key] = 0;
        }
        this.incorrectIdentifications[key]++;
        this.totalFallaciesIncorrect++;
        this.totalFallaciesEncountered++;
        
        // Also track the missed fallacy
        this.trackMissedFallacy(actualFallacy);
    }
    
    /**
     * Track when a fallacy is missed entirely
     * @param {string} fallacyType - The type of fallacy that was missed
     */
    trackMissedFallacy(fallacyType) {
        if (!this.missedFallacies[fallacyType]) {
            this.missedFallacies[fallacyType] = 0;
        }
        this.missedFallacies[fallacyType]++;
        this.totalFallaciesMissed++;
    }
    
    /**
     * Track reaction time for a fallacy identification
     * @param {number} seconds - Time in seconds to identify
     */
    trackReactionTime(seconds) {
        this.reactionTimes.push(seconds);
    }
    
    /**
     * Get the most missed fallacy type
     * @returns {string} - The most missed fallacy name
     */
    getMostMissedFallacy() {
        let mostMissedType = 'None';
        let mostMissedCount = 0;
        
        for (const [fallacyType, count] of Object.entries(this.missedFallacies)) {
            if (count > mostMissedCount) {
                mostMissedType = fallacyType;
                mostMissedCount = count;
            }
        }
        
        if (mostMissedType !== 'None' && window.FallacyDefinitions && window.FallacyDefinitions[mostMissedType]) {
            return window.FallacyDefinitions[mostMissedType].name;
        }
        
        return 'None';
    }
    
    /**
     * Get average reaction time for fallacy identifications
     * @returns {number} - Average time in seconds
     */
    getAverageReactionTime() {
        if (this.reactionTimes.length === 0) return 0;
        
        const sum = this.reactionTimes.reduce((a, b) => a + b, 0);
        return sum / this.reactionTimes.length;
    }
    
    /**
     * Save stats to localStorage for persistent tracking
     */
    saveStats() {
        try {
            const stats = {
                correctIdentifications: this.correctIdentifications,
                incorrectIdentifications: this.incorrectIdentifications,
                missedFallacies: this.missedFallacies,
                totalFallaciesCorrect: this.totalFallaciesCorrect,
                totalFallaciesIncorrect: this.totalFallaciesIncorrect,
                totalFallaciesMissed: this.totalFallaciesMissed,
                avgReactionTime: this.getAverageReactionTime()
            };
            
            localStorage.setItem('echoChamberStats', JSON.stringify(stats));
        } catch (err) {
            console.warn('Could not save game stats:', err);
        }
    }
}

// Make available globally
window.GameStats = GameStats; 