# ConservationCred (BioPay MVP)
## Investor-Grade Product Requirements Document
### Version 1.0 | Confidential

---

# 1. Executive Summary

## The Opportunity in One Sentence

**ConservationCred turns the world's most underpaid labor — grassroots conservation — into verifiable digital income that builds financial identity for unbanked communities.**

## Vision

A future where a forest ranger in rural Kenya, a nest monitor in the Mekong Delta, or a snare-removal volunteer in Zambia wakes up every morning knowing that their conservation labor is economically counted, financially rewarded, and permanently recorded — creating a credit identity that no corrupt middleman can erase.

## Why Now

Three forces are converging simultaneously:

**Conservation finance is broken.** Over $50 billion flows annually toward conservation globally, yet less than 10% reaches the community-level workers who actually implement it on the ground. The field has documented this failure for two decades without building a systemic alternative.

**Financial inclusion infrastructure has matured.** Mobile money adoption across Sub-Saharan Africa, Southeast Asia, and Latin America has crossed critical mass. Over 1.7 billion adults remain unbanked globally (World Bank, 2022), but the majority now carry mobile phones. The infrastructure for digital wallets, lightweight KYC, and micro-transactions now exists without requiring traditional banking relationships.

**Verification technology no longer requires AI.** Rule-based fraud detection, metadata validation, geofence logic, and behavioral scoring can now be assembled from commodity web services and Firebase infrastructure at near-zero marginal cost. The persistent myth that fraud prevention requires machine learning has delayed practical solutions. We reject that premise.

## The Core Insight

Conservation workers are performing **economically valuable, measurable labor** for which there is documented global demand — from carbon credit buyers, from biodiversity offset markets, from NGO donors, from government conservation mandates. The problem is not a lack of demand for their labor. The problem is a broken verification and payment infrastructure that makes their labor economically invisible.

ConservationCred does not invent a new economic primitive. It **plumbs the gap** between documented conservation labor and the financial systems that should be rewarding it.

## Problem/Opportunity Summary

| Dimension | Current State | ConservationCred |
|---|---|---|
| Income from conservation labor | Delayed, cash-based, corrupt | Instant digital credit |
| Verification of work done | Manual, forged, unreliable | Rule-based, timestamped, auditable |
| Financial identity for workers | Nonexistent | Built incrementally from activity |
| NGO reporting to donors | Spreadsheets, anecdotes | Real-time dashboards |
| Loan eligibility for workers | Zero | Built from conservation history |

---

# 2. Product Vision

## Long-Term Vision (5–10 Years)

ConservationCred becomes the **financial operating system for the conservation economy** — the layer that sits between conservation labor, institutional conservation finance, and community financial inclusion. At scale:

- Conservation workers globally hold a **ConservationCred Score** that functions like a credit score, but built on verified environmental stewardship rather than debt repayment history.
- NGOs, park authorities, and government conservation agencies use ConservationCred as their **primary reporting and payment rail** for community-based programs.
- Microfinance institutions and rural banks accept ConservationCred history as **alternative credit data**, unlocking loans for workers who have never held a formal bank account.
- Carbon credit and biodiversity offset markets use ConservationCred activity logs as **verifiable provenance data** to back nature-based credits.
- The platform operates in **40+ countries**, processing millions of conservation activity submissions per year.

## Ecosystem Vision

ConservationCred is designed as a **multi-sided platform** with four node types whose incentives are aligned:

**Node 1: Conservation Workers** — Earn credits for verified labor. Use credits to unlock financial literacy, build savings habits, access micro-loans, and establish financial identity.

**Node 2: NGOs & Park Authorities** — Subscribe to ConservationCred to manage their community ranger programs. Get fraud-resistant reporting, donor-ready dashboards, and compliance documentation.

**Node 3: Donors & Impact Investors** — Gain transparent, auditable proof that their money reached real workers doing real work. Receive impact reports they can share with their own stakeholders.

**Node 4: Microfinance Institutions** — Access verified alternative credit data on applicants who have no traditional credit history. Reduce loan default risk through behavioral financial literacy data.

Each node gains independent value. The platform becomes more defensible as all four nodes grow together.

## Theory of Change

```
Conservation labor performed
        ↓
Labor submitted via mobile app (low-bandwidth PWA)
        ↓
Rule-based verification engine validates submission
        ↓
ConservationCreds deposited to worker's digital wallet
        ↓
Credits unlock financial literacy modules
        ↓
Financial literacy completion strengthens credit profile
        ↓
Savings behavior simulated and tracked
        ↓
Credit profile shared (with consent) with microfinance partners
        ↓
Worker receives first formal micro-loan
        ↓
Successful repayment fed back into ConservationCred profile
        ↓
Worker graduates to formal financial system
```

## How Conservation Becomes Economic Infrastructure

The critical insight is **labor abstraction**. Just as Uber abstracted transportation labor into a trackable, rewardable economic unit, ConservationCred abstracts conservation labor into a trackable, rewardable economic unit.

A snare removal is not just an ecological act — it is a **unit of labor** with economic value. Currently that value is dispersed into grant budgets, donor reports, and conservation NGO operating costs. ConservationCred routes a portion of that value directly to the worker who performed the act, in real time, in a form they can use.

The long-term moat is the **data layer**: a longitudinal record of conservation behavior, financial engagement, and economic reliability that no other platform possesses. This data, aggregated and anonymized, becomes the most valuable alternative credit dataset in the world for underserved rural populations.

---

# 3. Problem Deep Dive

## Existing System Failures

The current dominant model for community conservation incentive programs operates as follows: an international NGO receives a multi-year grant from a bilateral donor or foundation. They design a "community ranger" or "conservation steward" program. They recruit local workers, often through village leaders. They pay those workers in cash, typically monthly, through a field officer who physically travels to the community.

This system fails at every link in the chain:

**Verification failure.** Field officers cannot physically verify every claimed activity. They rely on verbal attestation, paper logbooks, and occasional spot checks. Fraud rates in community ranger programs have been documented at 15–40% in some programs (internal NGO audits, not public). Workers quickly learn what claims are accepted and optimize for claims rather than actions.

**Payment delay failure.** Cash disbursement requires a field officer visit, which occurs monthly at best, quarterly at worst. During payment gaps, workers lose motivation, disengage from patrols, and often pursue extractive income alternatives (poaching, illegal logging) to compensate.

**Middle-layer corruption.** Village leaders, program coordinators, and field officers at every level of the payment chain have economic incentives to skim. Workers at the bottom of the hierarchy — the ones doing the actual work — often receive 60–70 cents of every dollar intended for them, with the remainder captured by intermediaries.

**No financial identity creation.** Even when workers are paid correctly, cash payments create no durable financial record. After years of conservation labor, a worker has no credit history, no savings record, no financial profile. They remain as financially invisible the day they retire from the program as the day they joined.

**Donor reporting failure.** NGOs spend enormous internal resources compiling impact reports for donors. These reports are retrospective, aggregated, and disconnected from ground-level data. Donors cannot verify that their donations reached the workers claimed. This creates a trust deficit that caps donation sizes and program continuity.

## Conservation Participation Collapse

When incentive systems fail, conservation participation collapses — and it collapses exactly at the moments of highest ecological stress. When poaching pressure increases, workers who are behind on payments are least likely to perform patrols. When deforestation fronts advance, discouraged workers are least likely to report illegal activity. The incentive failure is procyclical with ecological damage.

## Why Current NGO Workflows Fail

Current NGO-built mobile reporting tools (several exist, e.g., SMART for ranger patrol management) are designed for **institutional reporting**, not **worker incentivization**. They capture data for NGO dashboards, not worker wallets. They do not create financial identity for the workers who use them. They are top-down tools that extract data from workers without returning economic value to those workers.

ConservationCred is fundamentally different: it is designed **from the worker wallet outward**, not from the NGO dashboard inward.

---

# 4. User Personas

## Persona 1: Amara — Conservation Field Guardian

**Demographics:** Female, age 28. Lives in a village 12km from a wildlife corridor in rural Zambia. Primary school education. Speaks Bemba and basic English. Household income approximately $80/month from subsistence farming and occasional casual labor.

**Conservation Role:** Participates in a snare-removal program run by a local NGO partner. Performs 3–4 patrols per week. Has removed over 200 snares in the past 18 months. Is considered one of the most reliable guardians in her community.

**Technology Access:** Owns a mid-range Android smartphone (Tecno Spark, purchased 2021). Has a mobile data SIM with approximately 500MB data purchased per week. Charges phone at a communal charging station. Primarily uses WhatsApp and Facebook. Comfortable with photo-taking and basic app navigation.

**Pain Points:**
- Receives payment 6–8 weeks after submitting paper patrol reports to her field coordinator
- Has been underpaid twice when her coordinator "lost" her logbook pages
- Has no bank account and cannot access credit for farming inputs or emergencies
- Feels her conservation work is invisible and unvalued by her broader community
- Does not know how to budget, save, or invest the irregular cash she does receive

**Motivations:**
- Cares deeply about wildlife — grew up near the park and has watched species disappear
- Wants to earn a steady, reliable income that she controls
- Wants to be able to save for her children's school fees
- Wants to be taken seriously as a professional worker, not a volunteer
- Is competitive within her peer group and would engage with leaderboard recognition

**Trust Barriers:**
- Has been burned by technology promises before (an SMS-based payment system in 2019 that never paid out)
- Trusts her phone but is skeptical of apps from unknown organizations
- Would trust a tool endorsed by her NGO partner or village leader

**Economic Reality:**
- Conservation income is irregular and supplementary; farming is primary
- No formal savings instrument; uses a rotating savings group (chama/chilimba)
- Would save small amounts if a simple, low-friction mechanism existed

---

## Persona 2: Sipho — NGO Field Program Manager

**Demographics:** Male, age 35. Based in a regional NGO office in Livingstone, Zambia. University-educated in environmental science. Manages a team of 45 community guardians across 3 villages.

**Professional Role:** Responsible for program compliance, donor reporting, and guardian payment processing. Spends approximately 30% of his time on data entry and report compilation. Travels to field sites 2–3 times per month.

**Technology Access:** Uses a laptop (Windows 10) and a high-end Android smartphone. Has reliable office internet. Is comfortable with Google Workspace, Excel, and basic data tools.

**Pain Points:**
- Spends 2 full days per month compiling guardian activity data from paper logbooks into Excel spreadsheets
- Cannot verify submitted patrol reports without physically visiting sites
- Has caught fraud in his program but lacks systematic tools to detect it earlier
- Donor reports are always delayed because field data arrives late and inconsistently
- Has lost guardian trust after payment processing errors caused by manual data entry mistakes
- His organization's impact metrics are weak because they lack real-time activity data

