# Design Document V2: InsuriHub Platform - Additional Features

## Overview

This document provides the technical design for additional features outlined in requirements-v2.md. These features enhance the core InsuriHub platform with emergency services, offline capabilities, advanced engagement tools, and comprehensive user experience improvements.

### Design Principles for V2 Features

1. **Safety First**: Emergency features are always free and accessible
2. **Offline Resilience**: Critical features work without internet connectivity
3. **Proactive Engagement**: Smart notifications and reminders keep users informed
4. **Trust Building**: Reviews, referrals, and transparency features
5. **Agent Empowerment**: Advanced tools for agent productivity
6. **Accessibility**: Voice assistance and Myanmar language support
7. **Gamification**: Engaging mechanics to drive retention
8. **Data Security**: Encrypted document storage and compliance

### Technology Stack Additions

**Frontend Enhancements:**
- Workbox (PWA offline support)
- IndexedDB (offline data storage)
- Web Speech API (voice assistant)
- WebRTC (video consultation)
- Chart.js (analytics dashboards)

**Backend Enhancements:**
- Bull Queue (background jobs for notifications)
- Node-cron (scheduled tasks)
- Sharp (image processing)
- PDF-lib (document generation)
- Socket.IO rooms (real-time features)

**External Services:**
- Weather API (Myanmar weather service)
- SMS Gateway (OTP and alerts)
- Video Service (Agora/Twilio for consultations)
- AI/ML Service (chatbot, recommendations)

## Architecture Enhancements

### Enhanced System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
├─────────────────────────────────────────────────────────────┤
│  PWA with Offline Support                                    │
│  ├── Service Worker (Workbox)                                │
│  ├── IndexedDB (Offline Storage)                             │
│  ├── Web Speech API (Voice Assistant)                        │
│  ├── WebRTC (Video Calls)                                    │
│  └── Push Notifications                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
├─────────────────────────────────────────────────────────────┤
│  New Services:                                               │
│  ├── Emergency Service                                       │
│  ├── Offline Sync Service                                    │
│  ├── Smart Notification Engine                               │
│  ├── Chatbot Service (AI)                                    │
│  ├── Referral & Loyalty Service                              │
│  ├── Document Vault Service                                  │
│  ├── Review & Rating Service                                 │
│  ├── Video Consultation Service                              │
│  ├── Comparison Engine                                       │
│  ├── Voice Assistant Service                                 │
│  └── Gamification Engine                                     │
└─────────────────────────────────────────────────────────────┘

                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                               │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL (New Tables)  │  Redis (Enhanced)                │
│  - Emergency Logs         │  - Offline Queue                 │
│  - Referrals              │  - Notification Queue            │
│  - Loyalty Tiers          │  - Chatbot Sessions              │
│  - Document Vault         │  - Video Sessions                │
│  - Reviews & Ratings      │  - Leaderboard Cache             │
│  - Family Groups          │                                  │
│  - Achievements           │                                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
├─────────────────────────────────────────────────────────────┤
│  - Weather API (Myanmar)  │  - Video Service (Agora/Twilio) │
│  - SMS Gateway            │  - AI/ML Service (Chatbot)       │
│  - Email Service          │  - Document Storage (S3/Local)   │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Phase 1 Enhancement Services (Must-Have)

#### 1. Emergency Assistance Service

**Responsibilities:**
- Emergency mode activation
- Location sharing
- Emergency contact management
- Facility finder (hospitals, garages)
- Fast-track claim submission
- Emergency logging

**Interfaces:**

```typescript
interface EmergencyService {
  // Emergency Activation
  activateEmergency(userId: string, policyId: string): Promise<EmergencySession>
  deactivateEmergency(sessionId: string): Promise<void>
  
  // Location Services
  shareLocation(sessionId: string, location: GeoLocation): Promise<void>
  getLocation(sessionId: string): Promise<GeoLocation>
  
  // Facility Finder
  findNearestHospitals(location: GeoLocation, radius: number): Promise<Facility[]>
  findNearestGarages(location: GeoLocation, radius: number): Promise<Facility[]>
  getFacilityDetails(facilityId: string): Promise<FacilityDetails>
  
  // Emergency Contacts
  getEmergencyContacts(policyId: string): Promise<EmergencyContact[]>
  callEmergencyContact(contactId: string): Promise<CallSession>
  
  // Fast-Track Claim
  submitEmergencyClaim(data: EmergencyClaimInput): Promise<Claim>
  
  // Logging
  logEmergencyEvent(sessionId: string, event: EmergencyEvent): Promise<void>
  getEmergencyHistory(userId: string): Promise<EmergencySession[]>
}

interface EmergencySession {
  id: string
  userId: string
  policyId: string
  location?: GeoLocation
  status: 'ACTIVE' | 'RESOLVED' | 'CANCELLED'
  activatedAt: Date
  resolvedAt?: Date
  events: EmergencyEvent[]
}

interface GeoLocation {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: Date
}

interface Facility {
  id: string
  name: string
  type: 'HOSPITAL' | 'CLINIC' | 'GARAGE' | 'REPAIR_SHOP'
  location: GeoLocation
  distance: number // meters
  phone: string
  address: string
  isApproved: boolean
  rating?: number
}

interface FacilityDetails extends Facility {
  services: string[]
  operatingHours: OperatingHours[]
  emergencyAvailable: boolean
  insuranceAccepted: string[]
}

interface EmergencyContact {
  id: string
  name: string
  phone: string
  type: 'AGENT' | 'COMPANY_HOTLINE' | 'EMERGENCY_SERVICE'
  available24x7: boolean
}

interface EmergencyClaimInput {
  sessionId: string
  policyId: string
  incidentType: string
  description: string
  location: GeoLocation
  photos?: File[]
}

interface EmergencyEvent {
  type: 'ACTIVATED' | 'LOCATION_SHARED' | 'CONTACT_CALLED' | 'CLAIM_SUBMITTED' | 'RESOLVED'
  timestamp: Date
  data?: Record<string, any>
}
```

#### 2. Offline Sync Service

**Responsibilities:**
- Service worker management
- Offline data caching
- Action queue management
- Sync when online
- Cache management

**Interfaces:**

```typescript
interface OfflineSyncService {
  // Cache Management
  cacheData(key: string, data: any, ttl?: number): Promise<void>
  getCachedData(key: string): Promise<any>
  clearCache(pattern?: string): Promise<void>
  getCacheSize(): Promise<number>
  
  // Offline Actions
  queueAction(action: OfflineAction): Promise<void>
  getQueuedActions(): Promise<OfflineAction[]>
  syncQueuedActions(): Promise<SyncResult>
  
  // Policy Data
  cachePolicies(userId: string): Promise<void>
  getCachedPolicies(userId: string): Promise<Policy[]>
  
  // Calculator Data
  cacheCalculatorRules(): Promise<void>
  getCachedCalculatorRules(): Promise<PricingRules[]>
  
  // Content
  cacheContent(contentType: string, ids: string[]): Promise<void>
  getCachedContent(contentType: string): Promise<any[]>
  
  // Sync Status
  getSyncStatus(): Promise<SyncStatus>
  forceSyncNow(): Promise<SyncResult>
  
  // Settings
  updateCacheSettings(settings: CacheSettings): Promise<void>
  getCacheSettings(): Promise<CacheSettings>
}

interface OfflineAction {
  id: string
  type: 'POST_CREATE' | 'MESSAGE_SEND' | 'COMMENT_ADD' | 'LIKE_POST'
  data: Record<string, any>
  timestamp: Date
  retryCount: number
  status: 'PENDING' | 'SYNCING' | 'SYNCED' | 'FAILED'
}

interface SyncResult {
  success: boolean
  synced: number
  failed: number
  errors: SyncError[]
}

interface SyncError {
  actionId: string
  error: string
  canRetry: boolean
}

interface SyncStatus {
  isOnline: boolean
  lastSyncAt?: Date
  pendingActions: number
  cacheSize: number
  syncInProgress: boolean
}

interface CacheSettings {
  maxCacheSize: number // MB
  autoSync: boolean
  syncOnWifiOnly: boolean
  cacheImages: boolean
  cacheDuration: number // hours
}
```

#### 3. Smart Notification Engine

