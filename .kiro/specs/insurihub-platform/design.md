# Design Document: InsuriHub Platform

## Overview

InsuriHub is a comprehensive insurance sector platform for Myanmar, implementing a token-based economy across three phases. The platform serves customers, agents, insurance companies, teachers, and administrators through web applications and future React Native mobile apps.

### Key Design Principles

1. **Token-First Economy**: All activities consume tokens that never expire
2. **Mobile-First PWA**: Responsive design optimized for mobile devices
3. **Myanmar Localization**: Unicode support, local payment gateways (KBZPay, WavePay, AYAPay)
4. **Scalability**: Designed for 1K users initially, scalable to 100K+
5. **Real-time Communication**: Socket.IO for chat and notifications
6. **Rule-Based AI**: Configurable premium calculator with no external API costs
7. **Modular Architecture**: Clean separation between phases for incremental deployment

### Technology Stack

**Frontend:**
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- Framer Motion (animations)
- Socket.IO Client
- React Query (data fetching)

**Backend:**
- Node.js 18+
- Express.js
- TypeScript
- Socket.IO Server
- Prisma ORM
- PostgreSQL 15+
- Redis 7+ (caching, sessions)

**Future Mobile:**
- React Native (shared design with web)
- Expo (development framework)

**Infrastructure:**
- Docker & Docker Compose
- Nginx (reverse proxy)
- Local file storage (Phase 1), Cloud storage (future)

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                             │
├─────────────────────────────────────────────────────────────┤
│  Web App (Next.js)  │  Mobile App (React Native - Future)   │
│  - Customer Portal  │  - Customer App                        │
│  - Agent Portal     │  - Agent App                           │
│  - Admin Portal     │  - Teacher App (Phase 2)               │
│  - Teacher Portal   │                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     API Gateway Layer                        │
├─────────────────────────────────────────────────────────────┤
│  Nginx Reverse Proxy                                         │
│  - Load Balancing                                            │
│  - SSL Termination                                           │
│  - Rate Limiting                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
├─────────────────────────────────────────────────────────────┤
│  Express.js API Server                                       │
│  ├── Authentication & Authorization                          │
│  ├── Token Management Service                                │
│  ├── Premium Calculator Engine                               │
│  ├── Commission Service                                      │
│  ├── Notification Service                                    │
│  ├── File Upload Service                                     │
│  └── Socket.IO Server (Real-time)                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                               │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL Database  │  Redis Cache                         │
│  - User Data          │  - Sessions                          │
│  - Policies           │  - Rate Limiting                     │
│  - Transactions       │  - Real-time Data                    │
│  - Content            │  - Job Queues                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
├─────────────────────────────────────────────────────────────┤
│  Payment Gateways     │  Email Service (Future)              │
│  - KBZPay             │  - SMTP                              │
│  - WavePay            │  - Transactional Emails              │
│  - AYAPay             │                                      │
└─────────────────────────────────────────────────────────────┘
```


### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Production Setup                         │
├─────────────────────────────────────────────────────────────┤
│  Docker Compose / Kubernetes                                 │
│  ├── Web Container (Next.js)                                 │
│  ├── API Container (Express.js)                              │
│  ├── PostgreSQL Container                                    │
│  ├── Redis Container                                         │
│  └── Nginx Container                                         │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### Core Services

#### 1. Authentication Service

**Responsibilities:**
- Multi-provider authentication (Facebook, Google, Email, Phone+OTP)
- JWT token generation and validation
- Session management
- Role-based access control (RBAC)

**Interfaces:**
```typescript
interface AuthService {
  // Registration
  registerWithEmail(email: string, password: string, name: string, role: UserRole): Promise<User>
  registerWithSocial(provider: 'facebook' | 'google', token: string): Promise<User>
  registerWithPhone(phone: string, otp: string, name: string): Promise<User>
  
  // Authentication
  login(credentials: LoginCredentials): Promise<AuthResponse>
  logout(userId: string): Promise<void>
  refreshToken(refreshToken: string): Promise<AuthResponse>
  
  // Verification
  verifyEmail(token: string): Promise<boolean>
  sendOTP(phone: string): Promise<boolean>
  verifyOTP(phone: string, otp: string): Promise<boolean>
  
  // Password Management
  resetPassword(email: string): Promise<void>
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>
}

interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}

interface LoginCredentials {
  email?: string
  phone?: string
  password: string
}
```

#### 2. Token Management Service

**Responsibilities:**
- Token balance tracking
- Activity-based token deduction
- Token purchase processing
- Commission calculation
- Withdrawal request management
- Account suspension logic

**Interfaces:**
```typescript
interface TokenService {
  // Balance Management
  getBalance(userId: string): Promise<number>
  addTokens(userId: string, amount: number, reason: string): Promise<TokenTransaction>
  deductTokens(userId: string, amount: number, activityType: ActivityType): Promise<TokenTransaction>
  
  // Purchase
  purchaseTokens(userId: string, packageId: string, paymentMethod: PaymentMethod): Promise<Purchase>
  
  // Withdrawal (Agents only)
  requestWithdrawal(agentId: string, tokenAmount: number): Promise<WithdrawalRequest>
  approveWithdrawal(requestId: string, adminId: string): Promise<void>
  rejectWithdrawal(requestId: string, adminId: string, reason: string): Promise<void>
  
  // Commission
  calculateCommission(activityType: ActivityType, amount: number): Promise<number>
  creditCommission(agentId: string, amount: number, policyId: string): Promise<void>
  
  // Account Status
  checkAccountStatus(userId: string): Promise<AccountStatus>
  suspendAccount(userId: string): Promise<void>
  reactivateAccount(userId: string): Promise<void>
  
  // Admin Configuration
  setActivityCost(activityType: ActivityType, cost: number): Promise<void>
  getActivityCosts(): Promise<Map<ActivityType, number>>
}

enum ActivityType {
  POST_CREATION = 'POST_CREATION',
  POST_COMMENT = 'POST_COMMENT',
  POST_LIKE = 'POST_LIKE',
  MESSAGE_SEND = 'MESSAGE_SEND',
  RENEWAL_REMINDER = 'RENEWAL_REMINDER',
  CALCULATOR_SAVE = 'CALCULATOR_SAVE',
  CLAIM_DOCUMENT_UPLOAD = 'CLAIM_DOCUMENT_UPLOAD',
  JOB_POST = 'JOB_POST',
  ADVERTISEMENT_REQUEST = 'ADVERTISEMENT_REQUEST'
}

interface TokenTransaction {
  id: string
  userId: string
  amount: number
  type: 'CREDIT' | 'DEBIT'
  activityType: ActivityType
  balanceBefore: number
  balanceAfter: number
  description: string
  createdAt: Date
}

interface AccountStatus {
  isActive: boolean
  isSuspended: boolean
  tokenBalance: number
  canPerformActivities: boolean
  suspensionReason?: string
}
```


#### 3. Premium Calculator Service

**Responsibilities:**
- Rule-based premium calculation
- Product-specific pricing logic
- Risk assessment
- Recommendation generation
- Calculation history management

**Interfaces:**
```typescript
interface PremiumCalculatorService {
  // Calculation
  calculatePremium(input: CalculatorInput): Promise<CalculatorResult>
  saveCalculation(userId: string, result: CalculatorResult): Promise<SavedCalculation>
  
  // History
  getCalculationHistory(userId: string): Promise<SavedCalculation[]>
  getCalculationById(calculationId: string): Promise<SavedCalculation>
  
  // Admin Configuration
  updateProductRules(productType: InsuranceProduct, rules: PricingRules): Promise<void>
  getProductRules(productType: InsuranceProduct): Promise<PricingRules>
}

interface CalculatorInput {
  productType: InsuranceProduct
  coverageAmount: number
  duration: number // months
  customerAge: number
  riskFactors: RiskFactor[]
  additionalCoverage?: string[]
}

interface CalculatorResult {
  basePremium: number
  riskAdjustment: number
  additionalCoveragesCost: number
  totalPremium: number
  currency: 'MMK' | 'USD'
  breakdown: PremiumBreakdown[]
  recommendations: string[]
  calculatedAt: Date
}

interface PremiumBreakdown {
  component: string
  amount: number
  percentage: number
}

interface PricingRules {
  baseRate: number
  ageMultipliers: Map<number, number>
  riskFactorWeights: Map<string, number>
  coverageRates: Map<string, number>
  minimumPremium: number
  maximumPremium: number
}

enum InsuranceProduct {
  AUTO = 'AUTO',
  HEALTH = 'HEALTH',
  LIFE = 'LIFE',
  PROPERTY = 'PROPERTY',
  BUSINESS = 'BUSINESS',
  TRAVEL = 'TRAVEL',
  DISABILITY = 'DISABILITY',
  LIABILITY = 'LIABILITY',
  MARINE = 'MARINE',
  CYBER = 'CYBER'
}

