# Requirements Document V2: InsuriHub Platform - Additional Features

## Introduction

This document outlines additional features for the InsuriHub platform, organized by implementation priority. These features enhance user engagement, provide better customer service, and expand the platform's capabilities beyond the core functionality defined in requirements.md.

## Priority Classification

- **Must-Have (Phase 1)**: Critical features that should be added to the initial release
- **High Priority (Phase 2)**: Important features that significantly improve user experience and platform value
- **Nice-to-Have (Phase 3)**: Enhancement features that provide competitive advantages and ecosystem expansion

---

## Must-Have Features (Add to Phase 1)

### Requirement 25: Emergency Assistance

**User Story:** As a customer, I want quick access to emergency services during critical situations, so that I can get immediate help when I need it most.

**Why:** Critical for insurance customers in emergencies

#### Acceptance Criteria

1. THE System SHALL provide a prominent emergency button accessible from all screens
2. WHEN a customer activates emergency mode, THE System SHALL display emergency hotline numbers for their insurance company
3. THE System SHALL provide one-tap calling to the assigned agent's emergency line
4. THE System SHALL provide one-tap calling to the insurance company's 24/7 hotline
5. WHEN emergency is activated, THE System SHALL allow customers to share their current GPS location
6. THE System SHALL provide a fast-track claim submission option during emergencies
7. THE System SHALL display nearest approved hospitals based on customer location
8. THE System SHALL display nearest approved garages/repair shops based on customer location
9. THE System SHALL filter facilities by policy type (health insurance shows hospitals, vehicle insurance shows garages)
10. THE System SHALL maintain a database of approved service providers with contact information
11. THE System SHALL allow customers to call facilities directly from the emergency screen
12. THE System SHALL log all emergency activations for audit and support purposes
13. THE System SHALL send automatic notifications to assigned agents when emergency mode is activated
14. Token Cost: Free (critical feature)

### Requirement 26: Offline Mode (PWA Enhancement)

**User Story:** As a user in Myanmar, I want to access essential features without internet connectivity, so that I can use the platform despite unreliable internet.

**Why:** Myanmar internet connectivity can be unreliable

#### Acceptance Criteria

1. THE System SHALL implement comprehensive offline support through PWA service workers
2. WHEN offline, THE System SHALL allow users to view previously loaded policy information
3. WHEN offline, THE System SHALL allow users to access the premium calculator with cached data
4. WHEN offline, THE System SHALL allow users to view saved calculations and documents
5. WHEN offline, THE System SHALL allow users to view previously loaded posts and announcements
6. WHEN offline, THE System SHALL queue user actions (messages, posts) for submission when online
7. WHEN connection is restored, THE System SHALL automatically sync queued actions
8. WHEN connection is restored, THE System SHALL sync new notifications and updates
9. THE System SHALL display clear offline/online status indicators
10. THE System SHALL cache user profile data and settings for offline access
11. THE System SHALL cache frequently accessed content automatically
12. THE System SHALL allow users to manually mark content for offline availability
13. THE System SHALL manage cache size to prevent excessive storage usage
14. THE System SHALL provide cache management settings for users
15. Token Cost: Free (PWA feature)

### Requirement 27: Smart Notifications & Reminders

**User Story:** As a user, I want proactive notifications about important events and deadlines, so that I never miss critical insurance-related activities.

**Why:** Proactive customer engagement and retention

#### Acceptance Criteria

1. THE System SHALL send premium payment reminders 7 days before due date
2. THE System SHALL send premium payment reminders 3 days before due date
3. THE System SHALL send premium payment reminders on the due date
4. THE System SHALL send policy renewal countdown notifications at 90 days before expiration
5. THE System SHALL send policy renewal countdown notifications at 60 days before expiration
6. THE System SHALL send policy renewal countdown notifications at 30 days before expiration
7. THE System SHALL send policy renewal countdown notifications at 7 days before expiration
8. WHEN a claim status changes, THE System SHALL send real-time updates to customers
9. WHEN a claim is approved, THE System SHALL notify the customer immediately
10. WHEN a claim payment is processed, THE System SHALL notify the customer
11. THE System SHALL send birthday wishes to customers with special token bonuses
12. THE System SHALL send anniversary wishes (policy purchase anniversary) with special offers
13. THE System SHALL send weather alerts for customers with travel insurance when severe weather is forecasted
14. THE System SHALL send weather alerts for customers with property insurance during natural disaster warnings
15. THE System SHALL integrate with Myanmar weather services for alert data
16. THE System SHALL allow users to configure notification preferences by category
17. THE System SHALL support notification delivery via in-app, push, and email channels
18. THE System SHALL respect user quiet hours settings for non-urgent notifications
19. Token Cost: Free (system feature)