**Motivations:**
- Wants to run a program that demonstrably works and can be evidenced to donors
- Wants to reduce time spent on administration and increase time on field support
- Wants to catch fraud early before it becomes a program scandal
- Is genuinely motivated by guardian welfare and wants workers to be paid fairly and promptly

**Trust Barriers:**
- Skeptical of technology that promises too much
- Has seen multiple conservation tech tools fail in the field due to connectivity issues
- Requires any tool to work reliably offline and in low-bandwidth conditions

---

## Persona 3: Dr. Rachel — Foundation Program Officer (Donor)

**Demographics:** Female, age 42. Works for a mid-sized European conservation foundation with a $20M annual grant portfolio. Based in Amsterdam. Makes grant decisions for 8–12 community conservation programs per year.

**Professional Role:** Reviews program applications, conducts due diligence, monitors grant performance, compiles annual impact reports for her foundation's board.

**Technology Access:** Full enterprise technology stack. Uses Salesforce for grant management. Sophisticated data consumer — comfortable with dashboards, geospatial visualizations, and downloadable datasets.

**Pain Points:**
- Receives narrative impact reports from grantees that are impossible to verify
- Has no way to know if reported activity numbers are real or inflated
- Spends significant time chasing grantees for data that arrives months after activity occurred
- Her foundation's board increasingly demands "impact transparency" that current reporting cannot provide
- Has growing concerns about whether cash payment programs actually reach frontline workers

**Motivations:**
- Wants to be able to show her board a live dashboard of what their grants are achieving
- Wants to fund programs she can defend as fraud-resistant and worker-centered
- Would increase grant size to organizations that can demonstrate transparent impact data
- Cares about worker welfare — not just ecological outcomes

**Trust Barriers:**
- Extremely cautious about platforms that are unproven at scale
- Would require a security review and data privacy assessment before using
- Needs to see evidence of real field deployment, not just demo videos

---

## Persona 4: Mr. Okonkwo — Microfinance Loan Officer

**Demographics:** Male, age 38. Works for a rural microfinance institution in Nigeria with 12 branch offices. Reviews 15–20 loan applications per week. Is under pressure to grow his loan book while maintaining default rates below 8%.

**Professional Role:** Evaluates creditworthiness of small business loan applicants. Most applicants have no formal credit history. Currently relies on character references, asset assessments, and group lending structures.

**Pain Points:**
- The biggest barrier to growing his loan book is the lack of credit data on rural applicants
- Character references and group lending are costly to administer and imperfect predictors of repayment
- Has no way to assess the financial behavior or income stability of conservation workers
- Would love an alternative data source that demonstrated consistent earning behavior over time

**Motivations:**
- Wants to serve a new market segment (conservation workers) that he currently has no tools to underwrite
- Is interested in green/impact loan products that attract concessional funding
- Would offer preferential loan terms to applicants with verified conservation income history

---

# 5. User Journey Maps

## Journey 1: Amara Submits a Conservation Report

**Step 1 — App Launch (Offline-capable)**
Amara opens ConservationCred on her Tecno Spark. The PWA loads from local cache even with no data connection. She sees her wallet balance (currently 240 ConservationCreds) and a prominent green "Log Activity" button.

**Step 2 — Activity Type Selection**
She taps "Log Activity." She sees five large icon-based options: Snare Removal | Wildlife Sighting | Illegal Activity Report | Nest Check | Patrol Log. She selects "Snare Removal."

**Step 3 — Photo Capture**
The app opens her camera. She photographs the snare she removed. The app automatically captures EXIF timestamp (from device clock) and GPS coordinates if location services are enabled. If GPS is unavailable, the app notes this for admin review.

**Step 4 — Quantity Entry**
She enters "3" for snares removed. The interface uses a large numeric keypad with no text input required.

**Step 5 — Voice Note Option (Low-Literacy Support)**
Optionally, she can tap a microphone icon and record a 15-second voice note describing conditions on the ground. This is stored as audio metadata — not transcribed or analyzed.

**Step 6 — Offline Queue**
Submission is queued locally. She receives visual confirmation: "Your patrol log is saved. It will be sent when you have internet."

**Step 7 — Background Sync**
When she connects to mobile data on her walk back through the village, the app silently syncs her submission to Firebase.

**Step 8 — Verification Processing (2–5 minutes)**
The Cloud Function verification pipeline runs. It checks: timestamp consistency, GPS coordinates against her assigned patrol zone, photo hash for duplicates, submission rate against her historical baseline. A confidence score of 87/100 is generated. The submission passes automatic verification.

**Step 9 — Credits Awarded**
Amara receives a push notification: "✓ Patrol verified! +15 ConservationCreds added to your wallet." She opens the app and sees her balance updated to 255. A small animation shows credits "flowing" into her wallet icon.

**Step 10 — Streak Recognition**
Because this is her 7th consecutive day of activity, she receives a "7-Day Streak" badge and a 10% bonus: +1.5 extra credits. The leaderboard updates her position from 4th to 3rd in her community.

---

## Journey 2: Verification Flow (Backend Perspective)

**Trigger:** New submission document created in Firestore `/submissions/{submissionId}`.

**Step 1 — Trigger Cloud Function** `onSubmissionCreate` fires.

**Step 2 — Extract Metadata**
Pull: userId, activityType, timestamp, GPS coordinates, photoHash, deviceId, submissionCount (today), lastSubmissionTimestamp.

**Step 3 — Run Rule Battery**
| Rule | Pass Condition | Weight |
|---|---|---|
| Timestamp freshness | Submission within 24 hours of photo EXIF time | 20 pts |
| GPS in patrol zone | Coordinates within assigned geofence polygon | 25 pts |
| Photo hash uniqueness | Hash not found in duplicate detection index | 20 pts |
| Rate check | Fewer than max daily submissions for activity type | 15 pts |
| Device consistency | DeviceId matches registered device for user | 10 pts |
| Streak consistency | Submission time consistent with historical pattern | 10 pts |

**Step 4 — Score Calculation**
Each passing rule adds its weight. Failing rules deduct half their weight. Total score 0–100.

**Step 5 — Decision Routing**
- Score ≥ 70: Auto-approve → trigger credit deposit Cloud Function
- Score 40–69: Flag for admin review → move to `/pending_review` queue, do not award credits
- Score < 40: Reject → notify user, create audit log, do NOT award credits, increment user suspicion counter

**Step 6 — Credit Deposit**
On auto-approval: write transaction document to `/wallet_transactions/{userId}`, update `/users/{userId}/wallet.balance`, trigger push notification.

---

## Journey 3: Unlocking a Financial Literacy Module

**Context:** Amara has accumulated 300 ConservationCreds. A literacy module "How to Save for a Goal" requires 250 credits and 5 completed patrol submissions in the past 30 days. She qualifies.

**Step 1:** She navigates to "Learn & Earn" tab. She sees 3 modules with lock icons and progress indicators. The first module "Introduction to Saving" shows "Unlocked" in green. The second, "How to Save for a Goal," shows "Ready to Unlock."

**Step 2:** She taps the second module. A screen explains: "You've earned enough credits! This module teaches you how to save for big goals. Complete it to earn 50 bonus ConservationCreds."

**Step 3:** She starts the module. It has 5 screens, each with a large illustration, 2–3 sentences of text (translated into Bemba), and a voice playback option. She listens to the audio version.

**Step 4:** At the end of each screen is a single multiple-choice question. She taps her answer. Correct answers show a green checkmark with brief encouraging feedback.

**Step 5:** On completing all 5 screens, she takes a 5-question quiz. She passes with 4/5.

**Step 6:** "Module Complete! +50 ConservationCreds added." Her credit balance: 350. Her "Financial Literacy Score" advances from Level 1 to Level 2. This score is visible on her credit profile.

---

## Journey 4: Building a Credit Reputation

**Month 1–3:** Amara submits 65 conservation activities. 62 pass auto-verification. 3 are flagged for review (one GPS miss, two submission rate flags during a busy patrol week). NGO admin approves 2 of 3 flagged submissions manually. Her verification rate: 98%.

**Month 4:** She completes 3 of 5 financial literacy modules. Her "Financial Literacy Completion" metric reaches 60%.

**Month 6:** Her ConservationCred profile shows:
- Total verified activities: 127
- Average monthly activity: 21
- Verification rate: 97%
- Financial literacy score: Level 3
- Savings simulation consistency: 80% (she has been consistently moving simulated amounts to her "savings pool" within the app)
- Longest streak: 23 days

**Month 9:** Her NGO partner opts into the "Credit Sharing" program with a local MFI. Amara consents to sharing her ConservationCred profile with the MFI. She applies for a $150 agricultural input loan.

**MFI Review:** Mr. Okonkwo's institution reviews her ConservationCred profile. They see consistent income behavior over 9 months. They approve a $120 starter loan at standard rates — Amara's first formal loan.

---

# 6. Core Product Architecture

## Frontend Architecture

**Technology:** React Progressive Web App (PWA) with Tailwind CSS.

**Why PWA over Native App:**
- Zero app store friction for distribution in markets where Play Store access is inconsistent
- Installable to home screen, functions like native app
- Service worker enables full offline functionality — critical for field use
- Single codebase for all devices
- Easier updates — push new versions without app store approval delays

**Key Frontend Modules:**

```
/src
  /components
    /activity            — ActivityLogForm, PhotoCapture, ActivityTypeSelector
    /wallet              — WalletBalance, TransactionHistory, CreditDisplay
    /literacy            — ModuleCard, QuizEngine, ProgressTracker
    /leaderboard         — CommunityRank, StreakDisplay, BadgeGallery
    /profile             — CreditProfile, VerificationHistory, SettingsPanel
    /admin               — SubmissionQueue, FraudAlerts, AnalyticsDashboard
  /services
    /firebase            — auth.js, firestore.js, functions.js, storage.js
    /offline             — syncQueue.js, localCache.js, conflictResolver.js
    /verification        — clientValidation.js (pre-submission checks)
  /hooks
    useAuth, useWallet, useSubmissions, useLeaderboard
  /contexts
    AuthContext, WalletContext, OfflineContext
```

**Offline-First Architecture:**
- Service worker caches the entire app shell on first load
- IndexedDB stores pending submissions when offline
- Background Sync API fires when connectivity returns
- Optimistic UI updates (credits shown immediately, rolled back if server rejects)
- Firestore SDK offline persistence enabled — reads cached data when offline

**State Management:** React Context + useReducer for global state (wallet balance, auth state, pending sync queue). No Redux needed for MVP scope.

---

## Backend Architecture

**Technology:** Firebase (Firestore, Authentication, Cloud Functions, Cloud Storage)

**Firebase Authentication:**
- Phone number OTP for primary authentication — no email required
- Backup: NGO admin can provision accounts via email for workers without personal phone numbers
- Auth UID is the universal user identifier across all Firestore collections
- Session persistence with short-lived tokens refreshed automatically

