# Implementation Plan: InsuriHub Platform

## Overview

This implementation plan breaks down the InsuriHub platform development into incremental, testable tasks. The plan covers all three phases with a focus on Phase 1 core features first, followed by Phase 2 and Phase 3 enhancements. Each task builds on previous work and includes testing to ensure correctness.

**Timeline**: 2 weeks (1 week development + 1 week testing)
**Approach**: AI-assisted development with property-based testing
**Language**: TypeScript (Next.js + Express.js)

## Tasks

- [ ] 1. Project Setup and Infrastructure
  - Initialize monorepo structure with existing apps/web and apps/api
  - Configure TypeScript strict mode
  - Set up Prisma with PostgreSQL
  - Configure Redis connection
  - Set up Docker Compose for development
  - Configure environment variables for all services
  - _Requirements: All phases foundation_

- [ ]* 1.1 Set up testing infrastructure
  - Install Jest and React Testing Library
  - Install fast-check for property-based testing
  - Configure test scripts in package.json
  - Set up test database
  - _Requirements: Testing Strategy_

- [ ] 2. Database Schema Implementation
  - [ ] 2.1 Create enhanced Prisma schema with all models
    - Implement User model with multi-auth fields
    - Implement Policy model with agent relationship
    - Implement Token system models (Transaction, Package, Purchase, Withdrawal)
    - Implement Post and Comment models
    - Implement Quiz and Badge models
    - Implement Claim and Document models
    - Implement Advertisement model
    - Implement Notification model
    - Implement Phase 2 models (Job, Course, Class)
    - _Requirements: Data Models section_

  - [ ] 2.2 Run Prisma migrations
    - Generate Prisma client
    - Push schema to database
    - Verify all tables created
    - _Requirements: 1.1-24.1_

  - [ ]* 2.3 Write property test for database schema
    - **Property 29: Claim number uniqueness**
    - **Validates: Requirements 13.4**

- [ ] 3. Checkpoint - Database Setup Complete
  - Ensure all migrations pass, ask the user if questions arise.

- [ ] 4. Authentication System
  - [ ] 4.1 Implement JWT token service
    - Create token generation function
    - Create token verification middleware
    - Implement refresh token logic
    - _Requirements: 1.1, 1.9, 21.2_

  - [ ] 4.2 Implement email registration
    - Create registration endpoint
    - Implement email verification
    - Send verification emails
    - _Requirements: 1.2_

  - [ ]* 4.3 Write property test for email registration
    - **Property 1: Email registration requires verification**
    - **Validates: Requirements 1.2**

  - [ ] 4.4 Implement phone registration with OTP
    - Create phone registration endpoint
    - Implement OTP generation and sending
    - Create OTP verification endpoint
    - _Requirements: 1.3, 1.4_

  - [ ]* 4.5 Write property tests for phone registration
    - **Property 2: Phone registration sends OTP**
    - **Property 3: OTP requirement when enabled**
    - **Validates: Requirements 1.3, 1.4**

  - [ ] 4.6 Implement social authentication
    - Set up Facebook OAuth strategy
    - Set up Google OAuth strategy
    - Create social auth callback endpoints
    - _Requirements: 1.5_

  - [ ]* 4.7 Write property test for social auth
    - **Property 4: Social auth auto-verification**
    - **Validates: Requirements 1.5**

  - [ ] 4.8 Implement login and logout
    - Create login endpoint with multi-provider support
    - Create logout endpoint
    - Implement session management
    - _Requirements: 1.9_

  - [ ]* 4.9 Write property test for password encryption
    - **Property 35: Password encryption**
    - **Validates: Requirements 21.1**