interface RiskFactor {
  type: string
  value: string | number
  weight: number
}
```

#### 4. Policy Management Service

**Responsibilities:**
- Policy CRUD operations
- Policy-agent relationship management
- Policy status tracking
- Renewal management
- Document management

**Interfaces:**
```typescript
interface PolicyService {
  // Policy Operations
  createPolicy(data: CreatePolicyInput): Promise<Policy>
  getPolicy(policyId: string): Promise<Policy>
  updatePolicy(policyId: string, updates: Partial<Policy>): Promise<Policy>
  deletePolicy(policyId: string): Promise<void>
  
  // Customer Policies
  getCustomerPolicies(customerId: string): Promise<Policy[]>
  getPolicyDetails(policyId: string): Promise<PolicyDetails>
  
  // Agent Policies
  getAgentPolicies(agentId: string): Promise<Policy[]>
  assignAgentToPolicy(policyId: string, agentId: string): Promise<void>
  changeAgentForPolicy(policyId: string, newAgentId: string): Promise<void>
  
  // Renewal
  getPoliciesNearExpiration(days: number): Promise<Policy[]>
  renewPolicy(policyId: string): Promise<Policy>
  
  // Documents
  uploadPolicyDocument(policyId: string, file: File): Promise<Document>
  getPolicyDocuments(policyId: string): Promise<Document[]>
}

interface Policy {
  id: string
  policyNumber: string
  customerId: string
  agentId: string
  productType: InsuranceProduct
  coverageAmount: number
  premiumAmount: number
  currency: 'MMK' | 'USD'
  startDate: Date
  endDate: Date
  status: PolicyStatus
  documents: Document[]
  createdAt: Date
  updatedAt: Date
}

enum PolicyStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  PENDING_RENEWAL = 'PENDING_RENEWAL'
}

interface PolicyDetails extends Policy {
  customer: User
  agent: User
  paymentHistory: Payment[]
  claimHistory: Claim[]
}
```


#### 5. Claim Management Service

**Responsibilities:**
- Claim submission and tracking
- Document upload and management
- Status workflow management
- Agent collaboration
- Audit trail

**Interfaces:**
```typescript
interface ClaimService {
  // Claim Operations
  submitClaim(data: CreateClaimInput): Promise<Claim>
  getClaim(claimId: string): Promise<Claim>
  updateClaimStatus(claimId: string, status: ClaimStatus, notes: string): Promise<Claim>
  
  // Customer Claims
  getCustomerClaims(customerId: string): Promise<Claim[]>
  
  // Agent Claims
  getAgentClaims(agentId: string): Promise<Claim[]>
  addClaimNote(claimId: string, agentId: string, note: string): Promise<void>
  
  // Documents
  uploadClaimDocument(claimId: string, file: File): Promise<Document>
  getClaimDocuments(claimId: string): Promise<Document[]>
  
  // Audit
  getClaimAuditTrail(claimId: string): Promise<AuditEntry[]>
}

interface Claim {
  id: string
  claimNumber: string
  policyId: string
  customerId: string
  incidentDate: Date
  description: string
  claimAmount: number
  status: ClaimStatus
  documents: Document[]
  notes: ClaimNote[]
  createdAt: Date
  updatedAt: Date
}

enum ClaimStatus {
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID'
}

interface ClaimNote {
  id: string
  authorId: string
  authorName: string
  content: string
  createdAt: Date
}

interface AuditEntry {
  id: string
  action: string
  performedBy: string
  timestamp: Date
  changes: Record<string, any>
}
```

#### 6. Post and Content Service

**Responsibilities:**
- Post creation and management
- Like and comment system
- Content moderation (admin only)
- Feed generation
- Myanmar Unicode support

**Interfaces:**
```typescript
interface PostService {
  // Post Operations
  createPost(data: CreatePostInput): Promise<Post>
  getPost(postId: string): Promise<Post>
  updatePost(postId: string, updates: Partial<Post>): Promise<Post>
  deletePost(postId: string): Promise<void>
  
  // Feed
  getFeed(userId: string, pagination: Pagination): Promise<Post[]>
  getAgentPosts(agentId: string, pagination: Pagination): Promise<Post[]>
  
  // Interactions
  likePost(postId: string, userId: string): Promise<void>
  unlikePost(postId: string, userId: string): Promise<void>
  commentOnPost(postId: string, userId: string, content: string): Promise<Comment>
  getPostComments(postId: string, pagination: Pagination): Promise<Comment[]>
  
  // Admin Moderation
  deletePostAsAdmin(postId: string, adminId: string, reason: string): Promise<void>
}

interface Post {
  id: string
  authorId: string
  author: User
  title: string
  content: string
  image?: string
  category: InsuranceProduct
  status: PostStatus
  likesCount: number
  commentsCount: number
  createdAt: Date
  updatedAt: Date
}

enum PostStatus {
  PUBLISHED = 'PUBLISHED',
  DELETED = 'DELETED'
}

interface Comment {
  id: string
  postId: string
  authorId: string
  author: User
  content: string
  createdAt: Date
}

interface CreatePostInput {
  authorId: string
  title: string
  content: string
  image?: File
  category: InsuranceProduct
}
```


#### 7. Quiz and Gamification Service

**Responsibilities:**
- Quiz management
- Score calculation
- Badge awarding
- Leaderboard management
- Token rewards

**Interfaces:**
```typescript
interface QuizService {
  // Quiz Management
  createQuiz(data: CreateQuizInput): Promise<Quiz>
  getQuiz(quizId: string): Promise<Quiz>
  getAvailableQuizzes(userId: string): Promise<Quiz[]>
  
  // Quiz Attempt
  startQuiz(quizId: string, userId: string): Promise<QuizAttempt>
  submitAnswer(attemptId: string, questionId: string, answer: string): Promise<void>
  completeQuiz(attemptId: string): Promise<QuizResult>
  
  // Results
  getQuizHistory(userId: string): Promise<QuizAttempt[]>
  getQuizResult(attemptId: string): Promise<QuizResult>
  
  // Leaderboard
  getLeaderboard(period: 'daily' | 'weekly' | 'monthly' | 'all-time'): Promise<LeaderboardEntry[]>
  
  // Badges
  getUserBadges(userId: string): Promise<Badge[]>
  awardBadge(userId: string, badgeType: BadgeType): Promise<Badge>
}

interface Quiz {
  id: string
  title: string
  description: string
  category: InsuranceProduct
  questions: Question[]
  passingScore: number
  tokenReward: number
  duration: number // minutes
  retakeDelay: number // hours
  isActive: boolean
  createdAt: Date
}

interface Question {
  id: string
  text: string
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE'
  options: string[]
  correctAnswer: string
  points: number
}

interface QuizAttempt {
  id: string
  quizId: string
  userId: string
  startedAt: Date
  completedAt?: Date
  answers: Map<string, string>
  score?: number
  passed?: boolean
}

interface QuizResult {
  attemptId: string
  score: number
  totalPoints: number
  percentage: number
  passed: boolean
  tokensEarned: number
  badgesEarned: Badge[]
  correctAnswers: number
  totalQuestions: number
}

interface LeaderboardEntry {
  rank: number
  userId: string
  userName: string
  avatar?: string
  totalScore: number
  quizzesCompleted: number
  badges: number
}

interface Badge {
  id: string
  type: BadgeType
  name: string
  description: string
  icon: string
  earnedAt: Date
}

enum BadgeType {
  QUIZ_MASTER = 'QUIZ_MASTER',
  PERFECT_SCORE = 'PERFECT_SCORE',
  STREAK_7_DAYS = 'STREAK_7_DAYS',
  STREAK_30_DAYS = 'STREAK_30_DAYS',
  CATEGORY_EXPERT = 'CATEGORY_EXPERT'
}
```

#### 8. Notification Service

**Responsibilities:**
- Real-time notifications via Socket.IO
- Push notifications for PWA
- Email notifications (future)
- Notification preferences
- Notification history

**Interfaces:**
```typescript
interface NotificationService {
  // Send Notifications
  sendNotification(userId: string, notification: Notification): Promise<void>
  sendBulkNotifications(userIds: string[], notification: Notification): Promise<void>
  
  // Real-time
  subscribeToNotifications(userId: string, socketId: string): Promise<void>
  unsubscribeFromNotifications(socketId: string): Promise<void>
  
  // History
  getNotifications(userId: string, pagination: Pagination): Promise<Notification[]>
  markAsRead(notificationId: string): Promise<void>
  markAllAsRead(userId: string): Promise<void>
  
  // Preferences
  updatePreferences(userId: string, preferences: NotificationPreferences): Promise<void>
  getPreferences(userId: string): Promise<NotificationPreferences>
}

interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  createdAt: Date
}

enum NotificationType {
  POST_LIKE = 'POST_LIKE',
  POST_COMMENT = 'POST_COMMENT',
  MESSAGE = 'MESSAGE',
  POLICY_EXPIRING = 'POLICY_EXPIRING',
  CLAIM_STATUS = 'CLAIM_STATUS',
  TOKEN_LOW = 'TOKEN_LOW',
  AGENT_VERIFIED = 'AGENT_VERIFIED',
  WITHDRAWAL_APPROVED = 'WITHDRAWAL_APPROVED',
  QUIZ_REWARD = 'QUIZ_REWARD'
}

