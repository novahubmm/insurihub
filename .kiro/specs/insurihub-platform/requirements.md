# Requirements Document: InsuriHub Platform

## Introduction

InsuriHub is a comprehensive insurance sector platform designed for Myanmar, serving customers, agents, insurance companies, teachers, and administrators. The platform implements a token-based economy where all activities consume tokens that never expire. The system will be developed in three phases, with Phase 1 focusing on core customer-agent-admin functionality, Phase 2 adding job portal and training systems, and Phase 3 implementing full insurance company management.

The platform supports multiple languages (English and Myanmar Unicode), multiple currencies (MMK and USD), Myanmar calendar integration, and local payment gateways (KBZPay, WavePay, AYAPay). The system is designed as a mobile-first Progressive Web App (PWA) with future React Native mobile applications.

## Glossary

- **System**: The InsuriHub platform including web applications, mobile applications, and backend services
- **Customer**: End users who purchase insurance policies and interact with agents
- **Agent**: Insurance agents who manage customers, create posts, and handle policy renewals
- **Admin**: System administrators who manage users, content, and system configuration
- **Teacher**: Training instructors who manage courses and students (Phase 2)
- **Company**: Insurance company staff managing HR, policies, and operations (Phase 3)
- **Token**: Virtual currency unit used to pay for platform activities, never expires
- **Token_Package**: Subscription plan that provides monthly token allocation
- **Policy**: Insurance policy owned by a customer
- **Premium_Calculator**: AI-powered tool for calculating insurance premiums
- **Quiz**: Knowledge assessment system with rewards
- **Post**: Content created by agents or admins (announcements, articles)
- **Claim**: Insurance claim request submitted by customers
- **Account_Suspension**: State where user account is held due to zero token balance
- **Social_Authentication**: Login via Facebook, Google, Email, or Phone with OTP
- **Myanmar_Calendar**: Traditional Myanmar calendar system
- **Payment_Gateway**: Local payment processors (KBZPay, WavePay, AYAPay)
- **Agent_Verification**: Manual approval process for agent accounts by admin
- **Commission**: Earnings for agents based on customer activities
- **Advertisement**: Promotional content (GIF files) displayed to customers
- **Leaderboard**: Ranking system based on quiz scores and achievements
- **Badge**: Achievement award earned through quiz participation
- **Renewal_Reminder**: Notification sent to customers about policy renewal

## Requirements

### Requirement 1: User Authentication and Registration

**User Story:** As a user (customer or agent), I want to register and login using multiple authentication methods, so that I can access the platform securely and conveniently.

#### Acceptance Criteria

1. WHEN a user chooses to register, THE System SHALL provide options for Facebook, Google, Email, and Phone number authentication
2. WHEN a user registers with email, THE System SHALL require email verification before account activation
3. WHEN a user registers with phone number, THE System SHALL send an OTP for verification
4. WHERE OTP verification is enabled by admin, WHEN a user registers with phone, THE System SHALL require OTP confirmation
5. WHEN a user registers with social authentication (Facebook or Google), THE System SHALL automatically verify the account
6. WHEN a user completes registration, THE System SHALL create an account with zero token balance
7. WHEN a customer registers, THE System SHALL assign the CUSTOMER role by default
8. WHEN an agent registers, THE System SHALL assign the AGENT role and set status to pending verification
9. WHEN an admin logs in, THE System SHALL require email and password authentication only
10. WHEN authentication fails, THE System SHALL return a descriptive error message
11. THE System SHALL store phone numbers in +95 format for Myanmar users
12. THE System SHALL support Myanmar Unicode for user names and profile information

### Requirement 2: Token System Management

**User Story:** As a user, I want to use tokens to perform activities on the platform, so that I can access premium features and services.

#### Acceptance Criteria

1. THE System SHALL implement a token-based economy where all activities consume tokens
2. WHEN a user performs any activity, THE System SHALL deduct the configured token cost from their balance
3. THE System SHALL ensure tokens never expire once purchased or earned
4. WHEN a user's token balance reaches zero, THE System SHALL suspend the account with soft hold
5. WHILE an account is suspended, THE System SHALL hide all token-based activity features from the user interface
6. WHILE an account is suspended, THE System SHALL allow users to view policies and messages
7. WHEN an account is suspended, THE System SHALL allow users to request token top-up from admin
8. WHEN an admin configures token costs, THE System SHALL apply the new costs to all subsequent activities
9. THE System SHALL maintain a transaction history for all token additions and deductions
10. WHEN a user purchases tokens, THE System SHALL immediately add tokens to their balance
11. WHEN a token transaction occurs, THE System SHALL record the activity type, amount, and timestamp
12. THE System SHALL allow admins to manually adjust user token balances with a reason
13. THE System SHALL display current token balance prominently in the user interface
14. WHEN a user attempts an activity with insufficient tokens, THE System SHALL prevent the action and display the required token cost

