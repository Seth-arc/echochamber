/**
 * Fallacy Definitions
 * Provides educational information about different types of logical fallacies
 * Used for feedback and learning elements in the game
 */
const FallacyDefinitions = {
    strawman: {
        name: "Strawman Argument",
        description: "Misrepresenting someone's argument to make it easier to attack. By exaggerating, misrepresenting, or completely fabricating someone's argument, it's much easier to present your own position as being reasonable.",
        example: "After Will said we should invest more in education and healthcare, Warren responded by saying that Will wants to leave the country defenseless by cutting military spending.",
        avoidance: "Always verify you understand the other person's position. Quote their actual words rather than paraphrasing when possible."
    },
    
    false_dilemma: {
        name: "False Dilemma/Dichotomy",
        description: "Presenting only two options or sides when there are many more possibilities. This fallacy artificially limits the options being considered, forcing a choice between two extremes when alternative options exist.",
        example: "Either we cut healthcare funding, or the national debt will cause an economic collapse. There's no middle ground.",
        avoidance: "Ask yourself if there might be a spectrum of options, compromises, or alternative approaches not being considered."
    },
    
    ad_hominem: {
        name: "Ad Hominem Attack",
        description: "Attacking the person instead of addressing their argument. This fallacy attempts to undermine someone's position by criticizing their personal characteristics rather than engaging with their reasoning.",
        example: "Don't listen to his arguments about climate policy—he didn't even graduate from college!",
        avoidance: "Focus on evaluating the argument itself rather than who is making it. The validity of an argument is independent of its source."
    },
    
    appeal_emotion: {
        name: "Appeal to Emotion",
        description: "Manipulating emotions rather than using valid reasoning. This technique substitutes emotionally charged language, imagery, or stories for logical arguments to sway opinions and decisions.",
        example: "Think of the children who will suffer if you don't support this policy! How will you be able to sleep at night?",
        avoidance: "While emotions can be valid, ask if they're being used as a substitute for evidence. Consider whether the emotional appeal is relevant to the actual merits of the argument."
    },
    
    hasty_generalization: {
        name: "Hasty Generalization",
        description: "Drawing a general conclusion from a sample that is too small or biased. This error involves making a broad claim based on insufficient or unrepresentative evidence.",
        example: "I met two people from that country and they were both rude. Everyone from there must be impolite.",
        avoidance: "Consider the sample size and representativeness. Ask whether a few examples are sufficient to support a broad conclusion about an entire group."
    },
    
    appeal_authority: {
        name: "Appeal to Authority",
        description: "Using the opinion of an authority figure in place of actual evidence. While expert opinions can be valuable, they don't replace facts, especially when the authority is speaking outside their expertise.",
        example: "This famous actor says this health supplement works, so it must be effective.",
        avoidance: "Evaluate the expertise of the authority. Are they qualified in the relevant field? Even then, ask for the evidence behind their position."
    },
    
    stats_manipulation: {
        name: "Statistical Manipulation",
        description: "Misusing statistics to create misleading impressions. This includes cherry-picking data, presenting correlations as causations, or using deceptive visual representations to support a predetermined conclusion.",
        example: "Our product is 50% more effective! (Compared to a deliberately weak competitor, or measuring from an artificially low baseline.)",
        avoidance: "Look for the full context of statistics—what's being measured, what's the baseline, what's being excluded, and who conducted the research."
    },
    
    confirmation_bias: {
        name: "Confirmation Bias",
        description: "Favoring information that confirms existing beliefs while rejecting contradictory evidence. This cognitive bias leads people to selectively collect and interpret evidence that supports their preconceptions.",
        example: "I know this theory is true because I only read news sources that agree with my viewpoint. The others are obviously biased.",
        avoidance: "Deliberately seek out information from diverse sources, including those that challenge your existing beliefs. Be willing to revise opinions based on new evidence."
    },
    
    false_causality: {
        name: "False Causality",
        description: "Assuming that because one event followed another, the first event caused the second. This 'post hoc ergo propter hoc' fallacy confuses correlation with causation.",
        example: "I wore my lucky shirt and our team won, so my shirt must have caused the victory.",
        avoidance: "Remember that correlation doesn't imply causation. Consider alternative explanations, including coincidence, reverse causation, or common causes."
    },
    
    inauthentic_behavior: {
        name: "Inauthentic Behavior",
        description: "Coordinated efforts to manipulate public perception by creating an artificial impression of consensus or grassroots support. This includes astroturfing, bot networks, and orchestrated campaigns masquerading as organic activity.",
        example: "Suddenly thousands of identical comments supporting this policy appeared overnight, all using similar phrasing and talking points.",
        avoidance: "Look for unusual patterns like identical messaging, sudden surges of activity, or accounts with limited history. Consider the authenticity and diversity of sources."
    },
    
    whataboutism: {
        name: "Whataboutism",
        description: "Deflecting criticism by pointing to someone else's real or alleged wrongdoing. This technique attempts to change the subject rather than addressing the original criticism.",
        example: "Why are you criticizing our corruption when others are doing the same thing? What about their misconduct?",
        avoidance: "Recognize that multiple wrongs don't make a right. Each issue deserves to be addressed on its own merits without deflection."
    },
    
    moving_goalposts: {
        name: "Moving the Goalposts",
        description: "Changing the criteria of an argument when the original conditions are met. This fallacy involves continuously raising the standards of evidence or adding new demands to avoid conceding a point.",
        example: "After evidence was provided, they said, 'That's not enough, I need to see more comprehensive data from multiple sources.'",
        avoidance: "Establish clear criteria for what would constitute sufficient evidence at the beginning of a discussion. Recognize when new demands are being added to avoid acknowledging a valid point."
    }
};

