# Echo Chamber - Advanced Fallacy Detection Game

An educational game designed to help students recognize logical fallacies and sophisticated influence campaigns in social media content.

## New Features: Influence Campaign Simulation

### Overview
The Echo Chamber game now simulates contemporary influence campaigns that mirror real-world disinformation tactics. This educational enhancement helps students develop critical media literacy skills by recognizing:

- **State-Sponsored Disinformation**: Campaigns designed to undermine institutional trust and social cohesion
- **Corporate Astroturfing**: Fake grassroots movements funded by corporate interests  
- **Domestic Political Manipulation**: Sophisticated messaging designed to increase polarization

### Campaign Types

#### 1. Foreign State Disinformation
- **Objective**: Undermine institutional trust and social cohesion
- **Tactics**: Doubt seeding, false equivalency, amplifying division
- **Common Fallacies**: Appeal to emotion, false dilemma, ad hominem, strawman
- **Indicators**: Authority-sounding usernames, institutional skepticism, "both sides" narratives

#### 2. Corporate Astroturfing  
- **Objective**: Simulate grassroots support for corporate interests
- **Tactics**: Fake grassroots messaging, economic fear appeals, job concerns
- **Common Fallacies**: Appeal to authority, hasty generalization, statistical manipulation
- **Indicators**: Professional messaging, economic arguments, industry talking points

#### 3. Domestic Political Manipulation
- **Objective**: Increase polarization and emotional response
- **Tactics**: Emotional manipulation, group identity appeals, artificial urgency
- **Common Fallacies**: Appeal to emotion, false dilemma, strawman, hasty generalization
- **Indicators**: Urgent language, in-group/out-group framing, time pressure

### Sentiment Pattern Recognition

The game periodically presents light analytical questions that help students recognize influence patterns:

- **Emotional Targeting**: Identifying which emotions are being manipulated
- **Username Patterns**: Recognizing fake account naming conventions
- **Coordination Indicators**: Spotting repeated talking points and messaging
- **Authenticity Markers**: Distinguishing real grassroots from astroturfing

### Educational Value

This simulation provides students with:

1. **Recognition Skills**: Ability to identify sophisticated manipulation tactics
2. **Critical Thinking**: Enhanced analytical skills for evaluating online content
3. **Media Literacy**: Understanding of how influence campaigns operate
4. **Civic Engagement**: Better preparation for navigating modern information environments

### Technical Implementation

- Campaign posts appear starting at Level 3 with increasing sophistication
- Visual indicators help identify different campaign types (subtle colored dots)
- Sentiment analysis questions appear every 8 posts to reinforce learning
- Dynamic question selection based on recent campaign activity patterns
- Bonus points awarded for correct pattern recognition

### Getting Started

1. Open `game.html` in a web browser
2. Play through the first few levels to understand basic fallacy detection
3. Starting at Level 3, begin encountering influence campaign content
4. Pay attention to patterns across multiple posts, not just individual fallacies
5. Use sentiment analysis questions to reinforce learning

### Educational Context

This game is designed as a supplement to media literacy education, helping students:
- Understand contemporary information warfare tactics
- Develop resilience against manipulation
- Practice analytical thinking in a safe, gamified environment
- Learn to identify both obvious and sophisticated influence attempts

The content is balanced and non-partisan, focusing on techniques rather than specific political positions, making it suitable for diverse educational settings.

## About

Echo Chamber combines the urgency of an arcade shooter with the analytical rigor of critical thinking education, creating an engaging tool to counter misinformation.

## How to Play

1. **Start the Game**: Click the "Engage Shield" button on the splash screen.
2. **Detect Fallacies**: As social media posts scroll up the screen, identify posts containing logical fallacies.
3. **Select Fallacy Type**: Click the appropriate fallacy button at the bottom to identify the type of fallacy in a post.
4. **Manage Resources**: Your cognitive shield depletes when you miss fallacies or make incorrect identifications. Perfect streaks recharge your shield.
5. **Progress Through Levels**: As you progress, posts move faster and new types of fallacies are introduced.

## Fallacy Types

### Basic (Levels 1-2)
- **Strawman Argument**: Misrepresenting someone's argument to make it easier to attack
- **False Dilemma/Dichotomy**: Presenting only two options when there are many more possibilities
- **Ad Hominem Attack**: Attacking the person instead of addressing their argument
- **Appeal to Emotion**: Manipulating emotions rather than using valid reasoning
- **Hasty Generalization**: Drawing a general conclusion from a sample that is too small or biased
- **Appeal to Authority**: Using the opinion of an authority figure in place of actual evidence

### Intermediate (Levels 3-4)
- **Statistical Manipulation**: Misusing statistics to create misleading impressions
- **Confirmation Bias**: Favoring information that confirms existing beliefs
- **False Causality**: Assuming that because one event followed another, the first event caused the second

### Advanced (Levels 5+)
- **Inauthentic Behavior**: Coordinated efforts to manipulate public perception
- **Whataboutism**: Deflecting criticism by pointing to someone else's real or alleged wrongdoing
- **Moving Goalposts**: Changing the criteria of an argument when the original conditions are met

## Technical Implementation

Echo Chamber is built with vanilla JavaScript, HTML, and CSS, ensuring compatibility across devices. Performance optimizations include:

- Debounced scroll handlers to prevent browser lag
- Web Workers for parallel fallacy detection processing
- Optimized animations using requestAnimationFrame

## Running the Game

Simply open `index.html` in a modern web browser to start. No server setup is required as the game runs entirely in the browser.

## Future Enhancements

- Custom fallacy list imports for classroom use
- Community moderation tools
- Server-side leaderboards and statistics

## License

This project is open source and available for educational purposes. 