- [ ] 5. Token Management System
  - [ ] 5.1 Implement token balance service
    - Create getBalance function
    - Create addTokens function
    - Create deductTokens function
    - Implement transaction logging
    - _Requirements: 2.1-2.3, 2.9-2.11_

  - [ ]* 5.2 Write property tests for token operations
    - **Property 5: Activity token deduction**
    - **Property 6: Token persistence**
    - **Validates: Requirements 2.2, 2.3**

  - [ ] 5.3 Implement account suspension logic
    - Create checkAccountStatus function
    - Create suspendAccount function
    - Create reactivateAccount function
    - Implement soft hold restrictions
    - _Requirements: 2.4-2.7_

  - [ ]* 5.4 Write property tests for account suspension
    - **Property 7: Zero balance suspension**
    - **Property 8: Suspended account UI restrictions**
    - **Property 9: Suspended account read access**
    - **Validates: Requirements 2.4, 2.5, 2.6**

  - [ ] 5.5 Implement token packages
    - Create token package CRUD endpoints
    - Create token purchase endpoint
    - Integrate payment gateway (mock for now)
    - _Requirements: 3.1-3.6, 17.1-17.5_

  - [ ]* 5.6 Write property tests for token purchase
    - **Property 32: Payment gateway redirection**
    - **Property 33: Successful payment token credit**
    - **Validates: Requirements 17.6, 17.7**

  - [ ] 5.7 Implement activity cost configuration
    - Create ActivityCost model operations
    - Create admin endpoints for cost management
    - Implement cost lookup for activities
    - Seed default activity costs
    - _Requirements: 2.8_

  - [ ]* 5.8 Write property test for insufficient tokens
    - **Property 10: Insufficient token prevention**
    - **Validates: Requirements 2.14**

- [ ] 6. Commission and Withdrawal System
  - [ ] 6.1 Implement commission calculation
    - Create calculateCommission function
    - Create creditCommission function
    - Implement commission rate configuration
    - _Requirements: 6.1-6.3_

  - [ ]* 6.2 Write property test for commission calculation
    - **Property 12: Commission calculation accuracy**
    - **Validates: Requirements 6.1**

  - [ ] 6.3 Implement withdrawal request system
    - Create withdrawal request endpoint
    - Create admin approval/rejection endpoints
    - Implement withdrawal history
    - _Requirements: 6.7-6.9_

  - [ ]* 6.4 Write property test for withdrawal requests
    - **Property 13: Withdrawal request creation**
    - **Validates: Requirements 6.7**

- [ ] 7. Checkpoint - Token System Complete
  - Ensure all token tests pass, ask the user if questions arise.

- [ ] 8. Policy Management
  - [ ] 8.1 Implement policy CRUD operations
    - Create policy creation endpoint
    - Create policy retrieval endpoints
    - Create policy update endpoint
    - Implement policy-agent relationship
    - _Requirements: 7.1-7.3, 5.1-5.10_

  - [ ]* 8.2 Write property tests for policy management
    - **Property 11: Package subscription date recording**
    - **Property 14: Policy retrieval completeness**
    - **Validates: Requirements 3.2, 7.1**

  - [ ] 8.3 Implement policy document management
    - Create document upload endpoint
    - Create document retrieval endpoint
    - Implement file validation
    - _Requirements: 7.5_

  - [ ] 8.4 Implement renewal system
    - Create renewal reminder endpoint
    - Implement expiration detection
    - Create renewal endpoint
    - _Requirements: 7.4, 9.1-9.10_

  - [ ]* 8.5 Write property tests for renewal reminders
    - **Property 17: Renewal reminder token cost**
    - **Property 18: Reminder history tracking**
    - **Validates: Requirements 9.1, 9.4**

- [ ] 9. Premium Calculator
  - [ ] 9.1 Implement rule-based calculator engine
    - Create PricingRule model operations
    - Implement calculatePremium function
    - Create premium breakdown logic
    - Implement recommendation generation
    - _Requirements: 8.1-8.11_

  - [ ]* 9.2 Write property test for premium calculation
    - **Property 15: Premium calculation result**
    - **Validates: Requirements 8.3**

  - [ ] 9.3 Implement calculator history
    - Create saveCalculation endpoint
    - Create calculation history endpoint
    - Implement token deduction for saves
    - _Requirements: 8.5-8.6_

  - [ ]* 9.4 Write property test for calculator save
    - **Property 16: Calculator save token cost**
    - **Validates: Requirements 8.5**

  - [ ] 9.5 Implement admin pricing rule management
    - Create pricing rule CRUD endpoints
    - Seed default pricing rules for all products
    - _Requirements: 8.10-8.11_

