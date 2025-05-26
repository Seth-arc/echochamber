/**
 * PostGenerator - Creates realistic social media posts with potential fallacies
 */
class PostGenerator {
    constructor() {
        this.fallacyDetector = window.FallacyDetector ? new FallacyDetector() : { detectFallacies: () => [] };
        
        // Sample usernames
        this.usernames = [
            'TruthSeeker42', 'FactChecker', 'FreeThinker', 'ReasonableDebater',
            'LogicalMind', 'OpinionHaver', 'NewsJunkie', 'MediaCritic',
            'RealistView', 'IndependentVoice', 'CriticalThinker', 'ThoughtLeader',
            'DebateChampion', 'PoliticalPundit', 'SocialCommentator', 'FreedomFighter',
            'TruthTeller', 'UnbiasedObserver', 'RationalAnalyst', 'SkepticalCitizen'
        ];
        
        // Influence campaign usernames (more sophisticated)
        this.campaignUsernames = {
            state_sponsored: [
                'LocalNewsToday', 'CitizenJournalist', 'IndependentResearcher', 'CommunityVoice',
                'FreedomWatcher', 'TruthInvestigator', 'UncensoredNews', 'RealAmericans',
                'AuthenticVoices', 'GrassrootsMovement', 'LocalActivist', 'ConcernedParent'
            ],
            corporate_astroturf: [
                'EnergyWorkerUnion', 'JobsFirst2024', 'EconomicGrowthNow', 'InnovationAlliance',
                'TaxpayerAdvocate', 'SmallBusinessOwner', 'WorkingFamilies', 'EnergyIndependence',
                'ConsumerChoice', 'TechProgress', 'AmericaWorks', 'FutureJobs'
            ],
            domestic_political: [
                'PatriotAlert', 'DefendDemocracy', 'ProtectRights', 'SecureElections',
                'YouthVoices', 'SeniorCitizens', 'MiddleClassFamily', 'VeteranAdvocate',
                'CommunityLeader', 'StateResident', 'LocalBusiness', 'TownCouncil'
            ]
        };
        
        // Common topics to generate content about
        this.topics = [
            'politics', 'health', 'education', 'environment', 'technology',
            'economy', 'social_media', 'entertainment', 'science', 'sports'
        ];
        
        // Templates for generating content
        this.contentTemplates = {
            strawman: [
                "People who support {position} basically want {exaggerated_consequence}. How ridiculous is that?",
                "The other side is arguing that {exaggerated_position}. They couldn't be more wrong!",
                "So you're saying {misrepresented_position}? That's completely unreasonable.",
                "Let me get this straight - {group} thinks {exaggerated_belief}. Unbelievable!",
                "Supporters of {position} just want {exaggerated_consequence}. It's so obvious.",
                "Environmental activists want to shut down all industry and send us back to the stone age.",
                "Anyone who supports gun regulation clearly wants to take away all of our constitutional rights.",
                "Public health officials are saying we should never leave our houses again and live in fear forever."
            ],
            
            false_dilemma: [
                "It's simple: either we {option_one} or we {bad_consequence}. There's no middle ground.",
                "We have two choices: {option_one} or {option_two}. There is no third option.",
                "The choice is clear: {option_one} or {option_two}. What's it going to be?",
                "You're either with {group_one} or with {group_two}. You can't support both.",
                "Either you support {position_one} or you support {position_two}. It's that simple.",
                "Either we drill for more oil or we all freeze in the dark. There are no alternatives.",
                "You either support law enforcement 100% or you support chaos and anarchy. Pick a side."
            ],
            
            ad_hominem: [
                "Don't listen to {person}'s arguments about {topic}. They {personal_attack}.",
                "Why would anyone trust {person} on {topic}? Everyone knows they {personal_attack}.",
                "The problem with {person}'s position on {topic} is that they {personal_attack}.",
                "{person} has no credibility on {topic} because they {personal_attack}.",
                "I can't believe people listen to {person} about {topic} when they clearly {personal_attack}.",
                "That economist's analysis is worthless because they went to a state school, not an Ivy League university.",
                "Why should we listen to climate scientists when most of them are just liberal activists in disguise?"
            ],
            
            appeal_emotion: [
                "If you have any heart at all, you'll support {position}. Think about {emotional_subject}!",
                "How can anyone oppose {position}? Don't you care about {emotional_subject}?",
                "Only someone completely heartless would support {position} when {emotional_consequence}.",
                "I'm literally shaking thinking about what happens if we don't {action}. {emotional_appeal}",
                "My heart breaks every time I think about {emotional_subject}. We must {action} now!",
                "If this policy fails, countless innocent families will suffer. How can you live with yourself if you don't support it?",
                "Every day we delay action, more children are at risk. Won't someone please think of the children?"
            ],
            
            hasty_generalization: [
                "I saw two people from {group} who {action}. They're all like that!",
                "My friend once experienced {specific_event}, so clearly {general_conclusion}.",
                "The one time I tried {activity}, {negative_outcome} happened. It's always a disaster.",
                "I met someone from {group} and they {trait}. That tells you everything you need to know.",
                "I went to {place} once and {experience}. The whole place is like that.",
                "I know three people who got sick after their vaccination. Clearly vaccines are dangerous for everyone.",
                "My neighbor got robbed in that part of town, so obviously the entire area is completely unsafe.",
                "Our company surveyed 5 customers and 4 were satisfied. That's an 80% approval rating across all users!",
                "I tested this on my family of 4 and it worked for 3 of us. That's 75% effectiveness for the entire population!"
            ],
            
            appeal_authority: [
                "As {celebrity} said, {dubious_claim}. Who would argue with someone so successful?",
                "{authority_figure} believes {claim}, so it must be true.",
                "According to {authority_figure}, {claim}. That's all the evidence I need.",
                "Don't argue with me, argue with {authority_figure} who clearly stated {claim}.",
                "{authority_figure} supports {position}, which proves it's the right approach.",
                "My favorite actor posted about this health supplement, so it must work. They wouldn't lie to their fans.",
                "This retired general says the strategy is sound, and military people know best about everything.",
                "This influencer with 2 million followers shared an infographic about {topic}. That's basically peer review!",
                "A professor (of literature) posted this chart about climate data. Academic credentials prove everything!"
            ],
            
            stats_manipulation: [
                "Studies show a {percentage}% increase in {metric} after {action}. The evidence is clear!",
                "The data doesn't lie: {percentage}% of {group} agree that {claim}.",
                "We saw {change} in just {short_time_period}, proving that {dubious_conclusion}.",
                "The numbers speak for themselves: {cherry_picked_stat} means {conclusion}.",
                "Research shows {correlation}, which proves {causation_claim}.",
                "Crime went up 50% in that neighborhood! (But they don't mention it went from 2 incidents to 3.)",
                "Our product works 3x better than the leading competitor! (Compared to their worst-performing version from 10 years ago.)",
                "New study shows 87% effectiveness! (Based on a survey of only 23 people who completed the full program.)",
                "Check out this graph showing how {metric} skyrocketed after {event}! The Y-axis starts at 98% to really show the dramatic change.",
                "The data is conclusive: cities with more {factor_a} have {percentage}% higher {outcome}. Clearly {factor_a} causes {outcome}.",
                "According to our internal research, 9 out of 10 customers prefer our product! (We surveyed our employees' families.)",
                "This chart proves renewable energy is failing - wind power dropped 15% last winter! (Ignoring that winter always has less wind.)",
                "Hospital admissions increased 200% during the full moon! (From 1 case to 3 cases that month.)",
                "Our new policy reduced complaints by 90%! (We stopped accepting complaint forms.)",
                "Look at this alarming trend: {negative_outcome} increased {large_percentage}% in just {timeframe}! (Cherry-picked data from worst-case scenario.)"
            ],
            
            confirmation_bias: [
                "I've read five articles supporting {my_position}. The opposing evidence must be flawed.",
                "Every trusted source I follow confirms that {my_belief}. The others are just biased.",
                "I've seen so much evidence for {my_position} that opposing arguments aren't worth considering.",
                "All the experts I respect agree that {my_belief}. Anyone who disagrees is not credible.",
                "The more I research, the more confirmation I find that {my_belief} is correct.",
                "I only get my news from sources that tell the truth, unlike the mainstream media that lies about everything.",
                "I found 12 studies that support my view and ignored the 47 that contradict it. The science is settled!",
                "This graph perfectly supports my argument! (Ignoring the 15 other graphs that show the opposite trend.)"
            ],
            
            false_causality: [
                "{event_a} happened, then {event_b} occurred. Clearly, one caused the other.",
                "Since we implemented {policy}, we've seen {change}. The policy is obviously responsible.",
                "I started {action} and then {unrelated_outcome} happened. It can't be a coincidence!",
                "The rate of {metric_a} and {metric_b} increased at the same time. They must be related.",
                "Ever since {event}, we've seen more {outcome}. The connection is obvious!",
                "Violent crime increased after that video game was released. Video games clearly cause violence.",
                "I started eating organic food and my headaches went away. Organic food definitely cures headaches.",
                "Ice cream sales and drowning deaths both peak in summer. Ice cream must cause drowning!",
                "Countries with more McDonald's have higher GDP. Fast food clearly drives economic growth!",
                "This scatter plot shows a clear correlation between {variable_a} and {variable_b} - proof of causation!",
                "Every time the stock market goes up, my lucky socks are clean. Clearly my laundry schedule affects the economy."
            ],
            
            inauthentic_behavior: [
                "I'm just an average citizen with no agenda, but {talking_point} #JustSaying",
                "As a former supporter of {opposing_group}, I've seen the light about {talking_point}.",
                "I have no stake in this debate, but {suspicious_consensus_view} is clearly correct.",
                "I used to believe {opposing_view} until I learned that {talking_point}. Everyone should know this!",
                "Longtime {identity} here. We all need to accept that {unexpected_position}."
            ],
            
            whataboutism: [
                "Why focus on {current_issue} when {other_side} is doing {other_issue}?",
                "Everyone's criticizing {group} for {action}, but what about when {other_group} did {similar_action}?",
                "Sure, {problem} is concerning, but why isn't anyone talking about {unrelated_problem}?",
                "Before we address {issue}, shouldn't we talk about how {other_side} has done {other_thing}?",
                "The media covers {topic} extensively, but stays silent about {unrelated_topic}. Hypocrites!",
                "Why are we talking about this politician's mistakes when the other party did worse things last year?"
            ],
            
            moving_goalposts: [
                "Yes, you provided evidence for {claim}, but that's not enough. Now I need {higher_standard}.",
                "I know I said {original_requirement}, but now I realize we also need {new_requirement}.",
                "That evidence only addresses part of the issue. You still haven't proven {shifted_focus}.",
                "That may be true, but it doesn't address the real question of {tangential_issue}.",
                "OK, but that's just one study. I need to see research from {specific_sources} before I'm convinced."
            ],
            
            // Non-fallacious content 
            none: [
                "I think {topic} deserves more thoughtful discussion. There are valid points on multiple sides.",
                "Has anyone read any good articles about {topic} recently? I'm trying to learn more.",
                "It's important to consider various perspectives on {topic} before forming a strong opinion.",
                "I've been researching {topic} lately and found some interesting information worth sharing.",
                "What are some reliable sources to learn more about {topic}? I want to be well-informed.",
                "The latest research on renewable energy shows promising developments in battery technology.",
                "Local schools are implementing new literacy programs with encouraging early results.",
                "Community volunteers cleaned up the park this weekend. Great to see neighbors working together!",
                "Interesting documentary about urban planning on tonight. Always fascinating to learn how cities develop.",
                "New bike lanes downtown seem to be reducing traffic congestion according to city data.",
                "Public library is offering free computer classes for seniors. What a great community resource.",
                "Local farmers market has amazing produce this season. Supporting local agriculture feels good.",
                "New peer-reviewed study with 10,000 participants shows promising results for {treatment}. Sample size and methodology look solid.",
                "City released comprehensive traffic data covering 5 years. Interesting to see seasonal patterns and long-term trends.",
                "University researchers published their methodology and raw data alongside their findings. Love the transparency!",
                "Meta-analysis of 15 studies suggests {conclusion}. Good to see researchers synthesizing multiple data sources.",
                "Local health department released clear statistics with confidence intervals and explained limitations. Refreshing honesty!",
                "This economist explained both the strengths AND weaknesses of their economic model. Rare intellectual honesty!"
            ]
        };
        
        // Fill-in values for templates
        this.templateValues = {
            position: ['healthcare reform', 'environmental regulations', 'tax policy', 'immigration reform', 'gun control', 'educational reform'],
            exaggerated_consequence: ['to destroy the economy', 'to eliminate all personal freedom', 'to bankrupt the country', 'to control every aspect of our lives', 'to undermine our values'],
            exaggerated_position: ['we should have no regulations whatsoever', 'we should abandon all traditional values', 'the government should control everything', 'we should open all borders completely', 'we should never change anything'],
            misrepresented_position: ['we should give up all our rights', 'nobody should be held responsible for anything', 'the government should decide everything for us', 'we should ignore all evidence', 'we should completely restructure society'],
            group: ['liberals', 'conservatives', 'politicians', 'experts', 'journalists', 'academics', 'celebrities'],
            exaggerated_belief: ['the world is ending tomorrow', 'there are simple solutions to complex problems', 'their side is always right', 'facts do not matter', 'everyone else is wrong'],
            
            option_one: ['follow this policy exactly', 'agree with this viewpoint', 'support this candidate', 'accept this solution', 'adopt this approach'],
            option_two: ['face complete disaster', 'lose all our freedoms', 'accept a terrible alternative', 'give up everything we value', 'admit we do not care about the issue'],
            bad_consequence: ['everything will fall apart', 'we will face dire consequences', 'we will regret it forever', 'it will be a disaster', 'we will never recover'],
            group_one: ['the good people', 'those who care', 'the reasonable side', 'those who understand', 'the sensible majority'],
            group_two: ['the opposition', 'those who do not get it', 'the unreasonable side', 'those who deny reality', 'the extremists'],
            position_one: ['the only sensible approach', 'what any rational person would want', 'the obviously correct policy', 'what we all know is right', 'the only position that makes sense'],
            position_two: ['a completely unreasonable alternative', 'what only extremists want', 'a clearly flawed approach', 'something no sensible person would support', 'an obviously harmful position'],
            
            person: ['that politician', 'that celebrity', 'that commentator', 'that expert', 'that public figure', 'that CEO', 'that activist'],
            topic: ['the economy', 'healthcare', 'education', 'climate change', 'foreign policy', 'social issues', 'technology regulation', 'energy policy'],
            personal_attack: ['never even had a real job', 'lied about their credentials', 'has a conflict of interest', 'has a sketchy past', 'is not even qualified to speak on this', 'does not practice what they preach', 'has changed their position multiple times'],
            
            emotional_subject: ['the children', 'future generations', 'vulnerable communities', 'the elderly', 'struggling families', 'innocent victims'],
            emotional_consequence: ['people will suffer', 'we will destroy what we value most', 'we will abandon our principles', 'we will regret it deeply', 'the damage will be irreversible'],
            emotional_appeal: ['It breaks my heart to think about it.', 'I cannot sleep thinking about what might happen.', 'How will we look our children in the eyes?', 'The thought brings me to tears.', 'It is absolutely terrifying to consider.'],
            action: ['take action', 'support this cause', 'change our policies', 'speak out', 'make different choices'],
            
            specific_event: ['a bad customer service experience', 'a negative interaction', 'one problematic incident', 'a single encounter', 'a minor problem'],
            general_conclusion: ['the entire company is terrible', 'the whole system is broken', 'everyone in that group is the same', 'it happens all the time', 'it is a universal problem'],
            activity: ['that restaurant', 'that service', 'that product', 'that location', 'that experience'],
            negative_outcome: ['it was a disaster', 'it went terribly wrong', 'I had a bad experience', 'I was disappointed', 'it failed to meet expectations'],
            trait: ['was rude', 'was dishonest', 'was incompetent', 'was biased', 'did not know what they were talking about'],
            place: ['that city', 'that country', 'that neighborhood', 'that venue', 'that destination'],
            experience: ['had a terrible experience', 'was treated poorly', 'found it disappointing', 'did not enjoy it', 'encountered problems'],
            
            celebrity: ['that famous actor', 'that popular musician', 'that well-known athlete', 'that social media influencer', 'that TV personality'],
            authority_figure: ['a doctor on television', 'a self-proclaimed expert', 'a famous CEO', 'a popular book author', 'someone with a large social media following', 'a celebrity with no relevant expertise'],
            dubious_claim: ['alternative medicine is better than conventional treatments', 'traditional education is obsolete', 'you can get rich quick with this method', 'this product will change your life', 'this simple trick solves complex problems'],
            claim: ['this product offers amazing benefits', 'this approach is revolutionary', 'this method guarantees results', 'this solution is the only one that works', 'this explanation is the correct one'],
            
            percentage: ['67', '85', '92', '73', '58', '94'],
            metric: ['satisfaction', 'performance', 'efficiency', 'success', 'improvement', 'results'],
            change: ['a dramatic improvement', 'a significant decline', 'a major shift', 'a remarkable transformation', 'an unprecedented change'],
            short_time_period: ['just one week', 'only a month', 'a single quarter', 'a brief trial period', 'a limited test run'],
            dubious_conclusion: ['our approach is superior', 'the alternative is ineffective', 'we have solved the problem', 'the debate is settled', 'no further research is needed'],
            cherry_picked_stat: ['this one data point', 'this isolated statistic', 'this single measurement', 'this particular figure', 'this one-time result'],
            conclusion: ['the entire theory is proven', 'the debate is settled', 'our position is validated', 'the opposition is wrong', 'there is no need for further discussion'],
            correlation: ['these two trends moved together', 'these factors appeared at the same time', 'these metrics both increased', 'these patterns emerged together', 'these changes occurred simultaneously'],
            causation_claim: ['one definitely caused the other', 'we know what is responsible', 'the relationship is clearly causal', 'we have identified the cause', 'the driver of this change is obvious'],
            
            my_position: ['view on this topic', 'stance on this issue', 'perspective on this matter', 'position in this debate', 'opinion on this subject'],
            my_belief: ['vaccines are dangerous', 'climate change is not real', 'mainstream media is always wrong', 'alternative medicine is superior', 'conventional wisdom is incorrect', 'the official narrative is false'],
            
            event_a: ['the new policy was implemented', 'the new mayor was elected', 'the company changed its logo', 'daylight saving time started', 'the new highway opened'],
            event_b: ['crime rates decreased', 'sales improved', 'test scores went up', 'the economy grew', 'public approval increased'],
            policy: ['the new regulation', 'our marketing campaign', 'the recent initiative', 'the updated procedure', 'the new system'],
            unrelated_outcome: ['I got a promotion', 'the weather improved', 'my team started winning', 'my plants grew better', 'I felt healthier'],
            metric_a: ['smartphone usage', 'cheese consumption', 'internet speeds', 'coffee sales', 'movie attendance'],
            metric_b: ['life expectancy', 'test scores', 'home prices', 'divorce rates', 'national debt'],
            event: ['the new law passed', 'that product was released', 'social media became popular', 'that show premiered', 'prices increased'],
            outcome: ['these types of incidents', 'these kinds of behaviors', 'these problems', 'these trends', 'these patterns'],
            
            talking_point: ['we must prioritize economic growth over environmental concerns', 'both sides are equally extreme', 'the mainstream narrative is completely wrong', 'traditional experts have failed us', 'we need radical change immediately'],
            opposing_group: ['environmentalists', 'progressives', 'conservatives', 'traditional experts', 'mainstream voices', 'the opposing political party'],
            suspicious_consensus_view: ['we should trust corporations to self-regulate', 'this controversial figure is actually right', 'the scientific consensus is wrong', 'the radical solution is the only option', 'the extreme position is actually moderate'],
            opposing_view: ['what the experts say', 'the scientific consensus', 'conventional wisdom', 'what most sources report', 'the mainstream position'],
            identity: ['supporter of this cause', 'member of this group', 'advocate for this issue', 'participant in this community', 'follower of this approach'],
            unexpected_position: ['our group is wrong about everything', 'we should actually oppose our traditional values', 'our longtime goals are misguided', 'we should abandon our core principles', 'everything we have fought for is wrong'],
            
            current_issue: ['this scandal', 'this controversy', 'this problem', 'this mistake', 'this policy failure'],
            other_side: ['the other political party', 'the opposition', 'your preferred group', 'your allies', 'the other side'],
            other_issue: ['something worse', 'the same thing', 'something more serious', 'much more problematic things', 'far worse things'],
            action: ['this mistake', 'this controversial action', 'this problematic statement', 'this questionable decision', 'this policy'],
            other_group: ['the previous administration', 'your favored group', 'the other party', 'your allies', 'people you support'],
            similar_action: ['the exact same thing', 'something much worse', 'comparable things', 'essentially the same action', 'virtually identical behavior'],
            problem: ['this issue', 'this concern', 'this controversy', 'this policy problem', 'this situation'],
            unrelated_problem: ['something completely different', 'an unrelated issue', 'a distraction', 'a topic you would rather discuss', 'something that deflects attention'],
            issue: ['this controversy', 'this problem', 'this mistake', 'this scandal', 'this concern'],
            other_thing: ['worse things', 'the same thing', 'similar actions', 'comparable behavior', 'equivalent mistakes'],
            unrelated_topic: ['something that does not fit their narrative', 'a story they choose to ignore', 'an issue that contradicts their perspective', 'a topic that does not get clicks', 'a subject that does not serve their agenda'],
            
            original_requirement: ['one credible source', 'some basic evidence', 'a reasonable explanation', 'a logical argument', 'an expert opinion'],
            higher_standard: ['multiple peer-reviewed studies', 'unanimous expert consensus', 'irrefutable evidence', 'proof beyond any doubt', 'comprehensive data from multiple sources'],
            new_requirement: ['additional constraints', 'further evidence', 'more extensive proof', 'additional conditions', 'extra verification'],
            shifted_focus: ['this tangential aspect', 'this minor detail', 'this secondary concern', 'this additional factor', 'this related but separate issue'],
            tangential_issue: ['something only loosely related', 'a minor technical detail', 'an aspect not central to the main argument', 'a side point', 'a distraction from the main topic'],
            specific_sources: ['these specific authorities', 'these particular journals', 'these select experts', 'these exact types of studies', 'these precise methodologies'],
            
            // Statistical and data visualization template values
            factor_a: ['coffee shops', 'bike lanes', 'trees', 'public transit', 'electric vehicles', 'bookstores', 'yoga studios'],
            large_percentage: ['45', '67', '89', '112', '156', '203', '287'],
            timeframe: ['one week', 'two months', 'six months', 'one year', 'five years', 'the last quarter', 'this decade'],
            negative_outcome: ['accidents', 'complaints', 'delays', 'errors', 'problems', 'incidents', 'failures'],
            variable_a: ['shoe size', 'city population', 'temperature', 'rainfall', 'internet speed', 'coffee consumption'],
            variable_b: ['happiness levels', 'crime rates', 'test scores', 'productivity', 'life satisfaction', 'economic growth'],
            treatment: ['meditation', 'exercise', 'dietary supplements', 'sleep therapy', 'stress reduction', 'vitamin D'],
            conclusion: ['moderate benefits', 'promising early results', 'mixed outcomes', 'potential for further research', 'inconclusive but interesting findings']
        };
        
        // Influence campaign post templates
        this.influenceCampaigns = {
            // Campaign 1: State-Sponsored Disinformation
            state_sponsored: {
                name: "Foreign State Disinformation",
                objective: "Undermine institutional trust and social cohesion",
                tactics: ["doubt_seeding", "false_equivalency", "amplify_division"],
                templates: [
                    "Just learned that {institution} has been {negative_action} for years. Why isn't mainstream media covering this? #WakeUp",
                    "Both sides are equally corrupt. There's no point in {civic_action} anymore. The system is rigged against ordinary people.",
                    "Research shows {controversial_claim}, but {institution} doesn't want you to know. Follow the money! 💰",
                    "Why do we trust {expert_group} when they've been wrong about {unrelated_topic} before? Question everything.",
                    "The real issue isn't {current_topic}, it's how {institution} is dividing us. We're fighting each other instead of the real problem.",
                    "Interesting how {institution} announces {policy} right when {distraction_event} happens. Coincidence? I think not.",
                    "My {family_member} works in {relevant_field} and says everyone there knows {unsupported_claim} but can't speak out.",
                    "Remember when {institution} said {past_statement}? Now they're saying {contradictory_statement}. Who can we trust?"
                ]
            },
            
            // Campaign 2: Corporate Astroturfing
            corporate_astroturf: {
                name: "Corporate Astroturfing",
                objective: "Simulate grassroots support for corporate interests",
                tactics: ["fake_grassroots", "economic_fear", "job_concerns"],
                templates: [
                    "As a {job_title} with {number} years experience, new regulations will devastate our industry. {number} families depend on these jobs!",
                    "Local business owner here. These proposed changes would force me to {negative_consequence}. Think about the economic impact on our community!",
                    "Working parent of {number} kids. Can't afford higher {costs} from these environmental regulations. Families first! #RealTalk",
                    "Union member speaking: We support responsible {industry} that keeps Americans working. These extreme policies threaten {number} jobs in our state.",
                    "Small town resident. Our community depends on {industry}. Urban politicians don't understand our reality. We need balance, not ideology.",
                    "Taxpayer here. Why are we paying for {policy} when we have real problems like {local_issue}? Priorities, people!",
                    "Consumer advocacy: New regulations mean higher prices for everyday families. Who benefits? Follow the money to find out.",
                    "Tech worker here. Over-regulation stifles innovation. America leads in {technology} because we embrace progress, not restrict it."
                ]
            },
            
            // Campaign 3: Domestic Political Manipulation
            domestic_political: {
                name: "Domestic Political Manipulation",
                objective: "Increase polarization and emotional response",
                tactics: ["emotional_manipulation", "group_identity", "urgency_creation"],
                templates: [
                    "URGENT: {political_group} are trying to {extreme_action} before the election. We have {short_timeframe} to stop this!",
                    "Real {identity_group} understand that {political_position}. If you care about {emotional_value}, you know what to do.",
                    "They're coming for your {cherished_thing} next. First {previous_target}, now {current_target}. When will we say enough?",
                    "Every day we wait, {negative_outcome} gets worse. Our {family_type} deserve better. Time to {political_action}!",
                    "I never thought I'd see the day when {extreme_scenario} in America. This isn't the country I grew up in.",
                    "Attention {local_area} residents: Your {local_representative} voted AGAINST {popular_position}. Remember this in {timeframe}!",
                    "Breaking: {source} reports {inflammatory_claim}. Mainstream media silence speaks volumes. Share before it gets buried!",
                    "As a proud {identity}, I'm tired of being told I should {uncomfortable_position}. We need leaders who understand our values."
                ]
            }
        };
        
        // Template values for influence campaigns
        this.campaignValues = {
            institution: ['CDC', 'FBI', 'Department of Education', 'EPA', 'Federal Reserve', 'Supreme Court', 'Congress'],
            negative_action: ['hiding information', 'misleading the public', 'serving special interests', 'covering up failures'],
            controversial_claim: ['vaccines have unreported side effects', 'climate data is manipulated', 'election systems are vulnerable'],
            expert_group: ['scientists', 'economists', 'doctors', 'educators', 'journalists'],
            unrelated_topic: ['the economy', 'foreign policy', 'technology predictions', 'dietary guidelines'],
            current_topic: ['healthcare', 'education', 'climate change', 'immigration', 'the economy'],
            distraction_event: ['a major news story', 'a celebrity scandal', 'international tensions', 'a natural disaster'],
            family_member: ['cousin', 'brother-in-law', 'neighbor', 'friend'],
            relevant_field: ['government', 'healthcare', 'education', 'media'],
            unsupported_claim: ['there are major cover-ups', 'the real data is different', 'insiders are concerned'],
            
            job_title: ['construction worker', 'factory supervisor', 'truck driver', 'small business owner', 'farmer'],
            number: ['15', '25', '2', '3', '1000', '500'],
            negative_consequence: ['lay off workers', 'close my doors', 'move operations overseas', 'cut benefits'],
            costs: ['energy bills', 'gas prices', 'food costs', 'healthcare'],
            industry: ['energy', 'manufacturing', 'agriculture', 'transportation'],
            local_issue: ['infrastructure', 'schools', 'crime', 'homelessness'],
            technology: ['AI', 'biotech', 'clean energy', 'manufacturing'],
            
            political_group: ['extremists', 'radical activists', 'special interests', 'lobbyists'],
            extreme_action: ['change voting laws', 'restrict freedoms', 'raise taxes', 'eliminate protections'],
            short_timeframe: ['30 days', 'weeks', 'until the election', 'this month'],
            identity_group: ['Americans', 'parents', 'workers', 'patriots', 'families'],
            political_position: ['freedom comes first', 'families matter most', 'security is essential', 'jobs are the priority'],
            emotional_value: ['your children', 'our future', 'our values', 'our community'],
            cherished_thing: ['freedom of speech', 'privacy', 'traditional values', 'economic opportunity'],
            previous_target: ['small businesses', 'rural communities', 'working families', 'local schools'],
            current_target: ['your neighborhood', 'your job', 'your family', 'your rights'],
            negative_outcome: ['division in our community', 'threats to our way of life', 'economic uncertainty'],
            family_type: ['children', 'families', 'seniors', 'veterans'],
            political_action: ['vote', 'speak out', 'get involved', 'demand answers'],
            extreme_scenario: ['such division', 'such government overreach', 'such attacks on freedom'],
            local_area: ['Virginia', 'Ohio', 'Texas', 'Michigan', 'Pennsylvania'],
            local_representative: ['Senator', 'Congressman', 'Governor', 'Mayor'],
            popular_position: ['infrastructure funding', 'tax relief', 'education support', 'healthcare access'],
            timeframe: ['November', 'next election', '2024', 'the primaries'],
            source: ['leaked documents', 'insider sources', 'whistleblowers', 'investigative reports'],
            inflammatory_claim: ['secret meetings occurred', 'funding was diverted', 'policies are being hidden'],
            identity: ['American', 'parent', 'taxpayer', 'citizen', 'veteran'],
            uncomfortable_position: ['apologize for our values', 'accept policies that hurt families', 'stay silent about problems']
        };
    }
    