**Firestore as Primary Database:**
- NoSQL document model suits the flexible, evolving data structures of conservation activity types
- Real-time listeners enable instant wallet balance updates without polling
- Offline SDK persistence enables read access without connectivity
- Security Rules enforced server-side — users can only read/write their own documents

**Cloud Functions:**
- Node.js 18 runtime
- All business logic server-side (prevents client-side tampering)
- Triggered by Firestore document creation, HTTP endpoints, and scheduled jobs

**Cloud Storage:**
- Photo uploads stored in Firebase Storage buckets, organized by `/photos/{userId}/{submissionId}/{filename}`
- Storage Security Rules: users can only write to their own folder; read requires authentication
- Photo hash (SHA-256 of image bytes) stored in Firestore for duplicate detection — actual images stored in Storage

---

## Firestore Collections

### `/users/{userId}`
```json
{
  "uid": "string",
  "phone": "string (hashed for privacy)",
  "displayName": "string",
  "organizationId": "string (NGO)",
  "patrolZoneId": "string",
  "deviceFingerprint": "string",
  "registrationDate": "timestamp",
  "kycLevel": "number (0-3)",
  "role": "guardian | ngo_admin | donor | mfi_partner",
  "locale": "string",
  "wallet": {
    "balance": "number",
    "lifetimeEarned": "number",
    "lastUpdated": "timestamp"
  },
  "fraudFlags": {
    "suspicionScore": "number (0-100)",
    "flagCount": "number",
    "lastFlagDate": "timestamp",
    "status": "clear | watchlist | suspended"
  },
  "creditProfile": {
    "verificationRate": "number",
    "avgMonthlyActivity": "number",
    "literacyLevel": "number",
    "savingsConsistency": "number",
    "profileVisibility": "private | shared_with_mfi"
  }
}
```

### `/submissions/{submissionId}`
```json
{
  "submissionId": "string",
  "userId": "string",
  "organizationId": "string",
  "activityType": "snare_removal | wildlife_sighting | nest_check | patrol_log | illegal_activity_report",
  "submittedAt": "timestamp",
  "exifTimestamp": "timestamp",
  "gpsCoordinates": { "lat": "number", "lng": "number" },
  "gpsAccuracy": "number (meters)",
  "photoStoragePath": "string",
  "photoHash": "string (SHA-256)",
  "quantityValue": "number",
  "quantityUnit": "string",
  "voiceNoteStoragePath": "string (optional)",
  "deviceId": "string",
  "appVersion": "string",
  "offlineSubmission": "boolean",
  "offlineQueuedAt": "timestamp",
  "verificationScore": "number",
  "verificationStatus": "pending | approved | flagged | rejected",
  "verificationDetails": { "ruleResults": "map" },
  "creditsAwarded": "number",
  "adminReviewerId": "string (if manually reviewed)",
  "adminReviewNote": "string"
}
```

### `/wallet_transactions/{transactionId}`
```json
{
  "transactionId": "string",
  "userId": "string",
  "type": "activity_reward | literacy_bonus | streak_bonus | admin_adjustment | savings_lock",
  "amount": "number",
  "balanceBefore": "number",
  "balanceAfter": "number",
  "sourceSubmissionId": "string (if activity_reward)",
  "sourceLiteracyModuleId": "string (if literacy_bonus)",
  "createdAt": "timestamp",
  "description": "string"
}
```

### `/organizations/{orgId}`
```json
{
  "orgId": "string",
  "name": "string",
  "type": "ngo | park_authority | government",
  "country": "string",
  "adminUserIds": ["string"],
  "patrolZones": [{ "zoneId": "string", "polygon": "GeoJSON" }],
  "activityTypes": ["string"],
  "creditRateCard": { "activityType": "credits_per_unit" },
  "subscriptionTier": "free | basic | pro",
  "fraudThresholds": { "autoApproveMinScore": "number", "autoRejectMaxScore": "number" },
  "createdAt": "timestamp"
}
```

### `/literacy_modules/{moduleId}`
```json
{
  "moduleId": "string",
  "title": "map (locale -> string)",
  "description": "map (locale -> string)",
  "unlockRequirements": {
    "minCredits": "number",
    "minSubmissions30Days": "number",
    "prerequisiteModuleIds": ["string"]
  },
  "completionBonus": "number",
  "screens": [{ "screenId": "string", "contentType": "text | image | audio", "content": "map" }],
  "quiz": [{ "question": "map", "options": ["map"], "correctIndex": "number" }],
  "passingScore": "number",
  "tags": ["saving | budgeting | borrowing | goals"],
  "createdAt": "timestamp"
}
```

### `/leaderboard/{orgId}/periods/{periodId}`
```json
{
  "periodType": "weekly | monthly",
  "startDate": "timestamp",
  "endDate": "timestamp",
  "rankings": [
    { "userId": "string", "displayName": "string", "verifiedActivities": "number", "credits": "number", "rank": "number" }
  ],
  "lastUpdated": "timestamp"
}
```

---

## Cloud Functions Architecture

### `onSubmissionCreate` (Firestore Trigger)
Triggered: document create in `/submissions/{submissionId}`
Actions: Run verification pipeline → update verification status → if approved, trigger credit award → update user fraud score

### `awardCredits` (Called by onSubmissionCreate)
Triggered: programmatically
Actions: Calculate credits from org rate card → write wallet transaction → update user wallet balance → trigger push notification → update leaderboard aggregates

### `updateLeaderboard` (Scheduled — every hour)
Triggered: Cloud Scheduler
Actions: Aggregate verified submissions per user per org → recalculate rankings → write to leaderboard collection

### `computeCreditProfile` (Scheduled — daily at midnight UTC)
Triggered: Cloud Scheduler
Actions: Per user: compute 30-day verification rate, average monthly activity, savings consistency, literacy completion → write to users.creditProfile

### `detectPhotoHash` (HTTP Callable)
Called: client pre-upload (optional) or by onSubmissionCreate
Actions: Query photoHash index → return isDuplicate boolean

### `adminApproveSubmission` (HTTP Callable — admin only)
Triggered: NGO admin clicks "Approve" in dashboard
Actions: Update submission status → award credits → log admin action

---

# 7. Fraud Prevention System

## Design Philosophy

The fraud problem in community conservation programs is structural, not technical. Workers do not need sophisticated attack vectors to game simple paper-based systems — they just need a coordinator who isn't watching closely. The baseline we are competing against is paper logbooks reviewed monthly. Our verification system does not need to be perfect — it needs to be **substantially better than the status quo** while remaining lightweight enough to run on Firebase Cloud Functions at near-zero infrastructure cost.

The core principle: **make fraud more costly than honest reporting, without making honest reporting difficult.**

## The Fraud Taxonomy

Before designing defenses, we enumerate the actual fraud types we expect to see:

| Fraud Type | Description | Likelihood |
|---|---|---|
| Photo recycling | Resubmitting the same photo (same snare) multiple times | High |
| Time spoofing | Backdating submissions to claim missed days | Medium |
| Location spoofing | Submitting from home, claiming remote patrol location | Medium |
| Quantity inflation | Submitted "3 snares" when only 1 was removed | High |
| Collusion fraud | Multiple workers submitting same event from different accounts | Medium |
| Device sharing fraud | One person operating multiple accounts from one device | Medium |
| Coordinator fraud | Admin approving fake submissions for kickbacks | Low-Medium |
| Onboarding fraud | Registering fake users to capture credits | Low |

## Defense Layer 1: Photo Integrity

**SHA-256 Photo Hashing**
Every uploaded photo has a SHA-256 hash computed client-side before upload. This hash is stored in a dedicated Firestore collection `/photo_hashes/{hash}` with userId and submissionId. Before a new submission is approved, the pipeline queries this collection for an exact hash match.

*Limitation:* Simple re-save or screenshot creates a different hash. *Mitigation:* Combine with EXIF analysis (below).

**EXIF Metadata Validation**
When a photo is submitted, the app extracts available EXIF data:
- `DateTimeOriginal`: when the photo was taken
- `GPSLatitude` / `GPSLongitude`: where the photo was taken
- `Make` / `Model`: camera device
- `Software`: editing software tag (if present — flag if professional editing software detected)

Rules:
- EXIF timestamp must be within ±4 hours of submission timestamp (allows for timezone ambiguity and offline queue delay)
- EXIF GPS (if present) must match submitted GPS within 500 meters
- Photos with editing software EXIF tags are automatically flagged for admin review
- Photos with EXIF stripped entirely are flagged (score penalty: -10 pts)

**Perceptual Hash (pHash) — Future Phase 2**
Phase 1 uses exact SHA-256 hashing. Phase 2 adds perceptual hashing (pHash) to detect visually similar images even after re-saves. This requires a lightweight image processing Cloud Function but is not required for MVP.

## Defense Layer 2: Temporal Consistency

**Submission Timestamp vs. EXIF Timestamp**
Checks that the photo was not taken long before submission (someone hoarding old photos).
- Pass: |submission_timestamp - exif_timestamp| ≤ 4 hours
- Flag: 4–48 hours delta → reduce score, soft flag
- Reject: > 48 hours delta

**Daily Rate Limiting**
Each activity type has a maximum submission count per user per day, set by the NGO in their org configuration. Defaults:
- Snare removal: max 10/day (a very active guardian)
- Wildlife sighting: max 20/day
- Patrol log: max 1/day
- Illegal activity report: max 3/day

Submissions above the daily limit are held in a "rate-limit queue" for admin review, not auto-rejected (a guardian who found 15 snares in one day should be reviewed, not penalized).

**Historical Baseline Comparison**
After a user has 14+ days of submission history, the system computes their rolling average daily activity. Submissions that exceed 3× their historical average trigger a soft flag for admin review.

## Defense Layer 3: Geospatial Validation

**Patrol Zone Geofencing**
Each guardian is assigned to one or more patrol zones, defined as GeoJSON polygons by the NGO admin. Submissions are compared against these polygons.

Implementation: Use a lightweight point-in-polygon algorithm (ray casting) running in the Cloud Function. No external geospatial API required.

Scoring:
- GPS within assigned zone: +25 pts
- GPS within 2km buffer of zone boundary: +15 pts (GPS accuracy is imperfect)
- GPS > 2km outside zone: -20 pts, flag for admin review
- GPS not available (offline submission): no penalty, but noted in verification details

**GPS Accuracy Check**
Device GPS provides an accuracy estimate in meters. Submissions with accuracy > 500m are downgraded in score (GPS was not reliable). Submissions with accuracy > 2000m are flagged.

**Impossible Speed Detection**
If a user submits from Location A and then from Location B within an interval that would require physically impossible travel speed (e.g., 50km in 10 minutes), both submissions are flagged and held for admin review.

## Defense Layer 4: Device & Identity Integrity

**Device Fingerprinting**
At app installation, a device fingerprint is computed from: user-agent string, screen resolution, color depth, timezone, available fonts (from Canvas fingerprinting). This fingerprint is stored with the user profile.