- [ ] 10. Claim Management
  - [ ] 10.1 Implement claim submission
    - Create claim submission endpoint
    - Implement claim number generation
    - Create claim document upload
    - _Requirements: 13.1-13.4_

  - [ ]* 10.2 Write property tests for claims
    - **Property 28: Claim required fields validation**
    - **Property 29: Claim number uniqueness**
    - **Validates: Requirements 13.2, 13.4**

  - [ ] 10.3 Implement claim workflow
    - Create claim status update endpoint
    - Implement claim notes system
    - Create audit trail logging
    - _Requirements: 13.5-13.7_

  - [ ] 10.4 Implement claim retrieval
    - Create customer claims endpoint
    - Create agent claims endpoint
    - Create claim details endpoint
    - _Requirements: 13.9-13.10_

- [ ] 11. Post and Content System
  - [ ] 11.1 Implement post creation
    - Create post creation endpoint
    - Implement image upload
    - Implement token deduction for agents
    - Implement auto-publish for agents
    - Implement no-cost for admins
    - _Requirements: 10.1-10.7_

  - [ ]* 11.2 Write property tests for post creation
    - **Property 19: Agent post token cost**
    - **Property 20: Agent post auto-publish**
    - **Property 21: Admin post no cost**
    - **Validates: Requirements 10.1, 10.2, 10.3**

  - [ ] 11.3 Implement post interactions
    - Create like/unlike endpoint
    - Create comment endpoint
    - Implement like counter
    - Implement token deduction for comments
    - _Requirements: 10.8-10.12_

  - [ ]* 11.4 Write property tests for post interactions
    - **Property 22: Post like counter increment**
    - **Property 23: Comment token cost**
    - **Validates: Requirements 10.9, 10.11**

  - [ ] 11.5 Implement post feed
    - Create feed endpoint with pagination
    - Implement category filtering
    - Create agent posts endpoint
    - _Requirements: 10.7_

  - [ ] 11.6 Implement admin moderation
    - Create post deletion endpoint
    - Implement deletion logging
    - _Requirements: 10.13-10.14_

- [ ] 12. Checkpoint - Core Content Features Complete
  - Ensure all post and claim tests pass, ask the user if questions arise.

- [ ] 13. Quiz and Gamification System
  - [ ] 13.1 Implement quiz management
    - Create quiz CRUD endpoints
    - Create question management
    - Implement quiz activation
    - _Requirements: 11.1, 11.6-11.8_

  - [ ] 13.2 Implement quiz attempt system
    - Create quiz start endpoint
    - Create answer submission endpoint
    - Create quiz completion endpoint
    - Implement score calculation
    - _Requirements: 11.2_

  - [ ]* 13.3 Write property tests for quiz scoring
    - **Property 24: Quiz score calculation**
    - **Property 25: Quiz passing token reward**
    - **Validates: Requirements 11.2, 11.3**

  - [ ] 13.4 Implement badge system
    - Create badge awarding logic
    - Create user badges endpoint
    - Implement badge types
    - _Requirements: 11.4, 11.11_

  - [ ] 13.5 Implement leaderboard
    - Create leaderboard calculation
    - Create leaderboard endpoint
    - Implement real-time updates
    - _Requirements: 11.5, 11.12_

  - [ ] 13.6 Implement quiz retake prevention
    - Create retake validation
    - Implement time-based restrictions
    - _Requirements: 11.10_

  - [ ]* 13.7 Write property test for quiz retake
    - **Property 26: Quiz retake prevention**
    - **Validates: Requirements 11.10**

- [ ] 14. Agent Verification System
  - [ ] 14.1 Implement verification submission
    - Create verification request endpoint
    - Implement document upload
    - Create verification status endpoint
    - _Requirements: 4.1-4.3, 4.8-4.10_

  - [ ] 14.2 Implement admin verification workflow
    - Create pending verifications endpoint
    - Create approve/reject endpoints
    - Create revoke endpoint
    - Implement notification on status change
    - _Requirements: 4.4-4.7_

  - [ ] 14.3 Implement agent search
    - Create agent search endpoint
    - Implement filtering by specialization
    - Create agent profile endpoint
    - _Requirements: 12.1-12.10_

  - [ ]* 14.4 Write property test for agent search
    - **Property 27: Agent search filtering**
    - **Validates: Requirements 12.2**

