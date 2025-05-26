document.addEventListener('DOMContentLoaded', () => {
    // Main elements
    const loadingScreen = document.getElementById('loading-screen');
    const loadingStatus = document.querySelector('.loading-status');
    const splashScreen = document.getElementById('splash-screen');
    const letterboxTop = document.querySelector('.cinematic-letterbox.top');
    const letterboxBottom = document.querySelector('.cinematic-letterbox.bottom');
    const bgImageContainer = document.querySelector('.background-image-container');
    const mainTitle = document.getElementById('main-title');
    const dataStreamContainer = document.querySelector('.data-stream-container');
    const particleContainer = document.querySelector('.particle-container');
    const ctaContainer = document.getElementById('cta-container');
    const ctaButton = document.getElementById('cta-button');
    const shieldPulseOverlay = document.getElementById('shield-pulse-overlay');

    const fallacyAlerts = {
        strawman: document.getElementById('strawman-alert'),
        dichotomy: document.getElementById('dichotomy-alert'),
        baiting: document.getElementById('baiting-alert')
    };

    const NUM_DATA_STREAMS = 25; // Number of streams
    const NUM_PARTICLES = 90; // Number of particles
    const LOREM_IPSUM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. System.out.println("Processing data..."); Kernel.panic("Error 0xDEADBEEF"); SELECT * FROM users WHERE id = ?;`;
    
    let dataStreams = [];
    let particles = [];
    let loadingSequenceComplete = false;
    let hasPlayedIntro = false;
    
    // Ambient audio (placeholder - add actual audio files in production)
    // const ambientSound = new Audio('ambient.mp3');
    // const buttonSound = new Audio('button.mp3');
    // const glitchSound = new Audio('glitch.mp3');
    // const transitionSound = new Audio('transition.mp3');

    // Loading sequence states and messages
    const loadingStates = [
        { message: "INITIALIZING", duration: 800 },
        { message: "ANALYZING SOCIAL PATTERNS", duration: 600 },
        { message: "DETECTING MANIPULATION VECTORS", duration: 700 },
        { message: "CALIBRATING DEFENSE PROTOCOLS", duration: 500 },
        { message: "ESTABLISHING NEURAL INTERFACE", duration: 900 },
        { message: "ACTIVATING COGNITIVE SHIELDING", duration: 400 },
        { message: "SYSTEM READY", duration: 300 }
    ];
    
    // Initialize the splash screen with AAA-style sequence
    startCinematicSequence();
    
    async function startCinematicSequence() {
        // Initial state setup - letterbox and dark screen
        document.body.classList.add('letterbox-expand');
        splashScreen.style.opacity = '0';
        
        // Fade in
        await delay(1000);
        splashScreen.style.transition = 'opacity 1.5s ease-in-out';
        splashScreen.style.opacity = '1';
        
        // Collapse letterbox for main experience after a moment
        await delay(500);
        document.body.classList.remove('letterbox-expand');
        
        // Initialize the main experience
        await delay(500);
        hasPlayedIntro = true;
        initializeSplashScreen();
    }
    
    function initializeSplashScreen() {
        // Create particles and data streams
        createParticles();
        createDataStreams();
        
        // Make data streams visible
        dataStreams.forEach((stream, index) => {
            setTimeout(() => {
                stream.style.opacity = (0.05 + Math.random() * 0.2).toFixed(2);
                stream.style.transition = 'opacity 2s cubic-bezier(0.23, 1, 0.32, 1)';
            }, index * 80);
        });
        
        // Add dramatic title entrance effects
        enhanceTitleEntrance();
        
        // Set up button click handler
        ctaButton.addEventListener('click', handleButtonClick);
        // if (buttonSound) {
        //     ctaButton.addEventListener('mouseenter', () => buttonSound.play());
        // }
    }
    
    function enhanceTitleEntrance() {
        // Create a flash effect when the title appears
        setTimeout(() => {
            // Quick flash with bright light
            const flash = document.createElement('div');
            flash.style.position = 'absolute';
            flash.style.top = '0';
            flash.style.left = '0';
            flash.style.width = '100%';
            flash.style.height = '100%';
            flash.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            flash.style.zIndex = '9';
            flash.style.opacity = '0';
            flash.style.transition = 'opacity 0.1s ease-in, opacity 0.5s ease-out';
            document.body.appendChild(flash);
            
            // Flash in
            setTimeout(() => {
                flash.style.opacity = '0.9';
                // if (glitchSound) glitchSound.play();
                
                // Trigger additional effects
                accelerateStreams(1.8);
                
                // Create a quick camera shake effect
                document.body.style.transition = 'none';
                const intensity = 10;
                const shakeTiming = [
                    { x: -intensity, y: -intensity/2, duration: 50 },
                    { x: intensity, y: intensity/2, duration: 50 },
                    { x: -intensity/2, y: intensity, duration: 50 },
                    { x: intensity/2, y: -intensity, duration: 50 },
                    { x: -intensity/4, y: -intensity/4, duration: 50 },
                    { x: intensity/4, y: intensity/4, duration: 50 },
                    { x: 0, y: 0, duration: 50 }
                ];
                
                let shakeIndex = 0;
                const shakeInterval = setInterval(() => {
                    if (shakeIndex < shakeTiming.length) {
                        const { x, y } = shakeTiming[shakeIndex];
                        document.body.style.transform = `translate(${x}px, ${y}px)`;
                        shakeIndex++;
                    } else {
                        clearInterval(shakeInterval);
                        document.body.style.transform = '';
                        document.body.style.transition = '';
                    }
                }, 50);
                
                // Flash out
                setTimeout(() => {
                    flash.style.opacity = '0';
                    setTimeout(() => {
                        flash.remove();
                    }, 500);
                }, 150);
            }, 10);
        }, 500);
        
        // Trigger some dramatic data stream activity
        setTimeout(() => {
            accelerateStreams(1.5);
            
            setTimeout(() => {
                calmStreams();
            }, 2000);
        }, 1000);
    }
    
    function handleButtonClick() {
        // Tracking pixel-perfect mouse position for a more professional feel
        const btnRect = ctaButton.getBoundingClientRect();
        const rippleX = event.clientX - btnRect.left;
        const rippleY = event.clientY - btnRect.top;
        
        // Create ripple effect at exact click position like modern AAA UI
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.width = '5px';
        ripple.style.height = '5px';
        ripple.style.borderRadius = '50%';
        ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        ripple.style.left = `${rippleX}px`;
        ripple.style.top = `${rippleY}px`;
        ripple.style.transform = 'scale(1)';
        ripple.style.opacity = '1';
        ripple.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        ctaButton.appendChild(ripple);
        
        // Expand ripple
        setTimeout(() => {
            ripple.style.transform = 'scale(100)';
            ripple.style.opacity = '0';
            setTimeout(() => ripple.remove(), 600);
        }, 10);
        
        // if (transitionSound) transitionSound.play();
        
        // Pulse effect
        shieldPulseOverlay.classList.remove('hidden');
        shieldPulseOverlay.style.animation = 'shieldActivate 1.5s cubic-bezier(0.23, 1, 0.32, 1) forwards';
        
        // Calm streams
        calmStreams();
        
        // Hide fallacy alerts if any are visible
        Object.values(fallacyAlerts).forEach(alert => {
            if (!alert.classList.contains('hidden')) {
                alert.classList.add('hidden');
            }
        });
        
        // Add letterbox cinematic transition
        document.body.classList.add('letterbox-expand');
        
        // After pulse animation, fade out splash screen and show loading screen
        setTimeout(() => {
            // Fade out splash screen with a professional transition
            splashScreen.style.opacity = '0';
            splashScreen.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            
            setTimeout(() => {
                // Hide splash screen
                splashScreen.classList.add('hidden');
                
                // Show loading screen with a slight delay for more polish
                loadingScreen.style.opacity = '0';
                loadingScreen.classList.remove('hidden');
                setTimeout(() => {
                    loadingScreen.style.opacity = '1';
                    loadingScreen.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                    
                    // Start loading sequence
                    runLoadingSequence();
                }, 200);
            }, 800);
        }, 1500);
    }
    
    function runLoadingSequence() {
        let currentState = 0;
        
        // Update loading status messages
        function updateLoadingState() {
            if (currentState < loadingStates.length) {
                loadingStatus.textContent = loadingStates[currentState].message;
                
                // Create glitch effect randomly
                if (Math.random() > 0.7) {
                    setTimeout(() => {
                        loadingStatus.style.opacity = '0.3';
                        // if (glitchSound) glitchSound.play();
                        setTimeout(() => {
                            loadingStatus.style.opacity = '1';
                        }, 100);
                    }, loadingStates[currentState].duration / 2);
                }
                
                setTimeout(() => {
                    currentState++;
                    updateLoadingState();
                }, loadingStates[currentState].duration);
            } else {
                // Loading complete, transition to game
                completeLoadingSequence();
            }
        }
        
        // Start updating the loading state
        updateLoadingState();
    }
    
    function completeLoadingSequence() {
        // if (transitionSound) transitionSound.play();
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        
        setTimeout(() => {
            // Navigate to game with a cinematic-style transition
            const finalTransition = document.createElement('div');
            finalTransition.style.position = 'fixed';
            finalTransition.style.top = '0';
            finalTransition.style.left = '0';
            finalTransition.style.width = '100%';
            finalTransition.style.height = '100%';
            finalTransition.style.backgroundColor = '#000';
            finalTransition.style.zIndex = '9999';
            finalTransition.style.opacity = '0';
            finalTransition.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            document.body.appendChild(finalTransition);
            
            setTimeout(() => {
                finalTransition.style.opacity = '1';
                setTimeout(() => {
                    window.location.href = 'game.html';
                }, 800);
            }, 10);
        }, 500);
    }

    function createParticles() {
        for (let i = 0; i < NUM_PARTICLES; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random size
            const size = 1 + Math.random() * 5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random color - dark red/purple tones
            const hue = 300 + Math.random() * 60 || Math.random() * 30;
            const saturation = 70 + Math.random() * 30;
            const lightness = 15 + Math.random() * 25;
            particle.style.backgroundColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${0.05 + Math.random() * 0.2})`;
            particle.style.boxShadow = `0 0 ${size * 2}px hsla(${hue}, ${saturation}%, ${lightness + 10}%, 0.5)`;
            
            // Animation properties with more variation
            particle.style.animation = `floatParticle ${20 + Math.random() * 40}s ease-in-out infinite`;
            particle.style.animationDelay = `${Math.random() * 20}s`;
            
            particleContainer.appendChild(particle);
            particles.push(particle);
            
            // Create random movement with smoother animations
            animateParticle(particle);
        }
    }
    
    function animateParticle(particle) {
        const x = parseFloat(particle.style.left);
        const y = parseFloat(particle.style.top);
        
        // Random movement, smaller values for more subtle movement
        const moveX = -0.1 + Math.random() * 0.2;
        const moveY = -0.1 + Math.random() * 0.2;
        
        let newX = x + moveX;
        let newY = y + moveY;
        
        // Keep within boundaries with smoother wrapping
        if (newX < 0) newX = 99;
        if (newX > 100) newX = 1;
        if (newY < 0) newY = 99;
        if (newY > 100) newY = 1;
        
        // Apply smoother transition
        particle.style.transition = `left ${3 + Math.random() * 2}s cubic-bezier(0.23, 1, 0.32, 1), top ${3 + Math.random() * 2}s cubic-bezier(0.23, 1, 0.32, 1)`;
        particle.style.left = `${newX}%`;
        particle.style.top = `${newY}%`;
        
        // Vary opacity slightly with smooth transition
        const currentOpacity = parseFloat(particle.style.opacity || 0.3);
        const newOpacity = currentOpacity + (-0.05 + Math.random() * 0.1);
        particle.style.opacity = Math.max(0.1, Math.min(0.6, newOpacity));
        
        // Continue animation with variable timing for more natural movement
        setTimeout(() => {
            animateParticle(particle);
        }, 3000 + Math.random() * 5000);
    }

    function createDataStreams() {
        for (let i = 0; i < NUM_DATA_STREAMS; i++) {
            const stream = document.createElement('div');
            stream.classList.add('data-stream');
            
            // Repeat lorem ipsum to make it long enough
            let streamText = '';
            for(let j=0; j<10; j++) { // Repeat text to make it long
                streamText += LOREM_IPSUM.split('').sort(() => 0.5 - Math.random()).join('').substring(0, 100 + Math.random() * 200) + '\n';
            }
            stream.textContent = streamText;

            // Random positioning and scroll properties
            const isVertical = Math.random() > 0.3;
            if (isVertical) {
                stream.style.writingMode = 'vertical-rl';
                stream.style.textOrientation = 'mixed';
                stream.style.height = `${150 + Math.random() * 100}%`; // Taller than screen for vertical scroll
                stream.style.width = `${Math.random() * 40 + 15}px`;
                stream.style.left = `${Math.random() * 95}%`;
                stream.style.top = `${Math.random() * -50}%`; // Start off-screen top
                stream.style.animationName = 'scrollDataVertical';
            } else {
                stream.style.writingMode = 'horizontal-tb';
                stream.style.width = `${150 + Math.random() * 100}%`; // Wider than screen
                stream.style.height = 'auto'; // Multiple lines
                stream.style.top = `${Math.random() * 90}%`;
                stream.style.left = `${Math.random() * -50}%`; // Start off-screen left
                stream.style.animationName = 'scrollDataHorizontal';
                stream.style.fontSize = `${6 + Math.random() * 4}px`; // Smaller font size
            }
            
            // Slower, smoother animations
            stream.style.animationDuration = `${25 + Math.random() * 30}s`;
            stream.style.animationTimingFunction = 'cubic-bezier(0.23, 1, 0.32, 1)';
            stream.style.animationIterationCount = 'infinite';
            stream.style.animationDelay = `${Math.random() * 5}s`;
            stream.style.opacity = 0; // Start invisible

            dataStreamContainer.appendChild(stream);
            dataStreams.push(stream);
        }
    }

    function accelerateStreams(factor) {
        dataStreams.forEach(stream => {
            const currentDuration = parseFloat(stream.style.animationDuration);
            if (!isNaN(currentDuration)) {
                stream.style.animationDuration = `${Math.max(4, currentDuration / factor)}s`;
                stream.style.transition = `opacity 1.8s cubic-bezier(0.16, 1, 0.3, 1), animation-duration 1.8s cubic-bezier(0.16, 1, 0.3, 1)`;
            }
            stream.style.opacity = Math.min(0.8, parseFloat(stream.style.opacity) * 1.5);
        });
        // Make background image slightly darker and more intense
        bgImageContainer.style.filter = `brightness(${Math.max(0.4, parseFloat(bgImageContainer.style.filter.match(/\d+(\.\d+)?/) ? bgImageContainer.style.filter.match(/\d+(\.\d+)?/)[0] : 0.6) * 0.9)}) contrast(1.4)`;
    }
    
    function calmStreams() {
        dataStreams.forEach(stream => {
            const currentDuration = parseFloat(stream.style.animationDuration);
            if (!isNaN(currentDuration)) {
                // Slow them down, but not to initial state, just calmer
                stream.style.animationDuration = `${currentDuration * 1.5}s`;
                stream.style.transition = `opacity 2.5s cubic-bezier(0.16, 1, 0.3, 1), animation-duration 2.5s cubic-bezier(0.16, 1, 0.3, 1)`;
            }
            stream.style.opacity = Math.max(0.1, parseFloat(stream.style.opacity) * 0.7);
        });
        bgImageContainer.style.filter = 'brightness(0.6) contrast(1.3)';
    }

    function showFallacy(alertElement) {
        alertElement.classList.remove('hidden');
        alertElement.classList.add('fallacy-flash');
        // if (glitchSound) glitchSound.play();
        alertElement.addEventListener('animationend', () => {
            alertElement.classList.add('hidden');
            alertElement.classList.remove('fallacy-flash');
        }, { once: true });
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Add some random fallacy alerts for visual effect in splash screen
    setTimeout(() => {
        const randomFallacies = [
            fallacyAlerts.strawman,
            fallacyAlerts.dichotomy, 
            fallacyAlerts.baiting
        ];
        
        function showRandomFallacy() {
            if (splashScreen.classList.contains('hidden')) return;
            
            const randomFallacy = randomFallacies[Math.floor(Math.random() * randomFallacies.length)];
            showFallacy(randomFallacy);
            
            // Schedule next one
            setTimeout(showRandomFallacy, 5000 + Math.random() * 5000);
        }
        
        // Start after a delay
        setTimeout(showRandomFallacy, 3000);
        
        // Periodically accelerate streams for visual effect
        function randomlyAccelerateStreams() {
            if (splashScreen.classList.contains('hidden')) return;
            
            accelerateStreams(1.2);
            
            // Schedule next acceleration
            setTimeout(() => {
                calmStreams();
                setTimeout(randomlyAccelerateStreams, 8000 + Math.random() * 5000);
            }, 3000);
        }
        
        // Start after a delay
        setTimeout(randomlyAccelerateStreams, 10000);
        
    }, 5000);
    
    // Easter egg - Konami code
    let konamiSequence = [];
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', (e) => {
        konamiSequence.push(e.key);
        if (konamiSequence.length > konamiCode.length) {
            konamiSequence.shift();
        }
        
        if (konamiSequence.join('') === konamiCode.join('')) {
            // Activate easter egg - developer mode or special effect
            document.body.style.filter = 'invert(1)';
            setTimeout(() => {
                document.body.style.filter = 'none';
            }, 500);
        }
    });
});