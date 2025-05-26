// Replace ES module imports with global variables that will be set by the individual script files
// FallacyDetector, PostGenerator, FallacyDefinitions, and GameStats should be defined globally

class Game {
    constructor() {
        // Game state
        this.level = 1;
        this.score = 0;
        this.lives = 3;
        this.shieldPercent = 100;
        this.correctStreak = 0;
        this.gameActive = true;  // Always start active
        this.activePosts = [];
        this.postSpeed = 0; // No movement needed - posts stay in place
        this.spawnInterval = 8000; // Longer intervals for deliberate analysis
        this.maxActivePosts = 1; // Only one post at a time
        this.audioEnabled = true;
        this.postAnimationDelta = 0;
        this.gameLoaded = true;  // Always consider loaded
        this.combo = 0;
        this.comboMultiplier = 1;
        this.comboTimeout = null;
        this.comboTimeWindow = 8000;
        this.difficulty = 1;
        this.perfectLevelBonus = true;
        this.lastFallaciesFound = {};
        this.currentPostTimeout = null; // Track post display timeout
        
        // Influence campaign tracking
        this.campaignTracker = {
            postsProcessed: 0,
            campaignPosts: [],
            lastAnalysisLevel: 0,
            analysisThreshold: 8 // Show analysis question every 8 posts
        };
        
        // Sentiment analysis questions
        this.sentimentQuestions = [
            {
                question: "Looking at recent posts, which emotional response seems most targeted?",
                options: ["Fear and urgency", "Anger and outrage", "Hope and unity", "Confusion and doubt"],
                correctIndex: null, // Will be determined based on campaign posts
                explanation: "Influence campaigns often target specific emotions to bypass critical thinking."
            },
            {
                question: "What pattern do you notice in the usernames of suspicious posts?",
                options: ["Random personal names", "Authority-sounding accounts", "Celebrity parodies", "Number sequences"],
                correctIndex: 1,
                explanation: "Fake accounts often use authoritative names to appear credible."
            },
            {
                question: "Which tactic appears most frequently in recent political posts?",
                options: ["Presenting balanced viewpoints", "Creating false urgency", "Citing academic sources", "Encouraging dialogue"],
                correctIndex: 1,
                explanation: "Influence campaigns often create artificial time pressure to prevent careful consideration."
            },
            {
                question: "What's a common sign of coordinated messaging?",
                options: ["Diverse writing styles", "Similar talking points", "Personal anecdotes", "Regional differences"],
                correctIndex: 1,
                explanation: "Coordinated campaigns often repeat the same key phrases and arguments."
            },
            {
                question: "How do authentic grassroots posts differ from astroturfing?",
                options: ["More typos and errors", "Perfect grammar only", "Corporate buzzwords", "Celebrity endorsements"],
                correctIndex: 0,
                explanation: "Real people make natural language mistakes; astroturfing often appears too polished."
            }
        ];
        
        // Game modules - create these directly without imports if needed
        try {
            this.fallacyDetector = typeof FallacyDetector !== 'undefined' ? new FallacyDetector() : null;
            this.postGenerator = typeof PostGenerator !== 'undefined' ? new PostGenerator() : null;
            this.gameStats = typeof GameStats !== 'undefined' ? new GameStats() : null;
            
            // Create fallbacks if modules aren't available
            if (!this.fallacyDetector) {
                console.warn("FallacyDetector not available, using fallback");
                this.fallacyDetector = { detectFallacies: () => [] };
            }
            
            if (!this.postGenerator) {
                console.warn("PostGenerator not available, using fallback");
                this.postGenerator = { 
                    generatePost: (level) => ({ 
                        username: "TestUser", 
                        timestamp: "Just now", 
                        content: "Test post content", 
                        fallacyType: "none" 
                    }) 
                };
            }
            
            if (!this.gameStats) {
                console.warn("GameStats not available, using fallback");
                this.gameStats = { 
                    reset: () => {}, 
                    trackCorrectIdentification: () => {},
                    trackIncorrectIdentification: () => {},
                    trackMissedFallacy: () => {},
                    trackReactionTime: () => {},
                    getAverageReactionTime: () => 0,
                    getMostMissedFallacy: () => "None",
                    saveStats: () => {}
                };
            }
        } catch (err) {
            console.error("Failed to create game modules:", err);
            // Create fallback empty implementations
            this.fallacyDetector = { detectFallacies: () => [] };
            this.postGenerator = { 
                generatePost: (level) => ({ 
                    username: "TestUser", 
                    timestamp: "Just now", 
                    content: "Test post content", 
                    fallacyType: "none" 
                }) 
            };
            this.gameStats = { 
                reset: () => {}, 
                trackCorrectIdentification: () => {},
                trackIncorrectIdentification: () => {},
                trackMissedFallacy: () => {},
                trackReactionTime: () => {},
                getAverageReactionTime: () => 0,
                getMostMissedFallacy: () => "None",
                saveStats: () => {}
            };
        }
        
        // Find DOM elements - with error checking
        this.findDomElements();
        
        // Sound effects
        this.sounds = {};
        
        try {
            this.loadSounds();
        } catch (err) {
            console.warn('Error loading sounds:', err);
            this.audioEnabled = false;
        }
        
        // Bind methods
        this.init = this.init.bind(this);
        this.startGame = this.startGame.bind(this);
        this.spawnPost = this.spawnPost.bind(this);
        this.updatePosts = this.updatePosts.bind(this);
        this.handleFallacyButtonClick = this.handleFallacyButtonClick.bind(this);
        this.updateShieldMeter = this.updateShieldMeter.bind(this);
        this.checkPostsBounds = this.checkPostsBounds.bind(this);
        this.showFeedback = this.showFeedback.bind(this);
        this.nextLevel = this.nextLevel.bind(this);
        this.gameOver = this.gameOver.bind(this);
        this.updateScore = this.updateScore.bind(this);
        this.playSound = this.playSound.bind(this);
        this.initializeEntranceAnimations = this.initializeEntranceAnimations.bind(this);
        this.resetComboTimer = this.resetComboTimer.bind(this);
        this.updateCombo = this.updateCombo.bind(this);
        this.adaptDifficulty = this.adaptDifficulty.bind(this);
        this.updateFallacyButtonHighlights = this.updateFallacyButtonHighlights.bind(this);
        this.ensureSpawnInterval = this.ensureSpawnInterval.bind(this);
        
        // Make the game instance globally accessible
        window.game = this;
        
        // Initialize game
        this.init();
    }
    
    // Add new method to check DOM elements
    findDomElements() {
        this.gameContainer = document.getElementById('game-container');
        this.feedContainer = document.getElementById('feed-container');
        
        // Create essential elements if missing
        if (!this.feedContainer && document.querySelector('main')) {
            console.warn("Feed container missing - creating it");
            this.feedContainer = document.createElement('div');
            this.feedContainer.id = 'feed-container';
            document.querySelector('main').appendChild(this.feedContainer);
        }
        
        // Continue with other elements
        this.fallacyButtons = document.querySelectorAll('.fallacy-button');
        this.shieldMeterFill = document.querySelector('.shield-meter-fill');
        this.shieldPercentage = document.querySelector('.shield-percentage');
        this.scoreValue = document.querySelector('.score-value');
        this.levelValue = document.querySelector('.level-value');
        this.lifeIcons = document.querySelectorAll('.life-icon');
        this.feedbackPanel = document.getElementById('feedback-panel');
        this.feedbackHeader = document.querySelector('.feedback-header');
        this.feedbackDescription = document.querySelector('.feedback-description');
        this.feedbackClose = document.querySelector('.feedback-close');
        this.levelTransition = document.getElementById('level-transition');
        this.nextLevelNumber = document.querySelector('.next-level-number');
        this.levelDescription = document.querySelector('.level-description');
        this.newFallacies = document.querySelector('.new-fallacies');
        this.levelContinue = document.querySelector('.level-continue');
        this.gameOverPanel = document.getElementById('game-over');
        this.finalScore = document.querySelector('.final-score');
        this.finalLevel = document.querySelector('.final-level');
        this.mostMissed = document.querySelector('.most-missed');
        this.avgReaction = document.querySelector('.avg-reaction');
        this.playAgainBtn = document.getElementById('play-again');
        this.returnHomeBtn = document.getElementById('return-home');
        this.audioToggle = document.getElementById('toggle-audio');
        
        // Handle missing elements gracefully
        if (!this.shieldMeterFill) console.warn("Shield meter fill not found");
        if (!this.shieldPercentage) console.warn("Shield percentage not found");
        if (!this.scoreValue) console.warn("Score value not found");
        if (!this.levelValue) console.warn("Level value not found");
    }
    