interface NotificationPreferences {
  email: boolean
  push: boolean
  inApp: boolean
  types: Map<NotificationType, boolean>
}
```


#### 9. Advertisement Service

**Responsibilities:**
- Ad request management
- Admin approval workflow
- Ad display and tracking
- Impression counting
- Payment processing

**Interfaces:**
```typescript
interface AdvertisementService {
  // Ad Management
  requestAd(data: CreateAdRequest): Promise<Advertisement>
  getAd(adId: string): Promise<Advertisement>
  
  // Customer Ads
  getCustomerAds(customerId: string): Promise<Advertisement[]>
  
  // Admin Approval
  getPendingAds(): Promise<Advertisement[]>
  approveAd(adId: string, adminId: string): Promise<void>
  rejectAd(adId: string, adminId: string, reason: string): Promise<void>
  pauseAd(adId: string, adminId: string): Promise<void>
  
  // Display
  getActiveAds(placement: AdPlacement): Promise<Advertisement[]>
  recordImpression(adId: string, userId: string): Promise<void>
  
  // Analytics
  getAdPerformance(adId: string): Promise<AdPerformance>
}

interface Advertisement {
  id: string
  customerId: string
  title: string
  gifUrl: string
  placement: AdPlacement
  pricingModel: 'PER_VIEW' | 'PER_TIME'
  targetViews?: number
  duration?: number // days
  costInTokens: number
  status: AdStatus
  impressions: number
  startDate?: Date
  endDate?: Date
  createdAt: Date
}

enum AdPlacement {
  FEED_TOP = 'FEED_TOP',
  FEED_MIDDLE = 'FEED_MIDDLE',
  SIDEBAR = 'SIDEBAR',
  MODAL = 'MODAL'
}

enum AdStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED'
}

interface AdPerformance {
  adId: string
  impressions: number
  uniqueViews: number
  clickThroughRate: number
  costPerImpression: number
  totalCost: number
}
```

#### 10. Agent Verification Service

**Responsibilities:**
- Agent application management
- Verification workflow
- Profile validation
- Status tracking

**Interfaces:**
```typescript
interface AgentVerificationService {
  // Application
  submitVerification(agentId: string, data: VerificationData): Promise<VerificationRequest>
  getVerificationStatus(agentId: string): Promise<VerificationRequest>
  
  // Admin Review
  getPendingVerifications(): Promise<VerificationRequest[]>
  approveVerification(requestId: string, adminId: string): Promise<void>
  rejectVerification(requestId: string, adminId: string, reason: string): Promise<void>
  revokeVerification(agentId: string, adminId: string, reason: string): Promise<void>
  
  // History
  getVerificationHistory(agentId: string): Promise<VerificationRequest[]>
}

interface VerificationRequest {
  id: string
  agentId: string
  status: VerificationStatus
  documents: Document[]
  experience: string
  specializations: InsuranceProduct[]
  submittedAt: Date
  reviewedAt?: Date
  reviewedBy?: string
  rejectionReason?: string
}

enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REVOKED = 'REVOKED'
}

interface VerificationData {
  licenseNumber: string
  experience: string
  specializations: InsuranceProduct[]
  documents: File[]
}
```


#### 11. Payment Gateway Service

**Responsibilities:**
- Payment gateway integration (KBZPay, WavePay, AYAPay)
- Payment processing
- Webhook handling
- Transaction tracking
- Currency conversion

**Interfaces:**
```typescript
interface PaymentService {
  // Payment Initiation
  initiatePayment(data: PaymentRequest): Promise<PaymentSession>
  
  // Gateway Integration
  processKBZPayPayment(sessionId: string, data: any): Promise<PaymentResult>
  processWavePayPayment(sessionId: string, data: any): Promise<PaymentResult>
  processAYAPayPayment(sessionId: string, data: any): Promise<PaymentResult>
  
  // Webhook Handling
  handleWebhook(gateway: PaymentGateway, payload: any): Promise<void>
  
  // Transaction Management
  getTransaction(transactionId: string): Promise<Transaction>
  getUserTransactions(userId: string): Promise<Transaction[]>
  
  // Currency
  convertCurrency(amount: number, from: Currency, to: Currency): Promise<number>
  getExchangeRate(from: Currency, to: Currency): Promise<number>
  
  // Admin Configuration
  updateGatewayConfig(gateway: PaymentGateway, config: GatewayConfig): Promise<void>
  enableGateway(gateway: PaymentGateway): Promise<void>
  disableGateway(gateway: PaymentGateway): Promise<void>
}

interface PaymentRequest {
  userId: string
  amount: number
  currency: Currency
  gateway: PaymentGateway
  purpose: PaymentPurpose
  metadata?: Record<string, any>
}

interface PaymentSession {
  sessionId: string
  redirectUrl: string
  expiresAt: Date
}

interface PaymentResult {
  success: boolean
  transactionId: string
  amount: number
  currency: Currency
  gateway: PaymentGateway
  timestamp: Date
}

interface Transaction {
  id: string
  userId: string
  amount: number
  currency: Currency
  gateway: PaymentGateway
  status: TransactionStatus
  purpose: PaymentPurpose
  metadata: Record<string, any>
  createdAt: Date
  completedAt?: Date
}

enum PaymentGateway {
  KBZPAY = 'KBZPAY',
  WAVEPAY = 'WAVEPAY',
  AYAPAY = 'AYAPAY'
}

enum Currency {
  MMK = 'MMK',
  USD = 'USD'
}

enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

enum PaymentPurpose {
  TOKEN_PURCHASE = 'TOKEN_PURCHASE',
  PACKAGE_SUBSCRIPTION = 'PACKAGE_SUBSCRIPTION',
  ADVERTISEMENT = 'ADVERTISEMENT'
}

interface GatewayConfig {
  apiKey: string
  apiSecret: string
  webhookUrl: string
  enabled: boolean
}
```

#### 12. Data Migration Service

**Responsibilities:**
- Excel file parsing
- Data validation
- Bulk import processing
- Error handling
- Progress tracking

**Interfaces:**
```typescript
interface DataMigrationService {
  // Import
  uploadExcelFile(file: File): Promise<ImportSession>
  validateImportData(sessionId: string): Promise<ValidationResult>
  executeImport(sessionId: string): Promise<ImportResult>
  
  // Progress
  getImportProgress(sessionId: string): Promise<ImportProgress>
  
  // Error Handling
  getImportErrors(sessionId: string): Promise<ImportError[]>
  fixImportRow(sessionId: string, rowIndex: number, data: any): Promise<void>
  
  // History
  getImportHistory(): Promise<ImportSession[]>
}

interface ImportSession {
  id: string
  fileName: string
  totalRows: number
  status: ImportStatus
  uploadedAt: Date
  uploadedBy: string
}

interface ValidationResult {
  valid: boolean
  errors: ImportError[]
  warnings: ImportWarning[]
  summary: {
    totalRows: number
    validRows: number
    invalidRows: number
  }
}

interface ImportResult {
  success: boolean
  imported: number
  failed: number
  errors: ImportError[]
  createdUsers: string[]
  createdPolicies: string[]
}

interface ImportProgress {
  sessionId: string
  status: ImportStatus
  processed: number
  total: number
  percentage: number
  currentRow: number
}

interface ImportError {
  row: number
  field: string
  value: any
  error: string
}

interface ImportWarning {
  row: number
  field: string
  message: string
}