### Requirement 3: Token Package Subscriptions

**User Story:** As an agent, I want to subscribe to token packages, so that I can receive monthly token allocations for my activities.

#### Acceptance Criteria

1. THE System SHALL provide multiple token package options with different monthly allocations
2. WHEN an agent subscribes to a package, THE System SHALL record the subscription start date and expiration date
3. WHEN a package expires, THE System SHALL automatically renew if payment is successful
4. WHEN package renewal fails, THE System SHALL notify the agent and suspend token allocation
5. THE System SHALL support both MMK and USD pricing for packages
6. WHEN an agent changes packages, THE System SHALL apply the new allocation from the next billing cycle
7. THE System SHALL allow admins to create, modify, and deactivate token packages
8. WHEN creating a package, THE System SHALL require name, description, monthly token amount, and price
9. THE System SHALL display package features and benefits to users during selection
10. WHEN a package is deactivated, THE System SHALL prevent new subscriptions but maintain existing ones

### Requirement 4: Agent Verification and Management

**User Story:** As an admin, I want to manually verify agent accounts, so that I can ensure only qualified agents operate on the platform.

#### Acceptance Criteria

1. WHEN an agent registers, THE System SHALL set their verification status to pending
2. WHILE an agent is pending verification, THE System SHALL restrict access to agent-specific features
3. WHEN an admin reviews an agent application, THE System SHALL provide approve and reject options
4. WHEN an admin approves an agent, THE System SHALL activate all agent features and send a notification
5. WHEN an admin rejects an agent, THE System SHALL provide a reason field and notify the applicant
6. THE System SHALL allow agents to update their profile information for re-verification
7. WHEN an agent updates their profile, THE System SHALL display verification status prominently
8. THE System SHALL maintain a verification history for each agent account
9. THE System SHALL allow admins to suspend or revoke agent verification at any time
10. WHEN agent verification is revoked, THE System SHALL immediately restrict agent features

### Requirement 5: Customer-Agent-Policy Relationship Management

**User Story:** As a customer, I want to connect with agents for specific insurance policies, so that I can receive specialized support for each policy.

#### Acceptance Criteria

1. THE System SHALL link each customer policy to exactly one agent
2. WHEN a customer purchases a policy, THE System SHALL require agent selection
3. WHEN a customer searches for agents, THE System SHALL display agent profiles with verification status
4. THE System SHALL allow agents to claim customers by sending connection requests for specific policies
5. WHEN an agent claims a customer for a policy, THE System SHALL require customer approval
6. THE System SHALL track which agent manages each policy for commission purposes
7. WHEN a customer accepts an agent connection, THE System SHALL notify the agent
8. THE System SHALL allow customers to change the agent for a specific policy
9. THE System SHALL display all policies with their assigned agents in the customer's profile
10. THE System SHALL allow agents to view their customer list grouped by policy type

### Requirement 6: Commission Tracking and Withdrawal System

**User Story:** As an agent, I want to track and withdraw commissions earned from my customers, so that I can monitor my earnings and receive payments.

#### Acceptance Criteria

1. THE System SHALL calculate commissions for agents based on customer policy activities
2. WHEN a customer performs a paid activity on their policy, THE System SHALL credit commission to the assigned agent
3. THE System SHALL support configurable commission rates per activity type
4. THE System SHALL maintain a commission transaction history for each agent
5. WHEN commission is earned, THE System SHALL notify the agent with transaction details
6. THE System SHALL display total commission earned in tokens in the agent dashboard
7. THE System SHALL allow agents to request token-to-money withdrawal
8. WHEN an agent requests withdrawal, THE System SHALL create a withdrawal request for admin approval
9. WHEN an admin approves withdrawal, THE System SHALL mark it for manual bank transfer or payment gateway processing
10. THE System SHALL allow admins to configure commission rates globally
11. WHEN an admin changes commission rates, THE System SHALL apply changes to future transactions only
12. THE System SHALL generate commission reports for agents on a monthly basis