### Requirement 28: Chatbot Support

**User Story:** As a user, I want 24/7 instant support for common questions, so that I can get help anytime without waiting for human agents.

**Why:** 24/7 instant support and reduced agent workload

#### Acceptance Criteria

1. THE System SHALL provide an AI-powered chatbot accessible from all screens
2. WHEN a user opens the chatbot, THE System SHALL greet them and offer common help topics
3. THE System SHALL train the chatbot on insurance FAQs and platform usage
4. WHEN a user asks about policies, THE System SHALL allow chatbot to lookup user's policy details
5. WHEN a user asks about claim status, THE System SHALL allow chatbot to retrieve claim information
6. WHEN a user asks about token balance, THE System SHALL allow chatbot to display current balance
7. THE System SHALL support Myanmar language input and responses in the chatbot
8. THE System SHALL support English language input and responses in the chatbot
9. WHEN the chatbot cannot answer a question, THE System SHALL offer to transfer to a human agent
10. WHEN transferring to human agent, THE System SHALL preserve chat history
11. THE System SHALL allow agents to take over chatbot conversations
12. THE System SHALL track chatbot conversation history for quality improvement
13. THE System SHALL provide chatbot analytics to admins (common questions, resolution rate)
14. THE System SHALL allow admins to update chatbot knowledge base
15. THE System SHALL implement natural language processing for better understanding
16. Token Cost: Free (support feature)

---

## High Priority Features (Add to Phase 2)

### Requirement 29: Referral & Loyalty Program

**User Story:** As a user, I want to earn rewards for referring friends and staying active, so that I can benefit from my engagement with the platform.

**Why:** Encourage organic growth and customer retention

#### Acceptance Criteria

1. THE System SHALL generate unique referral codes for each user
2. WHEN a new user signs up with a referral code, THE System SHALL link them to the referrer
3. WHEN a referred user completes registration, THE System SHALL award tokens to the referrer
4. WHEN a referred user makes their first purchase, THE System SHALL award bonus tokens to the referrer
5. THE System SHALL provide additional commission bonuses for agents who refer new agents
6. THE System SHALL implement loyalty tiers: Bronze, Silver, Gold, Platinum
7. THE System SHALL calculate tier based on total activity points over 12 months
8. WHEN a user reaches a new tier, THE System SHALL unlock tier-specific perks
9. THE System SHALL provide tier benefits: Bronze (5% token bonus), Silver (10% bonus + priority support), Gold (15% bonus + free premium calculator), Platinum (20% bonus + VIP features)
10. THE System SHALL implement daily login streak tracking
11. WHEN a user maintains login streaks, THE System SHALL award streak bonuses (7 days = 10 tokens, 30 days = 50 tokens, 90 days = 200 tokens)
12. WHEN a user breaks a streak, THE System SHALL reset the counter
13. THE System SHALL implement activity streak tracking (daily quiz, daily post view)
14. THE System SHALL display referral statistics in user profile (total referrals, earned tokens)
15. THE System SHALL display current tier and progress to next tier prominently
16. THE System SHALL allow users to share referral codes via social media
17. Token Cost: Free (rewards users with tokens)

### Requirement 30: Document Vault

**User Story:** As a customer, I want secure storage for my insurance documents, so that I can access them anytime and share them easily during claims.

**Why:** Secure storage for important insurance documents

#### Acceptance Criteria