**Responsibilities:**
- Scheduled notifications
- Event-triggered notifications
- Weather alerts integration
- Birthday/anniversary tracking
- Notification preferences
- Multi-channel delivery

**Interfaces:**

```typescript
interface SmartNotificationEngine {
  // Scheduled Notifications
  schedulePremiumReminder(policyId: string, dueDate: Date): Promise<void>
  scheduleRenewalReminder(policyId: string, expiryDate: Date): Promise<void>
  scheduleBirthdayWish(userId: string, birthday: Date): Promise<void>
  scheduleAnniversaryWish(policyId: string, purchaseDate: Date): Promise<void>
  
  // Event-Triggered
  sendClaimStatusUpdate(claimId: string, newStatus: ClaimStatus): Promise<void>
  sendLowTokenWarning(userId: string, balance: number): Promise<void>
  sendAgentVerificationUpdate(agentId: string, status: VerificationStatus): Promise<void>
  
  // Weather Alerts
  subscribeToWeatherAlerts(userId: string, location: GeoLocation): Promise<void>
  sendWeatherAlert(alert: WeatherAlert): Promise<void>
  
  // Batch Notifications
  sendBulkNotifications(userIds: string[], notification: NotificationTemplate): Promise<void>
  
  // Preferences
  updateNotificationPreferences(userId: string, prefs: NotificationPreferences): Promise<void>
  getNotificationPreferences(userId: string): Promise<NotificationPreferences>
  
  // Analytics
  getNotificationStats(userId: string): Promise<NotificationStats>
  getDeliveryReport(notificationId: string): Promise<DeliveryReport>
}

interface NotificationTemplate {
  title: string
  message: string
  type: NotificationType
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  channels: NotificationChannel[]
  data?: Record<string, any>
  actionUrl?: string
}

interface NotificationChannel {
  type: 'IN_APP' | 'PUSH' | 'EMAIL' | 'SMS'
  enabled: boolean
}

interface WeatherAlert {
  type: 'SEVERE_WEATHER' | 'STORM' | 'FLOOD' | 'EARTHQUAKE'
  severity: 'WARNING' | 'WATCH' | 'ADVISORY'
  location: GeoLocation
  message: string
  validUntil: Date
  affectedPolicyTypes: InsuranceProduct[]
}

interface NotificationPreferences {
  channels: {
    inApp: boolean
    push: boolean
    email: boolean
    sms: boolean
  }
  types: Map<NotificationType, boolean>
  quietHours: {
    enabled: boolean
    start: string // HH:mm
    end: string // HH:mm
  }
  frequency: 'REAL_TIME' | 'HOURLY' | 'DAILY'
}

interface NotificationStats {
  sent: number
  delivered: number
  read: number
  clicked: number
  deliveryRate: number
  readRate: number
  clickRate: number
}

interface DeliveryReport {
  notificationId: string
  totalRecipients: number
  delivered: number
  failed: number
  pending: number
  failureReasons: Map<string, number>
}
```

#### 4. Chatbot Service

**Responsibilities:**
- Natural language processing
- Intent recognition
- Context management
- Knowledge base queries
- Agent handoff
- Myanmar language support

**Interfaces:**

```typescript
interface ChatbotService {
  // Conversation Management
  startConversation(userId: string): Promise<ChatSession>
  sendMessage(sessionId: string, message: string): Promise<ChatResponse>
  endConversation(sessionId: string): Promise<void>
  
  // Intent Recognition
  detectIntent(message: string, language: 'en' | 'my'): Promise<Intent>
  
  // Knowledge Base
  queryKnowledgeBase(query: string): Promise<KnowledgeResult[]>
  updateKnowledgeBase(data: KnowledgeEntry): Promise<void>
  
  // Context Management
  getConversationContext(sessionId: string): Promise<ConversationContext>
  updateContext(sessionId: string, context: Partial<ConversationContext>): Promise<void>
  
  // Agent Handoff
  requestAgentHandoff(sessionId: string, reason: string): Promise<HandoffRequest>
  transferToAgent(sessionId: string, agentId: string): Promise<void>
  
  // Analytics
  getChatbotMetrics(): Promise<ChatbotMetrics>
  getConversationHistory(userId: string): Promise<ChatSession[]>
  
  // Training
  trainModel(trainingData: TrainingData[]): Promise<void>
  addFAQ(faq: FAQ): Promise<void>
}

interface ChatSession {
  id: string
  userId: string
  startedAt: Date
  endedAt?: Date
  messages: ChatMessage[]
  context: ConversationContext
  status: 'ACTIVE' | 'TRANSFERRED' | 'ENDED'
  language: 'en' | 'my'
}

interface ChatMessage {
  id: string
  sender: 'USER' | 'BOT' | 'AGENT'
  content: string
  timestamp: Date
  intent?: Intent
  confidence?: number
}

interface ChatResponse {
  message: string
  intent: Intent
  confidence: number
  suggestions?: string[]
  actions?: ChatAction[]
  requiresHumanAgent: boolean
}

interface Intent {
  name: string
  confidence: number
  entities: Map<string, any>
  category: 'POLICY_INQUIRY' | 'CLAIM_STATUS' | 'TOKEN_BALANCE' | 'GENERAL_HELP' | 'COMPLAINT'
}

interface ConversationContext {
  userId: string
  currentTopic?: string
  lastIntent?: string
  userPolicies?: string[]
  recentClaims?: string[]
  preferences: Record<string, any>
}

interface KnowledgeResult {
  question: string
  answer: string
  category: string
  relevanceScore: number
  source: string
}

interface KnowledgeEntry {
  question: string
  answer: string
  category: string
  keywords: string[]
  language: 'en' | 'my'
}

interface HandoffRequest {
  id: string
  sessionId: string
  reason: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  status: 'PENDING' | 'ASSIGNED' | 'COMPLETED'
  createdAt: Date
}

interface ChatbotMetrics {
  totalConversations: number
  averageResolutionTime: number
  resolutionRate: number
  handoffRate: number
  userSatisfaction: number
  topIntents: Map<string, number>
  topUnresolvedQueries: string[]
}

interface FAQ {
  question: string
  answer: string
  category: string
  keywords: string[]
  language: 'en' | 'my'
  priority: number
}
```

### Phase 2 Enhancement Services (High Priority)

#### 5. Referral & Loyalty Service

**Responsibilities:**
- Referral code generation
- Referral tracking
- Loyalty tier management
- Streak tracking
- Reward distribution
- Analytics

**Interfaces:**

```typescript
interface ReferralLoyaltyService {
  // Referral Management
  generateReferralCode(userId: string): Promise<string>
  getReferralCode(userId: string): Promise<ReferralCode>
  applyReferralCode(newUserId: string, code: string): Promise<void>
  getReferralStats(userId: string): Promise<ReferralStats>
  
  // Rewards
  processReferralReward(referrerId: string, referredId: string, event: ReferralEvent): Promise<void>
  
  // Loyalty Tiers
  getUserTier(userId: string): Promise<LoyaltyTier>
  calculateTierProgress(userId: string): Promise<TierProgress>
  upgradeTier(userId: string, newTier: TierLevel): Promise<void>
  getTierBenefits(tier: TierLevel): Promise<TierBenefits>
  
  // Streaks
  recordDailyLogin(userId: string): Promise<StreakInfo>
  recordActivity(userId: string, activityType: string): Promise<StreakInfo>
  getStreakInfo(userId: string): Promise<StreakInfo>
  awardStreakBonus(userId: string, streakDays: number): Promise<void>
  
  // Analytics
  getReferralLeaderboard(period: 'MONTHLY' | 'YEARLY' | 'ALL_TIME'): Promise<LeaderboardEntry[]>
  getLoyaltyAnalytics(): Promise<LoyaltyAnalytics>
}

interface ReferralCode {
  code: string
  userId: string
  createdAt: Date
  usageCount: number
  maxUsage?: number
  expiresAt?: Date
}

interface ReferralStats {
  totalReferrals: number
  successfulReferrals: number
  pendingReferrals: number
  totalTokensEarned: number
  referralsByMonth: Map<string, number>
  topReferredUsers: ReferredUser[]
}

interface ReferredUser {
  userId: string
  userName: string
  joinedAt: Date
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE'
  rewardEarned: number
}

enum ReferralEvent {
  SIGNUP = 'SIGNUP',
  FIRST_PURCHASE = 'FIRST_PURCHASE',
  FIRST_POLICY = 'FIRST_POLICY',
  AGENT_REFERRAL = 'AGENT_REFERRAL'
}

interface LoyaltyTier {
  userId: string
  currentTier: TierLevel
  points: number
  tierSince: Date
  nextTier?: TierLevel
  pointsToNextTier?: number
}

enum TierLevel {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM'
}

interface TierProgress {
  currentTier: TierLevel
  currentPoints: number
  nextTier?: TierLevel
  pointsRequired: number
  progressPercentage: number
  recentActivities: ActivityPoint[]
}

interface TierBenefits {
  tier: TierLevel
  tokenBonus: number // percentage
  prioritySupport: boolean
  freeFeatures: string[]
  discounts: Map<string, number>
  exclusiveAccess: string[]
}

interface StreakInfo {
  userId: string
  currentStreak: number
  longestStreak: number
  lastActivityDate: Date
  streakType: 'LOGIN' | 'QUIZ' | 'POST_VIEW'
  nextMilestone: number
  milestoneReward: number
}

interface ActivityPoint {
  activityType: string
  points: number
  timestamp: Date
  description: string
}

interface LoyaltyAnalytics {
  totalMembers: number
  tierDistribution: Map<TierLevel, number>
  averagePoints: number
  activeStreaks: number
  totalRewardsDistributed: number
  engagementRate: number
}
```