### Requirement 7: Policy Management

**User Story:** As a customer, I want to view my insurance policies and their status, so that I can track my coverage and important dates.

#### Acceptance Criteria

1. THE System SHALL display all customer policies with current status
2. WHEN a customer views a policy, THE System SHALL show policy number, type, coverage amount, premium, and expiration date
3. THE System SHALL support all Myanmar insurance policy categories from mminsurance.gov.mm
4. WHEN a policy is near expiration, THE System SHALL display a renewal reminder
5. THE System SHALL allow customers to view detailed policy documents
6. THE System SHALL track policy status (active, expired, cancelled, pending renewal)
7. WHEN a policy status changes, THE System SHALL notify the customer and connected agents
8. THE System SHALL display policy information in both English and Myanmar language
9. THE System SHALL show premium payment history for each policy
10. THE System SHALL allow customers to download policy documents as PDF files

### Requirement 8: Premium Calculator

**User Story:** As a user (customer or agent), I want to use an AI-powered premium calculator, so that I can estimate insurance costs for different coverage options.

#### Acceptance Criteria

1. THE System SHALL provide a premium calculator for all insurance product types
2. WHEN a user accesses the calculator, THE System SHALL display input fields for coverage parameters
3. WHEN a user submits calculator inputs, THE System SHALL return estimated premium amounts
4. THE System SHALL use AI algorithms to provide personalized premium recommendations
5. WHEN a user saves calculator results, THE System SHALL deduct the configured token cost
6. THE System SHALL store saved calculations in the user's history
7. THE System SHALL allow users to compare multiple calculation scenarios
8. THE System SHALL display premium breakdowns by coverage component
9. THE System SHALL support both MMK and USD currency for premium calculations
10. THE System SHALL allow admins to update calculator parameters and pricing models
11. WHEN calculator data is updated by admin, THE System SHALL apply changes immediately to new calculations

### Requirement 9: Renewal Reminder System

**User Story:** As an agent, I want to send renewal reminders to my customers, so that I can help them maintain continuous insurance coverage.

#### Acceptance Criteria

1. WHEN an agent sends a renewal reminder, THE System SHALL deduct the configured token cost
2. THE System SHALL allow agents to send reminders to individual customers or groups
3. WHEN a reminder is sent, THE System SHALL notify the customer via in-app notification
4. THE System SHALL track reminder history for each customer-agent relationship
5. THE System SHALL prevent duplicate reminders within a configured time period
6. WHEN a policy is within 30 days of expiration, THE System SHALL automatically suggest sending reminders
7. THE System SHALL allow agents to customize reminder messages
8. THE System SHALL display reminder status (sent, viewed, responded) to agents
9. WHEN a customer views a reminder, THE System SHALL update the status and notify the agent
10. THE System SHALL generate reminder effectiveness reports for agents

### Requirement 10: Post Creation and Management

**User Story:** As an agent or admin, I want to create posts to share information and announcements, so that I can engage with customers and the community.

#### Acceptance Criteria

1. WHEN an agent creates a post, THE System SHALL deduct the configured token cost
2. WHEN an agent creates a post, THE System SHALL automatically publish it without approval
3. WHEN an admin creates a post, THE System SHALL publish it immediately without token cost
4. THE System SHALL allow posts to include one image file
5. WHEN a post is created, THE System SHALL require title, content, and insurance category
6. THE System SHALL support Myanmar Unicode text in post content
7. THE System SHALL display posts in a feed ordered by creation date
8. THE System SHALL allow users to like posts
9. WHEN a user likes a post, THE System SHALL increment the like counter
10. THE System SHALL allow users to comment on posts
11. WHEN a user comments on a post, THE System SHALL deduct the configured token cost
12. THE System SHALL notify post authors when their posts receive likes or comments
13. THE System SHALL allow admins to delete any post
14. THE System SHALL allow agents to edit or delete their own posts

### Requirement 11: Quiz System with Rewards

**User Story:** As a customer, I want to participate in insurance knowledge quizzes, so that I can learn about insurance and earn rewards.

#### Acceptance Criteria