    /**
     * Generate a simple SVG chart for posts with statistical content
     * @param {string} type - Type of chart (bar, line, pie)
     * @param {string} fallacyType - The fallacy type to create misleading charts for
     * @returns {string} - SVG string for the chart
     */
    generateDataVisualization(type, fallacyType) {
        const width = 300;
        const height = 200;
        
        if (type === 'misleading_bar') {
            // Create a misleading bar chart with manipulated Y-axis
            const topics = [
                { title: "COVID Vaccine Effectiveness PLUMMETS!", yLabel: "Effectiveness (%)", beforeLabel: "Initial", afterLabel: "6 Months" },
                { title: "Crime Rate SKYROCKETS Under New Policy!", yLabel: "Safety Index", beforeLabel: "Before", afterLabel: "After" },
                { title: "Student Performance CRASHES With Online Learning!", yLabel: "Test Scores (%)", beforeLabel: "In-Person", afterLabel: "Online" },
                { title: "Electric Car Sales TANK This Quarter!", yLabel: "Market Share (%)", beforeLabel: "Q1", afterLabel: "Q2" },
                { title: "Social Media Usage DESTROYS Productivity!", yLabel: "Efficiency (%)", beforeLabel: "Limited Use", afterLabel: "Heavy Use" }
            ];
            
            const selectedTopic = topics[Math.floor(Math.random() * topics.length)];
            
            const data = [
                { label: selectedTopic.beforeLabel, value: 98.2 },
                { label: selectedTopic.afterLabel, value: 98.8 }
            ];
            
            // Manipulated scale starts at 98 instead of 0
            const minValue = 98;
            const maxValue = 99;
            const barWidth = 60;
            const barSpacing = 80;
            
            let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 4px;">`;
            
            // Title
            svg += `<text x="${width/2}" y="16" text-anchor="middle" font-family="Arial" font-size="13" font-weight="bold" fill="#d63384">${selectedTopic.title}</text>`;
            svg += `<text x="${width/2}" y="30" text-anchor="middle" font-family="Arial" font-size="10" fill="#666">Source: "Independent Research Institute" | Share if you care!</text>`;
            
            // Draw bars
            data.forEach((item, index) => {
                const x = 60 + (index * (barWidth + barSpacing));
                const normalizedValue = ((item.value - minValue) / (maxValue - minValue));
                const barHeight = normalizedValue * 110; // Makes the difference look huge
                const y = 155 - barHeight;
                
                // Bar
                svg += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${index === 0 ? '#28a745' : '#dc3545'}" stroke="#333" stroke-width="1"/>`;
                
                // Value label
                svg += `<text x="${x + barWidth/2}" y="${y - 5}" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#333">${item.value}%</text>`;
                
                // X-axis label
                svg += `<text x="${x + barWidth/2}" y="175" text-anchor="middle" font-family="Arial" font-size="11" fill="#333">${item.label}</text>`;
            });
            
            // Misleading Y-axis (starts at 98)
            svg += `<text x="10" y="160" font-family="Arial" font-size="10" fill="#666">98%</text>`;
            svg += `<text x="10" y="50" font-family="Arial" font-size="10" fill="#666">99%</text>`;
            svg += `<text x="25" y="105" font-family="Arial" font-size="9" fill="#999" transform="rotate(-90 25 105)">${selectedTopic.yLabel}</text>`;
            
            // Warning text (very small, easily missed)
            svg += `<text x="5" y="195" font-family="Arial" font-size="7" fill="#aaa">*Y-axis does not start at zero</text>`;
            
            svg += `</svg>`;
            return svg;
        }
        
        if (type === 'correlation_scatter') {
            // Create a scatter plot showing spurious correlation
            const correlations = [
                { title: "PROOF: Social Media Use Causes Depression!", xLabel: "Daily Social Media Hours", yLabel: "Depression Index", source: "Lifestyle Blog Network" },
                { title: "Video Games Linked to Academic Failure!", xLabel: "Gaming Hours/Week", yLabel: "GPA Decline", source: "Parents Against Gaming" },
                { title: "Coffee Consumption Drives Economic Growth!", xLabel: "Cups of Coffee per Capita", yLabel: "GDP Growth Rate", source: "Coffee Industry Alliance" },
                { title: "Screen Time DIRECTLY Causes Sleep Problems!", xLabel: "Screen Time (hours)", yLabel: "Sleep Quality Score", source: "Digital Wellness Blog" },
                { title: "Fast Food = Lower Test Scores (SHOCKING!)", xLabel: "Fast Food Outlets per City", yLabel: "Average Test Scores", source: "Health Freedom Network" }
            ];
            
            const selectedCorr = correlations[Math.floor(Math.random() * correlations.length)];
            
            let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 4px;">`;
            
            svg += `<text x="${width/2}" y="16" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#dc3545">${selectedCorr.title}</text>`;
            svg += `<text x="${width/2}" y="28" text-anchor="middle" font-family="Arial" font-size="9" fill="#666">Source: ${selectedCorr.source} | R² = 0.89 (STRONG!)</text>`;
            
            // Generate fake correlated data points
            const points = [];
            for (let i = 0; i < 15; i++) {
                const x = 35 + (i * 14) + (Math.random() * 8);
                const y = 45 + (i * 7) + (Math.random() * 15);
                points.push({ x, y });
            }
            
            // Draw points
            points.forEach(point => {
                svg += `<circle cx="${point.x}" cy="${point.y}" r="3" fill="#007bff" opacity="0.7"/>`;
            });
            
            // Draw trend line
            svg += `<line x1="35" y1="50" x2="265" y2="150" stroke="#dc3545" stroke-width="3"/>`;
            svg += `<text x="150" y="95" font-family="Arial" font-size="11" fill="#dc3545" font-weight="bold">CLEAR CAUSATION!</text>`;
            
            // Axes labels
            svg += `<text x="${width/2}" y="185" text-anchor="middle" font-family="Arial" font-size="10" fill="#666">${selectedCorr.xLabel}</text>`;
            svg += `<text x="15" y="105" font-family="Arial" font-size="10" fill="#666" transform="rotate(-90 15 105)">${selectedCorr.yLabel}</text>`;
            
            // Disclaimer (tiny text)
            svg += `<text x="5" y="195" font-family="Arial" font-size="6" fill="#aaa">*Correlation does not imply causation</text>`;
            
            svg += `</svg>`;
            return svg;
        }
        
        if (type === 'cherry_picked_line') {
            // Line chart with cherry-picked time range
            const trends = [
                { title: "Climate Change REVERSED! Global Cooling Confirmed!", yLabel: "Temperature (°F)", timeframe: "Jan-May 2023", source: "Climate Truth Network" },
                { title: "Renewable Energy FAILING - Coal Making Comeback!", yLabel: "Energy Output (MW)", timeframe: "Winter Months Only", source: "Energy Independence Blog" },
                { title: "Crime Wave EXPLODES Under Liberal Policies!", yLabel: "Incident Reports", timeframe: "Selected Districts", source: "Law & Order Today" },
                { title: "Stock Market COLLAPSE Imminent - Sell Everything!", yLabel: "Market Index", timeframe: "Last 30 Days", source: "Bear Market Predictions" },
                { title: "Remote Work DESTROYS Team Productivity!", yLabel: "Output Score", timeframe: "Transition Period", source: "Back to Office Movement" }
            ];
            
            const selectedTrend = trends[Math.floor(Math.random() * trends.length)];
            
            let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 4px;">`;
            
            svg += `<text x="${width/2}" y="16" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="#dc3545">${selectedTrend.title}</text>`;
            svg += `<text x="${width/2}" y="28" text-anchor="middle" font-family="Arial" font-size="9" fill="#666">Data: ${selectedTrend.timeframe} | Source: ${selectedTrend.source}</text>`;
            
            // Cherry-picked data showing dramatic change
            const points = [
                {x: 50, y: 60},
                {x: 100, y: 85},
                {x: 150, y: 115},
                {x: 200, y: 135},
                {x: 250, y: 150}
            ];
            
            // Draw line
            let pathD = `M ${points[0].x} ${points[0].y}`;
            for (let i = 1; i < points.length; i++) {
                pathD += ` L ${points[i].x} ${points[i].y}`;
            }
            svg += `<path d="${pathD}" stroke="#dc3545" stroke-width="4" fill="none"/>`;
            
            // Draw points
            points.forEach(point => {
                svg += `<circle cx="${point.x}" cy="${point.y}" r="4" fill="#dc3545"/>`;
            });
            
            // Add dramatic arrow
            svg += `<polygon points="230,140 240,135 240,145" fill="#dc3545"/>`;
            svg += `<text x="205" y="130" font-family="Arial" font-size="10" fill="#dc3545" font-weight="bold">SHOCKING!</text>`;
            
            // Time labels
            svg += `<text x="50" y="180" text-anchor="middle" font-family="Arial" font-size="10" fill="#666">Start</text>`;
            svg += `<text x="250" y="180" text-anchor="middle" font-family="Arial" font-size="10" fill="#666">End</text>`;
            svg += `<text x="${width/2}" y="190" text-anchor="middle" font-family="Arial" font-size="10" fill="#666">${selectedTrend.yLabel}</text>`;
            
            // Hidden disclaimer
            svg += `<text x="5" y="195" font-family="Arial" font-size="6" fill="#aaa">*Limited time period shown</text>`;
            
            svg += `</svg>`;
            return svg;
        }
        
        if (type === 'good_statistics') {
            // Proper statistical chart with full context
            const studies = [
                { title: "Long-term Climate Data Analysis (1970-2023)", yLabel: "Global Temperature Anomaly (°C)", source: "NOAA Climate Research", sample: "n=50,000 stations" },
                { title: "Educational Outcomes: 10-Year Longitudinal Study", yLabel: "Reading Proficiency (%)", source: "National Education Research Center", sample: "n=250,000 students" },
                { title: "Public Health Trends: Vaccination Impact Study", yLabel: "Disease Incidence Rate", source: "CDC Epidemiology Division", sample: "n=15M participants" },
                { title: "Economic Mobility Research (2010-2023)", yLabel: "Income Progression Index", source: "Bureau of Labor Statistics", sample: "n=75,000 households" },
                { title: "Mental Health Intervention Effectiveness", yLabel: "Wellness Score (0-100)", source: "Journal of Clinical Psychology", sample: "n=12,000 participants" }
            ];
            
            const selectedStudy = studies[Math.floor(Math.random() * studies.length)];
            
            let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 4px;">`;
            
            svg += `<text x="${width/2}" y="14" text-anchor="middle" font-family="Arial" font-size="11" font-weight="bold" fill="#28a745">${selectedStudy.title}</text>`;
            svg += `<text x="${width/2}" y="26" text-anchor="middle" font-family="Arial" font-size="8" fill="#666">${selectedStudy.source} | ${selectedStudy.sample} | p<0.001, CI: 95%</text>`;
            
            // Realistic long-term data with ups and downs
            const points = [
                {x: 40, y: 120}, {x: 55, y: 110}, {x: 70, y: 115}, {x: 85, y: 105}, 
                {x: 100, y: 100}, {x: 115, y: 95}, {x: 130, y: 90}, {x: 145, y: 88},
                {x: 160, y: 85}, {x: 175, y: 82}, {x: 190, y: 80}, {x: 205, y: 78},
                {x: 220, y: 75}, {x: 235, y: 73}, {x: 250, y: 70}
            ];
            
            // Draw confidence interval area
            svg += `<polygon points="40,128 55,118 70,123 85,113 100,108 115,103 130,98 145,96 160,93 175,90 190,88 205,86 220,83 235,81 250,78 250,62 235,65 220,67 205,70 190,72 175,74 160,77 145,80 130,82 115,87 100,92 85,97 70,107 55,102 40,112" fill="#28a745" opacity="0.2"/>`;
            
            // Draw line
            let pathD = `M ${points[0].x} ${points[0].y}`;
            for (let i = 1; i < points.length; i++) {
                pathD += ` L ${points[i].x} ${points[i].y}`;
            }
            svg += `<path d="${pathD}" stroke="#28a745" stroke-width="3" fill="none"/>`;
            
            // Draw points
            points.forEach(point => {
                svg += `<circle cx="${point.x}" cy="${point.y}" r="2" fill="#28a745"/>`;
            });
            
            // Add error bars/confidence intervals
            points.forEach((point, index) => {
                if (index % 3 === 0) {
                    svg += `<line x1="${point.x}" y1="${point.y - 8}" x2="${point.x}" y2="${point.y + 8}" stroke="#666" stroke-width="1" opacity="0.6"/>`;
                }
            });
            
            // Proper time labels
            svg += `<text x="40" y="180" text-anchor="middle" font-family="Arial" font-size="9" fill="#666">2010</text>`;
            svg += `<text x="145" y="180" text-anchor="middle" font-family="Arial" font-size="9" fill="#666">2016</text>`;
            svg += `<text x="250" y="180" text-anchor="middle" font-family="Arial" font-size="9" fill="#666">2023</text>`;
            svg += `<text x="${width/2}" y="190" text-anchor="middle" font-family="Arial" font-size="9" fill="#666">Year</text>`;
            
            // Y-axis starts from 0 (proper scale)
            svg += `<text x="15" y="170" font-family="Arial" font-size="9" fill="#666">0</text>`;
            svg += `<text x="15" y="50" font-family="Arial" font-size="9" fill="#666">100</text>`;
            svg += `<text x="25" y="105" font-family="Arial" font-size="8" fill="#666" transform="rotate(-90 25 105)">${selectedStudy.yLabel}</text>`;
            
            // Methodology note
            svg += `<text x="5" y="195" font-family="Arial" font-size="7" fill="#666">Peer-reviewed methodology available online</text>`;
            
            svg += `</svg>`;
            return svg;
        }
        
        return null;
    }
    