enum ImportStatus {
  UPLOADED = 'UPLOADED',
  VALIDATING = 'VALIDATING',
  VALIDATED = 'VALIDATED',
  IMPORTING = 'IMPORTING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}
```


## Data Models

### Enhanced Database Schema

```prisma
// User Management
model User {
  id                String    @id @default(cuid())
  email             String?   @unique
  phone             String?   @unique
  password          String?
  name              String
  avatar            String?
  role              UserRole  @default(CUSTOMER)
  tokenBalance      Int       @default(0)
  
  // Verification
  isVerified        Boolean   @default(false)
  isEmailVerified   Boolean   @default(false)
  isPhoneVerified   Boolean   @default(false)
  
  // Account Status
  isActive          Boolean   @default(true)
  isSuspended       Boolean   @default(false)
  suspensionReason  String?
  
  // Social Auth
  facebookId        String?   @unique
  googleId          String?   @unique
  
  // Agent Fields
  agentPackageId    String?
  agentPackage      AgentPackage? @relation(fields: [agentPackageId], references: [id])
  packageExpiresAt  DateTime?
  verificationStatus VerificationStatus @default(PENDING)
  licenseNumber     String?
  experience        String?
  specializations   InsuranceProduct[]
  
  // Language & Currency
  preferredLanguage String    @default("en")
  preferredCurrency Currency  @default(MMK)
  
  // Timestamps
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  lastLoginAt       DateTime?
  
  // Relations
  policies          Policy[]  @relation("CustomerPolicies")
  managedPolicies   Policy[]  @relation("AgentPolicies")
  posts             Post[]
  postLikes         PostLike[]
  postComments      PostComment[]
  sentMessages      Message[] @relation("MessageSender")
  receivedMessages  Message[] @relation("MessageReceiver")
  chatParticipants  ChatParticipant[]
  tokenTransactions TokenTransaction[]
  withdrawalRequests WithdrawalRequest[]
  notifications     Notification[]
  quizAttempts      QuizAttempt[]
  badges            UserBadge[]
  claims            Claim[]
  advertisements    Advertisement[]
  verificationRequests VerificationRequest[]
  
  @@map("users")
}

enum UserRole {
  CUSTOMER
  AGENT
  ADMIN
  TEACHER
  COMPANY
}

enum VerificationStatus {
  PENDING
  APPROVED
  REJECTED
  REVOKED
}

enum Currency {
  MMK
  USD
}

// Token System
model TokenPackage {
  id            String   @id @default(cuid())
  name          String
  description   String?
  tokenAmount   Int
  price         Float
  currency      Currency
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  purchases     TokenPurchase[]
  
  @@map("token_packages")
}

model AgentPackage {
  id            String   @id @default(cuid())
  name          String
  description   String?
  monthlyTokens Int
  price         Float
  currency      Currency
  features      String[]
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  users         User[]
  
  @@map("agent_packages")
}

model TokenTransaction {
  id            String      @id @default(cuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  amount        Int
  type          TransactionType
  activityType  ActivityType?
  balanceBefore Int
  balanceAfter  Int
  description   String
  metadata      Json?
  createdAt     DateTime    @default(now())
  
  @@map("token_transactions")
}

enum TransactionType {
  CREDIT
  DEBIT
}

enum ActivityType {
  POST_CREATION
  POST_COMMENT
  POST_LIKE
  MESSAGE_SEND
  RENEWAL_REMINDER
  CALCULATOR_SAVE
  CLAIM_DOCUMENT_UPLOAD
  JOB_POST
  ADVERTISEMENT_REQUEST
}

model TokenPurchase {
  id              String      @id @default(cuid())
  userId          String
  packageId       String
  package         TokenPackage @relation(fields: [packageId], references: [id])
  amount          Float
  currency        Currency
  tokenAmount     Int
  gateway         PaymentGateway
  transactionId   String?
  status          TransactionStatus
  createdAt       DateTime    @default(now())
  completedAt     DateTime?
  
  @@map("token_purchases")
}

enum PaymentGateway {
  KBZPAY
  WAVEPAY
  AYAPAY
  MANUAL
}

enum TransactionStatus {
  PENDING
  COMPLETED
  FAILED
  CANCELLED
}

model WithdrawalRequest {
  id              String      @id @default(cuid())
  agentId         String
  agent           User        @relation(fields: [agentId], references: [id], onDelete: Cascade)
  tokenAmount     Int
  cashAmount      Float
  currency        Currency
  status          WithdrawalStatus
  bankDetails     Json?
  reviewedBy      String?
  reviewedAt      DateTime?
  rejectionReason String?
  createdAt       DateTime    @default(now())
  
  @@map("withdrawal_requests")
}

enum WithdrawalStatus {
  PENDING
  APPROVED
  REJECTED
  COMPLETED
}

// Policy Management
model Policy {
  id              String      @id @default(cuid())
  policyNumber    String      @unique
  customerId      String
  customer        User        @relation("CustomerPolicies", fields: [customerId], references: [id], onDelete: Cascade)
  agentId         String
  agent           User        @relation("AgentPolicies", fields: [agentId], references: [id])
  productType     InsuranceProduct
  coverageAmount  Float
  premiumAmount   Float
  currency        Currency
  startDate       DateTime
  endDate         DateTime
  status          PolicyStatus
  documents       Document[]
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  claims          Claim[]
  commissions     Commission[]
  
  @@map("policies")
}

enum InsuranceProduct {
  AUTO
  HEALTH
  LIFE
  PROPERTY
  BUSINESS
  TRAVEL
  DISABILITY
  LIABILITY
  MARINE
  CYBER
}

enum PolicyStatus {
  ACTIVE
  EXPIRED
  CANCELLED
  PENDING_RENEWAL
}

model Document {
  id          String   @id @default(cuid())
  fileName    String
  fileUrl     String
  fileSize    Int
  mimeType    String
  uploadedBy  String
  policyId    String?
  policy      Policy?  @relation(fields: [policyId], references: [id], onDelete: Cascade)
  claimId     String?
  claim       Claim?   @relation(fields: [claimId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  
  @@map("documents")
}


// Premium Calculator
model PremiumCalculation {
  id                String      @id @default(cuid())
  userId            String
  productType       InsuranceProduct
  coverageAmount    Float
  duration          Int
  customerAge       Int
  riskFactors       Json
  basePremium       Float
  riskAdjustment    Float
  totalPremium      Float
  currency          Currency
  breakdown         Json
  recommendations   String[]
  createdAt         DateTime    @default(now())
  
  @@map("premium_calculations")
}

model PricingRule {
  id              String      @id @default(cuid())
  productType     InsuranceProduct @unique
  baseRate        Float
  ageMultipliers  Json
  riskWeights     Json
  coverageRates   Json
  minimumPremium  Float
  maximumPremium  Float
  isActive        Boolean     @default(true)
  updatedAt       DateTime    @updatedAt
  
  @@map("pricing_rules")
}

// Claims
model Claim {
  id              String      @id @default(cuid())
  claimNumber     String      @unique
  policyId        String
  policy          Policy      @relation(fields: [policyId], references: [id], onDelete: Cascade)
  customerId      String
  customer        User        @relation(fields: [customerId], references: [id], onDelete: Cascade)
  incidentDate    DateTime
  description     String
  claimAmount     Float
  status          ClaimStatus
  documents       Document[]
  notes           ClaimNote[]
  auditTrail      Json[]
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  @@map("claims")
}

enum ClaimStatus {
  SUBMITTED
  UNDER_REVIEW
  APPROVED
  REJECTED
  PAID
}

model ClaimNote {
  id          String   @id @default(cuid())
  claimId     String
  claim       Claim    @relation(fields: [claimId], references: [id], onDelete: Cascade)
  authorId    String
  content     String
  createdAt   DateTime @default(now())
  
  @@map("claim_notes")
}

// Posts and Content
model Post {
  id              String      @id @default(cuid())
  authorId        String
  author          User        @relation(fields: [authorId], references: [id], onDelete: Cascade)
  title           String
  content         String
  image           String?
  category        InsuranceProduct
  status          PostStatus  @default(PUBLISHED)
  likesCount      Int         @default(0)
  commentsCount   Int         @default(0)
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  likes           PostLike[]
  comments        PostComment[]
  
  @@map("posts")
}

enum PostStatus {
  PUBLISHED
  DELETED
}

model PostLike {
  id        String   @id @default(cuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  
  @@unique([postId, userId])
  @@map("post_likes")
}

model PostComment {
  id        String   @id @default(cuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("post_comments")
}

// Messaging
model Chat {
  id           String   @id @default(cuid())
  name         String?
  isGroup      Boolean  @default(false)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  participants ChatParticipant[]
  messages     Message[]
  
  @@map("chats")
}

model ChatParticipant {
  id       String   @id @default(cuid())
  chatId   String
  chat     Chat     @relation(fields: [chatId], references: [id], onDelete: Cascade)
  userId   String
  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  joinedAt DateTime @default(now())
  
  @@unique([chatId, userId])
  @@map("chat_participants")
}

model Message {
  id        String      @id @default(cuid())
  chatId    String
  chat      Chat        @relation(fields: [chatId], references: [id], onDelete: Cascade)
  senderId  String
  sender    User        @relation("MessageSender", fields: [senderId], references: [id], onDelete: Cascade)
  receiverId String?
  receiver  User?       @relation("MessageReceiver", fields: [receiverId], references: [id])
  content   String
  type      MessageType @default(TEXT)
  fileUrl   String?
  fileName  String?
  fileSize  Int?
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt
  
  @@map("messages")
}

enum MessageType {
  TEXT
  IMAGE
  FILE
}

// Quiz System
model Quiz {
  id            String   @id @default(cuid())
  title         String
  description   String
  category      InsuranceProduct
  passingScore  Int
  tokenReward   Int
  duration      Int
  retakeDelay   Int
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  questions     Question[]
  attempts      QuizAttempt[]
  
  @@map("quizzes")
}

model Question {
  id            String       @id @default(cuid())
  quizId        String
  quiz          Quiz         @relation(fields: [quizId], references: [id], onDelete: Cascade)
  text          String
  type          QuestionType
  options       String[]
  correctAnswer String
  points        Int
  order         Int
  
  @@map("questions")
}

enum QuestionType {
  MULTIPLE_CHOICE
  TRUE_FALSE
}

model QuizAttempt {
  id          String   @id @default(cuid())
  quizId      String
  quiz        Quiz     @relation(fields: [quizId], references: [id], onDelete: Cascade)
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  answers     Json
  score       Int?
  passed      Boolean?
  startedAt   DateTime @default(now())
  completedAt DateTime?
  
  @@map("quiz_attempts")
}

model UserBadge {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      BadgeType
  earnedAt  DateTime  @default(now())
  
  @@map("user_badges")
}

enum BadgeType {
  QUIZ_MASTER
  PERFECT_SCORE
  STREAK_7_DAYS
  STREAK_30_DAYS
  CATEGORY_EXPERT
}

// Advertisements
model Advertisement {
  id            String      @id @default(cuid())
  customerId    String
  customer      User        @relation(fields: [customerId], references: [id], onDelete: Cascade)
  title         String
  gifUrl        String
  placement     AdPlacement
  pricingModel  PricingModel
  targetViews   Int?
  duration      Int?
  costInTokens  Int
  status        AdStatus    @default(PENDING)
  impressions   Int         @default(0)
  startDate     DateTime?
  endDate       DateTime?
  reviewedBy    String?
  reviewedAt    DateTime?
  rejectionReason String?
  createdAt     DateTime    @default(now())
  
  @@map("advertisements")
}

enum AdPlacement {
  FEED_TOP
  FEED_MIDDLE
  SIDEBAR
  MODAL
}

enum PricingModel {
  PER_VIEW
  PER_TIME
}

enum AdStatus {
  PENDING
  APPROVED
  ACTIVE
  PAUSED
  COMPLETED
  REJECTED
}

// Agent Verification
model VerificationRequest {
  id              String      @id @default(cuid())
  agentId         String
  agent           User        @relation(fields: [agentId], references: [id], onDelete: Cascade)
  status          VerificationStatus
  licenseNumber   String
  experience      String
  specializations InsuranceProduct[]
  documents       Json
  submittedAt     DateTime    @default(now())
  reviewedBy      String?
  reviewedAt      DateTime?
  rejectionReason String?
  
  @@map("verification_requests")
}

// Commission
model Commission {
  id          String   @id @default(cuid())
  agentId     String
  policyId    String
  policy      Policy   @relation(fields: [policyId], references: [id], onDelete: Cascade)
  amount      Int
  activityType ActivityType
  description String
  createdAt   DateTime @default(now())
  
  @@map("commissions")
}

// Notifications
model Notification {
  id        String           @id @default(cuid())
  userId    String
  user      User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  type      NotificationType
  title     String
  message   String
  data      Json?
  read      Boolean          @default(false)
  createdAt DateTime         @default(now())
  
  @@map("notifications")
}

enum NotificationType {
  POST_LIKE
  POST_COMMENT
  MESSAGE
  POLICY_EXPIRING
  CLAIM_STATUS
  TOKEN_LOW
  AGENT_VERIFIED
  WITHDRAWAL_APPROVED
  QUIZ_REWARD
}

// System Configuration
model SystemSetting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String
  dataType  String
  category  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("system_settings")
}

model ActivityCost {
  id           String       @id @default(cuid())
  activityType ActivityType @unique
  cost         Int
  description  String
  updatedAt    DateTime     @updatedAt
  
  @@map("activity_costs")
}

// Phase 2: Job Portal
model Job {
  id            String      @id @default(cuid())
  posterId      String
  title         String
  description   String
  category      InsuranceProduct
  location      String
  salary        String?
  requirements  String[]
  status        JobStatus   @default(ACTIVE)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  applications  JobApplication[]
  
  @@map("jobs")
}

enum JobStatus {
  ACTIVE
  CLOSED
  FILLED
}

model JobApplication {
  id          String      @id @default(cuid())
  jobId       String
  job         Job         @relation(fields: [jobId], references: [id], onDelete: Cascade)
  applicantId String
  resume      String?
  coverLetter String?
  status      ApplicationStatus @default(PENDING)
  appliedAt   DateTime    @default(now())
  
  @@map("job_applications")
}

enum ApplicationStatus {
  PENDING
  REVIEWED
  SHORTLISTED
  REJECTED
  ACCEPTED
}

// Phase 2: Training System
model Course {
  id          String   @id @default(cuid())
  teacherId   String
  title       String
  description String
  category    InsuranceProduct
  duration    Int
  maxStudents Int
  price       Float
  currency    Currency
  status      CourseStatus @default(DRAFT)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  classes     Class[]
  enrollments Enrollment[]
  
  @@map("courses")
}

enum CourseStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model Class {
  id          String   @id @default(cuid())
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  title       String
  startDate   DateTime
  endDate     DateTime
  location    String?
  isOnline    Boolean  @default(false)
  maxStudents Int
  
  attendances Attendance[]
  
  @@map("classes")
}

model Enrollment {
  id          String   @id @default(cuid())
  courseId    String
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  studentId   String
  status      EnrollmentStatus @default(ENROLLED)
  enrolledAt  DateTime @default(now())
  completedAt DateTime?
  
  @@map("enrollments")
}

enum EnrollmentStatus {
  ENROLLED
  COMPLETED
  DROPPED
}

model Attendance {
  id        String   @id @default(cuid())
  classId   String
  class     Class    @relation(fields: [classId], references: [id], onDelete: Cascade)
  studentId String
  present   Boolean
  date      DateTime
  
  @@map("attendances")
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Core System Properties

Property 1: Email registration requires verification
*For any* user registration with email, the account SHALL NOT be activated until email verification is completed
**Validates: Requirements 1.2**

Property 2: Phone registration sends OTP
*For any* user registration with phone number, an OTP SHALL be sent to the provided phone number
**Validates: Requirements 1.3**

Property 3: OTP requirement when enabled
*For any* phone registration WHEN OTP verification is enabled by admin, the registration SHALL require OTP confirmation
**Validates: Requirements 1.4**

Property 4: Social auth auto-verification
*For any* user registration via Facebook or Google, the account SHALL be automatically verified upon creation
**Validates: Requirements 1.5**

Property 5: Activity token deduction
*For any* user activity that consumes tokens, the system SHALL deduct exactly the configured token cost from the user's balance
**Validates: Requirements 2.2**

Property 6: Token persistence
*For any* tokens purchased or earned, they SHALL remain valid indefinitely without expiration
**Validates: Requirements 2.3**

Property 7: Zero balance suspension
*For any* user account, WHEN the token balance reaches exactly zero, the account SHALL be suspended with soft hold status
**Validates: Requirements 2.4**

Property 8: Suspended account UI restrictions
*For any* suspended account, token-based activity features SHALL be hidden from the user interface
**Validates: Requirements 2.5**

Property 9: Suspended account read access
*For any* suspended account, the user SHALL still be able to view their policies and messages
**Validates: Requirements 2.6**

Property 10: Insufficient token prevention
*For any* activity attempt with insufficient token balance, the system SHALL prevent the action and display the required token cost
**Validates: Requirements 2.14**

Property 11: Package subscription date recording
*For any* agent package subscription, the system SHALL record both the subscription start date and expiration date
**Validates: Requirements 3.2**

Property 12: Commission calculation accuracy
*For any* customer policy activity, the system SHALL calculate and credit the correct commission amount to the assigned agent based on configured rates
**Validates: Requirements 6.1**

Property 13: Withdrawal request creation
*For any* agent withdrawal request, the system SHALL create a withdrawal request record requiring admin approval
**Validates: Requirements 6.7**

Property 14: Policy retrieval completeness
*For any* customer, the system SHALL return all policies associated with that customer when queried
**Validates: Requirements 7.1**

Property 15: Premium calculation result
*For any* valid calculator input, the system SHALL return a premium estimate with breakdown
**Validates: Requirements 8.3**

Property 16: Calculator save token cost
*For any* premium calculation save operation, the system SHALL deduct the configured token cost from the user's balance
**Validates: Requirements 8.5**

Property 17: Renewal reminder token cost
*For any* renewal reminder sent by an agent, the system SHALL deduct the configured token cost from the agent's balance
**Validates: Requirements 9.1**

Property 18: Reminder history tracking
*For any* renewal reminder sent, the system SHALL record it in the customer-agent relationship history
**Validates: Requirements 9.4**

Property 19: Agent post token cost
*For any* post created by an agent, the system SHALL deduct the configured token cost from the agent's balance
**Validates: Requirements 10.1**

Property 20: Agent post auto-publish
*For any* post created by an agent, the system SHALL automatically publish it without requiring approval
**Validates: Requirements 10.2**

Property 21: Admin post no cost
*For any* post created by an admin, the system SHALL publish it immediately without deducting tokens
**Validates: Requirements 10.3**

Property 22: Post like counter increment
*For any* post like action, the system SHALL increment the post's like counter by exactly one
**Validates: Requirements 10.9**

Property 23: Comment token cost
*For any* comment posted by a user, the system SHALL deduct the configured token cost from the user's balance
**Validates: Requirements 10.11**

Property 24: Quiz score calculation
*For any* completed quiz attempt, the system SHALL calculate the score based on correct answers and question points
**Validates: Requirements 11.2**

Property 25: Quiz passing token reward
*For any* quiz attempt with a passing score, the system SHALL award the configured token amount to the user
**Validates: Requirements 11.3**

Property 26: Quiz retake prevention
*For any* quiz, a user SHALL NOT be able to retake it within the configured time period after completion
**Validates: Requirements 11.10**

Property 27: Agent search filtering
*For any* agent search query, the system SHALL filter results matching the provided name, location, or specialization criteria
**Validates: Requirements 12.2**

Property 28: Claim required fields validation
*For any* claim submission, the system SHALL reject submissions missing policy number, incident date, description, or supporting documents
**Validates: Requirements 13.2**

Property 29: Claim number uniqueness
*For any* two claims in the system, they SHALL have different claim numbers
**Validates: Requirements 13.4**

Property 30: Excel import validation
*For any* Excel file upload, the system SHALL validate the file format and presence of required columns before processing
**Validates: Requirements 15.2**

Property 31: Auto-create missing agents
*For any* Excel import row with a non-existent agent name, the system SHALL automatically create a pending agent account
**Validates: Requirements 15.6**

Property 32: Payment gateway redirection
*For any* token purchase initiation, the system SHALL redirect the user to the selected payment gateway
**Validates: Requirements 17.6**

Property 33: Successful payment token credit
*For any* successful payment transaction, the system SHALL immediately credit the purchased tokens to the user's account
**Validates: Requirements 17.7**

Property 34: Message notification delivery
*For any* message received by a user, the system SHALL deliver a real-time notification to that user
**Validates: Requirements 18.1**

Property 35: Password encryption
*For any* user password stored in the database, it SHALL be encrypted using a hashing algorithm (never plain text)
**Validates: Requirements 21.1**

Property 36: Input sanitization
*For any* user input submitted to the system, malicious content SHALL be sanitized to prevent injection attacks
**Validates: Requirements 21.6**


## Error Handling

### Error Categories

1. **Authentication Errors**
   - Invalid credentials
   - Expired tokens
   - Unverified accounts
   - Social auth failures

2. **Token System Errors**
   - Insufficient balance
   - Invalid token amount
   - Payment gateway failures
   - Withdrawal request errors

3. **Validation Errors**
   - Missing required fields
   - Invalid data formats
   - File size/type violations
   - Myanmar Unicode encoding issues

4. **Business Logic Errors**
   - Policy not found
   - Agent not verified
   - Quiz retake too soon
   - Claim already submitted

5. **System Errors**
   - Database connection failures
   - File upload failures
   - External service timeouts
   - Rate limit exceeded

### Error Response Format

```typescript
interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: any
    timestamp: Date
  }
}

// Example error codes
enum ErrorCode {
  // Authentication
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
  AUTH_ACCOUNT_NOT_VERIFIED = 'AUTH_ACCOUNT_NOT_VERIFIED',
  
  // Token System
  TOKEN_INSUFFICIENT_BALANCE = 'TOKEN_INSUFFICIENT_BALANCE',
  TOKEN_INVALID_AMOUNT = 'TOKEN_INVALID_AMOUNT',
  TOKEN_PAYMENT_FAILED = 'TOKEN_PAYMENT_FAILED',
  
  // Validation
  VALIDATION_MISSING_FIELD = 'VALIDATION_MISSING_FIELD',
  VALIDATION_INVALID_FORMAT = 'VALIDATION_INVALID_FORMAT',
  VALIDATION_FILE_TOO_LARGE = 'VALIDATION_FILE_TOO_LARGE',
  
  // Business Logic
  POLICY_NOT_FOUND = 'POLICY_NOT_FOUND',
  AGENT_NOT_VERIFIED = 'AGENT_NOT_VERIFIED',
  QUIZ_RETAKE_TOO_SOON = 'QUIZ_RETAKE_TOO_SOON',
  
  // System
  DATABASE_ERROR = 'DATABASE_ERROR',
  FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED',
  EXTERNAL_SERVICE_TIMEOUT = 'EXTERNAL_SERVICE_TIMEOUT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}
```

### Error Handling Strategy

1. **Client-Side Validation**
   - Form validation before submission
   - File type/size checks
   - Myanmar Unicode validation
   - Real-time feedback

2. **Server-Side Validation**
   - Comprehensive input validation
   - Business rule enforcement
   - Database constraint checks
   - Security validation

3. **Graceful Degradation**
   - Offline mode for PWA
   - Cached data display
   - Retry mechanisms
   - Fallback UI states

4. **User-Friendly Messages**
   - Localized error messages (English/Myanmar)
   - Actionable error descriptions
   - Support contact information
   - Error recovery suggestions

## Testing Strategy

### Dual Testing Approach

The system will employ both unit testing and property-based testing to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs
- Both approaches are complementary and necessary for comprehensive coverage

### Unit Testing

**Focus Areas:**
- Specific examples demonstrating correct behavior
- Integration points between components
- Edge cases (empty inputs, boundary values, null handling)
- Error conditions and exception handling
- Myanmar Unicode text handling
- Currency conversion edge cases

**Testing Framework:**
- Jest for JavaScript/TypeScript
- React Testing Library for component tests
- Supertest for API endpoint tests

**Coverage Goals:**
- Minimum 80% code coverage
- 100% coverage for critical paths (authentication, token transactions, payments)

### Property-Based Testing

**Configuration:**
- Minimum 100 iterations per property test
- Each property test references its design document property
- Tag format: **Feature: insurihub-platform, Property {number}: {property_text}**

**Testing Framework:**
- fast-check for JavaScript/TypeScript property-based testing

**Property Test Examples:**

```typescript
// Property 5: Activity token deduction
test('Feature: insurihub-platform, Property 5: Activity token deduction', () => {
  fc.assert(
    fc.property(
      fc.record({
        userId: fc.string(),
        initialBalance: fc.integer({ min: 100, max: 10000 }),
        activityType: fc.constantFrom(...Object.values(ActivityType)),
        activityCost: fc.integer({ min: 1, max: 100 })
      }),
      async ({ userId, initialBalance, activityType, activityCost }) => {
        // Setup
        await setUserBalance(userId, initialBalance);
        await setActivityCost(activityType, activityCost);
        
        // Execute
        await performActivity(userId, activityType);
        
        // Verify
        const newBalance = await getUserBalance(userId);
        expect(newBalance).toBe(initialBalance - activityCost);
      }
    ),
    { numRuns: 100 }
  );
});

// Property 29: Claim number uniqueness
test('Feature: insurihub-platform, Property 29: Claim number uniqueness', () => {
  fc.assert(
    fc.property(
      fc.array(fc.record({
        policyId: fc.string(),
        customerId: fc.string(),
        description: fc.string()
      }), { minLength: 2, maxLength: 100 }),
      async (claims) => {
        // Execute
        const createdClaims = await Promise.all(
          claims.map(claim => createClaim(claim))
        );
        
        // Verify
        const claimNumbers = createdClaims.map(c => c.claimNumber);
        const uniqueNumbers = new Set(claimNumbers);
        expect(uniqueNumbers.size).toBe(claimNumbers.length);
      }
    ),
    { numRuns: 100 }
  );
});
```

### Integration Testing

**Scenarios:**
- End-to-end user flows (registration → purchase → activity)
- Payment gateway integration
- Socket.IO real-time communication
- File upload and storage
- Excel import workflow

### Performance Testing

**Metrics:**
- API response time < 200ms (95th percentile)
- Page load time < 2s
- Socket.IO message latency < 100ms
- Database query time < 50ms
- Support 1000 concurrent users

**Tools:**
- Artillery for load testing
- Lighthouse for web performance
- k6 for API stress testing

### Security Testing

**Areas:**
- Authentication bypass attempts
- SQL injection prevention
- XSS attack prevention
- CSRF protection
- Rate limiting effectiveness
- File upload security


## Cost Estimates

### Infrastructure Costs (Monthly)

**Phase 1 - Initial Launch (1K users)**

| Component | Service | Specification | Cost (USD) |
|-----------|---------|---------------|------------|
| Web Hosting | DigitalOcean/AWS | 2 vCPU, 4GB RAM | $24 |
| Database | PostgreSQL | 2GB storage, managed | $15 |
| Redis | Redis Cloud | 1GB memory | $10 |
| File Storage | Local/S3 | 50GB | $5 |
| Domain & SSL | Namecheap/Let's Encrypt | .com domain | $12/year |
| **Total Phase 1** | | | **~$54/month** |

**Phase 1 - Growth (10K users)**

| Component | Service | Specification | Cost (USD) |
|-----------|---------|---------------|------------|
| Web Hosting | DigitalOcean/AWS | 4 vCPU, 8GB RAM | $48 |
| Database | PostgreSQL | 10GB storage, managed | $30 |
| Redis | Redis Cloud | 2GB memory | $20 |
| File Storage | S3/Cloud | 200GB | $15 |
| CDN | CloudFlare | Free tier | $0 |
| **Total Growth** | | | **~$113/month** |

**Phase 2 & 3 - Scale (100K+ users)**

| Component | Service | Specification | Cost (USD) |
|-----------|---------|---------------|------------|
| Web Hosting | AWS/GCP | Load balanced, auto-scale | $200 |
| Database | PostgreSQL | 100GB, read replicas | $150 |
| Redis | Redis Cloud | 10GB memory | $80 |
| File Storage | S3/Cloud | 1TB | $50 |
| CDN | CloudFlare Pro | Global distribution | $20 |
| Monitoring | DataDog/New Relic | APM, logs | $50 |
| **Total Scale** | | | **~$550/month** |

### Development Costs

**AI-Assisted Development (1 week)**

| Task | Estimated Hours | Notes |
|------|----------------|-------|
| Database schema setup | 4 hours | Prisma migrations |
| Authentication system | 8 hours | Multi-provider auth |
| Token management | 12 hours | Core economy system |
| Premium calculator | 8 hours | Rule-based engine |
| Policy management | 8 hours | CRUD + relationships |
| Post & content system | 8 hours | Feed, likes, comments |
| Quiz system | 8 hours | Questions, scoring, badges |
| Claim management | 6 hours | Workflow + documents |
| Advertisement system | 6 hours | Approval workflow |
| Payment integration | 8 hours | Gateway setup (mock) |
| Real-time features | 8 hours | Socket.IO chat/notifications |
| Admin dashboard | 12 hours | Management interfaces |
| Data migration | 6 hours | Excel import |
| UI components | 16 hours | Mobile-first design |
| Testing setup | 8 hours | Unit + property tests |
| **Total Development** | **126 hours** | **~1 week with AI** |

**Testing & QA (1 week)**

| Task | Estimated Hours | Notes |
|------|----------------|-------|
| Unit test writing | 16 hours | Core functionality |
| Property test writing | 12 hours | Correctness properties |
| Integration testing | 12 hours | End-to-end flows |
| Manual QA | 16 hours | UI/UX testing |
| Bug fixes | 16 hours | Issue resolution |
| Performance testing | 8 hours | Load testing |
| Security audit | 8 hours | Vulnerability scan |
| **Total Testing** | **88 hours** | **~1 week** |

### Operational Costs

**Socket.IO (Real-time)**
- Self-hosted: $0 (included in server costs)
- Managed (Pusher alternative): $49/month for 10K users
- **Recommendation**: Self-hosted Socket.IO = **$0 extra cost**

**Premium Calculator (Rule-Based AI)**
- No external API costs
- Runs on application server
- Admin-configurable rules
- **Cost**: **$0** (included in server)

**Payment Gateways**
- KBZPay: Transaction fees only (2-3%)
- WavePay: Transaction fees only (2-3%)
- AYAPay: Transaction fees only (2-3%)
- **Setup Cost**: $0 (admin portal configuration)
- **Per Transaction**: 2-3% of transaction value

**Myanmar Localization**
- Unicode support: Built-in (no cost)
- Translation: Manual (one-time effort)
- **Cost**: **$0** (no external services)

### Total Cost Summary

**Year 1 Costs:**

| Phase | Infrastructure | Development | Total |
|-------|---------------|-------------|-------|
| Month 1-3 (1K users) | $54/month | One-time: $0 (AI-assisted) | $162 |
| Month 4-12 (Growth) | $113/month | Maintenance: $200/month | $2,016 |
| **Year 1 Total** | | | **~$2,178** |

**Notes:**
- Development costs assume AI-assisted coding (GitHub Copilot, ChatGPT, etc.)
- No external AI API costs (rule-based calculator)
- No Socket.IO service costs (self-hosted)
- Payment gateway fees are per-transaction (not fixed monthly)
- Myanmar localization has no recurring costs
- Costs scale gradually with user growth

### Cost Optimization Strategies

1. **Start Small**: Begin with DigitalOcean $24/month droplet
2. **Self-Host**: Use Socket.IO instead of paid services
3. **Free Tier**: Leverage CloudFlare free CDN
4. **Rule-Based AI**: Avoid expensive ML API calls
5. **Local Storage**: Start with local files, migrate to S3 later
6. **Open Source**: Use PostgreSQL, Redis, Nginx (all free)
7. **Progressive Scaling**: Only upgrade when needed


## API Endpoints

### Authentication Endpoints

```
POST   /api/auth/register/email
POST   /api/auth/register/phone
POST   /api/auth/register/social
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/verify-email
POST   /api/auth/send-otp
POST   /api/auth/verify-otp
POST   /api/auth/reset-password
POST   /api/auth/change-password
GET    /api/auth/profile
PATCH  /api/auth/profile
```

### Token Management Endpoints

```
GET    /api/tokens/balance
GET    /api/tokens/transactions
POST   /api/tokens/purchase
GET    /api/tokens/packages
POST   /api/tokens/withdraw-request
GET    /api/tokens/withdrawal-requests
PATCH  /api/tokens/withdrawal-requests/:id/approve
PATCH  /api/tokens/withdrawal-requests/:id/reject
GET    /api/tokens/activity-costs
```

### Policy Endpoints

```
GET    /api/policies
GET    /api/policies/:id
POST   /api/policies
PATCH  /api/policies/:id
DELETE /api/policies/:id
GET    /api/policies/:id/documents
POST   /api/policies/:id/documents
GET    /api/policies/expiring
POST   /api/policies/:id/renew
GET    /api/policies/agent/:agentId
```

### Premium Calculator Endpoints

```
POST   /api/calculator/calculate
POST   /api/calculator/save
GET    /api/calculator/history
GET    /api/calculator/:id
GET    /api/calculator/rules/:productType
PATCH  /api/calculator/rules/:productType
```

### Claim Endpoints

```
GET    /api/claims
GET    /api/claims/:id
POST   /api/claims
PATCH  /api/claims/:id/status
POST   /api/claims/:id/documents
POST   /api/claims/:id/notes
GET    /api/claims/:id/audit-trail
GET    /api/claims/customer/:customerId
GET    /api/claims/agent/:agentId
```

### Post Endpoints

```
GET    /api/posts
GET    /api/posts/:id
POST   /api/posts
PATCH  /api/posts/:id
DELETE /api/posts/:id
POST   /api/posts/:id/like
DELETE /api/posts/:id/like
GET    /api/posts/:id/comments
POST   /api/posts/:id/comments
GET    /api/posts/agent/:agentId
```

### Quiz Endpoints

```
GET    /api/quizzes
GET    /api/quizzes/:id
POST   /api/quizzes
PATCH  /api/quizzes/:id
DELETE /api/quizzes/:id
POST   /api/quizzes/:id/start
POST   /api/quizzes/attempts/:attemptId/answer
POST   /api/quizzes/attempts/:attemptId/complete
GET    /api/quizzes/attempts/history
GET    /api/quizzes/leaderboard
GET    /api/quizzes/badges
```

### Advertisement Endpoints

```
GET    /api/advertisements
GET    /api/advertisements/:id
POST   /api/advertisements
GET    /api/advertisements/pending
PATCH  /api/advertisements/:id/approve
PATCH  /api/advertisements/:id/reject
PATCH  /api/advertisements/:id/pause
GET    /api/advertisements/active
POST   /api/advertisements/:id/impression
GET    /api/advertisements/:id/performance
```

### Agent Verification Endpoints

```
POST   /api/agents/verification
GET    /api/agents/verification/status
GET    /api/agents/verification/pending
PATCH  /api/agents/verification/:id/approve
PATCH  /api/agents/verification/:id/reject
PATCH  /api/agents/verification/:id/revoke
GET    /api/agents/verification/history
GET    /api/agents/search
GET    /api/agents/:id
```

### Messaging Endpoints

```
GET    /api/chats
GET    /api/chats/:id
POST   /api/chats
GET    /api/chats/:id/messages
POST   /api/chats/:id/messages
PATCH  /api/messages/:id
DELETE /api/messages/:id
```

### Notification Endpoints

```
GET    /api/notifications
PATCH  /api/notifications/:id/read
PATCH  /api/notifications/read-all
GET    /api/notifications/preferences
PATCH  /api/notifications/preferences
```

### Data Migration Endpoints

```
POST   /api/import/upload
GET    /api/import/:sessionId/validate
POST   /api/import/:sessionId/execute
GET    /api/import/:sessionId/progress
GET    /api/import/:sessionId/errors
PATCH  /api/import/:sessionId/fix-row
GET    /api/import/history
```

### Admin Endpoints

```
GET    /api/admin/dashboard
GET    /api/admin/users
PATCH  /api/admin/users/:id/suspend
PATCH  /api/admin/users/:id/activate
PATCH  /api/admin/users/:id/tokens
GET    /api/admin/settings
PATCH  /api/admin/settings
PATCH  /api/admin/activity-costs
GET    /api/admin/analytics
GET    /api/admin/audit-logs
```

### Payment Gateway Endpoints

```
POST   /api/payments/initiate
POST   /api/payments/webhook/kbzpay
POST   /api/payments/webhook/wavepay
POST   /api/payments/webhook/ayapay
GET    /api/payments/transactions
GET    /api/payments/transactions/:id
GET    /api/payments/exchange-rate
```

### Phase 2: Job Portal Endpoints

```
GET    /api/jobs
GET    /api/jobs/:id
POST   /api/jobs
PATCH  /api/jobs/:id
DELETE /api/jobs/:id
POST   /api/jobs/:id/apply
GET    /api/jobs/:id/applications
PATCH  /api/jobs/applications/:id/status
```

### Phase 2: Training Endpoints

```
GET    /api/courses
GET    /api/courses/:id
POST   /api/courses
PATCH  /api/courses/:id
DELETE /api/courses/:id
POST   /api/courses/:id/enroll
GET    /api/courses/:id/classes
POST   /api/courses/:id/classes
POST   /api/classes/:id/attendance
GET    /api/enrollments
```

### Socket.IO Events

**Client → Server:**
```
join-room
leave-room
send-message
typing-start
typing-stop
like-post
read-notification
```

**Server → Client:**
```
new-message
user-online
user-offline
user-typing
post-liked
post-commented
notification
token-balance-updated
policy-expiring
claim-status-updated
```


## Default Token Activity Costs

Based on the token-based economy, here are the recommended default costs for activities:

| Activity Type | Default Cost (Tokens) | Rationale |
|--------------|----------------------|-----------|
| Agent creates post | 10 | Significant content creation |
| Customer comments on post | 2 | Engagement activity |
| Customer likes post | 0 | Free to encourage engagement |
| Customer sends message | 1 | Communication cost |
| Agent sends renewal reminder | 5 | Professional service |
| Customer saves premium calculator result | 3 | Value-added service |
| Customer uploads claim document | 2 | Per document upload |
| Agent posts job listing | 15 | Job portal feature (Phase 2) |
| Customer requests advertisement | 50-500 | Based on duration/views |

**Token Package Recommendations:**

| Package Name | Tokens | Price (MMK) | Price (USD) | Target User |
|-------------|--------|-------------|-------------|-------------|
| Starter | 100 | 5,000 | $2.50 | Customers |
| Basic | 500 | 20,000 | $10 | Active customers |
| Professional | 2,000 | 70,000 | $35 | Agents |
| Business | 5,000 | 150,000 | $75 | Active agents |
| Enterprise | 10,000 | 250,000 | $125 | High-volume agents |

**Agent Monthly Packages:**

| Package Name | Monthly Tokens | Price (MMK) | Price (USD) | Features |
|-------------|---------------|-------------|-------------|----------|
| Agent Starter | 1,000 | 50,000 | $25 | Basic agent features |
| Agent Pro | 3,000 | 120,000 | $60 | + Priority support |
| Agent Elite | 10,000 | 300,000 | $150 | + Analytics dashboard |

**Commission Rates:**

| Activity | Commission (% of tokens spent) |
|----------|-------------------------------|
| Customer post comment | 10% |
| Customer message | 10% |
| Calculator save | 15% |
| Claim document upload | 10% |

**Advertisement Pricing:**

| Model | Cost | Details |
|-------|------|---------|
| Per View | 0.1 tokens per view | Minimum 1,000 views = 100 tokens |
| Per Time | 50 tokens per day | Maximum 30 days = 1,500 tokens |
| GIF File Size | Max 5MB | Larger files rejected |

**Quiz Rewards:**

| Achievement | Token Reward |
|------------|--------------|
| Pass quiz (60-79%) | 10 tokens |
| Pass quiz (80-89%) | 20 tokens |
| Perfect score (90-100%) | 50 tokens |
| First quiz completion | 25 tokens (bonus) |
| 7-day streak | 100 tokens (bonus) |
| 30-day streak | 500 tokens (bonus) |

## Implementation Timeline

### Week 1: Development (AI-Assisted)

**Days 1-2: Foundation**
- Database schema setup and migrations
- Authentication system (multi-provider)
- JWT token management
- Basic API structure

**Days 3-4: Core Features**
- Token management system
- Policy management
- Premium calculator (rule-based)
- Agent verification workflow

**Days 5-6: Social Features**
- Post creation and feed
- Like and comment system
- Quiz system with scoring
- Claim management

**Day 7: Integration**
- Real-time features (Socket.IO)
- Notification system
- Payment gateway setup (mock)
- Admin dashboard

### Week 2: Testing & QA

**Days 1-2: Unit Testing**
- Write unit tests for all services
- Test edge cases and error handling
- Myanmar Unicode testing
- Currency conversion testing

**Days 3-4: Property Testing**
- Implement property-based tests
- Run 100+ iterations per property
- Fix discovered issues
- Document test results

**Days 5-6: Integration & Manual QA**
- End-to-end flow testing
- UI/UX testing on mobile devices
- Payment gateway integration testing
- Performance testing

**Day 7: Deployment Preparation**
- Security audit
- Performance optimization
- Documentation finalization
- Production deployment

### Phase 2 & 3: Future Enhancements

**Phase 2 (Months 2-3):**
- Job portal development
- Training system implementation
- Teacher role features
- Course management

**Phase 3 (Months 4-6):**
- Company portal (separate system)
- HR management tools
- Advanced policy management
- Risk assessment tools
- Regulatory compliance features

## Security Considerations

### Authentication Security

1. **Password Requirements**
   - Minimum 8 characters
   - Must include uppercase, lowercase, number
   - Bcrypt hashing with salt rounds = 12

2. **JWT Tokens**
   - Access token expiry: 15 minutes
   - Refresh token expiry: 7 days
   - Secure HTTP-only cookies
   - Token rotation on refresh

3. **Social Auth**
   - OAuth 2.0 implementation
   - State parameter for CSRF protection
   - Secure token storage

4. **OTP Security**
   - 6-digit numeric code
   - 5-minute expiration
   - Rate limiting: 3 attempts per 15 minutes
   - SMS provider: Twilio or local Myanmar provider

### Data Security

1. **Encryption**
   - Passwords: Bcrypt
   - Sensitive data at rest: AES-256
   - Data in transit: TLS 1.3
   - Database connection: SSL

2. **Input Validation**
   - Joi schema validation
   - Myanmar Unicode sanitization
   - File upload validation (type, size, content)
   - SQL injection prevention (Prisma ORM)

3. **Rate Limiting**
   - Authentication: 5 attempts per 15 minutes
   - API calls: 100 requests per 15 minutes
   - File uploads: 10 per hour
   - Token purchases: 5 per hour

4. **CORS Configuration**
   - Whitelist specific origins
   - Credentials allowed for same-origin
   - Preflight caching

### File Upload Security

1. **Validation**
   - Allowed types: images (jpg, png, gif), documents (pdf)
   - Maximum size: 10MB per file
   - Virus scanning (ClamAV)
   - Content-type verification

2. **Storage**
   - Randomized filenames
   - Separate directory per user
   - No executable permissions
   - CDN with signed URLs (future)

### Payment Security

1. **Gateway Integration**
   - Webhook signature verification
   - HTTPS-only communication
   - No credit card storage
   - PCI DSS compliance (gateway handles)

2. **Transaction Security**
   - Idempotency keys
   - Double-spend prevention
   - Transaction logging
   - Audit trail

## Monitoring and Logging

### Application Monitoring

1. **Metrics to Track**
   - API response times
   - Error rates
   - Token transaction volume
   - Active user count
   - Database query performance
   - Socket.IO connection count

2. **Tools**
   - Winston for logging
   - PM2 for process management
   - Prometheus + Grafana (future)
   - Sentry for error tracking

### Logging Strategy

1. **Log Levels**
   - ERROR: System errors, exceptions
   - WARN: Business logic warnings
   - INFO: Important events (login, purchase)
   - DEBUG: Detailed debugging info

2. **Log Retention**
   - ERROR logs: 90 days
   - INFO logs: 30 days
   - DEBUG logs: 7 days
   - Audit logs: Indefinite

3. **Sensitive Data**
   - Never log passwords
   - Mask payment information
   - Redact personal data in production
   - Comply with data protection laws

## Deployment Strategy

### Development Environment

```bash
# Local development
docker-compose up -d
npm run dev

# Environment variables
DATABASE_URL=postgresql://localhost:5432/insurihub_dev
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

### Staging Environment

```bash
# Staging deployment
docker-compose -f docker-compose.staging.yml up -d

# Environment variables
DATABASE_URL=postgresql://staging-db:5432/insurihub_staging
REDIS_URL=redis://staging-redis:6379
NODE_ENV=staging
```

### Production Environment

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# Environment variables
DATABASE_URL=postgresql://prod-db:5432/insurihub_prod
REDIS_URL=redis://prod-redis:6379
NODE_ENV=production
```

### CI/CD Pipeline

1. **GitHub Actions Workflow**
   - Run tests on pull request
   - Build Docker images
   - Deploy to staging on merge to develop
   - Deploy to production on merge to main

2. **Deployment Steps**
   - Run database migrations
   - Build frontend assets
   - Update Docker containers
   - Run smoke tests
   - Monitor for errors

### Backup Strategy

1. **Database Backups**
   - Automated daily backups
   - Retention: 30 days
   - Point-in-time recovery
   - Backup verification

2. **File Backups**
   - Daily incremental backups
   - Weekly full backups
   - Off-site storage
   - Disaster recovery plan

## Conclusion

This design document provides a comprehensive blueprint for the InsuriHub platform across all three phases. The architecture is designed to be:

- **Scalable**: From 1K to 100K+ users
- **Cost-Effective**: ~$54/month initial costs, rule-based AI, self-hosted services
- **Secure**: Multi-layer security, encryption, rate limiting
- **Maintainable**: Clean architecture, comprehensive testing, monitoring
- **Localized**: Myanmar language, calendar, currency, payment gateways
- **Mobile-First**: PWA with future React Native support

The token-based economy ensures sustainable monetization while the modular design allows for incremental feature rollout across three phases. With AI-assisted development, the platform can be built in 1 week and tested in another week, ready for launch with all phases complete.