1. THE System SHALL provide multiple quizzes on insurance knowledge topics
2. WHEN a customer completes a quiz, THE System SHALL calculate and display the score
3. WHEN a customer achieves a passing score, THE System SHALL award tokens as configured by admin
4. WHEN a customer completes a quiz, THE System SHALL award badges based on performance
5. THE System SHALL maintain a leaderboard ranking customers by quiz scores
6. THE System SHALL allow admins to create monthly quiz challenges
7. WHEN creating a quiz, THE System SHALL require questions, answers, and correct answer indicators
8. THE System SHALL support multiple choice and true/false question types
9. THE System SHALL display quiz history and scores in the customer profile
10. THE System SHALL prevent customers from retaking the same quiz within a configured time period
11. THE System SHALL display earned badges in the customer profile
12. THE System SHALL update the leaderboard in real-time as quizzes are completed
13. THE System SHALL support Myanmar Unicode for quiz questions and answers

### Requirement 12: Search and Discovery

**User Story:** As a customer, I want to search for agents and view their profiles, so that I can find qualified agents to work with.

#### Acceptance Criteria

1. THE System SHALL provide a search interface for finding agents
2. WHEN a customer searches, THE System SHALL filter results by name, location, and specialization
3. WHEN displaying search results, THE System SHALL show agent name, avatar, verification status, and rating
4. WHEN a customer views an agent profile, THE System SHALL display detailed information including experience and customer count
5. THE System SHALL allow customers to filter agents by insurance category expertise
6. THE System SHALL display agent verification badges prominently in search results
7. THE System SHALL sort search results by relevance and rating
8. THE System SHALL support Myanmar Unicode for search queries
9. THE System SHALL display agent contact information only to connected customers
10. THE System SHALL allow customers to send connection requests directly from search results

### Requirement 13: Claim Management

**User Story:** As a customer, I want to submit and track insurance claims, so that I can receive compensation for covered incidents.

#### Acceptance Criteria

1. THE System SHALL allow customers to submit claims for their active policies
2. WHEN submitting a claim, THE System SHALL require policy number, incident date, description, and supporting documents
3. THE System SHALL support document uploads (images and PDFs) for claim evidence
4. WHEN a claim is submitted, THE System SHALL assign a unique claim number
5. THE System SHALL track claim status (submitted, under review, approved, rejected, paid)
6. WHEN claim status changes, THE System SHALL notify the customer and connected agents
7. THE System SHALL allow agents to view claims for their customers
8. THE System SHALL allow agents to add notes and update claim information
9. THE System SHALL display claim history in the customer profile
10. THE System SHALL support Myanmar Unicode for claim descriptions
11. THE System SHALL allow customers to upload additional documents to existing claims
12. THE System SHALL maintain a complete audit trail for all claim activities

### Requirement 14: Advertisement System

**User Story:** As a customer, I want to request advertisements for my business, so that I can promote my services to other platform users.

#### Acceptance Criteria

1. THE System SHALL allow customers to request advertisement placement
2. WHEN requesting an ad, THE System SHALL require GIF file upload and display duration
3. THE System SHALL support pay-per-view and pay-per-time pricing models
4. WHEN an ad request is submitted, THE System SHALL require admin approval
5. WHEN an admin approves an ad, THE System SHALL activate it for the specified duration
6. THE System SHALL display approved ads in designated areas of the platform
7. THE System SHALL track ad impressions (views) and display count to advertisers
8. WHEN an ad reaches its view or time limit, THE System SHALL automatically deactivate it
9. THE System SHALL deduct payment from customer token balance upon ad activation
10. THE System SHALL allow admins to configure ad pricing for different placements
11. THE System SHALL provide ad performance reports to advertisers
12. THE System SHALL allow admins to pause or remove ads at any time

### Requirement 15: Data Migration from Excel

**User Story:** As an admin, I want to import customer data from Excel files, so that I can migrate existing customer records into the system.

#### Acceptance Criteria

1. THE System SHALL accept Excel file uploads for bulk customer data import
2. WHEN an Excel file is uploaded, THE System SHALL validate the file format and required columns (name, phone, email, policy number, agent name)
3. THE System SHALL support importing customer name, phone, email, policy information, and agent assignment
4. WHEN validation errors occur, THE System SHALL display error details with row numbers
5. THE System SHALL allow admins to review and correct individual records before final import
6. WHEN an agent name in Excel does not exist, THE System SHALL create a pending agent account automatically
7. WHEN import is confirmed, THE System SHALL create customer accounts with temporary passwords
8. THE System SHALL send account activation notifications to imported customers
9. THE System SHALL link imported customers to their assigned agents automatically
10. THE System SHALL support importing 1000+ customer records in a single operation
11. THE System SHALL provide import progress indication during processing
12. THE System SHALL generate an import summary report showing success and failure counts
13. THE System SHALL support Myanmar Unicode in imported data