A single device fingerprint associated with more than 3 user accounts triggers a flag on all associated accounts. This detects a coordinator registering ghost accounts on their own phone.

Note: Device fingerprinting is not foolproof (can be spoofed with effort) but raises the cost of multi-account fraud substantially.

**Phone Number Uniqueness**
Phone number authentication prevents easy account duplication. One phone number = one account. Firebase Auth enforces this at the authentication layer.

**KYC Tiering**
Users begin at KYC Level 0 (phone-verified only) with lower daily credit caps. NGO admin can upgrade to KYC Level 1 (verified in person by field officer) which unlocks higher earning limits. This creates an incentive for legitimate workers to undergo identity verification.

| KYC Level | Daily Credit Cap | Verification |
|---|---|---|
| 0 | 30 credits | Phone OTP only |
| 1 | 100 credits | NGO field officer verification |
| 2 | Unlimited | Government ID + NGO verification |

## Defense Layer 5: Behavioral Scoring

**Suspicion Score**
Each user has a cumulative `fraudFlags.suspicionScore` (0–100). Triggers that increase score:
- GPS outside zone: +5
- Rate limit exceeded: +3
- EXIF timestamp mismatch: +8
- Duplicate photo hash: +20
- Impossible speed: +15
- Admin manual rejection: +10

Triggers that decrease score:
- 30 consecutive clean submissions: -5
- NGO admin manually approves a flagged submission: -3
- Identity upgraded to KYC Level 1: -10

**Status Transitions:**
- Score 0–30: Clear (normal operation)
- Score 31–60: Watchlist (all submissions go through stricter rule weighting; admin notified weekly)
- Score 61–100: Suspended (submissions rejected pending manual review; NGO admin alerted immediately)

