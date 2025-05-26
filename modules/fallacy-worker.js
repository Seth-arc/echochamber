/**
 * Web Worker for fallacy detection
 * Processes text analysis in a separate thread to maintain UI responsiveness
 */

// Listen for messages from the main thread
self.addEventListener('message', function(e) {
    const data = e.data;
    
    // Process the fallacy detection command
    if (data.command === 'detectFallacy') {
        const result = processText(data.text, data.patterns);
        
        // Send the result back to the main thread
        self.postMessage({
            command: 'detectFallacyResult',
            result: result
        });
    }
});

/**
 * Process text to detect fallacies
 * @param {string} text - The text to analyze 
 * @param {Object} patterns - The fallacy patterns to check against
 * @returns {Object} Result with detected fallacies and confidence scores
 */
function processText(text, patterns) {
    const results = {};
    let highestScore = 0;
    let detectedFallacy = 'none';
    
    // Check each fallacy type
    for (const [fallacyType, patternList] of Object.entries(patterns)) {
        let score = 0;
        let matchCount = 0;
        
        // Apply each pattern
        for (const { pattern, weight } of patternList) {
            // Convert string pattern to RegExp if needed (serialization loses RegExp)
            const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern, 'i');
            
            if (regex.test(text)) {
                score += weight;
                matchCount++;
            }
        }
        
        // Normalize score based on number of patterns matched
        if (matchCount > 0) {
            score = score / patternList.length * (1 + 0.2 * (matchCount - 1));
            results[fallacyType] = score;
            
            // Track the highest scoring fallacy
            if (score > highestScore) {
                highestScore = score;
                detectedFallacy = fallacyType;
            }
        }
    }
    
    // Only consider it a fallacy if the score is high enough
    if (highestScore < 0.4) {
        detectedFallacy = 'none';
    }
    
    return {
        fallacyType: detectedFallacy,
        confidence: highestScore,
        allScores: results
    };
} 