### Requirement 16: Multi-Language Support

**User Story:** As a Myanmar user, I want to use the platform in Myanmar language, so that I can interact with the system in my native language.

#### Acceptance Criteria

1. THE System SHALL support English and Myanmar Unicode languages
2. WHEN a user selects a language, THE System SHALL display all interface elements in that language
3. THE System SHALL persist language preference across user sessions
4. THE System SHALL support Myanmar Unicode input for all text fields
5. THE System SHALL support language switching without requiring logout
6. THE System SHALL translate system notifications into the user's selected language
7. THE System SHALL allow content creators to provide translations for posts and announcements
8. THE System SHALL default to English for users who have not selected a language preference

### Requirement 17: Currency and Payment Integration

**User Story:** As a user, I want to purchase tokens using local payment methods, so that I can pay in my preferred currency and payment gateway.

#### Acceptance Criteria

1. THE System SHALL support MMK (Myanmar Kyat) and USD currencies
2. WHEN displaying prices, THE System SHALL show amounts in the user's selected currency
3. THE System SHALL integrate with KBZPay payment gateway
4. THE System SHALL integrate with WavePay payment gateway
5. THE System SHALL integrate with AYAPay payment gateway
6. WHEN a user initiates token purchase, THE System SHALL redirect to the selected payment gateway
7. WHEN payment is successful, THE System SHALL immediately credit tokens to the user account
8. WHEN payment fails, THE System SHALL notify the user and provide retry options
9. THE System SHALL maintain payment transaction history for all users
10. THE System SHALL support currency conversion at admin-configured exchange rates
11. THE System SHALL allow admins to enable or disable specific payment gateways
12. THE System SHALL generate payment receipts for successful transactions

### Requirement 18: Real-Time Notifications

**User Story:** As a user, I want to receive real-time notifications for important events, so that I can stay informed about platform activities.

#### Acceptance Criteria

1. WHEN a user receives a message, THE System SHALL display a real-time notification
2. WHEN a post receives a like or comment, THE System SHALL notify the post author
3. WHEN an agent connection request is received, THE System SHALL notify the customer
4. WHEN a policy is near expiration, THE System SHALL notify the customer and connected agents
5. WHEN a claim status changes, THE System SHALL notify the customer
6. WHEN token balance reaches a low threshold, THE System SHALL notify the user
7. WHEN an agent is verified, THE System SHALL notify the agent
8. THE System SHALL display unread notification count in the user interface
9. WHEN a user views a notification, THE System SHALL mark it as read
10. THE System SHALL maintain notification history for 30 days
11. THE System SHALL allow users to configure notification preferences
12. THE System SHALL support push notifications for mobile PWA installations

### Requirement 19: Admin Dashboard and Management

**User Story:** As an admin, I want comprehensive management tools, so that I can configure and monitor the entire platform.

#### Acceptance Criteria

1. THE System SHALL provide an admin dashboard with platform statistics
2. WHEN an admin logs in, THE System SHALL display user counts by role
3. THE System SHALL allow admins to view and manage all user accounts
4. THE System SHALL allow admins to suspend or activate user accounts
5. THE System SHALL allow admins to configure token costs for all activities
6. THE System SHALL allow admins to create and manage token packages
7. THE System SHALL allow admins to approve or reject agent verification requests
8. THE System SHALL allow admins to review and manage advertisement requests
9. THE System SHALL allow admins to create and manage quizzes
10. THE System SHALL allow admins to configure commission rates
11. THE System SHALL allow admins to manually adjust user token balances
12. THE System SHALL allow admins to configure payment gateway settings
13. THE System SHALL allow admins to view platform analytics and reports
14. THE System SHALL allow admins to manage system settings (OTP, language, currency)
15. THE System SHALL maintain audit logs for all admin actions

### Requirement 20: Mobile-First Progressive Web App

**User Story:** As a mobile user, I want a responsive and installable web application, so that I can access the platform like a native mobile app.

#### Acceptance Criteria

1. THE System SHALL implement a mobile-first responsive design
2. WHEN accessed on mobile devices, THE System SHALL display optimized layouts
3. THE System SHALL provide a web app manifest for PWA installation
4. WHEN installed as PWA, THE System SHALL function offline for cached content
5. THE System SHALL implement service workers for offline support
6. THE System SHALL support touch gestures for mobile interactions
7. THE System SHALL optimize images and assets for mobile bandwidth
8. THE System SHALL implement bottom navigation for mobile devices
9. THE System SHALL support safe area insets for devices with notches
10. THE System SHALL provide haptic feedback for mobile interactions where appropriate
11. THE System SHALL implement pull-to-refresh functionality on mobile
12. THE System SHALL cache frequently accessed data for faster mobile performance