    /**
     * Fill a template with random values
     * @param {string} template - Template string with placeholders
     * @returns {string} - Filled template
     */
    fillTemplate(template) {
        // Replace each {placeholder} with a random value from the corresponding category
        return template.replace(/\{(\w+)\}/g, (match, category) => {
            if (this.templateValues[category]) {
                const values = this.templateValues[category];
                return values[Math.floor(Math.random() * values.length)];
            }
            return match; // Keep the placeholder if no replacement found
        });
    }
    
    /**
     * Generate a timestamp for the post
     * @returns {string} - Human-readable timestamp
     */
    generateTimestamp() {
        const intervals = ['Just now', '1m ago', '2m ago', '5m ago', '10m ago', '15m ago', '30m ago', '1h ago'];
        return intervals[Math.floor(Math.random() * intervals.length)];
    }
    
    /**
     * Generate a social media post
     * @param {number} level - Current game level
     * @returns {Object} - Generated post data
     */
    generatePost(level) {
        // Determine if this post will be part of an influence campaign
        // Higher levels have more sophisticated manipulation
        const campaignProbability = Math.min(0.2 + (level * 0.05), 0.4); // Max 40% chance
        const isInfluenceCampaign = Math.random() < campaignProbability;
        
        let postData;
        let campaignType = null;
        
        if (isInfluenceCampaign && level >= 3) {
            // Generate influence campaign post
            campaignType = this.selectCampaignType(level);
            postData = this.generateCampaignPost(campaignType);
        } else {
            // Generate regular fallacy post
            postData = this.generateRegularPost(level);
        }
        
        // Determine if this post should have a data visualization
        const shouldHaveVisualization = this.shouldIncludeVisualization(postData.fallacyType, postData.content);
        let visualization = null;
        
        if (shouldHaveVisualization) {
            visualization = this.getVisualizationForPost(postData.fallacyType, postData.content);
        }
        
        return {
            username: postData.username,
            timestamp: this.generateTimestamp(),
            content: postData.content,
            fallacyType: postData.fallacyType,
            hasVisualization: shouldHaveVisualization,
            visualization: visualization,
            campaignType: campaignType,
            isInfluenceCampaign: isInfluenceCampaign
        };
    }
    