**Admin Escalation Rules:**
- Single submission score < 40: immediate admin notification in dashboard
- User suspicion score crosses 60: immediate alert email to NGO admin
- 3+ flagged submissions in 7 days: automatic watchlist upgrade
- Coordinator fraud detection (admin account approving >90% of their own team's submissions without notes): system alert to organization owner

## Why This Is Sufficient for MVP Trust

The fraud system described above does not require AI, satellite imagery, or blockchain anchoring. It achieves its purpose by raising the cost and complexity of fraud for the most common attack vectors in community conservation programs.

For the MVP, **the minimum viable fraud bar is: substantially harder to game than a paper logbook**. The system described exceeds this bar by a significant margin. A guardian who wants to fake patrol submissions now faces: photo hash tracking, EXIF timestamp validation, geofence checks, rate limits, historical baseline comparisons, and device fingerprinting — all of which must be successfully circumvented simultaneously for a fraudulent submission to score above the auto-approval threshold.

Sophisticated fraud will still occur. The system is designed to **surface anomalies for human review**, not to achieve perfect automated fraud prevention. NGO field officers remain the final verification layer. ConservationCred makes their job dramatically easier by automatically routing only the most suspicious 10–15% of submissions to their attention.

---

# 8. Digital Wallet & Financial Inclusion Layer

## The ConservationCred Unit

A ConservationCred (CC) is a non-transferable, non-redeemable digital point unit within the ConservationCred platform ecosystem. It is explicitly **not a currency and not a cryptocurrency**. It is a behavioral metric unit that:

1. Records the accumulation of verified conservation labor
2. Unlocks platform features (literacy modules, savings tools, credit profile features)
3. Functions as the primary metric in the community leaderboard
4. Contributes to the user's alternative credit profile
5. Can be converted to real cash payouts by NGO partners who choose to configure cash redemption (this is an optional NGO feature, not a platform default)

**The critical design decision:** ConservationCreds are designed as an engagement and literacy unlocking mechanism first, and a potential payment proxy second. This keeps the platform out of money transmission regulation while still creating meaningful economic value for workers.

## Earning Logic

Credits are awarded by a server-side Cloud Function after verification passes. The credit rate is configured per-organization by the NGO admin.

**Default Rate Card (configurable):**
| Activity | Unit | Default CC |
|---|---|---|
| Snare removal | Per snare | 5 CC |
| Patrol log | Per patrol | 10 CC |
| Wildlife sighting (rare species) | Per verified sighting | 20 CC |
| Wildlife sighting (common species) | Per verified sighting | 5 CC |
| Nest monitoring | Per nest check | 8 CC |
| Illegal activity report | Per verified report | 25 CC |
| Habitat restoration | Per session | 15 CC |

**Streak Multipliers:**
- 3-day streak: +5% bonus
- 7-day streak: +10% bonus
- 14-day streak: +15% bonus
- 30-day streak: +25% bonus

**Literacy Completion Bonuses:**
- Each completed module: 50 CC
- Module quiz perfect score: +10 CC bonus
- Level-up (complete all modules in a tier): 100 CC

## Savings Simulation Engine

The Savings Simulation is a behavioral finance tool built into the wallet. It is **not a real savings account** — it is a simulated savings experience designed to build saving habits and demonstrate compound progress.

**Mechanics:**
- Worker can designate a portion of their CC earnings as "Saved" (visually moved to a separate savings pool within the app)
- Saved credits earn a simulated "yield" of 5% per month within the platform (purely digital, not real interest)
- The savings pool is visualized as a growing container — water level or plant growth metaphor for low-literacy users
- Weekly prompts remind the user of their savings goal and current progress
- Savings consistency metric: percentage of weeks in the past 12 in which the user moved credits to savings at least once

**Behavioral Finance Mechanics Employed:**
- **Mental accounting:** Separate "savings" and "spending" buckets create psychological separation even within a single balance
- **Goal visualization:** Users set a named savings goal (e.g., "School Fees") with a target number; progress bar shows % completion
- **Loss aversion framing:** If savings consistency drops below 70%, user receives a message framed as loss ("Your savings goal is at risk") not just absence of gain
- **Variable reward:** Streak bonuses and literacy completion bonuses arrive unpredictably enough to maintain engagement (partial schedule of reinforcement)
- **Social proof:** Leaderboard shows community members' literacy levels and streak badges — creating positive peer pressure around financial engagement

## Alternative Credit Profile Creation

The ConservationCred profile, accumulated over time, constitutes a non-traditional credit data record with the following dimensions:

| Dimension | What It Measures | Proxy For |
|---|---|---|
| Verified activity rate | % of submissions that pass verification | Work ethic, consistency |
| Activity frequency | Avg. activities per month | Income regularity |
| Streak history | Longest and recent streaks | Behavioral consistency |
| Literacy completion | % of modules completed | Financial sophistication |
| Savings consistency | % of weeks with savings movement | Savings propensity |
| Platform tenure | Months since first verified submission | Stability |
| Fraud score | Current suspicion score (inverse) | Trustworthiness |

This profile is stored in structured form in Firestore and can be shared (with user consent) via a shareable read-only profile link or an API endpoint for MFI integration.

---

# 9. Financial Literacy Engine

## Design Principles

The financial literacy engine is built on five non-negotiable principles for the target population:

1. **Audio-first**: Every text element has a playable audio version in the user's language. Literacy levels vary widely; visual and audio modalities reduce barriers.
2. **Micro-learning**: Each module consists of 4–7 screens. Total completion time under 8 minutes. Designed for mobile consumption between patrol tasks.
3. **Contextually relevant**: Examples use conservation income contexts, not urban employment contexts. "You earned 200 ConservationCreds this month — here's how to think about that."
4. **Progressive unlocking**: Modules unlock based on platform activity, not payment. This makes literacy an earned benefit of conservation participation.
5. **Immediately applicable**: Each module ends with a single action step the user can take in the app right now (e.g., "Set your first savings goal").

## Module Library (Phase 1 — 5 Modules)

### Module 1: What Is a Digital Wallet?
**Unlock:** Available at registration (no requirements)
**Screens:** 5
**Completion Bonus:** 25 CC
**Content:** What a digital wallet is; how ConservationCreds work; how to read your balance; what transactions mean; how to check your history.
**Action Step:** Check your wallet balance and find your first credit transaction.

### Module 2: Why Saving Matters
**Unlock:** 50 CC balance + 5 verified submissions
**Screens:** 5
**Completion Bonus:** 50 CC
**Content:** Difference between spending and saving; the concept of a savings goal; how small regular saves create large future funds; a simple story ("Chanda saves 10 CC every week for 6 months..."); introduction to the savings simulator.
**Action Step:** Create your first savings goal in the app and move your first credits to savings.

### Module 3: Understanding Credit
**Unlock:** Module 2 complete + 100 CC balance
**Screens:** 6
**Completion Bonus:** 50 CC
**Content:** What a loan is; how interest works (illustrated with a simple visual); what makes someone creditworthy; how your ConservationCred activity builds your credit profile; what a good credit score means for your future.
**Action Step:** Check your credit profile in the app and see how your conservation work has built it.

### Module 4: Budgeting Your Income
**Unlock:** Module 3 complete + 30 days of activity
**Screens:** 7
**Completion Bonus:** 75 CC
**Content:** What a budget is; how to categorize income and expenses; the 50-30-20 rule adapted for conservation workers; how to handle irregular income months; what happens when you don't budget.
**Action Step:** Use the budget calculator in the app to plan this month's income and expenses.

### Module 5: Protecting Against Fraud
**Unlock:** Module 4 complete + KYC Level 1
**Screens:** 5
**Completion Bonus:** 75 CC
**Content:** What financial fraud looks like; common scams targeting rural workers; how to protect your account; what legitimate financial services look like vs. scams; how to report suspicious activity.
**Action Step:** Review your account security settings and enable your backup PIN.

## Quiz Engine

Each module quiz has 4–8 multiple choice questions. Each question has a single image or icon, one audio question, and 3 answer options (displayed as large tap targets). Pass threshold: 60%. Unlimited retries, but only the first attempt awards the full bonus CC.

Results are stored in `/literacy_completions/{userId}_{moduleId}` with score, attempts, completion timestamp.

## Offline Access

All module content (text, images, audio files) is bundled into the PWA service worker cache on first successful module unlock. Users can complete modules offline. Quiz results sync on next connectivity.

---

# 10. Admin & NGO Dashboard

## Dashboard Architecture

The admin dashboard is a separate view within the same React PWA, accessible only to users with `role: "ngo_admin"` or `role: "org_owner"`. It is designed for desktop-first use (field officers at laptops in regional offices) while remaining functional on mobile for field spot-checks.

## Core Dashboard Modules

### Submission Verification Queue

The queue shows all submissions with status `flagged` or `pending` in reverse chronological order.

Each queue item shows:
- Guardian name and photo
- Activity type and quantity
- Submitted photo (full resolution available on click)
- Verification score and breakdown (which rules passed/failed)
- GPS map view showing submission location vs. assigned patrol zone
- EXIF timestamp vs. submission timestamp
- Guardian suspicion score and history
- Action buttons: Approve | Reject | Request Clarification

The queue supports bulk actions: approve all > score 60, reject all < score 40.

### Fraud Alert Center

Real-time alerts panel showing:
- Users whose suspicion scores crossed 60 in the last 24 hours
- Submissions with exact photo hash duplicates (critical alert)
- Submissions with impossible speed flags
- Multi-account detection alerts
- Any submission flagged by admin-level rules (coordinator self-approving)

Each alert links directly to the relevant submission and user profile.

### Guardian Performance Panel

Per-guardian view showing:
- Monthly submission counts (last 6 months bar chart)
- Verification rate trend
- Credit earnings history
- Literacy progress
- Current suspicion score
- Last GPS submission location on map

Sortable and filterable by: verification rate, activity level, fraud score, registration date, patrol zone.

### Impact Metrics Dashboard

Organization-level aggregated metrics:
- Total verified conservation activities (all time, this month, this week)
- Total ConservationCreds awarded
- Active guardians (activity in last 30 days)
- Fraud rejection rate (% of submissions auto-rejected or admin-rejected)
- Guardian verification rate distribution (histogram)
- Financial literacy completion rates
- Savings simulation adoption

Time-series charts for all key metrics, exportable as CSV.

### Map Visualization

A simple Leaflet.js map showing:
- Guardian patrol zones (GeoJSON polygons)
- Submitted activity locations (clustered dots, color-coded by activity type)
- Rejected/flagged submissions (red dots)
- Auto-approved submissions (green dots)
- Guardian home base locations (if enabled)

This map provides intuitive geographic QA — unusual clustering or suspicious patterns are visually obvious.

### Donor Reporting Tools

Automated report generation:
- "Last 30 Days Impact Report" (PDF): summary metrics, activity breakdown, guardian count, map snapshot
- "Grant Period Report" (custom date range): detailed activity log, fraud rates, financial inclusion metrics
- Donor-shareable summary URL: a read-only dashboard view with the organization's public metrics (guardians can opt out of photo inclusion)

### Export Systems

- CSV export: all verified submissions for a date range
- Guardian activity export: per-guardian summary spreadsheet
- Firestore backup export (org-scoped): full data export for data portability

---

# 11. UX/UI Strategy

## Low-Literacy UX

Conservation workers in the target population may have primary school literacy at best, and may be reading in a second or third language. The UI must not assume reading ability as a prerequisite for core functionality.

**Icon-first navigation:** The five core activity types are represented by large, culturally appropriate icons (a trap image for snares, a binocular image for wildlife sightings, etc.) with text labels beneath. The label is supplementary, not primary.

**Color coding:** Activity states use consistent, globally intuitive color coding. Green = approved/successful. Orange = pending/review. Red = rejected/error. These are used consistently across all screens, never inverted.

**Progress visualization:** Wallet balance is displayed as a large number and as a visual "fill level" graphic. Credit growth is shown as a rising level in a container — similar to a fuel gauge — which communicates progress without numeric literacy.

**One action per screen:** Each screen has exactly one primary action. No screen presents competing choices or requires reading multiple options. Decision fatigue is minimized.

## Low-Bandwidth Optimization

**Progressive image loading:** Activity photos are uploaded in two passes: a compressed thumbnail first (to confirm receipt and begin processing) and the full image second (background upload). This prevents a poor connection from blocking submission flow.

**Text-heavy content over media:** Literacy module audio is the only non-essential media asset. Images in modules are small, compressed illustrations. No video content in Phase 1.

**Delta sync:** Firestore's offline persistence and delta sync means the app only transfers changed data, not full datasets, on reconnect.

**App bundle size target: under 300KB initial load.** No heavy animation libraries, no unnecessary dependencies.

**Lazy loading:** The admin dashboard is only loaded for admin users. All guardian-facing modules are loaded on demand.

## Multilingual Accessibility

Phase 1 targets three languages: English, Swahili (East Africa pilot), and a third language determined by pilot NGO partner (e.g., French for West Africa, Bemba for Zambia).

All user-facing strings are stored in locale JSON files. The `locale` field in the user document determines rendering language. Language selection is available in settings and is presented at onboarding.

Audio content for literacy modules is recorded by native speakers, not synthesized (synthesized audio has poor comprehension rates for rural users in many African languages).

## Trust-First Design

**NGO branding integration:** The app displays the NGO partner's name and logo prominently. Users onboard through a reference code provided by their NGO. This leverages existing trust relationships.

**Transparency in verification:** When a submission is verified, the user sees exactly which checks passed. When a submission is flagged, the user sees a non-accusatory explanation: "Your photo location didn't match your patrol area. This happens sometimes with GPS. Your coordinator will review it."

**Verification receipt:** Every verified submission generates a unique reference number. Users can show this number to their field coordinator as proof of submission.

**No dark patterns:** No notifications designed to trigger anxiety, no manipulative opt-in language. Push notifications are opt-in and limited to: credit awards, submission status updates, literacy reminders (max 1/day), and streak encouragement.

## Mobile-First Workflow

Target device: mid-range Android (4–6 inch screen, 2–3GB RAM).

Touch targets: minimum 48px × 48px for all interactive elements.

Bottom navigation bar with 4 items (Home, Log Activity, Learn, Profile) — never more than 2 taps to any core function.

Swipe gesture support for moving between literacy module screens.

Form inputs: minimal text entry. Numeric inputs use large keypad overlays. Selection inputs use full-screen radio-button lists.

---

# 12. MVP Scope Definition

## What IS Included in MVP

**Guardian-facing (mobile PWA):**
- Phone number OTP registration and login
- Conservation activity submission (5 activity types)
- Photo capture with automatic EXIF extraction
- GPS location capture
- Offline queue with background sync
- Real-time wallet balance display
- Transaction history (last 20 entries)
- 5 financial literacy modules with audio
- Savings simulator (goal-setting + weekly savings movement)
- Community leaderboard (weekly, org-scoped)
- Achievement badges (streak, literacy milestones)
- Profile view (verification rate, credit profile summary)

**Backend:**
- Full verification pipeline (all 5 defense layers described above)
- Credit award system with rate card configuration
- Photo hash duplicate detection
- Device fingerprint collection
- Leaderboard computation (hourly)
- Credit profile computation (daily)
- Push notifications (FCM)

**Admin/NGO Dashboard:**
- Submission queue with approve/reject/review actions
- Basic fraud alerts (critical flags only)
- Guardian performance overview
- Organization-level impact metrics
- CSV data export
- Simple Leaflet.js map of submission locations

## What is NOT Included in MVP

- Real cash payouts / mobile money integration (Phase 2)
- External MFI API integration (Phase 2)
- Carbon credit data linkage (Phase 3)
- Advanced perceptual image hashing (Phase 2)
- Multi-language admin dashboard (Phase 2 — admin team is assumed English-capable)
- AI-generated impact reports (Phase 3)
- Donor-facing public dashboard portal (Phase 2)
- SMS fallback for no-data situations (Phase 2)
- iOS native app (PWA covers this use case)
- Peer-to-peer credit transfers between guardians

## Technical Tradeoffs

| Decision | Choice | Rationale |
|---|---|---|
| Auth method | Phone OTP only | Eliminates email literacy requirement |
| Database | Firestore | Real-time, offline-capable, scalable |
| Media storage | Firebase Storage | Integrated, cheap, secure |
| Hosting | Vercel | Free tier sufficient for demo, fast global CDN |
| Maps | Leaflet.js (free) | No Google Maps API billing |
| Image hashing | SHA-256 (exact only) | Simple, fast, no server compute overhead |
| Push notifications | FCM (Firebase) | Free, reliable on Android |
| Geofencing | Client-side ray casting | No external API dependency |

## Fastest Route to Deployable Demo

A working hackathon demo can be produced in 72 hours with the following priority build order:

**Hour 0–8:** Firebase project setup, auth flow, basic submission form with photo capture.
**Hour 8–20:** Verification pipeline Cloud Function (simplified: timestamp check + GPS check + rate limit only), credit award function, wallet balance display.
**Hour 20–36:** Literacy module 1 and 2 (content only, no quiz scoring), savings goal simulator, leaderboard computation.
**Hour 36–50:** Admin dashboard: submission queue + approve/reject + basic metrics.
**Hour 50–60:** Polish: offline queue, push notifications, UI refinement, demo data seeding.
**Hour 60–72:** Testing, bug fixes, demo rehearsal, impact metrics panel.

---

# 13. Technical Roadmap

## Phase 1: Hackathon/Pilot MVP (0–3 months)

**Objective:** Functional demo + limited field pilot with 1 NGO partner, 20–50 guardians, in a single geographic location.

**Deliverables:**
- Full guardian PWA (submission, wallet, literacy, leaderboard, profile)
- Full verification pipeline (5 defense layers)
- NGO admin dashboard (queue, alerts, metrics, map)
- Firestore schema as documented above
- 5 literacy modules (English + 1 local language)
- Onboarding flow for NGO + guardian registration

**Technical Dependencies:**
- Firebase project provisioning (Blaze plan for Cloud Functions)
- FCM push notification configuration
- SSL certificate for Vercel deployment
- NGO partner: patrol zone GeoJSON data, activity type configuration, credit rate card

**Team:** 2 full-stack engineers, 1 designer, 1 field operations coordinator (NGO liaison)

**Success Metrics:**
- 90%+ of test submissions correctly verified/rejected by automated pipeline
- Guardian onboarding time under 5 minutes
- Offline sync success rate > 95%
- No critical fraud system bypass found in internal testing

---

## Phase 2: Market Expansion (3–12 months)

**Objective:** Scale to 5–10 NGO partners, 500–2000 guardians, 3 countries.

**New Technical Deliverables:**
- Mobile money integration (M-Pesa, MTN Mobile Money) for optional cash credit redemption
- Perceptual image hashing (pHash) upgrade to duplicate detection
- SMS fallback for areas with no mobile data (USSD or SMS-based submission for lowest connectivity environments)
- External MFI API (standardized credit profile share endpoint with consent management)
- Donor portal (read-only dashboard for grant reporting)
- Android app wrapper (TWA — Trusted Web Activity) for better offline performance on low-end devices
- Multi-language admin dashboard (French, Portuguese)
- Enhanced fraud analytics: time-series anomaly detection (rule-based, no ML — statistical threshold alerts)
- Webhook system for NGO integration with existing program management tools

**Business Development Dependencies:**
- MFI partner agreements (credit data sharing MOU)
- Mobile money API partnerships (M-Pesa Enterprise, MTN Business)
- 3+ NGO SaaS contracts signed
- Donor transparency feature: foundation partner feedback integrated

**Team Addition:** 1 additional engineer, 1 partnerships manager, 1 data/impact analyst

---

## Phase 3: Platform Maturity (12–36 months)

**Objective:** 50+ NGO partners, 50,000+ guardians, 15+ countries.

**New Technical Deliverables:**
- Carbon credit data bridge: ConservationCred activity logs as provenance data for voluntary carbon markets (Verra, Gold Standard compatibility research)
- Open API for third-party developer access to aggregated (anonymized) impact data
- Advanced reporting: automated PDF impact reports with narrative generation
- IoT bridge (optional): integration with ranger body-worn camera systems where available
- Behavioral analytics engine: rule-based identification of high-performing guardian profiles for NGO recruitment recommendations
- Regional data residency: country-specific Firestore instances for data sovereignty compliance
- Formal financial product integration: bank account opening pathways via partner banks in key markets

---

# 14. Go-To-Market Strategy

## Phase 1 NGO Partnership Strategy

The fastest path to field validation is through existing NGO relationships, not cold outreach.

**Target NGO Profile:** Organization with existing community ranger program, 20–200 guardians, current pain with manual reporting, donor accountability pressure, English-language operations.

**Outreach Sequence:**
1. Identify 10 target NGOs via Conservation Finance Alliance, African Wildlife Foundation partner list, WWF community program directories.
2. Approach their program managers (not executive directors) with a 2-page product brief and a demo link.
3. Offer a free 6-month pilot with zero-cost migration from their existing paper/spreadsheet system.
4. Provide hands-on onboarding support: GeoJSON patrol zone mapping, rate card configuration, guardian registration event.
5. Collect weekly feedback. Iterate aggressively.

**Value proposition for NGO:** "You get a fraud-resistant reporting system, a donor-ready impact dashboard, and a guardian engagement tool — at no cost for the pilot. In exchange, we need your program data to validate our model."

## Grassroots Guardian Onboarding

Guardian onboarding happens through the NGO, not directly. This is critical for trust.

The NGO field officer introduces the app at a community meeting, demonstrates it, and provides a program-specific registration code. The field officer is the trust proxy — guardians adopt the app because their known and trusted NGO partner is endorsing it, not because of ConservationCred's brand.

This channel keeps customer acquisition cost effectively zero for the guardian segment.

## Donor Adoption Strategy

Donors are not ConservationCred's paying customers (NGOs are). But donors are the NGO's customers — and NGOs adopt ConservationCred partly to deliver better donor outcomes.

**Donor proof points to enable:**
- Case study documentation from pilot NGO: before/after reporting quality
- Sample donor impact report (generated from pilot data)
- Testimonial from pilot NGO program director
- NGO's donor accepting the ConservationCred dashboard as a reporting substitute (i.e., donor validates transparency value)

Target: present at Conservation Finance Alliance annual conference, wildlife philanthropy forums, IUCN World Conservation Congress side events.

## Pricing & NGO SaaS Model

**Free tier:** Up to 25 guardians, 5 activity types, basic dashboard. Perpetually free for small community programs.

**Basic tier ($299/month):** Up to 100 guardians, all activity types, full fraud detection, donor reporting, data export, email support.

**Pro tier ($899/month):** Up to 500 guardians, multi-zone support, MFI integration, custom literacy modules, priority support, white-label option.

**Enterprise (custom):** Park authority or government programs, 500+ guardians, custom integrations, on-site training.

---

# 15. Impact Measurement Framework

## Conservation Impact KPIs

| Metric | Measurement Method | Target (Year 1 per NGO partner) |
|---|---|---|
| Verified conservation activities | Firestore aggregate: approved submissions | 2,000/month/partner |
| Snares removed | Sum of verified snare_removal quantities | 500/month/partner |
| Illegal activity reports | Count of verified illegal_activity_report | 20/month/partner |
| Patrol coverage area | Union of GPS submission locations (km²) | Measurable baseline established |
| Guardian retention rate | % of guardians active 30 days after onboarding | >80% |
| Guardian activation rate | % of registered guardians with 1+ verified submissions | >90% |

## Fraud Prevention KPIs

| Metric | Target |
|---|---|
| Auto-verification rate (no human review needed) | >85% of valid submissions |
| Duplicate photo rejection rate | 100% of detected duplicates blocked |
| False positive rate (legitimate submissions flagged) | <10% |
| Admin review time per flagged submission | <5 minutes |
| Program fraud rate (fraudulent submissions as % of total) | <5% (vs. industry status quo ~20%) |

## Financial Inclusion KPIs

| Metric | Target (Year 1) |
|---|---|
| Guardians with active digital wallets | 100% of registered guardians |
| Average monthly CC earnings per guardian | 200+ CC |
| Financial literacy module completion rate | >60% of active guardians complete Module 1 |
| Guardians completing all 5 modules | >20% of active guardians |
| Guardians with savings goal set | >50% of active guardians |
| Savings simulation consistency (weekly) | >60% among savings goal users |
| Credit profiles shared with MFI partner | >10% of eligible guardians (Phase 2) |
| Micro-loans approved using ConservationCred data | Tracked, target 50+ in Year 2 |

## SDG Mapping

**SDG 1 — No Poverty:** ConservationCred directly supplements income for communities near protected areas. Reliable digital income supplements irregular cash earnings. Credit profile creation unlocks access to formal financial services.

**SDG 8 — Decent Work and Economic Growth:** Conservation labor is formalized as recognized economic work with verifiable digital records. Workers build employment histories. Financial literacy modules build economic capability.

**SDG 9 — Industry, Innovation and Infrastructure:** ConservationCred builds digital financial infrastructure in communities that lack it. The platform is designed for emerging market mobile infrastructure constraints.

**SDG 10 — Reduced Inequalities:** The platform specifically targets populations excluded from formal financial systems. Alternative credit data democratizes access to financial services without requiring conventional credit history.

**SDG 15 — Life on Land:** The core function of the platform is to financially incentivize verified conservation behavior. More effective incentivization → more sustained conservation participation → better biodiversity outcomes.

---

# 16. Business Model

## Revenue Streams

**Stream 1: NGO SaaS Subscriptions (Primary)**
Monthly recurring revenue from NGO and park authority subscribers. Target ACV (Annual Contract Value): $3,600–$10,800 depending on tier. With 50 NGO partners by Year 3, this generates $180K–$540K ARR from subscriptions alone.

**Stream 2: Verification Overage Fees**
Tier-limited submissions per month. Overages billed at $0.10/submission. High-activity programs generate meaningful overage revenue.

**Stream 3: Donor Transparency Add-On**
Premium feature for NGOs on Basic+ plans: a branded donor portal showing real-time impact metrics. Premium access: $99/month. Unlocks ConservationCred's value to donors directly.

**Stream 4: MFI Credit Data Partnership Fees**
Microfinance institutions pay a per-inquiry fee ($2–$5) to access ConservationCred credit profiles for loan application processing. Revenue sharing: 50% to ConservationCred, 50% to the NGO whose program generated the data. User consent required.

**Stream 5: Grant Funding (Non-Revenue)**
Conservation tech, financial inclusion, and social impact grants from foundations (MacArthur Foundation, Omidyar Network, Skoll Foundation, CGAP) provide non-dilutive capital for early operations and product development. This is not a permanent revenue stream but de-risks the early years.

## Unit Economics (Steady State)

| Metric | Estimate |
|---|---|
| CAC (NGO) | $500 (sales + onboarding) |
| ACV (NGO, average) | $5,400 |
| Payback period | 1.1 months |
| Gross margin (SaaS) | ~75% |
| Guardian CAC | ~$0 (NGO-driven onboarding) |

## Sustainability Strategy

ConservationCred is designed to reach operational sustainability at 30 paying NGO partners. Below that, grant funding bridges the gap. The SaaS model has strong unit economics because marginal delivery cost (additional guardian, additional submission) is near-zero once the platform is built.

The platform becomes more valuable — and more difficult to replace — as guardian data accumulates. A guardian with 24 months of ConservationCred history is not going to switch to a competing platform, because their credit profile history is non-portable. This creates strong retention dynamics.

---

# 17. Competitive Advantage

## Competitive Landscape

### vs. NGO Cash Payment Programs

Cash programs have no real-time verification, high corruption rates, no financial identity creation, and no literacy component. They are the default because of institutional inertia, not because they work well.

ConservationCred's advantage: fraud reduction, instant digital acknowledgment, credit profile creation, financial literacy integration — at comparable or lower cost per guardian than cash administration.

### vs. SMART Patrol Management (Spatial Monitoring and Reporting Tool)

SMART is a ranger patrol management system used by large conservation organizations. It is designed for institutional data collection, not worker incentivization. It has no wallet, no literacy layer, no credit profile, no leaderboard. It requires significant GIS expertise to operate. It is desktop-heavy and has poor offline mobile experience.

ConservationCred's advantage: worker-centric design, financial inclusion layer, usable by guardians without GIS training, PWA mobile-first with offline capability.

### vs. BioCarbon Registry / Voluntary Carbon Market Platforms

Carbon credit platforms focus on offset generation and institutional buyers. Community worker payments are a side note, not the core product. Verification processes are expensive, slow (months), and require site visits.

ConservationCred's advantage: worker-centric, near-instant credit award, low-cost verification, designed for community-scale programs rather than project-scale registry compliance.

### vs. General Microfinance Platforms

Microfinance platforms underwrite loans — they do not create the data needed to underwrite rural conservation workers. They are downstream consumers of credit data, not creators.

ConservationCred's advantage: generates the alternative credit data that microfinance platforms lack access to, creating a complementary rather than competitive relationship.

## The Moat

**Data moat:** As the platform scales, ConservationCred accumulates the world's only longitudinal alternative credit dataset for rural conservation workers. This dataset is unique, difficult to replicate, and increasingly valuable to MFI partners, carbon market buyers, and impact investors.

**Trust moat:** Guardian trust is earned through the NGO partner relationship. Once an NGO has onboarded their guardians to ConservationCred, replacing the platform means asking guardians to lose their credit history and savings records and start over — a high switching cost.

**Network moat:** As more MFIs accept ConservationCred profiles, more guardians want to build their profiles. As more donors use ConservationCred dashboards, more NGOs want to adopt the platform. The value of every new node increases the value of the entire network.

---

# 18. Risk Analysis

## Fraud Risks

**Risk:** Sophisticated guardians discover ways to bypass multiple verification checks simultaneously.
**Mitigation:** Layered defense means bypassing any single layer doesn't constitute a successful fraud. Admin review is the final layer. Behavioral scoring catches patterns over time even if individual submissions pass. High-fraud users are watchlisted and eventually suspended.

**Risk:** NGO admin coordinator sells "approvals" to guardians for kickbacks.
**Mitigation:** Admin action logs are recorded and visible to organization owner. Unusual approval patterns (admin approving 95%+ of their own region's flagged submissions) trigger alerts. Multiple admin accounts per region prevent single points of corruption.

## Adoption Risks

**Risk:** Guardians distrust the platform and refuse to use it.
**Mitigation:** Trust is borrowed from NGO partners. Guardian onboarding is NGO-led. The platform is presented as an NGO tool, not a tech startup tool. No payment promises are made that could be broken.

**Risk:** NGO staff resist adopting a new system when spreadsheets "work fine."
**Mitigation:** Donor pressure for impact transparency is a forcing function. The platform's value proposition to NGOs is not just internal efficiency — it's the ability to report more credibly to donors. Donor demand creates NGO demand.

## Technical Risks

**Risk:** Firebase service outage affects submission processing.
**Mitigation:** Offline queue means guardian data is never lost. Submissions queue locally and sync when service returns. Firestore SLA is 99.95% uptime.

**Risk:** Photo storage costs escalate with scale.
**Mitigation:** Photo compression enforced client-side (max 800px, compressed JPEG). At 1000 guardians × 10 photos/day × 50KB/photo = 500MB/day = ~15GB/month = ~$3.60/month in Firebase Storage at current pricing. Storage costs are manageable for years.

**Risk:** Cloud Function cold starts cause slow verification on low-usage deployments.
**Mitigation:** Use minimum instance configuration (keep 1 function warm at all times). Cost is minimal at scale of Phase 1.

## Operational Risks

**Risk:** NGO partner exits program, leaving guardians with an orphaned account.
**Mitigation:** Credit history is user-owned, not NGO-owned. If an NGO account is deactivated, guardian history remains accessible. Guardians can request data export at any time.

**Risk:** Connectivity is too poor in target areas for PWA to function.
**Mitigation:** Offline-first design means the app functions fully without connectivity. Sync occurs when data is available. Phase 2 adds SMS fallback for extreme low-connectivity environments.

## Regulatory Risks

**Risk:** ConservationCreds are classified as a regulated financial instrument (e-money, cryptocurrency) in a target market.
**Mitigation:** ConservationCreds are explicitly non-transferable and non-redeemable by design. They unlock platform features; they are not transferable to third parties. Cash payouts (Phase 2) flow through licensed mobile money operators (M-Pesa, MTN Mobile Money) who hold the relevant licenses. Legal review is required per country before any cash redemption feature launches.

**Risk:** Data privacy regulations (e.g., Kenya Data Protection Act, GDPR for European NGO partners) impose compliance burden.
**Mitigation:** Firestore data is organized to enable easy data deletion per user request. GPS coordinates are stored with user permission, clearly disclosed in onboarding. A data processing agreement is included in NGO contracts. African data protection landscape monitoring is part of the legal function.

---

# 19. Demo Narrative

## "The Day Amara Got Paid"

*The hackathon judges are watching. The screen shows a satellite map of a wildlife corridor in Zambia. The presentation begins.*

---

**SCENE 1: THE MORNING PATROL — 6:14 AM**

Amara wakes before dawn, laces her boots, and walks into the forest. She's done this route four times a week for eighteen months. She finds what she feared — three wire snares set near a watering hole. She photographs each one, removes them, and bags them for the ranger station.

She opens her phone. No data out here. She opens ConservationCred.

*[Demo: Show the app opening from the home screen. Service worker loads from cache. The UI appears instantly.]*

She taps "Log Activity." She selects the snare icon. She enters "3." She photographs the snares. She taps submit.

*[Demo: Show the photo upload and offline queue animation. "Saved — will sync when you're connected."]*

A green banner appears: **"Patrol saved. You'll earn credits once verified."**

---

**SCENE 2: THE SYNC — 7:48 AM**

Amara emerges from the tree line and her phone catches a signal. In the background, ConservationCred silently syncs her submission to Firebase.

*[Demo: Slow motion of the sync animation.]*

---

**SCENE 3: THE VERIFICATION — 7:49 AM**

*[Demo: Switch to a code/function animation showing the verification pipeline in action.]*

The Cloud Function fires. It checks:
- EXIF timestamp: 6:23 AM. Submission at 7:49 AM. Delta: 86 minutes. ✓ Pass.
- GPS coordinates: 15.2° S, 26.1° E. Patrol zone boundary: within 400 meters. ✓ Pass.
- Photo hash: not found in duplicate index. ✓ Pass.
- Daily rate: 1 submission today, limit is 10. ✓ Pass.
- Device fingerprint: matches Amara's registered device. ✓ Pass.

Verification score: **91/100.** Status: **Auto-approved.**

---

**SCENE 4: THE MOMENT — 7:50 AM**

Amara's phone buzzes.

*[Demo: Show the push notification banner.]*

**"✓ Patrol verified! +15 ConservationCreds added to your wallet."**

She opens the app. Her balance: **255 ConservationCreds.** A small animation shows credits flowing into her wallet. Her streak counter reads: 8 days.

*[Pause for judges.]*

**In eighteen months of conservation work, Amara has never been acknowledged this fast. Never been paid this honestly. Never felt this seen.**

---

**SCENE 5: THE LEARNING — 8:00 AM**

Amara navigates to "Learn & Earn." She's been meaning to start Module 3 — "Understanding Credit." She qualified last week.

*[Demo: Show the module unlock screen, then the first content screen with audio playback.]*

She listens to the audio version in Bemba. She taps her way through 6 screens. She takes the quiz: 5/5.

**"Module Complete! +50 ConservationCreds. You've reached Financial Literacy Level 3."**

She sets a savings goal: "School fees — 500 ConservationCreds." She moves 50 credits to her savings pool.

---

**SCENE 6: THE DASHBOARD — Sipho's Office, 9:15 AM**

In Livingstone, Sipho opens the NGO admin dashboard on his laptop.

*[Demo: Switch to the dashboard view.]*

He sees: **42 verified submissions today. 3 pending review. 0 fraud alerts.**

He opens the map. 40 green dots scattered across two patrol zones. Two orange dots in a border area — GPS slightly outside the assigned zone. He clicks one. Guardian profile shows: **94% verification rate, 6-month history, zero fraud flags.** He clicks "Approve." Credits awarded automatically.

He pulls up the weekly donor report. One click generates a PDF: **"Week 34: 280 verified conservation activities, 42 active guardians, 3 snare-removal sessions, 1 illegal logging report."**

He emails it to their foundation donor. Three minutes of work, not three hours.

---

**SCENE 7: THE INVESTOR — 10:00 AM**

Dr. Rachel, the foundation program officer in Amsterdam, opens the ConservationCred donor portal for the Zambia program.

*[Demo: Show the read-only donor dashboard — activity charts, map, guardian count.]*

She sees live data: **1,847 verified conservation activities this month. 98.2% guardian verification rate. 23 financial literacy modules completed.**

She opens the grant renewal proposal. For the first time, she can **prove** that every dollar she recommended reached the ground.

She approves a 20% increase in grant funding.

---

**SCENE 8: THE LOAN — Month 9**

A rural MFI officer in Lusaka receives Amara's loan application. She has no bank account, no formal credit history. Normally this application would be rejected.

But Amara has consented to share her ConservationCred profile.

*[Demo: Show the credit profile export view.]*

The officer sees: **127 verified activities. 97% verification rate. Level 3 financial literacy. 8-month savings record. Zero fraud flags.**

**He approves a $120 agricultural loan.**

*[Pause.]*

Amara has never had a loan before. She buys maize seed and fertilizer. Her harvest doubles.

---

**CLOSE:**

*This is not a hypothetical. Every piece of this system is buildable today, with standard cloud infrastructure, no blockchain, no AI, no satellite imagery.*

*ConservationCred doesn't change what Amara does. She's been removing snares for two years.*

*It changes what her work means — economically, financially, permanently.*

*That's the product.*

---

# 20. Judge-Winning Narrative

## Why Judges Score This Highly

**Innovation (Score: 9/10)**
The innovation is not technical — it is architectural. ConservationCred innovates on the *combination* of: conservation labor verification + digital wallet + financial literacy + alternative credit profile. No existing platform combines these four elements. The insight that conservation participation and financial inclusion are not two separate problems but one connected opportunity is genuinely novel at the product level.

**Feasibility (Score: 9/10)**
Every technical component exists and is production-ready today. Firebase, Vercel, React PWA — these are proven technologies used at massive scale. The verification logic described requires no exotic infrastructure. A working demo can be built and deployed in 72 hours. Judges who ask "but can this actually work?" can be answered with a live, working demo on real devices.

**Scalability (Score: 8/10)**
Firebase's serverless architecture auto-scales without infrastructure management. The marginal cost of adding the 1,000th guardian is near zero. The business model (SaaS subscriptions from NGOs) scales independently of guardian count. The platform is designed for emerging market conditions (low bandwidth, low-literacy, intermittent connectivity) which are the conditions where most scalable impact opportunities exist.

**Social Impact (Score: 10/10)**
This is the platform's undeniable strength. The impact story is concrete, personal, and emotionally resonant. It addresses verified system failures (conservation incentive corruption, unbanked populations, donor transparency deficits) with a practical product intervention. Every element maps to documented SDGs. The demo narrative ("Amara's first loan") is exactly the kind of human story that wins impact category awards.

**Technical Execution (Score: 8/10)**
The fraud prevention system design demonstrates genuine systems thinking — not a surface-level feature list but a multi-layered defense architecture with specific rules, weights, scoring, and escalation logic. The Firestore schema design is thoughtful, normalized appropriately, and shows understanding of NoSQL data modeling. The offline-first architecture demonstrates knowledge of real-world mobile constraints in target markets.

**Design Thinking (Score: 9/10)**
The user persona development demonstrates empathy-driven design: starting from Amara's phone, her literacy level, her trust barriers, her data connection, and working backward to a product that serves her. The low-literacy UX principles (icon-first, audio-first, one action per screen) show design maturity. The trust-first design philosophy (NGO-branded onboarding, transparent verification results) shows understanding of adoption dynamics in trust-deficit environments.

**Sustainability (Score: 8/10)**
The SaaS model with NGO subscribers creates a clear revenue path that doesn't depend on donor subsidy in perpetuity. The unit economics (low CAC via NGO-driven onboarding, high retention via data lock-in) are favorable. The platform reaches sustainability at a scale (30 paying NGO partners) that is demonstrably achievable.

---

# 21. Investor Narrative

## Why This Can Scale Globally

Conservation labor exists on every continent. The problems ConservationCred solves — corrupt payment infrastructure, lack of financial identity for conservation workers, donor accountability deficits — are not specific to Zambia or East Africa. They are documented in Peru, Vietnam, Indonesia, Madagascar, Nepal, and dozens of other critical biodiversity areas.

The platform is explicitly designed to be culturally neutral at the infrastructure level, with localization (language, currency equivalent, activity types) configured per NGO partner. Scaling to a new country is a business development exercise (find NGO partners), not a re-engineering exercise.

## Why the Market Is Massive

The community conservation market is large and growing:

- Over 3 million community conservation workers globally (estimate based on IUCN, TRAFFIC, UNDP program data)
- Approximately $50 billion in annual global conservation finance, of which 3–5% flows to community-level programs
- The 30x30 commitment (30% of Earth protected by 2030, endorsed by 196 countries at COP15) will require an estimated 5–10× increase in community conservation programs
- Impact investment in nature-based solutions grew from $8.2B to $13.5B between 2019 and 2022 (OECD data) — the investor market for verified conservation outcomes is expanding rapidly

## Why Financial Inclusion + Conservation Is Powerful

The combination is powerful for a reason that neither sector has fully recognized: **conservation participation rates are positively correlated with income stability**. Communities that have reliable income from conservation participation are less likely to pursue extractive activities during conservation program gaps. Financial inclusion for conservation workers is not just a nice-to-have social benefit — it is a direct input into conservation effectiveness.

This means ConservationCred has a natural, defensible argument that financial inclusion investment generates conservation returns — which allows it to access funding from both conservation philanthropy (focused on ecological outcomes) and financial inclusion investors (focused on economic mobility). Most platforms can only access one of these capital pools. ConservationCred can access both.

## Long-Term Expansion Opportunities

**Carbon credit integration:** As voluntary carbon markets mature and demand for high-integrity community-verified nature-based credits grows, ConservationCred activity data becomes provenance evidence for carbon credit issuance. This creates a pathway to transaction fees on carbon credit sales — a large and growing market.

**Biodiversity offset markets:** Emerging regulatory frameworks (UK Biodiversity Net Gain, EU Nature Restoration Law) create compliance demand for verified community conservation activity data. ConservationCred is positioned as the infrastructure layer for this market.

**Government program digitization:** National park authorities and government-run conservation programs are under pressure to modernize their community engagement and reporting systems. ConservationCred can become the platform of record for government conservation labor programs, with large public sector contract potential.

**The alternative data franchise:** The ConservationCred alternative credit dataset, built over years, becomes a unique financial asset. Licensing this data (with appropriate consent and privacy frameworks) to credit bureaus, development finance institutions, and academic researchers creates a secondary revenue stream that grows with scale.

---

# 22. Appendix

## A. Sample Firestore Schema (Abbreviated)

```
/users/{uid}
  displayName: "Amara Banda"
  phone: "+260975000000" (hashed in storage)
  organizationId: "org_zambia_wildguard"
  patrolZoneId: "zone_north_corridor"
  wallet.balance: 355
  wallet.lifetimeEarned: 480
  fraudFlags.suspicionScore: 2
  fraudFlags.status: "clear"
  creditProfile.verificationRate: 0.97
  creditProfile.literacyLevel: 3

/submissions/{submissionId}
  userId: "uid_amara"
  activityType: "snare_removal"
  submittedAt: 2024-03-15T07:49:00Z
  exifTimestamp: 2024-03-15T06:23:00Z
  gpsCoordinates: { lat: -15.242, lng: 26.118 }
  photoHash: "a3f2c1d4..."
  quantityValue: 3
  verificationScore: 91
  verificationStatus: "approved"
  creditsAwarded: 15

/wallet_transactions/{txId}
  userId: "uid_amara"
  type: "activity_reward"
  amount: 15
  balanceBefore: 240
  balanceAfter: 255
  sourceSubmissionId: "sub_20240315_snare_03"
  createdAt: 2024-03-15T07:50:00Z
```

## B. Verification Logic Pseudocode

```javascript
async function verifySubmission(submissionId) {
  const sub = await getSubmission(submissionId);
  const user = await getUser(sub.userId);
  const org = await getOrg(sub.organizationId);
  
  let score = 0;
  const details = {};

  // Rule 1: Timestamp freshness (max 20pts)
  const timeDeltaHours = Math.abs(sub.submittedAt - sub.exifTimestamp) / 3600000;
  if (timeDeltaHours <= 4) { score += 20; details.timestamp = "pass"; }
  else if (timeDeltaHours <= 48) { score += 10; details.timestamp = "soft_flag"; }
  else { score -= 10; details.timestamp = "fail"; }

  // Rule 2: GPS in patrol zone (max 25pts)
  const zone = org.patrolZones.find(z => z.zoneId === user.patrolZoneId);
  if (zone && sub.gpsCoordinates) {
    const inZone = pointInPolygon(sub.gpsCoordinates, zone.polygon);
    const inBuffer = distanceToPolygon(sub.gpsCoordinates, zone.polygon) <= 2000;
    if (inZone) { score += 25; details.gps = "pass"; }
    else if (inBuffer) { score += 15; details.gps = "buffer"; }
    else { score -= 12; details.gps = "outside_zone"; flagUser(user.uid, 5); }
  } else {
    details.gps = "unavailable";
  }

  // Rule 3: Photo hash uniqueness (max 20pts)
  const isDuplicate = await checkPhotoHash(sub.photoHash);
  if (!isDuplicate) { score += 20; details.photoHash = "unique"; }
  else { score -= 20; details.photoHash = "duplicate"; flagUser(user.uid, 20); }

  // Rule 4: Daily rate check (max 15pts)
  const todayCount = await getDailySubmissionCount(user.uid, sub.activityType);
  const dailyMax = org.dailyLimits[sub.activityType] || 10;
  if (todayCount <= dailyMax) { score += 15; details.rateLimit = "pass"; }
  else { score += 0; details.rateLimit = "exceeded"; flagUser(user.uid, 3); }

  // Rule 5: Device consistency (max 10pts)
  if (sub.deviceId === user.deviceFingerprint) {
    score += 10; details.device = "match";
  } else {
    score += 0; details.device = "mismatch"; flagUser(user.uid, 5);
  }

  // Rule 6: Historical baseline (max 10pts)
  const historicalAvg = await getUserDailyAvg(user.uid, sub.activityType);
  if (!historicalAvg || todayCount <= historicalAvg * 3) {
    score += 10; details.baseline = "normal";
  } else {
    score += 0; details.baseline = "elevated"; flagUser(user.uid, 5);
  }

  // Route based on score
  const thresholds = org.fraudThresholds || { autoApprove: 70, autoReject: 40 };
  let status;
  if (score >= thresholds.autoApprove) {
    status = "approved";
    await awardCredits(sub.submissionId, user.uid, sub.activityType, sub.quantityValue);
  } else if (score < thresholds.autoReject) {
    status = "rejected";
    await notifyUser(user.uid, "submission_rejected");
  } else {
    status = "flagged";
    await addToAdminQueue(sub.submissionId);
  }

  await updateSubmission(submissionId, { verificationScore: score, verificationStatus: status, verificationDetails: details });
}
```

## C. Leaderboard Logic

```javascript
// Scheduled Cloud Function: runs every hour
async function updateLeaderboard(orgId) {
  const orgGuardians = await getGuardiansByOrg(orgId);
  const periodStart = getWeekStart(new Date());

  const rankings = await Promise.all(
    orgGuardians.map(async (guardian) => {
      const submissions = await getApprovedSubmissions(guardian.uid, periodStart);
      const totalCredits = submissions.reduce((sum, s) => sum + s.creditsAwarded, 0);
      return {
        userId: guardian.uid,
        displayName: guardian.displayName,
        verifiedActivities: submissions.length,
        credits: totalCredits,
      };
    })
  );

  rankings.sort((a, b) => b.verifiedActivities - a.verifiedActivities);
  rankings.forEach((r, i) => r.rank = i + 1);

  const periodId = `week_${periodStart.toISOString().split('T')[0]}`;
  await setLeaderboard(orgId, periodId, {
    periodType: "weekly",
    startDate: periodStart,
    rankings,
    lastUpdated: new Date()
  });
}
```

## D. Sample Wallet Transaction Structure

```json
{
  "transactionId": "tx_20240315_0001",
  "userId": "uid_amara_banda",
  "type": "activity_reward",
  "amount": 15,
  "balanceBefore": 240,
  "balanceAfter": 255,
  "sourceSubmissionId": "sub_20240315_snare_003",
  "createdAt": "2024-03-15T07:50:22Z",
  "description": "Snare removal — 3 snares verified",
  "streakBonus": {
    "streakDays": 8,
    "bonusRate": 0.10,
    "bonusAmount": 1.5
  }
}
```

## E. Sample Literacy Module JSON

```json
{
  "moduleId": "module_003",
  "title": {
    "en": "Understanding Credit",
    "sw": "Kuelewa Mkopo",
    "bem": "Kumvwikisha Ingamba"
  },
  "description": {
    "en": "Learn how credit works and how your conservation work is building your financial future."
  },
  "unlockRequirements": {
    "minCredits": 100,
    "minSubmissions30Days": 10,
    "prerequisiteModuleIds": ["module_001", "module_002"]
  },
  "completionBonus": 50,
  "passingScore": 0.6,
  "screens": [
    {
      "screenId": "m003_s01",
      "contentType": "text_with_image",
      "content": {
        "en": "Credit is when someone lends you money today and you repay it later. A good credit history means lenders trust you.",
        "audioUrl": "gs://conservationcred-audio/en/module003/screen01.mp3",
        "imageUrl": "gs://conservationcred-images/module003/screen01.webp"
      }
    }
  ],
  "quiz": [
    {
      "questionId": "m003_q01",
      "question": { "en": "What does good credit history show a lender?" },
      "options": [
        { "en": "That you have a lot of money" },
        { "en": "That you can be trusted to repay loans" },
        { "en": "That you own land" }
      ],
      "correctIndex": 1,
      "explanation": { "en": "Correct! A good credit history shows you are reliable and will repay what you borrow." }
    }
  ]
}
```

## F. Future Expansion Ideas

**ConservationCred Marketplace:** Allow NGOs to "request" specific conservation tasks (e.g., "urgent: nest monitoring needed in Zone C, 2× credit rate this week") that guardians can self-select into — creating a conservation labor marketplace.

**Peer Referral System:** Guardians who recruit new verified guardians to the program earn bonus credits, creating organic growth mechanics within communities.

**Carbon Linkage Layer:** As voluntary carbon markets mature, ConservationCred activity logs (timestamped, GPS-verified, fraud-screened) can form the community verification component of REDD+ or improved forest management carbon credit issuance.

**Government Workforce Integration:** Partner with national park authority human resources systems to recognize ConservationCred history as equivalent to formal employment references for park ranger employment applications.

**Insurance Micro-product Integration:** Partner with agricultural micro-insurance providers to offer premium discounts to guardians with high ConservationCred verification rates — treating consistent behavioral verification as a proxy for risk profile.

**Academic Research API:** License anonymized aggregate activity and behavioral data to conservation ecology researchers and development economists studying the link between financial inclusion and conservation participation outcomes.

---

*ConservationCred PRD v1.0 | Confidential | For hackathon judges and early investors only.*

*"The work was always real. Now it counts."*