    init() {
        // Create loading overlay
        this.initializeEntranceAnimations();
        
        // Add tooltips to fallacy buttons
        this.addFallacyTooltips();
        
        // Create difficulty indicator
        this.createDifficultyIndicator();
        
        // Add event listeners
        this.fallacyButtons.forEach((button, index) => {
            button.addEventListener('click', this.handleFallacyButtonClick);
            
            // Set button index for staggered animation
            button.style.setProperty('--btn-index', index);
            
            // Add hover sound effect
            button.addEventListener('mouseenter', () => {
                this.playSound('uiClick', 0.15);
            });
        });
        
        this.feedbackClose.addEventListener('click', () => {
            this.playSound('uiClick');
            this.feedbackPanel.classList.add('hidden');
            
            // Resume game if still active
            if (this.gameActive) {
                this.resumeGame();
            }
        });
        
        this.levelContinue.addEventListener('click', () => {
            this.playSound('uiClick');
            this.levelTransition.classList.add('hidden');
            this.startGame();
        });
        
        this.playAgainBtn.addEventListener('click', () => {
            this.playSound('uiClick');
            this.resetGame();
            this.gameOverPanel.classList.add('hidden');
            this.startGame();
        });
        
        this.returnHomeBtn.addEventListener('click', () => {
            this.playSound('uiClick');
            window.location.href = 'index.html';
        });
        
        // Add audio toggle functionality
        this.audioToggle.addEventListener('click', () => {
            this.audioEnabled = !this.audioEnabled;
            
            if (this.audioEnabled) {
                this.audioToggle.classList.remove('audio-off');
                this.audioToggle.classList.add('audio-on');
                this.playSound('uiClick');
            } else {
                this.audioToggle.classList.remove('audio-on');
                this.audioToggle.classList.add('audio-off');
            }
            
            // Save audio preference
            localStorage.setItem('echoChamberAudioEnabled', this.audioEnabled);
        });
        
        // Check for saved audio preference
        const savedAudioPref = localStorage.getItem('echoChamberAudioEnabled');
        if (savedAudioPref !== null) {
            this.audioEnabled = savedAudioPref === 'true';
            if (!this.audioEnabled) {
                this.audioToggle.classList.remove('audio-on');
                this.audioToggle.classList.add('audio-off');
            }
        }
        
        // Create assets directory if needed
        this.createAssetsDirectories();
    }
    
    initializeEntranceAnimations() {
        try {
            console.log("Initializing entrance animations");
            
            // Check if boot sequence is active
            const bootSequence = document.querySelector('.boot-sequence');
            const bootSequenceActive = bootSequence !== null;
            console.log("Boot sequence active:", bootSequenceActive);
            
            // Make sure game container is available
            if (!this.gameContainer) {
                console.error("Game container not found");
                // Start game immediately as fallback
                this.gameLoaded = true;
        this.startGame();
                return;
            }
            
            // Make sure feed container exists
            if (!this.feedContainer) {
                console.error("Feed container not found");
                this.feedContainer = document.getElementById('feed-container');
                if (!this.feedContainer) {
                    // Create feed container if missing
                    this.feedContainer = document.createElement('div');
                    this.feedContainer.id = 'feed-container';
                    document.querySelector('main').appendChild(this.feedContainer);
                    console.log("Created missing feed container");
                }
            }
            
            // Add animation class only if we intend to animate
            if (bootSequenceActive || document.querySelector('.loading-overlay')) {
                this.gameContainer.classList.add('animate-entrance');
            }
            
            // Create loading overlay (only if boot sequence is not active)
            if (!bootSequenceActive) {
                const loadingOverlay = document.createElement('div');
                loadingOverlay.className = 'loading-overlay';
                
                const loadingSpinner = document.createElement('div');
                loadingSpinner.className = 'loading-spinner';
                
                loadingOverlay.appendChild(loadingSpinner);
                document.body.appendChild(loadingOverlay);
            }
            
            // Set delay based on whether boot sequence is active
            const initialDelay = bootSequenceActive ? 10500 : 1500;
            console.log("Using initial delay:", initialDelay);
            
            // Set a safety timeout to ensure game starts even if animations fail
            const safetyTimeout = setTimeout(() => {
                console.log("Safety timeout triggered - starting game");
                if (!this.gameLoaded) {
                    this.gameLoaded = true;
                    this.startGame();
                }
            }, initialDelay + 5000);
            
            // Simulate loading time (delayed if boot sequence is active)
            setTimeout(() => {
                console.log("Main animation sequence starting");
                
                try {
                    // Fade out loading overlay if it exists
                    const loadingOverlay = document.querySelector('.loading-overlay');
                    if (loadingOverlay) {
                        loadingOverlay.classList.add('fade-out');
                        
                        // Remove loading overlay after fade out
                        setTimeout(() => {
                            if (loadingOverlay.parentNode) {
                                document.body.removeChild(loadingOverlay);
                            }
                        }, 1000);
                    }
                    
                    // Show game container with glitch effect
                    this.gameContainer.classList.add('loaded');
                    this.gameContainer.classList.add('loaded-with-glitch');
                    
                    // Create multiple scan lines for enhanced effect
                    for (let i = 0; i < 3; i++) {
                        const scanLine = document.createElement('div');
                        scanLine.className = 'scan-line';
                        this.gameContainer.appendChild(scanLine);
                    }
                    
                    // Add power-up sound if audio is enabled
                    if (this.audioEnabled) {
                        setTimeout(() => {
                            this.playSound('levelUp', 0.2);
                        }, 300);
                    }
                    
                    // Remove scan lines after animation completes
                    setTimeout(() => {
                        const scanLines = document.querySelectorAll('.scan-line');
                        scanLines.forEach(line => {
                            if (line.parentNode) {
                                line.parentNode.removeChild(line);
                            }
                        });
                    }, 1500);
                    
                    // Start game after interface animations complete
                    setTimeout(() => {
                        console.log("Starting game after animations");
                        clearTimeout(safetyTimeout);
                        this.gameLoaded = true;
                        this.gameActive = true; // Ensure gameActive is set to true
                        this.startGame();
                    }, 2500);
                } catch (err) {
                    console.error("Error during animation sequence:", err);
                    // Ensure game starts even if animations fail
                    clearTimeout(safetyTimeout);
                    this.gameLoaded = true;
                    this.gameActive = true; // Ensure gameActive is set to true
                    this.startGame();
                }
                
            }, initialDelay);
        } catch (err) {
            console.error("Error in initializeEntranceAnimations:", err);
            // Fallback - start game immediately
            this.gameLoaded = true;
            this.gameActive = true; // Ensure gameActive is set to true
            this.startGame();
        }
    }
    
    createAssetsDirectories() {
        // This is a placeholder since we can't directly create directories 
        // in the browser. In a real app, this would be handled server-side.
        console.log("Note: In a real environment, we'd ensure assets/sounds directory exists");
        // The sound files would need to be created separately
    }
    
    loadSounds() {
        const soundFiles = {
            correct: './assets/sounds/correct.mp3',
            incorrect: './assets/sounds/incorrect.mp3',
            levelUp: './assets/sounds/level-up.mp3',
            shieldDamage: './assets/sounds/shield-damage.mp3',
            lifeLost: './assets/sounds/life-lost.mp3',
            gameOver: './assets/sounds/game-over.mp3',
            uiClick: './assets/sounds/ui-click.mp3',
            postSpawn: './assets/sounds/post-spawn.mp3'
        };
        
        // Load each sound with error handling
        Object.entries(soundFiles).forEach(([name, path]) => {
            try {
                const sound = new Audio(path);
                sound.load();
                sound.volume = 0.5;
                this.sounds[name] = sound;
                
                // Add error event listener
                sound.addEventListener('error', (e) => {
                    console.warn(`Error loading sound '${name}' from ${path}:`, e);
                    delete this.sounds[name]; // Remove failed sound
                });
            } catch (err) {
                console.warn(`Could not create sound '${name}' from ${path}:`, err);
            }
        });
    }
    
    playSound(soundName, overrideVolume = null) {
        if (!this.audioEnabled || !this.sounds[soundName]) return;
        
        try {
            // Create a clone to allow overlapping sounds
            const sound = this.sounds[soundName].cloneNode();
            if (overrideVolume !== null) {
                sound.volume = overrideVolume;
            }
            
            // Add error handling for sound play
            sound.play().catch(err => {
                console.warn(`Sound '${soundName}' could not be played:`, err);
                // Disable audio if there are persistent issues
                if (err.name === 'NotSupportedError' || err.name === 'NotAllowedError') {
                    console.warn('Disabling audio due to browser restrictions');
                    this.audioEnabled = false;
                }
            });
        } catch (err) {
            console.warn(`Error with sound '${soundName}':`, err);
        }
    }
    