- [ ] 15. Advertisement System
  - [ ] 15.1 Implement ad request submission
    - Create ad request endpoint
    - Implement GIF upload and validation
    - Calculate token cost
    - _Requirements: 14.1-14.4_

  - [ ] 15.2 Implement admin ad approval
    - Create pending ads endpoint
    - Create approve/reject/pause endpoints
    - Implement ad activation
    - _Requirements: 14.5-14.7_

  - [ ] 15.3 Implement ad display and tracking
    - Create active ads endpoint
    - Implement impression recording
    - Create ad performance endpoint
    - Implement auto-deactivation
    - _Requirements: 14.6-14.12_

- [ ] 16. Real-time Features (Socket.IO)
  - [ ] 16.1 Set up Socket.IO server
    - Configure Socket.IO with Express
    - Implement connection handling
    - Implement room management
    - _Requirements: 18.1-18.12_

  - [ ] 16.2 Implement chat system
    - Create chat CRUD endpoints
    - Implement message sending via Socket.IO
    - Create message history endpoint
    - Implement typing indicators
    - _Requirements: 18.1_

  - [ ]* 16.3 Write property test for message notifications
    - **Property 34: Message notification delivery**
    - **Validates: Requirements 18.1**

  - [ ] 16.4 Implement notification system
    - Create notification service
    - Implement real-time notification delivery
    - Create notification history endpoint
    - Implement mark as read
    - _Requirements: 18.1-18.12_

  - [ ] 16.5 Implement notification preferences
    - Create preferences endpoint
    - Implement preference-based filtering
    - _Requirements: 18.11_

- [ ] 17. Checkpoint - Real-time Features Complete
  - Ensure Socket.IO connections work, ask the user if questions arise.

- [ ] 18. Payment Gateway Integration
  - [ ] 18.1 Implement payment initiation
    - Create payment initiation endpoint
    - Implement gateway selection
    - Create payment session management
    - _Requirements: 17.1-17.12_

  - [ ] 18.2 Implement webhook handlers
    - Create KBZPay webhook endpoint
    - Create WavePay webhook endpoint
    - Create AYAPay webhook endpoint
    - Implement signature verification
    - _Requirements: 17.8_

  - [ ] 18.3 Implement transaction management
    - Create transaction history endpoint
    - Implement transaction status tracking
    - Create receipt generation
    - _Requirements: 17.9_

  - [ ] 18.4 Implement currency conversion
    - Create exchange rate management
    - Implement conversion function
    - Create admin rate configuration
    - _Requirements: 17.10_

  - [ ] 18.5 Implement admin gateway configuration
    - Create gateway config endpoints
    - Implement enable/disable functionality
    - Store gateway credentials securely
    - _Requirements: 17.11-17.12_

- [ ] 19. Data Migration System
  - [ ] 19.1 Implement Excel upload
    - Create file upload endpoint
    - Implement Excel parsing
    - Create import session management
    - _Requirements: 15.1-15.2_

  - [ ] 19.2 Implement data validation
    - Create validation logic
    - Implement error reporting
    - Create row-by-row validation
    - _Requirements: 15.2, 15.4_

  - [ ]* 19.3 Write property tests for Excel import
    - **Property 30: Excel import validation**
    - **Property 31: Auto-create missing agents**
    - **Validates: Requirements 15.2, 15.6**

  - [ ] 19.4 Implement import execution
    - Create import execution endpoint
    - Implement progress tracking
    - Create user/policy creation
    - Implement auto-agent creation
    - Send activation notifications
    - _Requirements: 15.5-15.9_

  - [ ] 19.5 Implement import management
    - Create import history endpoint
    - Create error fixing endpoint
    - Generate import summary reports
    - _Requirements: 15.10-15.12_

- [ ] 20. Admin Dashboard
  - [ ] 20.1 Implement dashboard statistics
    - Create dashboard endpoint
    - Calculate user counts by role
    - Calculate token statistics
    - Calculate platform metrics
    - _Requirements: 19.1-19.2_

  - [ ] 20.2 Implement user management
    - Create user list endpoint
    - Create user suspend/activate endpoints
    - Create manual token adjustment endpoint
    - _Requirements: 19.3-19.4_

  - [ ] 20.3 Implement system configuration
    - Create settings CRUD endpoints
    - Implement activity cost management
    - Implement package management
    - _Requirements: 19.5-19.7, 19.10-19.11_

  - [ ] 20.4 Implement analytics and reporting
    - Create analytics endpoint
    - Generate commission reports
    - Create audit log endpoint
    - _Requirements: 19.13-19.15_