#### 6. Document Vault Service

**Responsibilities:**
- Encrypted document storage
- Document organization
- Expiry tracking
- Family sharing
- Version control
- Search and retrieval

**Interfaces:**

```typescript
interface DocumentVaultService {
  // Document Management
  uploadDocument(data: UploadDocumentInput): Promise<VaultDocument>
  getDocument(documentId: string): Promise<VaultDocument>
  updateDocument(documentId: string, updates: Partial<VaultDocument>): Promise<VaultDocument>
  deleteDocument(documentId: string): Promise<void>
  
  // Organization
  getUserDocuments(userId: string, filters?: DocumentFilters): Promise<VaultDocument[]>
  getDocumentsByPolicy(policyId: string): Promise<VaultDocument[]>
  getDocumentsByTag(userId: string, tag: string): Promise<VaultDocument[]>
  
  // Search
  searchDocuments(userId: string, query: string): Promise<VaultDocument[]>
  
  // Expiry Management
  getExpiringDocuments(userId: string, days: number): Promise<VaultDocument[]>
  setDocumentExpiry(documentId: string, expiryDate: Date): Promise<void>
  sendExpiryReminders(): Promise<void>
  
  // Family Sharing
  createFamilyGroup(userId: string, members: string[]): Promise<FamilyGroup>
  shareDocument(documentId: string, groupId: string, permissions: SharePermissions): Promise<void>
  getFamilyDocuments(groupId: string): Promise<VaultDocument[]>
  
  // Version Control
  getDocumentVersions(documentId: string): Promise<DocumentVersion[]>
  restoreVersion(documentId: string, versionId: string): Promise<VaultDocument>
  
  // Storage Management
  getStorageUsage(userId: string): Promise<StorageInfo>
  upgradeStorage(userId: string, plan: StoragePlan): Promise<void>
  
  // Bulk Operations
  downloadAllDocuments(userId: string): Promise<Buffer> // ZIP file
  exportDocuments(userId: string, format: 'ZIP' | 'PDF'): Promise<Buffer>
}

interface VaultDocument {
  id: string
  userId: string
  fileName: string
  fileType: string
  fileSize: number
  encryptedUrl: string
  policyId?: string
  category: DocumentCategory
  tags: string[]
  expiryDate?: Date
  uploadedAt: Date
  updatedAt: Date
  version: number
  isShared: boolean
  sharedWith?: string[]
}

enum DocumentCategory {
  POLICY = 'POLICY',
  CLAIM = 'CLAIM',
  IDENTITY = 'IDENTITY',
  MEDICAL = 'MEDICAL',
  VEHICLE = 'VEHICLE',
  PROPERTY = 'PROPERTY',
  OTHER = 'OTHER'
}

interface UploadDocumentInput {
  userId: string
  file: File
  policyId?: string
  category: DocumentCategory
  tags?: string[]
  expiryDate?: Date
}

interface DocumentFilters {
  category?: DocumentCategory
  policyId?: string
  tags?: string[]
  dateFrom?: Date
  dateTo?: Date
  hasExpiry?: boolean
}

interface FamilyGroup {
  id: string
  ownerId: string
  name: string
  members: FamilyMember[]
  createdAt: Date
}

interface FamilyMember {
  userId: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER'
  joinedAt: Date
}

interface SharePermissions {
  canView: boolean
  canDownload: boolean
  canEdit: boolean
  expiresAt?: Date
}

interface DocumentVersion {
  versionId: string
  documentId: string
  version: number
  fileName: string
  fileSize: number
  uploadedAt: Date
  uploadedBy: string
}

interface StorageInfo {
  used: number // bytes
  total: number // bytes
  percentage: number
  plan: StoragePlan
  documentsCount: number
}

enum StoragePlan {
  BASIC = 'BASIC', // 100MB free
  PREMIUM = 'PREMIUM' // Unlimited, 10 tokens/month
}
```

#### 7. Review & Rating Service

**Responsibilities:**
- Agent ratings and reviews
- Policy reviews
- Review moderation
- Trust badge management
- Review analytics
- Spam prevention

**Interfaces:**

```typescript
interface ReviewRatingService {
  // Agent Reviews
  rateAgent(data: CreateAgentReviewInput): Promise<AgentReview>
  getAgentReviews(agentId: string, pagination: Pagination): Promise<AgentReview[]>
  getAgentRating(agentId: string): Promise<AgentRating>
  
  // Policy Reviews
  ratePolicy(data: CreatePolicyReviewInput): Promise<PolicyReview>
  getPolicyReviews(policyId: string, pagination: Pagination): Promise<PolicyReview[]>
  getPolicyRating(policyId: string): Promise<PolicyRating>
  
  // Review Management
  updateReview(reviewId: string, updates: Partial<Review>): Promise<Review>
  deleteReview(reviewId: string): Promise<void>
  reportReview(reviewId: string, reason: string): Promise<void>
  
  // Agent Response
  respondToReview(reviewId: string, agentId: string, response: string): Promise<void>
  
  // Success Stories
  submitSuccessStory(data: CreateSuccessStoryInput): Promise<SuccessStory>
  getSuccessStories(filters?: StoryFilters): Promise<SuccessStory[]>
  approveSuccessStory(storyId: string, adminId: string): Promise<void>
  
  // Testimonials
  submitTestimonial(data: CreateTestimonialInput): Promise<Testimonial>
  getTestimonials(status?: TestimonialStatus): Promise<Testimonial[]>
  approveTestimonial(testimonialId: string, adminId: string): Promise<void>
  
  // Trust Badges
  calculateTrustBadges(agentId: string): Promise<TrustBadge[]>
  awardTrustBadge(agentId: string, badgeType: BadgeType): Promise<void>
  
  // Analytics
  getReviewAnalytics(agentId: string): Promise<ReviewAnalytics>
  detectSuspiciousReviews(): Promise<SuspiciousReview[]>
}

interface AgentReview {
  id: string
  agentId: string
  customerId: string
  customerName: string
  rating: number // 1-5
  title: string
  content: string
  policyId: string
  isVerifiedPurchase: boolean
  helpful: number
  notHelpful: number
  agentResponse?: string
  agentRespondedAt?: Date
  status: ReviewStatus
  createdAt: Date
  updatedAt: Date
}

interface CreateAgentReviewInput {
  agentId: string
  customerId: string
  policyId: string
  rating: number
  title: string
  content: string
}

interface AgentRating {
  agentId: string
  averageRating: number
  totalReviews: number
  ratingDistribution: Map<number, number> // star -> count
  recentReviews: AgentReview[]
}

interface PolicyReview {
  id: string
  policyId: string
  customerId: string
  customerName: string
  rating: number
  title: string
  content: string
  pros: string[]
  cons: string[]
  wouldRecommend: boolean
  createdAt: Date
}

interface CreatePolicyReviewInput {
  policyId: string
  customerId: string
  rating: number
  title: string
  content: string
  pros?: string[]
  cons?: string[]
  wouldRecommend: boolean
}

interface PolicyRating {
  policyId: string
  averageRating: number
  totalReviews: number
  recommendationRate: number
  ratingDistribution: Map<number, number>
}

interface SuccessStory {
  id: string
  customerId: string
  customerName: string
  agentId?: string
  policyType: InsuranceProduct
  claimAmount?: number
  story: string
  images?: string[]
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  featured: boolean
  createdAt: Date
  approvedAt?: Date
}

interface CreateSuccessStoryInput {
  customerId: string
  agentId?: string
  policyType: InsuranceProduct
  claimAmount?: number
  story: string
  images?: File[]
}

interface StoryFilters {
  policyType?: InsuranceProduct
  featured?: boolean
  status?: string
}

interface Testimonial {
  id: string
  userId: string
  userName: string
  userRole: UserRole
  content: string
  rating: number
  status: TestimonialStatus
  featured: boolean
  createdAt: Date
  approvedAt?: Date
}

enum TestimonialStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

interface CreateTestimonialInput {
  userId: string
  content: string
  rating: number
}

interface TrustBadge {
  type: BadgeType
  name: string
  description: string
  icon: string
  earnedAt: Date
}

enum BadgeType {
  VERIFIED_AGENT = 'VERIFIED_AGENT',
  TOP_RATED = 'TOP_RATED',
  HIGHLY_REVIEWED = 'HIGHLY_REVIEWED',
  ZERO_COMPLAINTS = 'ZERO_COMPLAINTS',
  QUICK_RESPONDER = 'QUICK_RESPONDER'
}

enum ReviewStatus {
  PUBLISHED = 'PUBLISHED',
  FLAGGED = 'FLAGGED',
  REMOVED = 'REMOVED'
}

interface ReviewAnalytics {
  totalReviews: number
  averageRating: number
  ratingTrend: TrendData[]
  sentimentScore: number
  responseRate: number
  averageResponseTime: number
  topKeywords: Map<string, number>
}

interface SuspiciousReview {
  reviewId: string
  reason: string
  confidence: number
  flags: string[]
}
```