    /**
     * Select campaign type based on level and randomization
     * @param {number} level - Current game level
     * @returns {string} - Campaign type
     */
    selectCampaignType(level) {
        const campaigns = ['state_sponsored', 'corporate_astroturf', 'domestic_political'];
        
        if (level < 5) {
            // Early levels: simpler campaigns
            return campaigns[Math.floor(Math.random() * 2)]; // Only first two
        } else {
            // Higher levels: all campaigns
            return campaigns[Math.floor(Math.random() * campaigns.length)];
        }
    }
    
    /**
     * Generate an influence campaign post
     * @param {string} campaignType - Type of campaign
     * @returns {Object} - Post data
     */
    generateCampaignPost(campaignType) {
        const campaign = this.influenceCampaigns[campaignType];
        const template = campaign.templates[Math.floor(Math.random() * campaign.templates.length)];
        const username = this.campaignUsernames[campaignType][Math.floor(Math.random() * this.campaignUsernames[campaignType].length)];
        
        // Fill template with campaign-specific values
        const content = this.fillCampaignTemplate(template, campaignType);
        
        // Campaign posts often use existing fallacy types but in sophisticated ways
        const fallacyType = this.getCampaignFallacyType(campaignType);
        
        return {
            username,
            content,
            fallacyType
        };
    }
    