/**
 * Get random fallacy from a specific level range
 * @param {number} level - Current game level
 * @returns {string} - Random fallacy type for the level
 */
function getRandomFallacyForLevel(level) {
    // Define which fallacies are available at each level
    let availableFallacies;
    
    if (level <= 2) {
        // Basic fallacies only
        availableFallacies = [
            "strawman", "false_dilemma", "ad_hominem", 
            "appeal_emotion", "hasty_generalization", "appeal_authority"
        ];
    } else if (level <= 4) {
        // Basic + advanced fallacies
        availableFallacies = [
            "strawman", "false_dilemma", "ad_hominem", 
            "appeal_emotion", "hasty_generalization", "appeal_authority",
            "stats_manipulation", "confirmation_bias", "false_causality"
        ];
    } else {
        // All fallacies
        availableFallacies = [
            "strawman", "false_dilemma", "ad_hominem", 
            "appeal_emotion", "hasty_generalization", "appeal_authority",
            "stats_manipulation", "confirmation_bias", "false_causality",
            "inauthentic_behavior", "whataboutism", "moving_goalposts"
        ];
    }
    
    // Return a random fallacy from the available ones
    const randomIndex = Math.floor(Math.random() * availableFallacies.length);
    return availableFallacies[randomIndex];
}

/**
 * Check if a fallacy is available at the current level
 * @param {string} fallacyType - Type of fallacy to check
 * @param {number} level - Current game level
 * @returns {boolean} - Whether fallacy is available
 */
function isFallacyAvailableAtLevel(fallacyType, level) {
    if (level >= 5) {
        // All fallacies available
        return true;
    } else if (level >= 3) {
        // Expert fallacies not available
        return !["inauthentic_behavior", "whataboutism", "moving_goalposts"].includes(fallacyType);
    } else {
        // Only basic fallacies available
        return ["strawman", "false_dilemma", "ad_hominem", 
                "appeal_emotion", "hasty_generalization", "appeal_authority"].includes(fallacyType);
    }
}

// Make available globally
window.FallacyDefinitions = FallacyDefinitions;
window.getRandomFallacyForLevel = getRandomFallacyForLevel;
window.isFallacyAvailableAtLevel = isFallacyAvailableAtLevel; 