    startGame() {
        console.log("Starting game");
        this.gameActive = true;
        
        // Clear any existing posts
        if (this.feedContainer) {
        while (this.feedContainer.firstChild) {
            this.feedContainer.removeChild(this.feedContainer.firstChild);
            }
        }
        this.activePosts = [];
        
        // Clear any existing timeouts
        if (this.currentPostTimeout) {
            clearTimeout(this.currentPostTimeout);
            this.currentPostTimeout = null;
        }
        
        // Clear fallback content if it exists
        if (window.clearFallbackContent) {
            window.clearFallbackContent();
        }
        
        // Create combo display if needed
        this.createComboDisplay();
        
        // Play startup sound if game is finished loading animation
        if (this.gameLoaded && this.audioEnabled) {
            this.playSound('levelUp', 0.3);
            this.animateFallacyButtons();
        }
        
        // Show helpful message for new levels
        this.showLevelStartMessage();
        
        // Start with a longer delay for first post to let users settle in
        const firstPostDelay = this.level === 1 ? 6000 : 3500;
        
        setTimeout(() => {
            // Spawn the first post
            this.spawnPost();
            console.log("Initial post spawned");
        }, firstPostDelay);
        
        // Start animation frame loop with safety check
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.animationFrameId = requestAnimationFrame(this.updatePosts);
        
        // Update UI
        if (this.scoreValue) this.scoreValue.textContent = this.score;
        if (this.levelValue) this.levelValue.textContent = this.level;
        this.updateShieldMeter();
        this.updateLives();
        
        console.log("Game started with single post system");
    }
    
    animateFallacyButtons() {
        // Sequentially highlight each fallacy button
        this.fallacyButtons.forEach((button, index) => {
            setTimeout(() => {
                // Add temporary highlight class
                button.classList.add('button-highlight');
                
                // Remove highlight after animation completes
                setTimeout(() => {
                    button.classList.remove('button-highlight');
                }, 300);
            }, index * 150); // Stagger the highlights
        });
    }
    
    pauseGame() {
        this.gameActive = false;
        
        // Clear post timeout if active
        if (this.currentPostTimeout) {
            clearTimeout(this.currentPostTimeout);
            this.currentPostTimeout = null;
        }
        
        // Cancel animation frame
        if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        }
        