    /**
     * Generate a regular (non-campaign) post
     * @param {number} level - Current game level
     * @returns {Object} - Post data
     */
    generateRegularPost(level) {
        // Determine if this post will contain a fallacy
        const fallacyProbability = 0.4 + (level * 0.1);
        const hasFallacy = Math.random() < fallacyProbability;
        
        let fallacyType = 'none';
        
        if (hasFallacy) {
            // Use the helper function to get a fallacy appropriate for the current level
            if (typeof getRandomFallacyForLevel === 'function') {
                fallacyType = getRandomFallacyForLevel(level);
            } else {
                // Fallback if the function is not available
                const basicFallacies = ["strawman", "false_dilemma", "ad_hominem", "appeal_emotion", "hasty_generalization", "appeal_authority"];
                fallacyType = basicFallacies[Math.floor(Math.random() * basicFallacies.length)];
            }
        }
        
        // Select a random username
        const username = this.usernames[Math.floor(Math.random() * this.usernames.length)];
        
        // Get content templates for this fallacy type
        const templates = this.contentTemplates[fallacyType] || this.contentTemplates.none;
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        // Fill the template with values
        const content = this.fillTemplate(template);
        
        return {
            username,
            content,
            fallacyType
        };
    }
    
    /**
     * Fill campaign template with appropriate values
     * @param {string} template - Template string
     * @param {string} campaignType - Campaign type
     * @returns {string} - Filled template
     */
    fillCampaignTemplate(template, campaignType) {
        return template.replace(/\{(\w+)\}/g, (match, category) => {
            if (this.campaignValues[category]) {
                const values = this.campaignValues[category];
                return values[Math.floor(Math.random() * values.length)];
            }
            return match; // Keep the placeholder if no replacement found
        });
    }
    