#### 8. Agent Performance Dashboard Service

**Responsibilities:**
- Performance metrics calculation
- Sales analytics
- Customer satisfaction tracking
- Leaderboard management
- Goal tracking
- Report generation

**Interfaces:**

```typescript
interface AgentPerformanceService {
  // Performance Metrics
  getPerformanceMetrics(agentId: string, period: TimePeriod): Promise<PerformanceMetrics>
  getSalesAnalytics(agentId: string, period: TimePeriod): Promise<SalesAnalytics>
  getCustomerSatisfaction(agentId: string): Promise<SatisfactionMetrics>
  
  // Response Tracking
  trackResponseTime(agentId: string, messageId: string, responseTime: number): Promise<void>
  getResponseMetrics(agentId: string): Promise<ResponseMetrics>
  
  // Conversion Tracking
  trackLead(agentId: string, leadData: LeadData): Promise<void>
  trackConversion(agentId: string, leadId: string, policyId: string): Promise<void>
  getConversionMetrics(agentId: string): Promise<ConversionMetrics>
  
  // Leaderboard
  getLeaderboard(category: LeaderboardCategory, period: TimePeriod): Promise<LeaderboardEntry[]>
  getAgentRank(agentId: string, category: LeaderboardCategory): Promise<number>
  
  // Goals
  setGoal(agentId: string, goal: PerformanceGoal): Promise<void>
  getGoals(agentId: string): Promise<PerformanceGoal[]>
  trackGoalProgress(agentId: string, goalId: string): Promise<GoalProgress>
  
  // Reports
  generatePerformanceReport(agentId: string, period: TimePeriod): Promise<PerformanceReport>
  exportReport(reportId: string, format: 'PDF' | 'EXCEL'): Promise<Buffer>
  
  // Comparison
  compareWithAverage(agentId: string, metric: string): Promise<ComparisonResult>
  getBenchmarks(): Promise<PerformanceBenchmarks>
}

interface PerformanceMetrics {
  agentId: string
  period: TimePeriod
  policiesSold: number
  revenue: number
  commission: number
  activeCustomers: number
  newCustomers: number
  retentionRate: number
  averageRating: number
  totalReviews: number
  responseTime: number
  conversionRate: number
}

interface SalesAnalytics {
  totalSales: number
  salesByMonth: Map<string, number>
  salesByProduct: Map<InsuranceProduct, number>
  revenueByMonth: Map<string, number>
  topSellingProducts: ProductSales[]
  salesTrend: TrendData[]
  forecastedSales: number
}

interface ProductSales {
  product: InsuranceProduct
  count: number
  revenue: number
  percentage: number
}

interface SatisfactionMetrics {
  averageRating: number
  totalReviews: number
  nps: number // Net Promoter Score
  satisfactionTrend: TrendData[]
  feedbackSummary: FeedbackSummary
}

interface FeedbackSummary {
  positive: number
  neutral: number
  negative: number
  commonPraise: string[]
  commonComplaints: string[]
}

interface ResponseMetrics {
  averageResponseTime: number // minutes
  medianResponseTime: number
  fastestResponse: number
  slowestResponse: number
  responseTrend: TrendData[]
  responseTimeByHour: Map<number, number>
}

interface ConversionMetrics {
  totalLeads: number
  convertedLeads: number
  conversionRate: number
  averageTimeToConvert: number // days
  conversionBySource: Map<string, number>
  conversionFunnel: FunnelStage[]
}

interface FunnelStage {
  stage: string
  count: number
  percentage: number
  dropoffRate: number
}

interface LeaderboardEntry {
  rank: number
  agentId: string
  agentName: string
  avatar?: string
  score: number
  metric: string
  badge?: string
}

enum LeaderboardCategory {
  TOTAL_SALES = 'TOTAL_SALES',
  CUSTOMER_SATISFACTION = 'CUSTOMER_SATISFACTION',
  RESPONSE_TIME = 'RESPONSE_TIME',
  CONVERSION_RATE = 'CONVERSION_RATE',
  REVENUE = 'REVENUE'
}

interface PerformanceGoal {
  id: string
  agentId: string
  type: GoalType
  target: number
  current: number
  period: TimePeriod
  deadline: Date
  status: 'IN_PROGRESS' | 'ACHIEVED' | 'MISSED'
  createdAt: Date
}

enum GoalType {
  SALES_COUNT = 'SALES_COUNT',
  REVENUE = 'REVENUE',
  NEW_CUSTOMERS = 'NEW_CUSTOMERS',
  CUSTOMER_SATISFACTION = 'CUSTOMER_SATISFACTION',
  RESPONSE_TIME = 'RESPONSE_TIME'
}

interface GoalProgress {
  goalId: string
  current: number
  target: number
  percentage: number
  onTrack: boolean
  projectedCompletion: Date
  daysRemaining: number
}

interface PerformanceReport {
  id: string
  agentId: string
  period: TimePeriod
  generatedAt: Date
  metrics: PerformanceMetrics
  salesAnalytics: SalesAnalytics
  satisfactionMetrics: SatisfactionMetrics
  strengths: string[]
  improvements: string[]
  recommendations: string[]
}

interface ComparisonResult {
  agentValue: number
  platformAverage: number
  difference: number
  percentile: number
  ranking: string // 'TOP_10%', 'ABOVE_AVERAGE', 'AVERAGE', 'BELOW_AVERAGE'
}

interface PerformanceBenchmarks {
  averageSales: number
  averageRevenue: number
  averageRating: number
  averageResponseTime: number
  averageConversionRate: number
  topPerformerThresholds: Map<string, number>
}

interface TimePeriod {
  start: Date
  end: Date
  type: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
}

interface TrendData {
  date: Date
  value: number
}

interface LeadData {
  name: string
  contact: string
  source: string
  interestedProducts: InsuranceProduct[]
}
```

### Phase 3 Enhancement Services (Nice-to-Have)

#### 9. Insurance Comparison Service

**Responsibilities:**
- Policy comparison
- AI-powered recommendations
- Coverage gap analysis
- Price comparison
- Comparison reports

**Interfaces:**