1. THE System SHALL provide encrypted document storage for each user
2. WHEN a user uploads a document, THE System SHALL encrypt it before storage
3. THE System SHALL support document types: PDF, JPG, PNG, DOCX
4. THE System SHALL organize documents by policy and document type
5. THE System SHALL allow users to tag documents with custom labels
6. THE System SHALL track document expiry dates (e.g., driver's license, vehicle registration)
7. WHEN a document is within 30 days of expiry, THE System SHALL send reminder notifications
8. THE System SHALL allow users to create family groups for document sharing
9. WHEN a family group is created, THE System SHALL allow sharing documents with family members
10. THE System SHALL implement permission controls for shared documents (view only, download)
11. WHEN submitting a claim, THE System SHALL allow quick attachment of documents from vault
12. THE System SHALL provide basic tier with 100MB storage (free)
13. THE System SHALL provide premium tier with unlimited storage (10 tokens/month subscription)
14. THE System SHALL display storage usage and remaining capacity
15. THE System SHALL allow users to download all documents as a ZIP file
16. THE System SHALL maintain document version history
17. THE System SHALL implement document search by name, tag, or date
18. Token Cost: Free for basic (100MB), 10 tokens/month for premium (unlimited)

### Requirement 31: Agent Performance Dashboard

**User Story:** As an agent, I want detailed analytics about my performance, so that I can track my progress and improve my results.

**Why:** Help agents track and improve performance

#### Acceptance Criteria

1. THE System SHALL provide a comprehensive performance dashboard for agents
2. THE System SHALL display total policies sold by month, quarter, and year
3. THE System SHALL display total revenue generated from customer activities
4. THE System SHALL display total commission earned and pending
5. THE System SHALL calculate and display customer satisfaction ratings from feedback
6. THE System SHALL track average response time to customer messages
7. THE System SHALL track average time to close customer inquiries
8. THE System SHALL calculate conversion rate (leads to customers ratio)
9. THE System SHALL display customer retention rate
10. THE System SHALL display policy renewal rate for agent's customers
11. THE System SHALL provide a top performer leaderboard visible to all agents
12. THE System SHALL rank agents by total sales, customer satisfaction, and activity
13. THE System SHALL award badges for performance milestones
14. THE System SHALL display performance trends with charts and graphs
15. THE System SHALL allow agents to set personal goals and track progress
16. THE System SHALL provide performance comparison against platform averages
17. THE System SHALL generate monthly performance reports downloadable as PDF
18. THE System SHALL highlight areas for improvement based on metrics
19. Token Cost: Free for agents

### Requirement 32: Social Proof & Reviews

**User Story:** As a customer, I want to see reviews and ratings of agents, so that I can make informed decisions about who to work with.

**Why:** Build trust through transparency

#### Acceptance Criteria

1. THE System SHALL allow customers to rate agents on a 1-5 star scale
2. WHEN a customer rates an agent, THE System SHALL deduct 2 tokens to prevent spam
3. THE System SHALL require customers to have an active policy with the agent before rating
4. THE System SHALL allow customers to write text reviews with ratings
5. THE System SHALL display average agent rating prominently on agent profiles
6. THE System SHALL display total number of reviews for each agent
7. THE System SHALL allow customers to rate specific policies they own
8. THE System SHALL display policy ratings and reviews to help others choose
9. THE System SHALL allow customers to share claim settlement success stories
10. THE System SHALL feature success stories on the platform homepage
11. THE System SHALL allow customers to submit testimonials
12. THE System SHALL require admin approval for featured testimonials
13. THE System SHALL display verified agent badges for agents meeting quality criteria
14. THE System SHALL award trust badges based on: verification status, rating above 4.5, 50+ reviews, zero complaints
15. THE System SHALL allow agents to respond to reviews
16. THE System SHALL flag and review suspicious rating patterns
17. THE System SHALL display recent reviews on agent profiles
18. Token Cost: 2 tokens to leave review (prevent spam)

---

## Nice-to-Have Features (Add to Phase 3)

### Requirement 33: Insurance Comparison Tool

**User Story:** As a customer, I want to compare different insurance policies side-by-side, so that I can make informed purchasing decisions.

**Why:** Help customers make informed decisions

#### Acceptance Criteria

1. THE System SHALL provide a policy comparison interface
2. THE System SHALL allow users to select 2-3 policies for side-by-side comparison
3. WHEN comparing policies, THE System SHALL display key features in aligned columns
4. THE System SHALL highlight differences between policies
5. THE System SHALL use AI to recommend the best match based on user profile
6. THE System SHALL consider user age, occupation, location, and needs for recommendations
7. THE System SHALL display premium differences across compared products
8. THE System SHALL calculate total cost over 1, 5, and 10 year periods
9. THE System SHALL perform coverage gap analysis
10. THE System SHALL identify what coverage is missing in each policy
11. THE System SHALL suggest additional coverage to fill gaps
12. THE System SHALL allow users to save comparison results
13. WHEN saving a comparison, THE System SHALL deduct 5 tokens
14. THE System SHALL allow users to share comparisons with agents
15. THE System SHALL generate comparison reports as PDF
16. Token Cost: 5 tokens to save comparison

### Requirement 34: Video Consultation

**User Story:** As a customer, I want to have video calls with agents, so that I can discuss policies face-to-face remotely.

**Why:** Remote agent-customer meetings enhance trust

#### Acceptance Criteria

1. THE System SHALL integrate video calling functionality
2. THE System SHALL allow customers to request video consultations with their agents
3. THE System SHALL allow agents to schedule video appointment slots
4. WHEN a video consultation is booked, THE System SHALL deduct 20 tokens per 30-minute session
5. THE System SHALL send calendar reminders before scheduled consultations
6. THE System SHALL provide in-app video calling interface
7. THE System SHALL support screen sharing during video calls
8. THE System SHALL allow agents to share documents during calls
9. THE System SHALL allow recording of consultations with mutual consent
10. WHEN a consultation is recorded, THE System SHALL store it in the customer's history
11. THE System SHALL allow customers to review past consultation recordings
12. THE System SHALL implement call quality monitoring
13. THE System SHALL provide fallback to audio-only if video quality is poor
14. THE System SHALL track consultation duration and automatically end at time limit
15. THE System SHALL allow extending consultations with additional token payment
16. Token Cost: 20 tokens per 30-minute session

### Requirement 35: Insurance News & Tips

**User Story:** As a user, I want to read insurance news and educational content, so that I can stay informed and make better decisions.

**Why:** Educational content builds trust and engagement

#### Acceptance Criteria

1. THE System SHALL provide a news and tips section
2. THE System SHALL display daily insurance tips curated by admins
3. THE System SHALL provide an industry news feed focused on Myanmar insurance
4. THE System SHALL allow admins to publish news articles
5. THE System SHALL categorize content by insurance type and topic
6. THE System SHALL provide video tutorials on common topics
7. THE System SHALL include tutorials on: filing claims, choosing policies, understanding coverage, reading policy documents
8. THE System SHALL provide a comprehensive FAQ section
9. THE System SHALL organize FAQs by category and popularity
10. THE System SHALL allow users to search FAQs
11. THE System SHALL allow users to bookmark articles and tips
12. WHEN bookmarking content, THE System SHALL deduct 5 tokens
13. THE System SHALL display bookmarked content in user profile
14. THE System SHALL track content views and engagement
15. THE System SHALL recommend content based on user's policies and interests
16. THE System SHALL support Myanmar and English content
17. Token Cost: Free to read, 5 tokens to bookmark

### Requirement 36: Family Account Management

**User Story:** As a customer, I want to manage insurance for my entire family in one place, so that I can easily track all family coverage.

**Why:** Manage insurance for entire family conveniently

#### Acceptance Criteria

1. THE System SHALL allow customers to create family groups
2. WHEN creating a family group, THE System SHALL deduct 10 tokens
3. THE System SHALL allow adding family members by email or phone
4. WHEN a family member is added, THE System SHALL send an invitation
5. WHEN invitation is accepted, THE System SHALL link accounts in family group
6. THE System SHALL display all family members' policies in one view
7. THE System SHALL allow filtering policies by family member
8. THE System SHALL provide family premium calculator
9. WHEN calculating family premiums, THE System SHALL apply family discounts if available
10. THE System SHALL allow managing dependents (children, elderly parents)
11. THE System SHALL track dependent information: name, age, relationship
12. THE System SHALL provide shared document vault for family
13. THE System SHALL implement permission controls (primary account holder has full access)
14. THE System SHALL calculate total family insurance spend
15. THE System SHALL provide family coverage gap analysis
16. THE System SHALL send consolidated reminders for all family policies
17. Token Cost: 10 tokens to create family group

### Requirement 37: Voice Assistant (Myanmar Language)

**User Story:** As a user, I want to interact with the platform using voice commands, so that I can access features hands-free and more easily.

**Why:** Accessibility for less tech-savvy users

#### Acceptance Criteria

1. THE System SHALL implement voice command recognition
2. THE System SHALL support Myanmar language voice input
3. THE System SHALL support English language voice input
4. THE System SHALL recognize common commands: "Show my policies", "Calculate premium", "Check token balance"
5. WHEN a voice command is recognized, THE System SHALL execute the corresponding action
6. THE System SHALL provide voice-to-text conversion for form inputs
7. THE System SHALL allow users to dictate messages and posts
8. THE System SHALL implement text-to-speech for reading content aloud
9. THE System SHALL allow users to listen to posts, news, and notifications
10. THE System SHALL provide voice navigation for accessibility
11. THE System SHALL display voice command suggestions to help users
12. THE System SHALL support voice search for agents and policies
13. THE System SHALL implement noise cancellation for better recognition
14. THE System SHALL allow users to enable/disable voice features
15. Token Cost: Free (accessibility feature)

### Requirement 38: Gamification Enhancements

**User Story:** As a user, I want engaging challenges and rewards, so that using the platform is fun and motivating.

**Why:** Increase engagement and retention through game mechanics

#### Acceptance Criteria

1. THE System SHALL provide daily challenges for users
2. THE System SHALL offer challenges like: "Complete a quiz", "Read 3 posts", "Send a renewal reminder", "Update your profile"
3. WHEN a user completes a daily challenge, THE System SHALL award bonus tokens
4. THE System SHALL implement an achievement system with 50+ achievements
5. THE System SHALL award achievements for milestones: first policy, 10 quizzes completed, 100 days streak, etc.
6. THE System SHALL display earned achievements in user profiles
7. THE System SHALL allow profile customization with avatars
8. THE System SHALL provide avatar options unlockable with tokens
9. THE System SHALL allow users to purchase profile themes with tokens
10. THE System SHALL implement seasonal events during Myanmar festivals
11. THE System SHALL provide special quizzes during Thingyan, Thadingyut, etc.
12. THE System SHALL award limited-edition badges during seasonal events
13. THE System SHALL implement team competitions for agents
14. THE System SHALL allow agents to form teams and compete in challenges
15. THE System SHALL display team leaderboards
16. THE System SHALL award team achievement badges
17. Token Cost: Free to participate, tokens as rewards

### Requirement 39: Financial Planning Tools

**User Story:** As a customer, I want financial planning tools, so that I can make better financial decisions beyond just insurance.

**Why:** Position as comprehensive financial platform

#### Acceptance Criteria

1. THE System SHALL provide a budget calculator tool
2. THE System SHALL allow users to input monthly income and expenses
3. THE System SHALL categorize expenses and provide budget recommendations
4. THE System SHALL provide a savings goals tracker
5. THE System SHALL allow users to set savings goals with target amounts and dates
6. THE System SHALL track progress toward savings goals
7. THE System SHALL provide an insurance coverage calculator
8. THE System SHALL recommend appropriate coverage amounts based on income, dependents, and assets
9. THE System SHALL provide a basic retirement planning calculator
10. THE System SHALL estimate retirement needs based on current age, income, and lifestyle
11. THE System SHALL provide an emergency fund calculator
12. THE System SHALL recommend emergency fund size (typically 3-6 months expenses)
13. THE System SHALL allow users to save financial plans
14. WHEN saving a financial plan, THE System SHALL deduct 5 tokens
15. THE System SHALL provide financial planning tips and education
16. THE System SHALL generate financial health reports
17. Token Cost: 5 tokens to save financial plan

### Requirement 40: Integration Features

**User Story:** As a user, I want the platform to integrate with my other tools, so that I can have a seamless experience.

**Why:** Seamless ecosystem integration

#### Acceptance Criteria

1. THE System SHALL allow linking bank accounts for auto-pay
2. WHEN a bank account is linked, THE System SHALL support automatic premium payments
3. THE System SHALL integrate with calendar applications
4. THE System SHALL allow syncing reminders to Google Calendar, Apple Calendar
5. THE System SHALL allow importing contacts for referrals
6. THE System SHALL support contact import from phone contacts
7. THE System SHALL allow sharing achievements on social media
8. THE System SHALL provide social sharing for Facebook, Viber, Telegram
9. THE System SHALL allow exporting reports and statements
10. THE System SHALL generate PDF exports for policies, transactions, and reports
11. THE System SHALL allow exporting data in CSV format
12. THE System SHALL implement webhook support for third-party integrations
13. THE System SHALL provide API documentation for integrations
14. Token Cost: Free (integration features)

### Requirement 41: Agent Tools Enhancement

**User Story:** As an agent, I want advanced tools to manage my customer pipeline, so that I can be more productive and close more sales.

**Why:** Empower agents to be more productive

#### Acceptance Criteria

1. THE System SHALL provide a lead management system for agents
2. THE System SHALL allow agents to add leads manually or import from contacts
3. THE System SHALL track lead status: new, contacted, interested, quoted, closed, lost
4. THE System SHALL provide follow-up reminder system
5. WHEN a follow-up is due, THE System SHALL notify the agent
6. THE System SHALL allow agents to schedule follow-ups for specific dates
7. THE System SHALL provide a visual sales pipeline
8. THE System SHALL display leads in pipeline stages with drag-and-drop
9. THE System SHALL provide a commission calculator
10. WHEN agents input potential sales, THE System SHALL estimate commission earnings
11. THE System SHALL allow agents to add private notes about customers
12. THE System SHALL keep customer notes private and searchable
13. THE System SHALL provide bulk messaging capability
14. WHEN sending bulk messages, THE System SHALL deduct 1 token per message
15. THE System SHALL allow filtering customers for targeted messaging
16. THE System SHALL track message delivery and read status
17. THE System SHALL provide templates for common messages
18. Token Cost: 1 token per bulk message

### Requirement 42: Compliance & Reporting

**User Story:** As an admin, I want comprehensive compliance and reporting tools, so that the platform meets regulatory requirements.

**Why:** Meet regulatory requirements and maintain audit trails

#### Acceptance Criteria

1. THE System SHALL generate regulatory compliance reports
2. THE System SHALL support Myanmar Insurance Board reporting requirements
3. THE System SHALL allow admins to schedule automatic report generation
4. THE System SHALL maintain complete audit trails for all transactions
5. THE System SHALL log all user actions with timestamps and IP addresses
6. THE System SHALL allow admins to search and filter audit logs
7. THE System SHALL provide data export functionality for audits
8. THE System SHALL allow exporting user data, transactions, and activities
9. THE System SHALL implement privacy controls similar to GDPR
10. THE System SHALL allow users to request their data
11. THE System SHALL allow users to request data deletion (with policy retention rules)
12. THE System SHALL implement consent management
13. THE System SHALL track user consent for data processing, marketing, and sharing
14. THE System SHALL allow users to update consent preferences
15. THE System SHALL ensure data retention policies are enforced
16. THE System SHALL automatically archive or delete data per retention rules
17. Token Cost: Free (compliance feature)

---

## Implementation Roadmap

### Phase 1 Enhancement (Must-Have Features)
- Emergency Assistance (Requirement 25)
- Offline Mode (Requirement 26)
- Smart Notifications & Reminders (Requirement 27)
- Chatbot Support (Requirement 28)

### Phase 2 Enhancement (High Priority Features)
- Referral & Loyalty Program (Requirement 29)
- Document Vault (Requirement 30)
- Agent Performance Dashboard (Requirement 31)
- Social Proof & Reviews (Requirement 32)

### Phase 3 Enhancement (Nice-to-Have Features)
- Insurance Comparison Tool (Requirement 33)
- Video Consultation (Requirement 34)
- Insurance News & Tips (Requirement 35)
- Family Account Management (Requirement 36)
- Voice Assistant (Requirement 37)
- Gamification Enhancements (Requirement 38)
- Financial Planning Tools (Requirement 39)
- Integration Features (Requirement 40)
- Agent Tools Enhancement (Requirement 41)
- Compliance & Reporting (Requirement 42)

---

## Token Economy Summary

### Free Features (No Token Cost)
- Emergency Assistance
- Offline Mode
- Smart Notifications
- Chatbot Support
- Agent Performance Dashboard
- Voice Assistant
- Integration Features
- Compliance & Reporting
- Referral Program (rewards tokens)
- Gamification (rewards tokens)

### Token-Based Features
- Document Vault: 10 tokens/month for premium tier
- Social Proof: 2 tokens to leave review
- Insurance Comparison: 5 tokens to save
- Video Consultation: 20 tokens per 30 minutes
- News & Tips: 5 tokens to bookmark
- Family Account: 10 tokens to create group
- Financial Planning: 5 tokens to save plan
- Agent Bulk Messaging: 1 token per message

---

## Notes

- All features maintain consistency with existing token economy
- Features prioritize Myanmar market needs (offline support, local language)
- Emergency features are free to ensure customer safety
- Educational and accessibility features are free to promote platform adoption
- Premium features use token costs to prevent abuse and generate revenue
- Agent productivity tools balance free access with usage-based costs
- All features support Myanmar Unicode and English languages
- Mobile-first design principles apply to all new features
- Integration with existing notification, payment, and authentication systems required