    /**
     * Get appropriate fallacy type for campaign
     * @param {string} campaignType - Campaign type
     * @returns {string} - Fallacy type
     */
    getCampaignFallacyType(campaignType) {
        const campaignFallacies = {
            state_sponsored: ['appeal_emotion', 'false_dilemma', 'ad_hominem', 'strawman'],
            corporate_astroturf: ['appeal_authority', 'appeal_emotion', 'hasty_generalization', 'stats_manipulation'],
            domestic_political: ['appeal_emotion', 'false_dilemma', 'strawman', 'hasty_generalization']
        };
        
        const possibleFallacies = campaignFallacies[campaignType];
        return possibleFallacies[Math.floor(Math.random() * possibleFallacies.length)];
    }
    
    /**
     * Determine if a post should include a data visualization
     * @param {string} fallacyType - The fallacy type
     * @param {string} content - The post content
     * @returns {boolean} - Whether to include a visualization
     */
    shouldIncludeVisualization(fallacyType, content) {
        // Include visualizations for statistical fallacies and some confirmation bias
        const visualizationFallacies = ['stats_manipulation', 'false_causality', 'confirmation_bias', 'none'];
        
        if (!visualizationFallacies.includes(fallacyType)) {
            return false;
        }
        
        // Check if content mentions charts, graphs, or data
        const hasDataKeywords = /chart|graph|data|study|research|trend|shows|evidence|statistics|findings|analysis/i.test(content);
        
        // Different probabilities based on fallacy type
        let probability;
        if (fallacyType === 'stats_manipulation') {
            probability = 0.7; // High chance for statistical manipulation
        } else if (fallacyType === 'none') {
            probability = 0.3; // Moderate chance for good statistics
        } else {
            probability = 0.4; // Medium chance for other fallacies
        }
        
        return hasDataKeywords && Math.random() < probability;
    }
    