```typescript
interface InsuranceComparisonService {
  // Comparison
  comparePolicies(policyIds: string[]): Promise<ComparisonResult>
  compareProducts(productType: InsuranceProduct, filters: ComparisonFilters): Promise<ProductComparison>
  
  // Recommendations
  getRecommendations(userProfile: UserProfile): Promise<PolicyRecommendation[]>
  getBestMatch(userProfile: UserProfile, policies: string[]): Promise<string>
  
  // Coverage Analysis
  analyzeCoverageGaps(userId: string): Promise<CoverageGapAnalysis>
  suggestAdditionalCoverage(userId: string): Promise<CoverageSuggestion[]>
  
  // Price Comparison
  comparePrices(productType: InsuranceProduct, coverage: CoverageRequirements): Promise<PriceComparison>
  
  // Saved Comparisons
  saveComparison(userId: string, comparison: ComparisonResult): Promise<SavedComparison>
  getSavedComparisons(userId: string): Promise<SavedComparison[]>
  shareComparison(comparisonId: string, agentId: string): Promise<void>
  
  // Reports
  generateComparisonReport(comparisonId: string): Promise<Buffer> // PDF
}

interface ComparisonResult {
  policies: PolicyComparison[]
  highlights: ComparisonHighlight[]
  recommendation: string
  bestValue: string
  bestCoverage: string
  createdAt: Date
}

interface PolicyComparison {
  policyId: string
  name: string
  provider: string
  premium: number
  coverage: number
  features: Feature[]
  pros: string[]
  cons: string[]
  rating: number
  score: number
}

interface Feature {
  name: string
  included: boolean
  value?: string
  important: boolean
}

interface ComparisonHighlight {
  category: string
  winner: string
  difference: string
}

interface ComparisonFilters {
  minCoverage?: number
  maxPremium?: number
  features?: string[]
  providers?: string[]
}

interface ProductComparison {
  productType: InsuranceProduct
  products: PolicyComparison[]
  averagePremium: number
  coverageRange: { min: number; max: number }
  commonFeatures: string[]
  uniqueFeatures: Map<string, string[]>
}

interface UserProfile {
  age: number
  occupation: string
  location: string
  income?: number
  dependents: number
  existingPolicies: string[]
  riskFactors: RiskFactor[]
  preferences: UserPreferences
}

interface UserPreferences {
  maxBudget?: number
  priorityFeatures: string[]
  preferredProviders?: string[]
}

interface PolicyRecommendation {
  policyId: string
  name: string
  matchScore: number
  reasons: string[]
  estimatedPremium: number
  keyBenefits: string[]
}

interface CoverageGapAnalysis {
  userId: string
  currentCoverage: CoverageSummary
  recommendedCoverage: CoverageSummary
  gaps: CoverageGap[]
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  priority: string[]
}

interface CoverageSummary {
  totalCoverage: number
  byCategory: Map<InsuranceProduct, number>
  adequacyScore: number
}

interface CoverageGap {
  category: InsuranceProduct
  currentCoverage: number
  recommendedCoverage: number
  gap: number
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  reason: string
}

interface CoverageSuggestion {
  productType: InsuranceProduct
  reason: string
  estimatedCost: number
  priority: number
  benefits: string[]
}

interface PriceComparison {
  productType: InsuranceProduct
  coverage: CoverageRequirements
  options: PriceOption[]
  averagePrice: number
  priceRange: { min: number; max: number }
  costOverTime: Map<number, number> // years -> total cost
}

interface PriceOption {
  provider: string
  premium: number
  frequency: 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  totalYearlyCost: number
  discounts: Discount[]
  finalPrice: number
}

interface Discount {
  type: string
  amount: number
  description: string
}

interface CoverageRequirements {
  amount: number
  duration: number
  features: string[]
  deductible?: number
}

interface SavedComparison {
  id: string
  userId: string
  comparison: ComparisonResult
  notes?: string
  savedAt: Date
}
```

#### 10. Video Consultation Service

**Responsibilities:**
- Video session management
- Scheduling
- Screen sharing
- Recording
- Quality monitoring

**Interfaces:**

```typescript
interface VideoConsultationService {
  // Session Management
  createSession(data: CreateSessionInput): Promise<VideoSession>
  joinSession(sessionId: string, userId: string): Promise<SessionToken>
  endSession(sessionId: string): Promise<void>
  
  // Scheduling
  getAvailableSlots(agentId: string, date: Date): Promise<TimeSlot[]>
  bookConsultation(data: BookingInput): Promise<Consultation>
  rescheduleConsultation(consultationId: string, newSlot: TimeSlot): Promise<void>
  cancelConsultation(consultationId: string, reason: string): Promise<void>
  
  // During Session
  enableScreenShare(sessionId: string, userId: string): Promise<void>
  shareDocument(sessionId: string, documentId: string): Promise<void>
  startRecording(sessionId: string): Promise<void>
  stopRecording(sessionId: string): Promise<Recording>
  
  // History
  getConsultationHistory(userId: string): Promise<Consultation[]>
  getRecording(recordingId: string): Promise<Recording>
  
  // Quality
  reportQualityIssue(sessionId: string, issue: QualityIssue): Promise<void>
  getSessionQuality(sessionId: string): Promise<QualityMetrics>
  
  // Extension
  extendSession(sessionId: string, additionalMinutes: number): Promise<void>
  
  // Reminders
  sendSessionReminder(consultationId: string): Promise<void>
}

interface VideoSession {
  id: string
  consultationId: string
  participants: Participant[]
  status: SessionStatus
  startedAt: Date
  endedAt?: Date
  duration: number // minutes
  recordingEnabled: boolean
  screenShareEnabled: boolean
  quality: QualityMetrics
}

interface CreateSessionInput {
  consultationId: string
  hostId: string
  guestId: string
  duration: number
  recordingEnabled: boolean
}

interface SessionToken {
  token: string
  sessionId: string
  userId: string
  role: 'HOST' | 'GUEST'
  expiresAt: Date
}

interface Participant {
  userId: string
  userName: string
  role: 'HOST' | 'GUEST'
  joinedAt: Date
  leftAt?: Date
  connectionQuality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
}

enum SessionStatus {
  SCHEDULED = 'SCHEDULED',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED'
}

interface TimeSlot {
  start: Date
  end: Date
  available: boolean
  duration: number
}

interface Consultation {
  id: string
  customerId: string
  agentId: string
  scheduledAt: Date
  duration: number // minutes
  status: ConsultationStatus
  topic?: string
  notes?: string
  cost: number // tokens
  sessionId?: string
  recordingId?: string
  createdAt: Date
}

interface BookingInput {
  customerId: string
  agentId: string
  slot: TimeSlot
  topic?: string
  duration: number
}

enum ConsultationStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

interface Recording {
  id: string
  sessionId: string
  consultationId: string
  url: string
  duration: number
  size: number
  format: string
  recordedAt: Date
  expiresAt: Date
  participants: string[]
}

interface QualityIssue {
  type: 'VIDEO' | 'AUDIO' | 'CONNECTION' | 'SCREEN_SHARE'
  severity: 'LOW' | 'MEDIUM' | 'HIGH'
  description: string
  timestamp: Date
}

interface QualityMetrics {
  videoQuality: number // 0-100
  audioQuality: number // 0-100
  connectionStability: number // 0-100
  averageBitrate: number
  packetLoss: number
  latency: number // ms
  issues: QualityIssue[]
}
```

#### 11. Voice Assistant Service

**Responsibilities:**
- Voice recognition
- Command processing
- Text-to-speech
- Myanmar language support
- Voice navigation

**Interfaces:**