- [ ] 21. Checkpoint - Admin Features Complete
  - Ensure all admin endpoints work, ask the user if questions arise.

- [ ] 22. Multi-Language Support
  - [ ] 22.1 Implement language system
    - Set up i18n library (next-i18next)
    - Create language selection endpoint
    - Implement language persistence
    - _Requirements: 16.1-16.3_

  - [ ] 22.2 Create translations
    - Create English translations
    - Create Myanmar Unicode translations
    - Implement translation loading
    - _Requirements: 16.4, 16.7-16.9_

  - [ ] 22.3 Implement language switching
    - Create language switch UI component
    - Implement without logout requirement
    - _Requirements: 16.5_

- [ ] 23. Security Implementation
  - [ ] 23.1 Implement rate limiting
    - Set up Redis-based rate limiter
    - Configure limits per endpoint
    - Implement rate limit headers
    - _Requirements: 21.5_

  - [ ] 23.2 Implement input sanitization
    - Create validation middleware
    - Implement Joi schemas for all endpoints
    - Add Myanmar Unicode validation
    - _Requirements: 21.6_

  - [ ]* 23.3 Write property test for input sanitization
    - **Property 36: Input sanitization**
    - **Validates: Requirements 21.6**

  - [ ] 23.4 Implement security headers
    - Configure Helmet.js
    - Set up CORS properly
    - Implement CSRF protection
    - _Requirements: 21.9_

  - [ ] 23.5 Implement file upload security
    - Add file type validation
    - Add file size limits
    - Implement virus scanning (optional)
    - _Requirements: 21.12_

- [ ] 24. Frontend Implementation
  - [ ] 24.1 Create authentication UI
    - Create login page
    - Create registration forms (email, phone, social)
    - Create OTP verification UI
    - Implement AuthContext
    - _Requirements: 1.1-1.10_

  - [ ] 24.2 Create dashboard layout
    - Update Dashboard component
    - Create mobile bottom navigation
    - Create desktop sidebar
    - Implement role-based navigation
    - _Requirements: 20.1-20.12_

  - [ ] 24.3 Create token management UI
    - Create token balance display
    - Create token purchase flow
    - Create transaction history
    - Create withdrawal request UI (agents)
    - _Requirements: 2.1-2.14, 6.7-6.9_

  - [ ] 24.4 Create policy management UI
    - Create policy list view
    - Create policy details view
    - Create document viewer
    - Create renewal reminder UI
    - _Requirements: 7.1-7.10_

  - [ ] 24.5 Create premium calculator UI
    - Create calculator form
    - Create results display
    - Create calculation history
    - _Requirements: 8.1-8.11_

  - [ ] 24.6 Create claim management UI
    - Create claim submission form
    - Create claim list view
    - Create claim details view
    - Create document upload UI
    - _Requirements: 13.1-13.12_

  - [ ] 24.7 Create post and feed UI
    - Create post creation form
    - Create feed view
    - Create like/comment UI
    - Create post details view
    - _Requirements: 10.1-10.14_

  - [ ] 24.8 Create quiz UI
    - Create quiz list view
    - Create quiz attempt UI
    - Create results display
    - Create leaderboard view
    - Create badges display
    - _Requirements: 11.1-11.13_

  - [ ] 24.9 Create chat UI
    - Create chat list view
    - Create chat conversation view
    - Create message input
    - Implement real-time updates
    - _Requirements: 18.1-18.12_

  - [ ] 24.10 Create admin UI
    - Create admin dashboard
    - Create user management interface
    - Create verification approval UI
    - Create ad approval UI
    - Create settings management
    - _Requirements: 19.1-19.15_

- [ ] 25. Checkpoint - Frontend Complete
  - Ensure all UI components render correctly, ask the user if questions arise.

- [ ] 26. Phase 2: Job Portal
  - [ ] 26.1 Implement job posting
    - Create job CRUD endpoints
    - Implement token deduction for posting
    - Create job list endpoint
    - _Requirements: 22.1-22.4_

  - [ ] 26.2 Implement job application
    - Create application submission endpoint
    - Create application management
    - Implement status tracking
    - _Requirements: 22.5-22.7_

  - [ ] 26.3 Create job portal UI
    - Create job list view
    - Create job details view
    - Create job posting form
    - Create application form
    - _Requirements: 22.1-22.10_