    /**
     * Get appropriate visualization for a post
     * @param {string} fallacyType - The fallacy type
     * @param {string} content - The post content
     * @returns {string} - SVG visualization
     */
    getVisualizationForPost(fallacyType, content) {
        switch (fallacyType) {
            case 'stats_manipulation':
                // Choose visualization type based on content
                if (content.includes('skyrocketed') || content.includes('dramatic')) {
                    return this.generateDataVisualization('misleading_bar', fallacyType);
                } else if (content.includes('trend') || content.includes('alarming')) {
                    return this.generateDataVisualization('cherry_picked_line', fallacyType);
                } else {
                    return this.generateDataVisualization('misleading_bar', fallacyType);
                }
                
            case 'false_causality':
                return this.generateDataVisualization('correlation_scatter', fallacyType);
                
            case 'confirmation_bias':
                if (content.includes('graph') || content.includes('charts')) {
                    return this.generateDataVisualization('cherry_picked_line', fallacyType);
                }
                break;
                
            case 'none':
                // Good statistical visualization for non-fallacious posts
                if (content.includes('study') || content.includes('research') || content.includes('data')) {
                    return this.generateDataVisualization('good_statistics', fallacyType);
                }
                break;
                
            default:
                return null;
        }
        
        return null;
    }
}

// Make available globally
window.PostGenerator = PostGenerator; 