```typescript
interface VoiceAssistantService {
  // Voice Recognition
  startListening(userId: string, language: 'en' | 'my'): Promise<VoiceSession>
  stopListening(sessionId: string): Promise<void>
  processVoiceInput(sessionId: string, audioData: Blob): Promise<VoiceCommand>
  
  // Command Execution
  executeCommand(command: VoiceCommand): Promise<CommandResult>
  getSupportedCommands(language: 'en' | 'my'): Promise<VoiceCommandDefinition[]>
  
  // Text-to-Speech
  speak(text: string, language: 'en' | 'my', voice?: VoiceProfile): Promise<AudioBuffer>
  readContent(contentId: string, contentType: string): Promise<AudioBuffer>
  
  // Voice Navigation
  navigateTo(destination: string): Promise<void>
  getNavigationCommands(): Promise<NavigationCommand[]>
  
  // Settings
  updateVoiceSettings(userId: string, settings: VoiceSettings): Promise<void>
  getVoiceSettings(userId: string): Promise<VoiceSettings>
  
  // Training
  trainVoiceProfile(userId: string, samples: AudioSample[]): Promise<VoiceProfile>
  improveRecognition(userId: string, corrections: VoiceCorrection[]): Promise<void>
}

interface VoiceSession {
  id: string
  userId: string
  language: 'en' | 'my'
  startedAt: Date
  endedAt?: Date
  commands: VoiceCommand[]
  status: 'LISTENING' | 'PROCESSING' | 'ENDED'
}

interface VoiceCommand {
  id: string
  sessionId: string
  transcript: string
  confidence: number
  intent: string
  parameters: Map<string, any>
  language: 'en' | 'my'
  timestamp: Date
}

interface CommandResult {
  success: boolean
  action: string
  response: string
  data?: any
  audioResponse?: AudioBuffer
}

interface VoiceCommandDefinition {
  command: string
  intent: string
  examples: string[]
  parameters: CommandParameter[]
  language: 'en' | 'my'
}

interface CommandParameter {
  name: string
  type: string
  required: boolean
  description: string
}

interface VoiceProfile {
  userId: string
  language: 'en' | 'my'
  voiceId: string
  pitch: number
  speed: number
  volume: number
  accent?: string
}

interface NavigationCommand {
  command: string
  destination: string
  description: string
}

interface VoiceSettings {
  enabled: boolean
  language: 'en' | 'my'
  autoSpeak: boolean
  voiceProfile: VoiceProfile
  wakeWord?: string
  noiseCancellation: boolean
  confirmCommands: boolean
}

interface AudioSample {
  audio: Blob
  transcript: string
  language: 'en' | 'my'
}

interface VoiceCorrection {
  originalTranscript: string
  correctedTranscript: string
  audioData: Blob
}
```

#### 12. Gamification Engine

**Responsibilities:**
- Challenge management
- Achievement tracking
- Profile customization
- Seasonal events
- Team competitions

**Interfaces:**

```typescript
interface GamificationEngine {
  // Daily Challenges
  getDailyChallenges(userId: string): Promise<Challenge[]>
  completeChallenge(userId: string, challengeId: string): Promise<ChallengeReward>
  
  // Achievements
  getAchievements(userId: string): Promise<Achievement[]>
  unlockAchievement(userId: string, achievementId: string): Promise<Achievement>
  getAchievementProgress(userId: string, achievementId: string): Promise<AchievementProgress>
  
  // Profile Customization
  getAvailableAvatars(): Promise<Avatar[]>
  purchaseAvatar(userId: string, avatarId: string): Promise<void>
  setAvatar(userId: string, avatarId: string): Promise<void>
  getAvailableThemes(): Promise<Theme[]>
  purchaseTheme(userId: string, themeId: string): Promise<void>
  setTheme(userId: string, themeId: string): Promise<void>
  
  // Seasonal Events
  getActiveEvents(): Promise<SeasonalEvent[]>
  participateInEvent(userId: string, eventId: string): Promise<void>
  getEventProgress(userId: string, eventId: string): Promise<EventProgress>
  getEventLeaderboard(eventId: string): Promise<LeaderboardEntry[]>
  
  // Team Competitions
  createTeam(data: CreateTeamInput): Promise<Team>
  joinTeam(userId: string, teamId: string): Promise<void>
  leaveTeam(userId: string, teamId: string): Promise<void>
  getTeamCompetitions(): Promise<Competition[]>
  getTeamLeaderboard(competitionId: string): Promise<TeamLeaderboardEntry[]>
  
  // Points & Rewards
  awardPoints(userId: string, points: number, reason: string): Promise<void>
  getPointsHistory(userId: string): Promise<PointsTransaction[]>
}

interface Challenge {
  id: string
  title: string
  description: string
  type: ChallengeType
  requirement: number
  progress: number
  reward: number // tokens
  expiresAt: Date
  completed: boolean
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
}

enum ChallengeType {
  COMPLETE_QUIZ = 'COMPLETE_QUIZ',
  READ_POSTS = 'READ_POSTS',
  SEND_REMINDER = 'SEND_REMINDER',
  UPDATE_PROFILE = 'UPDATE_PROFILE',
  REFER_FRIEND = 'REFER_FRIEND',
  LEAVE_REVIEW = 'LEAVE_REVIEW'
}

interface ChallengeReward {
  tokens: number
  points: number
  badges: Badge[]
  message: string
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: AchievementCategory
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  unlockedAt?: Date
  progress?: number
  requirement: number
}

enum AchievementCategory {
  POLICIES = 'POLICIES',
  QUIZZES = 'QUIZZES',
  SOCIAL = 'SOCIAL',
  STREAKS = 'STREAKS',
  REFERRALS = 'REFERRALS',
  SPECIAL = 'SPECIAL'
}

interface AchievementProgress {
  achievementId: string
  current: number
  required: number
  percentage: number
  unlocked: boolean
}

interface Avatar {
  id: string
  name: string
  imageUrl: string
  cost: number // tokens
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  unlockRequirement?: string
  owned: boolean
}

interface Theme {
  id: string
  name: string
  description: string
  previewUrl: string
  colors: ThemeColors
  cost: number
  owned: boolean
}

interface ThemeColors {
  primary: string
  secondary: string
  background: string
  text: string
}

interface SeasonalEvent {
  id: string
  name: string
  description: string
  theme: string
  startDate: Date
  endDate: Date
  challenges: Challenge[]
  rewards: EventReward[]
  participants: number
  isActive: boolean
}

interface EventProgress {
  eventId: string
  userId: string
  challengesCompleted: number
  totalChallenges: number
  points: number
  rank: number
  rewards: EventReward[]
}

interface EventReward {
  type: 'TOKENS' | 'BADGE' | 'AVATAR' | 'THEME'
  value: any
  requirement: string
  claimed: boolean
}

interface Team {
  id: string
  name: string
  description: string
  leaderId: string
  members: TeamMember[]
  totalPoints: number
  rank?: number
  createdAt: Date
}

interface TeamMember {
  userId: string
  userName: string
  avatar?: string
  role: 'LEADER' | 'MEMBER'
  points: number
  joinedAt: Date
}

interface CreateTeamInput {
  name: string
  description: string
  leaderId: string
}

interface Competition {
  id: string
  name: string
  description: string
  startDate: Date
  endDate: Date
  rules: string[]
  prizes: CompetitionPrize[]
  participatingTeams: number
  status: 'UPCOMING' | 'ACTIVE' | 'ENDED'
}

interface CompetitionPrize {
  rank: number
  reward: string
  tokens: number
}

interface TeamLeaderboardEntry {
  rank: number
  teamId: string
  teamName: string
  points: number
  members: number
  topContributors: string[]
}

interface PointsTransaction {
  id: string
  userId: string
  points: number
  type: 'EARNED' | 'SPENT'
  reason: string
  timestamp: Date
}
```

#### 13. Financial Planning Service

**Responsibilities:**
- Budget calculation
- Savings goals tracking
- Coverage recommendations
- Retirement planning
- Financial reports

**Interfaces:**