        this.resetComboTimer();
    }
    
    resumeGame() {
        this.gameActive = true;
        
        // Restart animation loop
        this.animationFrameId = requestAnimationFrame(this.updatePosts);
        
        // If there's an active post, restart its timeout
        if (this.activePosts.length > 0) {
            const post = this.activePosts[0];
            const elapsed = Date.now() - post.spawnTime;
            const remaining = Math.max(1000, 15000 - elapsed); // At least 1 second remaining
            
            this.currentPostTimeout = setTimeout(() => {
                this.handlePostTimeout(post.element, { fallacyType: post.fallacyType });
            }, remaining);
        }
    }
    
    resetGame() {
        this.level = 1;
        this.score = 0;
        this.lives = 3;
        this.shieldPercent = 100;
        this.correctStreak = 0;
        this.postSpeed = 0;
        this.spawnInterval = 8000;
        this.combo = 0;
        this.comboMultiplier = 1;
        this.difficulty = 1;
        this.perfectLevelBonus = true;
        this.lastFallaciesFound = {};
        
        // Reset campaign tracking
        this.campaignTracker = {
            postsProcessed: 0,
            campaignPosts: [],
            lastAnalysisLevel: 0,
            analysisThreshold: 8
        };
        
        // Clear any existing combo timeout
        if (this.comboTimeout) {
            clearTimeout(this.comboTimeout);
            this.comboTimeout = null;
        }
        
        // Reset UI
        this.updateShieldMeter();
        this.updateLives();
        
        // Reset fallacy buttons (only show first two rows)
        document.querySelector('.advanced-fallacies').classList.add('hidden');
        document.querySelector('.expert-fallacies').classList.add('hidden');
        
        // Reset stats
        this.gameStats.reset();
        
        // Create combo display if it doesn't exist
        this.createComboDisplay();
    }
    
    createComboDisplay() {
        // Check if combo display already exists
        if (!document.getElementById('combo-display')) {
            const comboDisplay = document.createElement('div');
            comboDisplay.id = 'combo-display';
            comboDisplay.className = 'combo-display';
            comboDisplay.innerHTML = `
                <div class="combo-counter">x<span class="combo-value">1</span></div>
                <div class="combo-multiplier">x<span class="multiplier-value">1.0</span></div>
                <div class="combo-timer"><div class="combo-timer-fill"></div></div>
            `;
            document.getElementById('score-container').appendChild(comboDisplay);
        }
        
        // Reset combo display
        this.updateComboDisplay(0);
    }
    
    updateComboDisplay(combo) {
        const comboDisplay = document.getElementById('combo-display');
        if (!comboDisplay) return;
        
        const comboValue = comboDisplay.querySelector('.combo-value');
        const multiplierValue = comboDisplay.querySelector('.multiplier-value');
        const comboTimerFill = comboDisplay.querySelector('.combo-timer-fill');
        
        comboValue.textContent = combo;
        multiplierValue.textContent = this.comboMultiplier.toFixed(1);
        
        // Update visibility based on combo
        if (combo > 0) {
            comboDisplay.classList.add('active');
            
            // Start combo timer animation
            comboTimerFill.style.transition = `width ${this.comboTimeWindow}ms linear`;
            comboTimerFill.style.width = '0%';
            
            // Force reflow to ensure animation restarts
            void comboTimerFill.offsetWidth;
            comboTimerFill.style.width = '100%';
        } else {
            comboDisplay.classList.remove('active');
            comboTimerFill.style.transition = 'none';
            comboTimerFill.style.width = '0%';
        }
        
        // Add effect for high combos
        if (combo >= 5) {
            comboDisplay.classList.add('high-combo');
        } else {
            comboDisplay.classList.remove('high-combo');
        }
    }
    
    updateCombo(correct) {
        // Clear existing combo timeout
        if (this.comboTimeout) {
            clearTimeout(this.comboTimeout);
        }
        
        if (correct) {
            // Increase combo
            this.combo++;
            
            // Calculate multiplier (max out at 3.0x)
            this.comboMultiplier = Math.min(1 + (this.combo * 0.1), 3.0);
            
            // Play combo sound if combo is significant
            if (this.combo >= 3 && this.combo % 2 === 0) {
                this.playSound('correct', Math.min(0.3 + (this.combo * 0.05), 0.8));
            }
            
            // Set timeout to reset combo if player takes too long
            this.comboTimeout = setTimeout(() => {
                this.combo = 0;
                this.comboMultiplier = 1;
                this.updateComboDisplay(0);
            }, this.comboTimeWindow);
        } else {
            // Reset combo on incorrect answer
            this.combo = 0;
            this.comboMultiplier = 1;
            this.comboTimeout = null;
        }
        
        // Update combo display
        this.updateComboDisplay(this.combo);
    }
    
    resetComboTimer() {
        // Called when level changes or game pauses
        if (this.comboTimeout) {
            clearTimeout(this.comboTimeout);
            this.comboTimeout = null;
        }
    }
    
    adaptDifficulty() {
        // Adjust difficulty based on player performance
        const performanceRatio = this.correctStreak / Math.max(this.gameStats.totalFallaciesEncountered, 1);
        
        if (performanceRatio > 0.8) {
            // Player is doing very well, increase difficulty
            this.difficulty = Math.min(this.difficulty + 0.2, 2.0);
        } else if (performanceRatio < 0.4) {
            // Player is struggling, decrease difficulty
            this.difficulty = Math.max(this.difficulty - 0.1, 0.8);
        }
        
        // Adjust post speed and spawn interval based on difficulty
        this.postSpeed = Math.min(800, 120 + (this.level - 1) * 60 * this.difficulty);
        this.spawnInterval = Math.max(1500, 4500 - (this.level - 1) * 150 * this.difficulty);
        
        // Update difficulty indicator
        this.updateDifficultyIndicator();
        
        console.log(`Adapting difficulty: ${this.difficulty.toFixed(2)}, Speed: ${this.postSpeed.toFixed(0)}, Interval: ${this.spawnInterval.toFixed(0)}`);
    }
    
    spawnPost() {
        console.log("Attempting to spawn post, gameActive:", this.gameActive, 
                    "activeCount:", this.activePosts.length, 
                    "maxActive:", this.maxActivePosts);
        
        // Don't spawn more posts if we're at the limit
        if (this.activePosts.length >= this.maxActivePosts) {
            console.log("Max posts reached, waiting...");
            return;
        }
        
        // Force gameActive to be true if it somehow got reset
        if (!this.gameActive) {
            console.warn("Game not active during spawnPost, forcing active state");
            this.gameActive = true;
        }
        
        // Ensure feed container exists and is accessible
        if (!this.feedContainer || !this.feedContainer.appendChild) {
            console.error("Feed container not available");
            this.feedContainer = document.getElementById('feed-container');
            if (!this.feedContainer) {
                console.error("Could not find feed container, creating it");
                this.feedContainer = document.createElement('div');
                this.feedContainer.id = 'feed-container';
                if (document.querySelector('main')) {
                    document.querySelector('main').appendChild(this.feedContainer);
                } else if (document.body) {
                    document.body.appendChild(this.feedContainer);
                }
            }
        }
        
        try {
            // Generate post data with error handling
            let postData;
            try {
                postData = this.postGenerator.generatePost(this.level);
            } catch (err) {
                console.error("Error generating post data:", err);
                // Create fallback data
                postData = {
                    username: "User" + Math.floor(Math.random() * 100),
                    timestamp: "Just now",
                    content: "This is a fallback post due to an error in post generation.",
                    fallacyType: "none"
                };
            }
        
        // Play spawn sound
        this.playSound('postSpawn', 0.3);
        
        // Create the post element
        const post = document.createElement('div');
        post.className = 'post';
        post.dataset.fallacyType = postData.fallacyType || 'none';
        post.dataset.spawnTime = Date.now().toString();
        
            // Add campaign indicators if this is an influence campaign post
            if (postData.isInfluenceCampaign) {
                post.classList.add('influence-campaign');
                post.dataset.campaignType = postData.campaignType;
            }
            
            // Create post main content
            const postHTML = `
            <div class="post-header">
                <div class="post-avatar">${postData.username.charAt(0).toUpperCase()}</div>
                <div class="post-user-info">
                    <div class="post-username">${postData.username}</div>
                    <div class="post-timestamp">${postData.timestamp}</div>
                </div>
            </div>
            <div class="post-content">${postData.content}</div>
                ${postData.hasVisualization && postData.visualization ? 
                    `<div class="post-visualization">${postData.visualization}</div>` : 
                    ''
                }
            <div class="post-interactions">
                <div class="post-interaction">❤️ ${Math.floor(Math.random() * 100)}</div>
                <div class="post-interaction">🔁 ${Math.floor(Math.random() * 50)}</div>
                <div class="post-interaction">💬 ${Math.floor(Math.random() * 20)}</div>
            </div>
        `;
        
            // Set post innerHTML
            post.innerHTML = postHTML;
            
            // Add fallacy cue separately if needed
            if (postData.fallacyType && postData.fallacyType !== 'none') {
                post.classList.add('has-fallacy');
                
                // Add a subtle prompt based on difficulty
                if (this.difficulty < 1.5) {
                    const fallacyCue = document.createElement('div');
                    fallacyCue.className = 'fallacy-cue';
                    fallacyCue.innerHTML = `<span class="cue-icon">!</span>`;
                    post.appendChild(fallacyCue);
                }
            }
            
            // Add visualization class if post has one
            if (postData.hasVisualization) {
                post.classList.add('has-visualization');
            }
            
            // Position the post in the center of the feed
            post.style.top = '50%';
            post.style.left = '50%';
            post.style.transform = 'translate(-50%, -50%) scale(0.85)';
            post.style.position = 'absolute';
            
            // Set rotation for personality
            const randomRotation = (Math.random() * 2 - 1); // Smaller rotation for centered posts
        
        // Add a data attribute for floating animation offset
        post.dataset.floatOffset = Math.random();
        
            // Create sophisticated entry staging
        post.style.opacity = '0';
            post.style.filter = 'blur(3px)';
        
            // Add to DOM first
        this.feedContainer.appendChild(post);
            
            // Add to active posts array
        this.activePosts.push({
            element: post,
            fallacyType: postData.fallacyType || 'none',
            marked: false,
            floatOffset: parseFloat(post.dataset.floatOffset),
                rotation: randomRotation,
                urgency: 0,
                isEntering: true,
                spawnTime: Date.now()
            });
            
            // Show campaign analysis if this is a campaign post
            if (postData.isInfluenceCampaign) {
                this.showCampaignAnalysisHints(postData.campaignType);
            }
            
            // Show incoming post notification
            this.showIncomingPostIndicator();
            
            // Stage 1: Fade in and start movement (500ms delay)
        setTimeout(() => {
                post.style.transition = 'opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1), transform 1.2s cubic-bezier(0.19, 1, 0.22, 1), filter 0.8s ease';
                post.style.opacity = '0.3';
                post.style.transform = `translate(-50%, -50%) scale(0.92) rotateZ(${randomRotation}deg)`;
                post.style.filter = 'blur(2px)';
            }, 500);
            
            // Stage 2: Full reveal and settle (1200ms delay)
            setTimeout(() => {
            post.style.opacity = '1';
                post.style.transform = `translate(-50%, -50%) scale(1) rotateZ(${randomRotation}deg)`;
                post.style.filter = 'blur(0px)';
                
                // Remove entering state
                const postObj = this.activePosts.find(p => p.element === post);
                if (postObj) {
                    postObj.isEntering = false;
                }
            }, 1200);
            
            // Stage 3: Add subtle glow effect briefly (1800ms delay)
            setTimeout(() => {
                post.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3), 0 0 20px rgba(59, 133, 187, 0.4)';
                
                // Remove glow after 1.5 seconds
                setTimeout(() => {
                    post.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3), 0 0 5px rgba(59, 133, 187, 0.2)';
                }, 1500);
            }, 1800);
            
            // Auto-advance post after timeout if not answered (penalty for inaction)
            this.currentPostTimeout = setTimeout(() => {
                this.handlePostTimeout(post, postData);
            }, 15000); // 15 seconds to analyze the post
            
            // Add proximity-based controller hints
            this.updateFallacyButtonHighlights();
            
            // Log that a post was created
            console.log("Post created:", postData.fallacyType || 'none', "active posts:", this.activePosts.length);
            
            // Track campaign posts for sentiment analysis
            this.trackCampaignPost(postData);
        } catch (error) {
            console.error("Critical error in spawnPost:", error);
        }
        
        // Schedule next post regardless of any errors
        this.ensureSpawnInterval();
    }
    
    /**
     * Show a subtle indicator that a new post is incoming
     */
    showIncomingPostIndicator() {
        // Create or reuse incoming indicator
        let indicator = document.getElementById('incoming-post-indicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'incoming-post-indicator';
            indicator.className = 'incoming-post-indicator';
            indicator.innerHTML = `
                <div class="indicator-pulse"></div>
                <span class="indicator-text">New Post</span>
            `;
            this.feedContainer.appendChild(indicator);
        }
        
        // Position at bottom of feed container
        indicator.style.bottom = '20px';
        indicator.style.right = '20px';
        
        // Show indicator with animation
        indicator.classList.add('active');
        
        // Hide indicator after post has entered
        setTimeout(() => {
            indicator.classList.remove('active');
        }, 2000);
    }
    
    /**
     * Enhanced post movement that respects entrance state
     */
    updatePostMovement() {
        // This method is no longer needed in single post system
        // Removed for simplification
    }
    
    // Add method to ensure interval is active
    ensureSpawnInterval() {
        // Clear any existing interval to prevent duplicates
        if (this.spawnIntervalId) {
            clearInterval(this.spawnIntervalId);
        }
        
        // Create new interval
        this.spawnIntervalId = setInterval(() => {
            console.log("Spawn interval triggered");
            this.spawnPost();
        }, this.spawnInterval);
        
        console.log("Spawn interval reset, ID:", this.spawnIntervalId);
    }
    
    // Add method to monitor game state
    startSafetyMonitor() {
        // Clear any existing monitor
        if (this.safetyMonitorId) {
            clearInterval(this.safetyMonitorId);
        }
        
        // Check every 5 seconds if game is still running
        this.safetyMonitorId = setInterval(() => {
            console.log("Safety check - Posts:", this.activePosts.length, 
                       "GameActive:", this.gameActive);
            
            // If no posts and game should be active, try to restart
            if (this.activePosts.length === 0 && this.gameActive) {
                console.warn("No active posts found, attempting recovery");
                
                // Force spawn a post
                this.spawnPost();
                
                // Ensure spawn interval is active
                this.ensureSpawnInterval();
            }
            
            // If game somehow got deactivated, reactivate it
        if (!this.gameActive) {
                console.warn("Game became inactive, reactivating");
                this.gameActive = true;
                this.ensureSpawnInterval();
            }
            
        }, 5000);
    }
    
    updateFallacyButtonHighlights() {
        // Get posts with fallacies
        const fallacyPosts = this.activePosts.filter(post => 
            post.fallacyType !== 'none' && !post.marked);
        
        // Remove all highlights first
        this.fallacyButtons.forEach(btn => {
            btn.classList.remove('proximity-hint');
        });
        
        // If no fallacy posts or difficulty is too high, don't add hints
        if (fallacyPosts.length === 0 || this.difficulty > 1.6) {
            return;
        }
        
        // Find the closest fallacy post
        let closestPost = null;
        let minDistance = Infinity;
        
        fallacyPosts.forEach(post => {
            // Calculate post distance from the top (closer to buttons)
            const postTop = parseFloat(post.element.style.top) || 0;
            const distance = Math.max(0, postTop - 100); // Distance from top of screen
            
            if (distance < minDistance) {
                minDistance = distance;
                closestPost = post;
            }
        });
        
        // If we found a close post and it's in the lower half of the screen,
        // highlight the correct fallacy button as a hint
        if (closestPost && minDistance < this.feedContainer.clientHeight / 2) {
            // Find the correct button
            const correctButton = Array.from(this.fallacyButtons)
                .find(btn => btn.dataset.fallacy === closestPost.fallacyType);
            
            if (correctButton) {
                // Add subtle highlight
                correctButton.classList.add('proximity-hint');
            }
        }
    }
    
    updatePosts() {
        if (!this.gameActive) {
            return;
        }
        
        // Add gentle breathing animation to current post
        if (this.activePosts.length > 0) {
            const post = this.activePosts[0];
            const element = post.element;
            
            if (!post.isEntering && !post.marked) {
                // Gentle breathing effect for focus
                const time = Date.now() * 0.001;
                const breathingScale = 1 + Math.sin(time * 1.2 + post.floatOffset * Math.PI * 2) * 0.008;
                const floatAmount = Math.sin(time * 0.8 + post.floatOffset * Math.PI * 2) * 1.5;
                
                element.style.transform = `translate(calc(-50% + ${floatAmount}px), calc(-50% + ${Math.sin(time * 1.5) * 0.5}px)) 
                                          scale(${breathingScale}) 
                                          rotateZ(${post.rotation + Math.sin(time * 0.6) * 0.3}deg)`;
            }
        }
        
        // Continue the animation loop
        this.animationFrameId = requestAnimationFrame(this.updatePosts);
    }
    
    checkPostsBounds() {
        const postsToRemove = [];
        
        this.activePosts.forEach((post, index) => {
            const element = post.element;
            const top = parseFloat(element.style.top) || 0;
            
            // If post has moved off the top of the screen
            if (top < -element.clientHeight) {
                // If post had a fallacy but wasn't marked, penalize player
                if (post.fallacyType !== 'none' && !post.marked) {
                    this.shieldPercent = Math.max(0, this.shieldPercent - 5);
                    this.correctStreak = 0;
                    this.updateShieldMeter();
                    
                    // Play shield damage sound
                    this.playSound('shieldDamage');
                    
                    // Track missed fallacy
                    this.gameStats.trackMissedFallacy(post.fallacyType);
                    
                    // Check for game over
                    if (this.shieldPercent <= 0) {
                        this.lives--;
                        this.updateLives();
                        this.shieldPercent = 100;
                        this.updateShieldMeter();
                        
                        // Play life lost sound
                        this.playSound('lifeLost');
                        
                        if (this.lives <= 0) {
                            this.gameOver();
                            return;
                        }
                    }
                }
                
                // Mark for removal
                postsToRemove.push(index);
            }
        });
        
        // Remove posts from back to front to avoid index issues
        for (let i = postsToRemove.length - 1; i >= 0; i--) {
            const index = postsToRemove[i];
            const post = this.activePosts[index];
            
            if (post.element.parentNode) {
                // Fade out the post before removing
                post.element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                post.element.style.opacity = '0';
                post.element.style.transform = `translateX(-50%) translateY(-30px) rotateZ(${post.rotation}deg)`;
                
                // Remove after animation completes
                setTimeout(() => {
                    if (post.element.parentNode) {
                        post.element.parentNode.removeChild(post.element);
                    }
                }, 300);
            }
            
            this.activePosts.splice(index, 1);
        }
    }
    
    handleFallacyButtonClick(event) {
        if (!this.gameActive) return;
        
        const selectedFallacy = event.target.dataset.fallacy;
        
        // Get the current active post
        if (this.activePosts.length === 0) {
            console.warn("No active posts to evaluate");
            return;
        }
        
        const targetPost = this.activePosts[0];
        const post = targetPost.element;
        const postData = {
            fallacyType: targetPost.fallacyType,
            isInfluenceCampaign: post.dataset.campaignType !== undefined,
            campaignType: post.dataset.campaignType
        };
        
        // Clear post timeout
        if (this.currentPostTimeout) {
            clearTimeout(this.currentPostTimeout);
            this.currentPostTimeout = null;
        }
        
        // Calculate reaction time
        const reactionTime = (Date.now() - targetPost.spawnTime) / 1000;
        this.gameStats.trackReactionTime(reactionTime);
        
        // Check if correct fallacy was identified
        const isCorrect = targetPost.fallacyType === selectedFallacy;
        
        // Mark the post
        targetPost.marked = true;
        post.classList.add('marked');
        
        // Track fallacy for analytics
        if (isCorrect) {
            if (!this.lastFallaciesFound[selectedFallacy]) {
                this.lastFallaciesFound[selectedFallacy] = 0;
            }
            this.lastFallaciesFound[selectedFallacy]++;
        }
        
        if (isCorrect) {
            // Correct identification
            const basePoints = 10 * this.level;
            const speedBonus = Math.max(0, Math.floor(basePoints * (1 - Math.min(reactionTime / 8, 1)) * 0.5));
            const streakBonus = Math.floor(this.correctStreak / 3) * 5;
            const comboPoints = Math.floor((basePoints + speedBonus + streakBonus) * (this.comboMultiplier - 1));
            
            // Campaign analysis bonus
            let campaignBonus = 0;
            if (postData.isInfluenceCampaign && reactionTime < 10) {
                campaignBonus = 15; // Bonus for quickly identifying campaign posts
            }
            
            const totalPoints = Math.floor((basePoints + speedBonus + streakBonus + campaignBonus) * this.comboMultiplier);
            this.updateScore(this.score + totalPoints);
            this.correctStreak++;
            this.updateCombo(true);
            
            // Add shield bonus for streaks
            if (this.correctStreak % 3 === 0) {
                this.shieldPercent = Math.min(100, this.shieldPercent + 5);
                this.updateShieldMeter();
            }
            
            // Mark as correct with visual flourish
            post.classList.add('correct');
            const indicator = document.createElement('div');
            indicator.className = 'post-indicator';
            indicator.textContent = 'CORRECT';
            post.appendChild(indicator);
            
            // Play correct sound
            this.playSound('correct');
            
            // Track stat
            this.gameStats.trackCorrectIdentification(selectedFallacy);
            
            // Show enhanced feedback for campaign posts
            const fallacyDef = FallacyDefinitions[selectedFallacy];
            let feedbackMessage = `Correct: ${fallacyDef.name}`;
            let feedbackDescription = fallacyDef.description;
            
            if (postData.isInfluenceCampaign) {
                const campaignInfo = this.getCampaignHintContent(postData.campaignType);
                feedbackMessage = `✅ ${fallacyDef.name} in ${campaignInfo.title}`;
                feedbackDescription = `${fallacyDef.description}\n\n🎯 Campaign Context: ${campaignInfo.objective}`;
            }
            
            this.showFeedback(true, feedbackMessage, feedbackDescription);
            
            // Adapt difficulty based on performance
            this.adaptDifficulty();
        } else {
            // Incorrect identification
            this.shieldPercent = Math.max(0, this.shieldPercent - 8);
            this.correctStreak = 0;
            this.perfectLevelBonus = false;
            this.updateCombo(false);
            
            // Mark as incorrect
            post.classList.add('incorrect');
            const indicator = document.createElement('div');
            indicator.className = 'post-indicator';
            indicator.textContent = 'INCORRECT';
            post.appendChild(indicator);
            
            // Play incorrect sound
            this.playSound('incorrect');
            
            // Apply screen shake effect
            document.body.classList.add('screen-shake');
            setTimeout(() => {
                document.body.classList.remove('screen-shake');
            }, 500);
            
            // Track stat
            this.gameStats.trackIncorrectIdentification(selectedFallacy, targetPost.fallacyType);
            
            // Show enhanced feedback for learning
            const actualFallacy = FallacyDefinitions[targetPost.fallacyType];
            const selectedFallacyDef = FallacyDefinitions[selectedFallacy];
            
            let feedbackMessage = `Incorrect Identification`;
            let feedbackDescription = `This post contains a ${actualFallacy.name}, not ${selectedFallacyDef.name}.\n\n${actualFallacy.description}`;
            
            if (postData.isInfluenceCampaign) {
                const campaignInfo = this.getCampaignHintContent(postData.campaignType);
                feedbackMessage = `❌ This was ${actualFallacy.name} in ${campaignInfo.title}`;
                feedbackDescription += `\n\n🎯 Campaign Analysis: ${campaignInfo.objective}\n\nKey indicators you missed:\n• ${campaignInfo.lookFor.slice(0, 2).join('\n• ')}`;
            }
            
            this.showFeedback(false, feedbackMessage, feedbackDescription);
            
            // Adapt difficulty based on performance
            this.adaptDifficulty();
        }
        
        // Update UI
        this.updateShieldMeter();
        
        // Remove current post after feedback delay
        setTimeout(() => {
            this.removeCurrentPost(post);
            
            // Spawn next post after a brief pause
            setTimeout(() => {
                // Check for level up
                if (this.score >= this.level * 100) {
                    this.nextLevel();
                } else {
                    this.spawnPost();
                }
        }, 1000);
        }, 2000); // Give time to read feedback
        
        // Check for shield depletion
        if (this.shieldPercent <= 0) {
            this.lives--;
            this.updateLives();
            this.shieldPercent = 100;
            this.updateShieldMeter();
            
            if (this.lives <= 0) {
                this.gameOver();
            }
        }
    }
    
    updateScore(newScore) {
        const oldScore = this.score;
        this.score = newScore;
        this.scoreValue.textContent = this.score;
        
        // Add animation class for score change
        this.scoreValue.classList.add('score-change');
        setTimeout(() => {
            this.scoreValue.classList.remove('score-change');
        }, 500);
    }
    
    updateShieldMeter() {
        this.shieldMeterFill.style.width = `${this.shieldPercent}%`;
        this.shieldPercentage.textContent = `${this.shieldPercent}%`;
        
        // Update color based on shield percentage
        if (this.shieldPercent > 60) {
            this.shieldMeterFill.style.background = 'var(--shield-full)';
        } else if (this.shieldPercent > 25) {
            this.shieldMeterFill.style.background = 'var(--shield-mid)';
        } else {
            this.shieldMeterFill.style.background = 'var(--shield-low)';
        }
        
        // Add visual effects for low shield
        if (this.shieldPercent <= 25) {
            document.body.classList.add('low-shield');
        } else {
            document.body.classList.remove('low-shield');
        }
    }
    
    updateLives() {
        this.lifeIcons.forEach((icon, index) => {
            if (index < this.lives) {
                icon.classList.add('active');
            } else {
                icon.classList.remove('active');
            }
        });
    }
    
    showFeedback(isCorrect, header, description) {
        this.pauseGame();
        
        this.feedbackHeader.textContent = header;
        this.feedbackDescription.textContent = description;
        
        if (isCorrect) {
            this.feedbackHeader.className = 'feedback-header correct';
        } else {
            this.feedbackHeader.className = 'feedback-header incorrect';
        }
        
        this.feedbackPanel.classList.remove('hidden');
    }
    
    nextLevel() {
        // Play level up sound
        this.playSound('levelUp');
        
        // Apply perfect level bonus if applicable
        if (this.perfectLevelBonus) {
            const perfectBonus = this.level * 50;
            this.updateScore(this.score + perfectBonus);
            
            // Create a bonus popup
            const bonusPopup = document.createElement('div');
            bonusPopup.className = 'perfect-level-bonus';
            bonusPopup.textContent = `PERFECT LEVEL BONUS: +${perfectBonus}`;
            document.getElementById('score-container').appendChild(bonusPopup);
            
            // Remove bonus popup after animation
            setTimeout(() => {
                if (bonusPopup.parentNode) {
                    bonusPopup.parentNode.removeChild(bonusPopup);
                }
            }, 3000);
        }
        
        // Reset perfect level bonus for next level
        this.perfectLevelBonus = true;
        
        // Reset combo for new level
        this.resetComboTimer();
        this.combo = 0;
        this.comboMultiplier = 1;
        this.updateComboDisplay(0);
        
        // Increment level
        this.level++;
        
        // Update difficulty
        this.adaptDifficulty();
        
        // Create fallacy insights for transition screen
        const fallacyInsights = this.generateFallacyInsights();
        
        // Prepare level transition UI
        this.nextLevelNumber.textContent = this.level;
        
        // Show new fallacies if appropriate
        if (this.level === 3) {
            document.querySelector('.advanced-fallacies').classList.remove('hidden');
            this.prepareLevelTransitionContent('Statistical manipulation and confirmation bias are now in the feed!', [
                { name: 'Statistical Manipulation', description: 'Misusing statistics to support an argument.' },
                { name: 'Confirmation Bias', description: 'Only considering evidence that supports pre-existing beliefs.' },
                { name: 'False Causality', description: 'Assuming correlation implies causation.' }
            ], fallacyInsights);
        } else if (this.level === 5) {
            document.querySelector('.expert-fallacies').classList.remove('hidden');
            this.prepareLevelTransitionContent('Advanced manipulation tactics detected!', [
                { name: 'Inauthentic Behavior', description: 'Coordinated efforts to manipulate public opinion.' },
                { name: 'Whataboutism', description: 'Deflecting criticism by pointing to someone else\'s wrongdoing.' },
                { name: 'Moving Goalposts', description: 'Changing the criteria for success when original goals are met.' }
            ], fallacyInsights);
        } else {
            this.prepareLevelTransitionContent(`Level increased! Posts now move faster. Stay vigilant!`, [], fallacyInsights);
        }
        
        // Update UI
        this.levelValue.textContent = this.level;
        
        // Show level transition
        this.levelTransition.classList.remove('hidden');
    }
    
    generateFallacyInsights() {
        // Generate insights based on player performance
        if (Object.keys(this.lastFallaciesFound).length === 0) {
            return null; // No insights to show
        }
        
        // Find most identified fallacy
        let mostFound = '';
        let mostCount = 0;
        
        for (const [fallacy, count] of Object.entries(this.lastFallaciesFound)) {
            if (count > mostCount) {
                mostCount = count;
                mostFound = fallacy;
            }
        }
        
        if (mostFound) {
            const fallacyName = FallacyDefinitions[mostFound].name;
            return {
                title: 'Fallacy Insight',
                text: `You identified ${mostCount} instances of "${fallacyName}" in the last level. Watch for more complex patterns of this fallacy in the next level.`
            };
        }
        
        return null;
    }
    
    prepareLevelTransitionContent(description, newFallacies, insights) {
        this.levelDescription.textContent = description;
        
        if (newFallacies.length > 0) {
            this.newFallacies.innerHTML = '';
            newFallacies.forEach(fallacy => {
                const fallacyItem = document.createElement('div');
                fallacyItem.className = 'new-fallacy-item';
                fallacyItem.innerHTML = `
                    <span class="fallacy-name">${fallacy.name}</span>
                    <p class="fallacy-description">${fallacy.description}</p>
                `;
                this.newFallacies.appendChild(fallacyItem);
            });
            this.newFallacies.style.display = 'block';
        } else {
            this.newFallacies.style.display = 'none';
        }
        
        // Add insights section if available
        const insightsContainer = document.querySelector('.fallacy-insights') || document.createElement('div');
        if (!insightsContainer.classList.contains('fallacy-insights')) {
            insightsContainer.className = 'fallacy-insights';
            this.levelTransition.querySelector('.level-transition-content').insertBefore(
                insightsContainer, 
                this.levelTransition.querySelector('.level-continue')
            );
        }
        
        if (insights) {
            insightsContainer.innerHTML = `
                <h3>${insights.title}</h3>
                <p>${insights.text}</p>
            `;
            insightsContainer.style.display = 'block';
        } else {
            insightsContainer.style.display = 'none';
        }
        
        // Reset last fallacies found
        this.lastFallaciesFound = {};
    }
    
    gameOver() {
        this.pauseGame();
        
        // Play game over sound
        this.playSound('gameOver');
        
        // Update game over panel with stats
        this.finalScore.textContent = this.score;
        this.finalLevel.textContent = this.level;
        this.mostMissed.textContent = this.gameStats.getMostMissedFallacy();
        this.avgReaction.textContent = `${this.gameStats.getAverageReactionTime().toFixed(2)}s`;
        
        // Show game over panel
        this.gameOverPanel.classList.remove('hidden');
        
        // Save stats
        this.gameStats.saveStats();
    }
    
    addFallacyTooltips() {
        this.fallacyButtons.forEach(button => {
            const fallacyType = button.dataset.fallacy;
            if (fallacyType && FallacyDefinitions[fallacyType]) {
                const fallacyDef = FallacyDefinitions[fallacyType];
                
                // Create tooltip element
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = fallacyDef.description;
                
                // Add tooltip to button
                button.appendChild(tooltip);
            }
        });
    }
    
    createDifficultyIndicator() {
        // Create difficulty indicator container
        const difficultyIndicator = document.createElement('div');
        difficultyIndicator.className = 'difficulty-indicator';
        difficultyIndicator.innerHTML = `
            <span class="difficulty-label">Difficulty</span>
            <div class="difficulty-bars">
                <div class="difficulty-bar" data-level="1"></div>
                <div class="difficulty-bar" data-level="2"></div>
                <div class="difficulty-bar" data-level="3"></div>
                <div class="difficulty-bar" data-level="4"></div>
                <div class="difficulty-bar" data-level="5"></div>
            </div>
        `;
        
        // Add to header
        document.getElementById('game-header').appendChild(difficultyIndicator);
        
        // Initialize difficulty display
        this.updateDifficultyIndicator();
    }
    
    updateDifficultyIndicator() {
        const bars = document.querySelectorAll('.difficulty-bar');
        if (!bars.length) return;
        
        // Calculate how many bars to fill based on difficulty level
        const activeBars = Math.ceil(this.difficulty * 2.5);
        
        bars.forEach((bar, index) => {
            if (index < activeBars) {
                bar.classList.add('active');
                // Mark high difficulty bars
                if (index >= 3) {
                    bar.classList.add('high');
                } else {
                    bar.classList.remove('high');
                }
            } else {
                bar.classList.remove('active');
                bar.classList.remove('high');
            }
        });
    }
    
    /**
     * Track campaign posts for sentiment analysis
     * @param {Object} postData - Generated post data
     */
    trackCampaignPost(postData) {
        this.campaignTracker.postsProcessed++;
        
        if (postData.isInfluenceCampaign) {
            this.campaignTracker.campaignPosts.push({
                campaignType: postData.campaignType,
                fallacyType: postData.fallacyType,
                content: postData.content,
                username: postData.username,
                timestamp: Date.now()
            });
        }
        
        // Check if it's time for a sentiment analysis question
        if (this.shouldShowSentimentAnalysis()) {
            this.showSentimentAnalysis();
        }
    }
    
    /**
     * Determine if we should show a sentiment analysis question
     * @returns {boolean} - Whether to show analysis
     */
    shouldShowSentimentAnalysis() {
        return this.campaignTracker.postsProcessed >= this.campaignTracker.analysisThreshold &&
               this.level >= 3 && // Only start analysis questions at level 3
               this.campaignTracker.campaignPosts.length >= 2; // Need some campaign posts to analyze
    }
    
    /**
     * Show sentiment pattern recognition question
     */
    showSentimentAnalysis() {
        this.pauseGame();
        
        // Reset the counter
        this.campaignTracker.postsProcessed = 0;
        this.campaignTracker.lastAnalysisLevel = this.level;
        
        // Select appropriate question based on recent campaign activity
        const question = this.selectSentimentQuestion();
        
        // Create sentiment analysis panel
        const analysisPanel = this.createSentimentAnalysisPanel(question);
        document.body.appendChild(analysisPanel);
    }
    
    /**
     * Select appropriate sentiment question based on campaign patterns
     * @returns {Object} - Selected question
     */
    selectSentimentQuestion() {
        const recentCampaigns = this.campaignTracker.campaignPosts.slice(-5); // Last 5 campaign posts
        
        // Analyze patterns to select most relevant question
        const campaignTypes = recentCampaigns.map(post => post.campaignType);
        const hasStateSponsored = campaignTypes.includes('state_sponsored');
        const hasAstroturf = campaignTypes.includes('corporate_astroturf');
        const hasPolitical = campaignTypes.includes('domestic_political');
        
        let selectedQuestion;
        
        if (hasStateSponsored && hasPolitical) {
            // Show emotion targeting question
            selectedQuestion = {...this.sentimentQuestions[0]};
            selectedQuestion.correctIndex = this.determineEmotionalTarget(recentCampaigns);
        } else if (hasAstroturf) {
            // Show astroturfing question
            selectedQuestion = this.sentimentQuestions[4];
        } else if (hasPolitical) {
            // Show urgency tactics question
            selectedQuestion = this.sentimentQuestions[2];
        } else {
            // Default to username patterns
            selectedQuestion = this.sentimentQuestions[1];
        }
        
        return selectedQuestion;
    }
    
    /**
     * Determine the primary emotional target based on recent posts
     * @param {Array} recentCampaigns - Recent campaign posts
     * @returns {number} - Index of correct answer
     */
    determineEmotionalTarget(recentCampaigns) {
        // Analyze content for emotional keywords
        const emotionKeywords = {
            fear: ['urgent', 'danger', 'threat', 'crisis', 'attack', 'destroy', 'lose'],
            anger: ['outrage', 'betrayal', 'corrupt', 'lying', 'wrong', 'unfair'],
            confusion: ['question', 'doubt', 'uncertain', 'contradictory', 'confusing']
        };
        
        const emotionCounts = { fear: 0, anger: 0, confusion: 0 };
        
        recentCampaigns.forEach(post => {
            const content = post.content.toLowerCase();
            Object.keys(emotionKeywords).forEach(emotion => {
                emotionKeywords[emotion].forEach(keyword => {
                    if (content.includes(keyword)) {
                        emotionCounts[emotion]++;
                    }
                });
            });
        });
        
        // Return index based on highest emotion count
        const maxEmotion = Object.keys(emotionCounts).reduce((a, b) => 
            emotionCounts[a] > emotionCounts[b] ? a : b
        );
        
        switch(maxEmotion) {
            case 'fear': return 0; // "Fear and urgency"
            case 'anger': return 1; // "Anger and outrage"
            case 'confusion': return 3; // "Confusion and doubt"
            default: return 0; // Default to fear
        }
    }
    
    /**
     * Create sentiment analysis panel UI
     * @param {Object} question - Question data
     * @returns {HTMLElement} - Analysis panel element
     */
    createSentimentAnalysisPanel(question) {
        const panel = document.createElement('div');
        panel.id = 'sentiment-analysis-panel';
        panel.className = 'sentiment-analysis-panel';
        panel.innerHTML = `
            <div class="sentiment-analysis-content">
                <div class="analysis-header">
                    <h3>📊 Pattern Recognition</h3>
                    <p class="analysis-subtitle">Analyze the influence patterns you've observed</p>
                </div>
                <div class="analysis-question">
                    <p class="question-text">${question.question}</p>
                    <div class="question-options">
                        ${question.options.map((option, index) => `
                            <button class="analysis-option" data-index="${index}">
                                ${option}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <div class="analysis-feedback hidden">
                    <p class="feedback-text"></p>
                    <button class="analysis-continue">Continue Game</button>
                </div>
            </div>
        `;
        
        // Add event listeners
        const options = panel.querySelectorAll('.analysis-option');
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                this.handleSentimentAnswer(parseInt(e.target.dataset.index), question, panel);
            });
        });
        
        return panel;
    }
    
    /**
     * Handle sentiment analysis answer
     * @param {number} selectedIndex - Selected answer index
     * @param {Object} question - Question data
     * @param {HTMLElement} panel - Analysis panel
     */
    handleSentimentAnswer(selectedIndex, question, panel) {
        const isCorrect = selectedIndex === question.correctIndex;
        const feedback = panel.querySelector('.analysis-feedback');
        const feedbackText = panel.querySelector('.feedback-text');
        const options = panel.querySelectorAll('.analysis-option');
        
        // Disable all options
        options.forEach(option => option.disabled = true);
        
        // Highlight correct and selected answers
        options[question.correctIndex].classList.add('correct');
        if (!isCorrect) {
            options[selectedIndex].classList.add('incorrect');
        }
        
        // Show feedback
        feedbackText.innerHTML = `
            <strong>${isCorrect ? 'Correct!' : 'Not quite.'}</strong><br>
            ${question.explanation}
        `;
        feedback.classList.remove('hidden');
        
        // Add continue button listener
        const continueBtn = panel.querySelector('.analysis-continue');
        continueBtn.addEventListener('click', () => {
            this.closeSentimentAnalysis(panel);
        });
        
        // Give small bonus for correct answers
        if (isCorrect) {
            const bonus = 25;
            this.updateScore(this.score + bonus);
            
            // Show bonus popup
            const bonusPopup = document.createElement('div');
            bonusPopup.className = 'score-popup';
            bonusPopup.textContent = `+${bonus} Pattern Recognition Bonus`;
            bonusPopup.style.position = 'fixed';
            bonusPopup.style.top = '100px';
            bonusPopup.style.right = '50px';
            bonusPopup.style.zIndex = '1000';
            document.body.appendChild(bonusPopup);
            
            setTimeout(() => {
                if (bonusPopup.parentNode) {
                    bonusPopup.parentNode.removeChild(bonusPopup);
                }
            }, 2000);
        }
    }
    
    /**
     * Close sentiment analysis panel and resume game
     * @param {HTMLElement} panel - Analysis panel to close
     */
    closeSentimentAnalysis(panel) {
        if (panel.parentNode) {
            panel.parentNode.removeChild(panel);
        }
        
        // Resume game
        if (this.gameActive) {
            this.resumeGame();
        }
    }
    
    /**
     * Show helpful level start message
     */
    showLevelStartMessage() {
        // Create or reuse level start indicator
        let levelIndicator = document.getElementById('level-start-indicator');
        
        if (!levelIndicator) {
            levelIndicator = document.createElement('div');
            levelIndicator.id = 'level-start-indicator';
            levelIndicator.className = 'level-start-indicator';
            this.feedContainer.appendChild(levelIndicator);
        }
        
        // Set appropriate message based on level
        let message = '';
        if (this.level === 1) {
            message = '📚 Welcome! Read each post carefully and identify logical fallacies.';
        } else if (this.level === 3) {
            message = '🎯 New challenge: Influence campaigns detected. Look for coordinated messaging patterns.';
        } else if (this.level === 5) {
            message = '⚡ Advanced tactics: Watch for sophisticated manipulation techniques.';
        } else {
            message = `🔍 Level ${this.level}: Posts moving faster. Stay focused!`;
        }
        
        levelIndicator.innerHTML = `
            <div class="level-message-content">
                <div class="level-message-text">${message}</div>
                <div class="level-message-timer">
                    <div class="timer-bar"></div>
                </div>
            </div>
        `;
        
        // Show indicator with animation
        levelIndicator.classList.add('active');
        
        // Start timer animation
        const timerBar = levelIndicator.querySelector('.timer-bar');
        const duration = this.level === 1 ? 5000 : 3000;
        
        setTimeout(() => {
            timerBar.style.transition = `width ${duration}ms linear`;
            timerBar.style.width = '0%';
        }, 100);
        
        // Hide indicator after duration
        setTimeout(() => {
            levelIndicator.classList.remove('active');
        }, duration + 500);
    }
    
    /**
     * Handle post timeout when user doesn't respond
     * @param {HTMLElement} post - The post element
     * @param {Object} postData - Post data
     */
    handlePostTimeout(post, postData) {
        if (!post.parentNode) return; // Post already removed
        
        // Apply penalty for missed posts with fallacies
        if (postData.fallacyType !== 'none') {
            this.shieldPercent = Math.max(0, this.shieldPercent - 10);
            this.correctStreak = 0;
            this.updateShieldMeter();
            this.perfectLevelBonus = false;
            this.updateCombo(false);
            
            // Play warning sound
            this.playSound('shieldDamage');
            
            // Track missed fallacy
            this.gameStats.trackMissedFallacy(postData.fallacyType);
            
            // Show timeout feedback
            this.showTimeoutFeedback(postData.fallacyType);
        }
        
        // Remove the post
        this.removeCurrentPost(post);
        
        // Check for game over
        if (this.shieldPercent <= 0) {
            this.lives--;
            this.updateLives();
            this.shieldPercent = 100;
            this.updateShieldMeter();
            
            if (this.lives <= 0) {
                this.gameOver();
                return;
            }
        }
        
        // Spawn next post after a brief delay
        setTimeout(() => {
            this.spawnPost();
        }, 1500);
    }
    
    /**
     * Show timeout feedback to educate users
     * @param {string} fallacyType - The missed fallacy type
     */
    showTimeoutFeedback(fallacyType) {
        const fallacyDef = FallacyDefinitions[fallacyType];
        const message = `⏰ Time's up! This post contained: ${fallacyDef.name}`;
        const description = `${fallacyDef.description}\n\nTip: Look for key warning signs to identify this faster next time.`;
        
        this.showFeedback(false, message, description);
    }
    
    /**
     * Remove current post and clean up
     * @param {HTMLElement} post - Post to remove
     */
    removeCurrentPost(post) {
        // Clear timeout
        if (this.currentPostTimeout) {
            clearTimeout(this.currentPostTimeout);
            this.currentPostTimeout = null;
        }
        
        // Remove from active posts array
        this.activePosts = this.activePosts.filter(p => p.element !== post);
        
        // Animate out
        post.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        post.style.opacity = '0';
        post.style.transform = 'translate(-50%, -50%) scale(0.8)';
        
        // Remove from DOM
        setTimeout(() => {
            if (post.parentNode) {
                post.parentNode.removeChild(post);
            }
        }, 500);
        
        // Hide any campaign hints
        this.hideCampaignAnalysisHints();
    }
    
    /**
     * Hide campaign analysis hints
     */
    hideCampaignAnalysisHints() {
        const hintPanel = document.getElementById('campaign-hints-panel');
        if (hintPanel) {
            hintPanel.classList.remove('active');
        }
    }
    
    /**
     * Get educational content for campaign hints
     * @param {string} campaignType - Campaign type
     * @param {Object} campaignInfo - Campaign information
     * @returns {Object} - Hint content
     */
    getCampaignHintContent(campaignType, campaignInfo) {
        const hintContents = {
            state_sponsored: {
                title: "🎭 Disinformation Campaign Detected",
                objective: "This appears designed to undermine trust in institutions and create confusion",
                lookFor: [
                    "\"Both sides are equally bad\" messaging",
                    "Vague claims about institutional failures",
                    "Appeals to distrust experts or authorities",
                    "Emotional language without supporting evidence",
                    "Username appears authoritative but generic"
                ]
            },
            corporate_astroturf: {
                title: "🏭 Astroturfing Campaign Detected",
                objective: "This appears to be fake grassroots messaging funded by corporate interests",
                lookFor: [
                    "Claims of representing \"ordinary workers\" or \"families\"",
                    "Economic fear tactics (job losses, price increases)",
                    "Professional language that seems too polished",
                    "Focus on economic impacts over other concerns",
                    "Username suggests industry or worker affiliation"
                ]
            },
            domestic_political: {
                title: "⚡ Political Manipulation Detected",
                objective: "This appears designed to increase emotional response and polarization",
                lookFor: [
                    "Urgent time pressure (\"before it's too late\")",
                    "Strong in-group/out-group language",
                    "Appeals to identity and values over facts",
                    "Extreme characterizations of opponents",
                    "Calls for immediate political action"
                ]
            }
        };
        
        return hintContents[campaignType] || hintContents.state_sponsored;
    }
    
    /**
     * Show campaign analysis hints to help users learn
     * @param {string} campaignType - Type of influence campaign
     */
    showCampaignAnalysisHints(campaignType) {
        const campaignInfo = this.influenceCampaigns[campaignType];
        
        // Create or update hint panel
        let hintPanel = document.getElementById('campaign-hints-panel');
        
        if (!hintPanel) {
            hintPanel = document.createElement('div');
            hintPanel.id = 'campaign-hints-panel';
            hintPanel.className = 'campaign-hints-panel';
            this.feedContainer.appendChild(hintPanel);
        }
        
        // Set hint content based on campaign type
        const hintContent = this.getCampaignHintContent(campaignType, campaignInfo);
        
        hintPanel.innerHTML = `
            <div class="campaign-hint-header">
                <div class="campaign-type-indicator ${campaignType}"></div>
                <h4>${hintContent.title}</h4>
            </div>
            <div class="campaign-hint-content">
                <p class="hint-objective">${hintContent.objective}</p>
                <div class="hint-tactics">
                    <strong>Look for:</strong>
                    <ul>
                        ${hintContent.lookFor.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        // Show with animation
        hintPanel.classList.add('active');
    }
}

// Make Game class globally available
window.Game = Game;

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded from game.js, creating game instance");
    try {
        window.gameInstance = new Game();
    } catch (error) {
        console.error("Error initializing game from game.js:", error);
    }
}); 