- [ ] 27. Phase 2: Training System
  - [ ] 27.1 Implement course management
    - Create course CRUD endpoints
    - Create class management
    - Implement enrollment system
    - _Requirements: 23.1-23.6_

  - [ ] 27.2 Implement attendance tracking
    - Create attendance recording endpoint
    - Create attendance reports
    - _Requirements: 23.4_

  - [ ] 27.3 Implement teacher features
    - Create teacher application endpoint
    - Implement teacher approval workflow
    - Create course creation UI
    - _Requirements: 23.7-23.10_

  - [ ] 27.4 Create training UI
    - Create course catalog view
    - Create enrollment UI
    - Create class schedule view
    - Create attendance UI
    - _Requirements: 23.1-23.10_

- [ ] 28. Phase 3: Company Portal Foundation
  - [ ] 28.1 Design company portal architecture
    - Plan separate authentication system
    - Design company role hierarchy
    - Plan integration with main platform
    - _Requirements: 24.1-24.2_

  - [ ] 28.2 Create company portal placeholder
    - Create separate Next.js app structure
    - Implement company authentication
    - Create basic dashboard
    - _Requirements: 24.1-24.12_

  - [ ] 28.3 Document Phase 3 implementation plan
    - Document HR management requirements
    - Document policy management requirements
    - Document integration points
    - _Requirements: 24.3-24.12_

- [ ] 29. Testing and Quality Assurance
  - [ ]* 29.1 Run all property-based tests
    - Execute all 36 property tests
    - Verify 100+ iterations per test
    - Fix any discovered issues
    - _Requirements: Testing Strategy_

  - [ ]* 29.2 Run unit tests
    - Execute all unit tests
    - Verify 80%+ code coverage
    - Fix failing tests
    - _Requirements: Testing Strategy_

  - [ ]* 29.3 Integration testing
    - Test end-to-end user flows
    - Test payment gateway integration
    - Test Socket.IO real-time features
    - Test file upload and storage
    - _Requirements: Testing Strategy_

  - [ ]* 29.4 Performance testing
    - Run load tests (1000 concurrent users)
    - Measure API response times
    - Test database query performance
    - Optimize slow endpoints
    - _Requirements: Testing Strategy_

  - [ ]* 29.5 Security testing
    - Test authentication bypass attempts
    - Test SQL injection prevention
    - Test XSS attack prevention
    - Test rate limiting
    - _Requirements: 21.1-21.12_

  - [ ]* 29.6 Manual QA
    - Test on mobile devices
    - Test Myanmar Unicode input
    - Test all user flows
    - Test error handling
    - _Requirements: 20.1-20.12_

- [ ] 30. Deployment Preparation
  - [ ] 30.1 Configure production environment
    - Set up production database
    - Configure Redis for production
    - Set up environment variables
    - Configure SSL certificates
    - _Requirements: Deployment Strategy_

  - [ ] 30.2 Set up CI/CD pipeline
    - Configure GitHub Actions
    - Set up automated testing
    - Configure Docker builds
    - Set up deployment automation
    - _Requirements: Deployment Strategy_

  - [ ] 30.3 Implement monitoring
    - Set up Winston logging
    - Configure error tracking (Sentry)
    - Set up performance monitoring
    - Create health check endpoints
    - _Requirements: Monitoring and Logging_

  - [ ] 30.4 Create documentation
    - Write API documentation
    - Create deployment guide
    - Write user manual
    - Create admin guide
    - _Requirements: All phases_

  - [ ] 30.5 Database backup setup
    - Configure automated backups
    - Test backup restoration
    - Set up off-site storage
    - _Requirements: Deployment Strategy_

- [ ] 31. Final Checkpoint - Production Ready
  - Ensure all tests pass, all features work, deployment is ready. Ask the user for final approval.

## Notes

- Tasks marked with `*` are testing tasks and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- All three phases are included in the implementation plan
- Phase 1 is prioritized for initial launch
- Phase 2 and 3 can be deployed incrementally after Phase 1 is stable
- Development timeline: 1 week with AI assistance
- Testing timeline: 1 week for comprehensive QA
- Total timeline: 2 weeks to production-ready platform