```typescript
interface FinancialPlanningService {
  // Budget Planning
  createBudget(userId: string, data: BudgetInput): Promise<Budget>
  getBudget(userId: string): Promise<Budget>
  updateBudget(budgetId: string, updates: Partial<BudgetInput>): Promise<Budget>
  analyzeBudget(budgetId: string): Promise<BudgetAnalysis>
  
  // Savings Goals
  createSavingsGoal(userId: string, goal: SavingsGoalInput): Promise<SavingsGoal>
  getSavingsGoals(userId: string): Promise<SavingsGoal[]>
  updateGoalProgress(goalId: string, amount: number): Promise<SavingsGoal>
  deleteGoal(goalId: string): Promise<void>
  
  // Insurance Coverage Calculator
  calculateRecommendedCoverage(profile: FinancialProfile): Promise<CoverageRecommendation>
  
  // Retirement Planning
  calculateRetirementNeeds(data: RetirementInput): Promise<RetirementPlan>
  projectRetirementSavings(data: RetirementInput): Promise<RetirementProjection>
  
  // Emergency Fund
  calculateEmergencyFund(monthlyExpenses: number, dependents: number): Promise<EmergencyFundRecommendation>
  
  // Financial Plans
  saveFinancialPlan(userId: string, plan: FinancialPlan): Promise<SavedFinancialPlan>
  getFinancialPlans(userId: string): Promise<SavedFinancialPlan[]>
  
  // Reports
  generateFinancialHealthReport(userId: string): Promise<FinancialHealthReport>
  exportReport(reportId: string, format: 'PDF' | 'EXCEL'): Promise<Buffer>
}

interface Budget {
  id: string
  userId: string
  monthlyIncome: number
  expenses: ExpenseCategory[]
  totalExpenses: number
  surplus: number
  savingsRate: number
  createdAt: Date
  updatedAt: Date
}

interface BudgetInput {
  monthlyIncome: number
  expenses: ExpenseCategory[]
}

interface ExpenseCategory {
  category: string
  amount: number
  percentage: number
  isFixed: boolean
}

interface BudgetAnalysis {
  budgetId: string
  healthScore: number // 0-100
  insights: string[]
  recommendations: string[]
  comparisonToAverage: Map<string, number>
  savingsOpportunities: SavingsOpportunity[]
}

interface SavingsOpportunity {
  category: string
  currentSpending: number
  recommendedSpending: number
  potentialSavings: number
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
}

interface SavingsGoal {
  id: string
  userId: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: Date
  monthlyContribution: number
  progress: number
  onTrack: boolean
  projectedCompletion: Date
  createdAt: Date
}

interface SavingsGoalInput {
  name: string
  targetAmount: number
  deadline: Date
  initialAmount?: number
}

interface FinancialProfile {
  age: number
  monthlyIncome: number
  dependents: number
  assets: Asset[]
  liabilities: Liability[]
  existingInsurance: ExistingInsurance[]
  riskTolerance: 'LOW' | 'MEDIUM' | 'HIGH'
}

interface Asset {
  type: 'PROPERTY' | 'VEHICLE' | 'SAVINGS' | 'INVESTMENTS' | 'OTHER'
  value: number
  description: string
}

interface Liability {
  type: 'MORTGAGE' | 'LOAN' | 'CREDIT_CARD' | 'OTHER'
  amount: number
  monthlyPayment: number
  description: string
}

interface ExistingInsurance {
  type: InsuranceProduct
  coverage: number
  premium: number
}

interface CoverageRecommendation {
  lifeInsurance: number
  healthInsurance: number
  propertyInsurance: number
  disabilityInsurance: number
  totalRecommended: number
  currentCoverage: number
  gap: number
  reasoning: Map<InsuranceProduct, string>
  estimatedCost: number
}

interface RetirementInput {
  currentAge: number
  retirementAge: number
  currentSavings: number
  monthlyContribution: number
  expectedReturn: number // percentage
  currentIncome: number
  desiredRetirementIncome: number
}

interface RetirementPlan {
  targetAmount: number
  monthlyContributionNeeded: number
  yearsToRetirement: number
  projectedSavings: number
  shortfall: number
  recommendations: string[]
  scenarios: RetirementScenario[]
}

interface RetirementScenario {
  name: string
  monthlyContribution: number
  projectedAmount: number
  retirementIncome: number
  feasibility: 'LOW' | 'MEDIUM' | 'HIGH'
}

interface RetirementProjection {
  years: number[]
  projectedBalance: number[]
  contributions: number[]
  returns: number[]
  milestones: Milestone[]
}

interface Milestone {
  year: number
  age: number
  balance: number
  description: string
}

interface EmergencyFundRecommendation {
  recommendedAmount: number
  minimumAmount: number
  idealAmount: number
  monthsOfExpenses: number
  reasoning: string
  savingsPlan: SavingsPlan
}

interface SavingsPlan {
  monthlyAmount: number
  timeToReach: number // months
  milestones: number[]
}

interface FinancialPlan {
  budget: Budget
  savingsGoals: SavingsGoal[]
  insuranceCoverage: CoverageRecommendation
  retirementPlan?: RetirementPlan
  emergencyFund?: EmergencyFundRecommendation
}

interface SavedFinancialPlan {
  id: string
  userId: string
  plan: FinancialPlan
  notes?: string
  savedAt: Date
}

interface FinancialHealthReport {
  id: string
  userId: string
  generatedAt: Date
  overallScore: number // 0-100
  budgetHealth: number
  savingsHealth: number
  insuranceHealth: number
  retirementHealth: number
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  actionItems: ActionItem[]
}

interface ActionItem {
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  category: string
  action: string
  impact: string
  estimatedCost?: number
}
```

## Data Models (Enhanced Schema)

### New Database Tables