### Requirement 21: Security and Data Protection

**User Story:** As a user, I want my personal and financial data protected, so that I can trust the platform with sensitive information.

#### Acceptance Criteria

1. THE System SHALL encrypt all passwords using industry-standard hashing algorithms
2. THE System SHALL implement JWT-based authentication with token expiration
3. THE System SHALL enforce HTTPS for all communications
4. WHEN a user logs in from a new device, THE System SHALL send a security notification
5. THE System SHALL implement rate limiting to prevent brute force attacks
6. THE System SHALL validate and sanitize all user inputs to prevent injection attacks
7. THE System SHALL implement role-based access control for all features
8. THE System SHALL log all security-relevant events for audit purposes
9. THE System SHALL implement CORS policies to prevent unauthorized API access
10. THE System SHALL encrypt sensitive data at rest in the database
11. THE System SHALL implement session timeout after configured inactivity period
12. THE System SHALL provide secure file upload validation to prevent malicious files

### Requirement 22: Phase 2 - Job Portal (Future)

**User Story:** As a customer or agent, I want to find insurance-related job opportunities, so that I can advance my career in the insurance sector.

#### Acceptance Criteria

1. THE System SHALL provide a job portal for insurance-related positions
2. THE System SHALL allow both companies and agents to post job listings
3. WHEN a company or agent posts a job, THE System SHALL deduct the configured token cost
4. WHEN a job is posted, THE System SHALL display it in the job listings
5. THE System SHALL allow customers and agents to search and filter job postings
6. THE System SHALL allow users to apply for jobs through the platform
7. THE System SHALL track application status for job seekers
8. THE System SHALL allow job posters to manage applications
9. THE System SHALL support job categories specific to the insurance industry
10. THE System SHALL allow agents to transition to teacher roles through job application

### Requirement 23: Phase 2 - Training and Education System (Future)

**User Story:** As a customer or agent, I want to attend insurance training courses, so that I can improve my knowledge and skills.

#### Acceptance Criteria

1. THE System SHALL provide a training course catalog
2. WHEN a teacher creates a course, THE System SHALL allow enrollment management
3. THE System SHALL allow customers and agents to search and enroll in courses
4. THE System SHALL track course attendance and completion
5. THE System SHALL allow teachers to manage class schedules and student progress
6. THE System SHALL support course materials upload and distribution
7. THE System SHALL allow agents to apply to become teachers
8. WHEN an agent becomes a teacher, THE System SHALL provide teacher-specific tools
9. THE System SHALL issue certificates upon course completion
10. THE System SHALL integrate course completion with the badge and achievement system

### Requirement 24: Phase 3 - Insurance Company Management (Future)

**User Story:** As an insurance company, I want comprehensive management tools through a separate portal, so that I can operate my business efficiently on the platform.

#### Acceptance Criteria

1. THE System SHALL provide a separate company login portal with distinct authentication
2. THE System SHALL support company role hierarchy (CEO, Manager, HR, Agent Manager, Staff)
3. THE System SHALL provide HR management tools for insurance companies
4. THE System SHALL provide policy management tools for creating and managing insurance products
5. THE System SHALL provide risk management and assessment tools
6. THE System SHALL provide financial reporting and analytics
7. THE System SHALL provide claims processing workflow management
8. THE System SHALL provide agent network management for companies
9. THE System SHALL provide customer relationship management tools
10. THE System SHALL integrate with external insurance industry systems
11. THE System SHALL provide regulatory compliance reporting
12. THE System SHALL support multi-branch company operations

## Notes

- All three phases will be implemented together as a comprehensive platform
- Token costs for specific activities will be configurable by admins
- The platform prioritizes Myanmar market needs with local language, calendar, and payment support
- Future React Native mobile applications will maintain design consistency with the PWA
- The system is designed to scale from initial 1000+ customers to enterprise-level usage
- All monetary transactions support both MMK and USD currencies
- Commission system supports both token-based and real currency payments
- Advertisement system is customer-initiated with admin approval workflow
- Agent posts auto-publish to reduce administrative overhead while maintaining quality through verification system