```prisma
// Emergency Assistance
model EmergencySession {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  policyId      String
  policy        Policy   @relation(fields: [policyId], references: [id])
  latitude      Float?
  longitude     Float?
  status        String   // ACTIVE, RESOLVED, CANCELLED
  activatedAt   DateTime @default(now())
  resolvedAt    DateTime?
  events        Json[]
  
  @@map("emergency_sessions")
}

model Facility {
  id            String   @id @default(cuid())
  name          String
  type          String   // HOSPITAL, CLINIC, GARAGE, REPAIR_SHOP
  latitude      Float
  longitude     Float
  phone         String
  address       String
  isApproved    Boolean  @default(false)
  rating        Float?
  services      String[]
  operatingHours Json
  insuranceAccepted String[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("facilities")
}

// Offline Sync
model OfflineAction {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  type          String
  data          Json
  status        String   // PENDING, SYNCING, SYNCED, FAILED
  retryCount    Int      @default(0)
  createdAt     DateTime @default(now())
  syncedAt      DateTime?
  
  @@map("offline_actions")
}

// Referral & Loyalty
model ReferralCode {
  id            String   @id @default(cuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id])
  code          String   @unique
  usageCount    Int      @default(0)
  maxUsage      Int?
  expiresAt     DateTime?
  createdAt     DateTime @default(now())
  
  referrals     Referral[]
  
  @@map("referral_codes")
}

model Referral {
  id            String   @id @default(cuid())
  referrerId    String
  referrer      User     @relation("Referrer", fields: [referrerId], references: [id])
  referredId    String
  referred      User     @relation("Referred", fields: [referredId], references: [id])
  codeId        String
  code          ReferralCode @relation(fields: [codeId], references: [id])
  status        String   // PENDING, ACTIVE, REWARDED
  rewardEarned  Int      @default(0)
  createdAt     DateTime @default(now())
  
  @@map("referrals")
}

model LoyaltyTier {
  id            String   @id @default(cuid())
  userId        String   @unique
  user          User     @relation(fields: [userId], references: [id])
  currentTier   String   // BRONZE, SILVER, GOLD, PLATINUM
  points        Int      @default(0)
  tierSince     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("loyalty_tiers")
}

model Streak {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  type          String   // LOGIN, QUIZ, POST_VIEW
  currentStreak Int      @default(0)
  longestStreak Int      @default(0)
  lastActivityDate DateTime
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@unique([userId, type])
  @@map("streaks")
}

// Document Vault
model VaultDocument {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  fileName      String
  fileType      String
  fileSize      Int
  encryptedUrl  String
  policyId      String?
  policy        Policy?  @relation(fields: [policyId], references: [id])
  category      String
  tags          String[]
  expiryDate    DateTime?
  version       Int      @default(1)
  isShared      Boolean  @default(false)
  uploadedAt    DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  versions      DocumentVersion[]
  shares        DocumentShare[]
  
  @@map("vault_documents")
}

model DocumentVersion {
  id            String   @id @default(cuid())
  documentId    String
  document      VaultDocument @relation(fields: [documentId], references: [id], onDelete: Cascade)
  version       Int
  fileName      String
  fileSize      Int
  encryptedUrl  String
  uploadedBy    String
  uploadedAt    DateTime @default(now())
  
  @@map("document_versions")
}

model FamilyGroup {
  id            String   @id @default(cuid())
  ownerId       String
  owner         User     @relation(fields: [ownerId], references: [id])
  name          String
  createdAt     DateTime @default(now())
  
  members       FamilyMember[]
  shares        DocumentShare[]
  
  @@map("family_groups")
}

model FamilyMember {
  id            String   @id @default(cuid())
  groupId       String
  group         FamilyGroup @relation(fields: [groupId], references: [id], onDelete: Cascade)
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  role          String   // OWNER, ADMIN, MEMBER
  joinedAt      DateTime @default(now())
  
  @@unique([groupId, userId])
  @@map("family_members")
}

model DocumentShare {
  id            String   @id @default(cuid())
  documentId    String
  document      VaultDocument @relation(fields: [documentId], references: [id], onDelete: Cascade)
  groupId       String
  group         FamilyGroup @relation(fields: [groupId], references: [id], onDelete: Cascade)
  canView       Boolean  @default(true)
  canDownload   Boolean  @default(false)
  canEdit       Boolean  @default(false)
  expiresAt     DateTime?
  sharedAt      DateTime @default(now())
  
  @@map("document_shares")
}

// Reviews & Ratings
model AgentReview {
  id            String   @id @default(cuid())
  agentId       String
  agent         User     @relation("AgentReviews", fields: [agentId], references: [id])
  customerId    String
  customer      User     @relation("CustomerReviews", fields: [customerId], references: [id])
  policyId      String
  policy        Policy   @relation(fields: [policyId], references: [id])
  rating        Int
  title         String
  content       String
  helpful       Int      @default(0)
  notHelpful    Int      @default(0)
  agentResponse String?
  agentRespondedAt DateTime?
  status        String   @default("PUBLISHED")
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("agent_reviews")
}

model SuccessStory {
  id            String   @id @default(cuid())
  customerId    String
  customer      User     @relation(fields: [customerId], references: [id])
  agentId       String?
  agent         User?    @relation("AgentStories", fields: [agentId], references: [id])
  policyType    String
  claimAmount   Float?
  story         String
  images        String[]
  status        String   @default("PENDING")
  featured      Boolean  @default(false)
  createdAt     DateTime @default(now())
  approvedAt    DateTime?
  
  @@map("success_stories")
}

// Video Consultation
model Consultation {
  id            String   @id @default(cuid())
  customerId    String
  customer      User     @relation("CustomerConsultations", fields: [customerId], references: [id])
  agentId       String
  agent         User     @relation("AgentConsultations", fields: [agentId], references: [id])
  scheduledAt   DateTime
  duration      Int
  status        String
  topic         String?
  notes         String?
  cost          Int
  sessionId     String?
  recordingId   String?
  createdAt     DateTime @default(now())
  
  @@map("consultations")
}

// Gamification
model Challenge {
  id            String   @id @default(cuid())
  title         String
  description   String
  type          String
  requirement   Int
  reward        Int
  difficulty    String
  expiresAt     DateTime
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  
  completions   ChallengeCompletion[]
  
  @@map("challenges")
}

model ChallengeCompletion {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  challengeId   String
  challenge     Challenge @relation(fields: [challengeId], references: [id])
  progress      Int      @default(0)
  completed     Boolean  @default(false)
  completedAt   DateTime?
  
  @@unique([userId, challengeId])
  @@map("challenge_completions")
}

model Achievement {
  id            String   @id @default(cuid())
  name          String
  description   String
  icon          String
  category      String
  rarity        String
  requirement   Int
  createdAt     DateTime @default(now())
  
  unlocks       UserAchievement[]
  
  @@map("achievements")
}

model UserAchievement {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  achievementId String
  achievement   Achievement @relation(fields: [achievementId], references: [id])
  progress      Int      @default(0)
  unlockedAt    DateTime?
  
  @@unique([userId, achievementId])
  @@map("user_achievements")
}

model Team {
  id            String   @id @default(cuid())
  name          String
  description   String
  leaderId      String
  leader        User     @relation("TeamLeader", fields: [leaderId], references: [id])
  totalPoints   Int      @default(0)
  createdAt     DateTime @default(now())
  
  members       TeamMember[]
  
  @@map("teams")
}

model TeamMember {
  id            String   @id @default(cuid())
  teamId        String
  team          Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  role          String   // LEADER, MEMBER
  points        Int      @default(0)
  joinedAt      DateTime @default(now())
  
  @@unique([teamId, userId])
  @@map("team_members")
}

// Financial Planning
model FinancialPlan {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  planData      Json
  notes         String?
  savedAt       DateTime @default(now())
  
  @@map("financial_plans")
}

model SavingsGoal {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  name          String
  targetAmount  Float
  currentAmount Float    @default(0)
  deadline      DateTime
  monthlyContribution Float
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("savings_goals")
}
```

## API Endpoints

### Emergency Assistance
- `POST /api/emergency/activate` - Activate emergency mode
- `POST /api/emergency/:sessionId/location` - Share location
- `GET /api/emergency/facilities/nearby` - Find nearby facilities
- `POST /api/emergency/claim` - Submit emergency claim

### Offline Sync
- `POST /api/offline/queue` - Queue offline action
- `GET /api/offline/queue` - Get queued actions
- `POST /api/offline/sync` - Sync queued actions

### Smart Notifications
- `POST /api/notifications/schedule` - Schedule notification
- `GET /api/notifications/preferences` - Get preferences
- `PUT /api/notifications/preferences` - Update preferences

### Chatbot
- `POST /api/chatbot/session` - Start chat session
- `POST /api/chatbot/message` - Send message
- `GET /api/chatbot/history` - Get chat history

### Referral & Loyalty
- `GET /api/referral/code` - Get referral code
- `POST /api/referral/apply` - Apply referral code
- `GET /api/loyalty/tier` - Get loyalty tier
- `GET /api/loyalty/streak` - Get streak info

### Document Vault
- `POST /api/vault/upload` - Upload document
- `GET /api/vault/documents` - Get documents
- `POST /api/vault/family` - Create family group
- `POST /api/vault/share` - Share document

### Reviews & Ratings
- `POST /api/reviews/agent` - Rate agent
- `GET /api/reviews/agent/:agentId` - Get agent reviews
- `POST /api/reviews/story` - Submit success story

### Video Consultation
- `POST /api/consultation/book` - Book consultation
- `GET /api/consultation/slots/:agentId` - Get available slots
- `POST /api/consultation/:id/join` - Join session

### Voice Assistant
- `POST /api/voice/session` - Start voice session
- `POST /api/voice/command` - Process voice command
- `POST /api/voice/speak` - Text-to-speech

### Gamification
- `GET /api/gamification/challenges` - Get daily challenges
- `POST /api/gamification/challenge/:id/complete` - Complete challenge
- `GET /api/gamification/achievements` - Get achievements
- `POST /api/gamification/team` - Create team

### Financial Planning
- `POST /api/financial/budget` - Create budget
- `POST /api/financial/savings-goal` - Create savings goal
- `POST /api/financial/coverage` - Calculate coverage
- `POST /api/financial/retirement` - Calculate retirement plan

## Implementation Notes

### Phase 1 Priority
1. Emergency Assistance - Critical safety feature
2. Offline Mode - Essential for Myanmar connectivity
3. Smart Notifications - Proactive engagement
4. Chatbot - 24/7 support

### Phase 2 Priority
1. Referral & Loyalty - Growth driver
2. Document Vault - High-value feature
3. Agent Performance - Agent retention
4. Reviews & Ratings - Trust building

### Phase 3 Priority
1. Video Consultation - Premium feature
2. Insurance Comparison - Differentiation
3. Voice Assistant - Accessibility
4. Gamification - Engagement
5. Financial Planning - Ecosystem expansion

### Security Considerations
- All document uploads encrypted at rest
- Emergency location data encrypted
- Voice data processed securely
- Video sessions use end-to-end encryption
- Review spam detection and moderation
- Rate limiting on all endpoints

### Performance Optimization
- Redis caching for leaderboards
- IndexedDB for offline storage
- CDN for static assets
- Lazy loading for heavy features
- Background jobs for notifications
- WebSocket for real-time features

### Myanmar-Specific Features
- Myanmar weather API integration
- Myanmar calendar support
- Myanmar voice recognition
- Local payment gateway integration
- Myanmar Unicode support throughout
- Local facility database

---

## Conclusion

This design document provides comprehensive technical specifications for all additional features in requirements-v2.md. The architecture maintains consistency with the core platform while adding powerful new capabilities across emergency services, offline support, engagement tools, and advanced features.

All services are designed to be modular, scalable, and maintainable, following the same patterns established in the core platform design.
