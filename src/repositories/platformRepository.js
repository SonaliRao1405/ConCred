import {
  auth,
  createUserWithEmailAndPassword,
  db,
  doc,
  firebaseEnabled,
  firebaseSignOut,
  getDoc,
  getDownloadURL,
  ref,
  setDoc,
  signInWithEmailAndPassword,
  storage,
  uploadString,
} from '../config/firebase'
import { literacyModules } from '../content/modules'
import { readRootState, writeRootState } from '../services/localDatabase'

const activityCatalog = [
  { id: 'forest-patrol', label: 'Forest patrol', baseReward: 18 },
  { id: 'water-source-check', label: 'Water source check', baseReward: 14 },
  { id: 'wildlife-sighting', label: 'Wildlife sighting', baseReward: 16 },
  { id: 'habitat-restoration', label: 'Habitat restoration', baseReward: 20 },
  { id: 'fire-risk-report', label: 'Fire risk report', baseReward: 22 },
]

const languages = ['Hindi', 'English', 'Marathi', 'Kannada', 'Tamil']

function createId(prefix) {
  return `${prefix}-${crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`}`
}

function normalizePhoneValue(value) {
  const digits = `${value ?? ''}`.replace(/\D/g, '')

  if (!digits) {
    return ''
  }

  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(-10)
  }

  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(-10)
  }

  return digits
}

function normalizePinValue(value) {
  return `${value ?? ''}`.trim()
}

function getStoredPhoneIdentity(user) {
  return user.phoneIdentity || normalizePhoneValue(user.phone)
}

function matchesStoredPhone(user, normalizedPhone, normalizedPhoneHash, legacyPhoneHash) {
  if (!user) {
    return false
  }

  if (user.phoneHash === normalizedPhoneHash || user.phoneHash === legacyPhoneHash) {
    return true
  }

  return Boolean(normalizedPhone) && getStoredPhoneIdentity(user) === normalizedPhone
}

function matchesStoredPin(user, normalizedPinHash, legacyPinHash) {
  return user.pinHash === normalizedPinHash || user.pinHash === legacyPinHash
}

async function hashValue(value) {
  const encoded = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', encoded)
  return Array.from(new Uint8Array(digest))
    .map((item) => item.toString(16).padStart(2, '0'))
    .join('')
}

function buildAuthEmail(phone) {
  return `${normalizePhoneValue(phone)}@conservationcred.app`
}

function createEmptyState() {
  return {
    meta: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      syncRevision: 0,
    },
    session: {
      userId: null,
      authMode: firebaseEnabled ? 'firebase' : 'local',
    },
    users: [],
    organizations: [],
    activities: [],
    transactions: [],
    savingsGoals: [],
    moduleProgress: [],
    queue: [],
  }
}

async function readState() {
  return (await readRootState()) ?? createEmptyState()
}

async function writeState(state) {
  const nextState = {
    ...state,
    meta: {
      ...state.meta,
      updatedAt: new Date().toISOString(),
      syncRevision: (state.meta?.syncRevision ?? 0) + 1,
    },
  }

  await writeRootState(nextState)
  return nextState
}

async function fileToDataUrl(file) {
  if (!file) return null

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error)
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })
}

async function normalizeEvidenceInput(evidenceInput, fallbackLabel) {
  if (!evidenceInput) {
    return null
  }

  if (typeof evidenceInput === 'object' && evidenceInput.dataUrl) {
    return {
      capturedAt: evidenceInput.capturedAt || new Date().toISOString(),
      dataUrl: evidenceInput.dataUrl,
      height: evidenceInput.height ?? null,
      mimeType: evidenceInput.mimeType || 'image/jpeg',
      name: evidenceInput.name || `${fallbackLabel}-${Date.now()}.jpg`,
      source: evidenceInput.source || 'in-app-camera',
      width: evidenceInput.width ?? null,
    }
  }

  return {
    capturedAt: new Date().toISOString(),
    dataUrl: await fileToDataUrl(evidenceInput),
    height: null,
    mimeType: evidenceInput.type || 'image/jpeg',
    name: evidenceInput.name || `${fallbackLabel}-${Date.now()}.jpg`,
    source: 'legacy-file-input',
    width: null,
  }
}

function calculateReward(activityType, evidenceCount, trustScore) {
  const activity = activityCatalog.find((item) => item.id === activityType)
  const baseReward = activity?.baseReward ?? 10
  const trustMultiplier = trustScore >= 75 ? 1.15 : trustScore >= 60 ? 1.08 : 1
  return Math.round(baseReward * trustMultiplier + evidenceCount * 2)
}

function deriveTrustScore(userId, state) {
  const userActivities = state.activities.filter((activity) => activity.userId === userId)
  const approvedCount = userActivities.filter((activity) => activity.status === 'approved').length
  const rejectedCount = userActivities.filter((activity) => activity.status === 'rejected').length
  const reviewCount = userActivities.filter((activity) => activity.status === 'manual_review').length
  const moduleCount = state.moduleProgress.filter(
    (entry) => entry.userId === userId && entry.completedAt,
  ).length
  const savingsBalance = state.savingsGoals.find((goal) => goal.userId === userId)?.savedAmount ?? 0

  return Math.max(
    30,
    Math.min(98, 56 + approvedCount * 4 - rejectedCount * 6 - reviewCount * 2 + moduleCount * 3 + Math.floor(savingsBalance / 80)),
  )
}

function deriveVerificationRate(userId, state) {
  const relevant = state.activities.filter((activity) => activity.userId === userId)
  if (relevant.length === 0) return 0
  return Math.round((relevant.filter((activity) => activity.status === 'approved').length / relevant.length) * 100)
}

function deriveWallet(userId, state) {
  const ledger = state.transactions
    .filter((transaction) => transaction.userId === userId)
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))

  const settledBalance = ledger
    .filter((transaction) => transaction.status === 'settled')
    .reduce((total, transaction) => total + transaction.amount, 0)
  const pendingBalance = ledger
    .filter((transaction) => transaction.status === 'pending')
    .reduce((total, transaction) => total + transaction.amount, 0)

  return {
    availableBalance: settledBalance,
    pendingBalance,
    savingsBalance: state.savingsGoals.find((goal) => goal.userId === userId)?.savedAmount ?? 0,
    ledger,
  }
}

function deriveLeaderboard(state) {
  const guardians = state.users.filter((user) => user.role === 'guardian')
  return guardians
    .map((user) => {
      const wallet = deriveWallet(user.id, state)
      const approvedWork = state.activities.filter(
        (activity) => activity.userId === user.id && activity.status === 'approved',
      ).length

      return {
        userId: user.id,
        name: user.name,
        region: user.region,
        village: user.village,
        trustScore: user.trustScore,
        approvedWork,
        credits: wallet.availableBalance,
      }
    })
    .sort((left, right) => {
      if (right.credits !== left.credits) return right.credits - left.credits
      return right.approvedWork - left.approvedWork
    })
    .map((entry, index) => ({ ...entry, rank: index + 1 }))
}

function deriveGuardianOverview(user, state) {
  const wallet = deriveWallet(user.id, state)
  const userActivities = state.activities.filter((activity) => activity.userId === user.id)
  const queueCount = state.queue.filter((item) => item.userId === user.id).length
  const moduleCount = state.moduleProgress.filter((entry) => entry.userId === user.id && entry.completedAt).length
  return {
    wallet,
    leaderboard: deriveLeaderboard(state),
    moduleCount,
    queueCount,
    pendingUploads: userActivities.filter((activity) => activity.syncState !== 'synced').length,
    pendingApprovals: userActivities.filter((activity) => activity.status === 'pending').length,
    verificationRate: deriveVerificationRate(user.id, state),
    trustScore: deriveTrustScore(user.id, state),
  }
}

function deriveNgoOverview(state) {
  const guardians = state.users.filter((user) => user.role === 'guardian')
  const queue = state.activities
    .filter((activity) => ['pending', 'manual_review', 'rejected'].includes(activity.status) || activity.flagged)
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
  return {
    queue,
    leaderboard: deriveLeaderboard(state),
    guardians,
    flaggedCount: state.activities.filter((activity) => activity.flagged).length,
    approvedCount: state.activities.filter((activity) => activity.status === 'approved').length,
  }
}

function enrichUser(user, state) {
  const wallet = deriveWallet(user.id, state)
  return {
    ...user,
    trustScore: deriveTrustScore(user.id, state),
    verificationRate: deriveVerificationRate(user.id, state),
    walletBalance: wallet.availableBalance,
    pendingRewards: wallet.pendingBalance,
  }
}

function hydrateState(state) {
  const enrichedUsers = state.users.map((user) => enrichUser(user, state))
  const sessionUser = enrichedUsers.find((user) => user.id === state.session.userId) ?? null

  return {
    ...state,
    users: enrichedUsers,
    sessionUser,
    authReady: true,
    content: {
      modules: literacyModules,
      activities: activityCatalog,
      languages,
    },
    derived:
      sessionUser?.role === 'ngo_admin'
        ? deriveNgoOverview({ ...state, users: enrichedUsers })
        : sessionUser
          ? deriveGuardianOverview(sessionUser, { ...state, users: enrichedUsers })
          : null,
  }
}

async function mirrorUserToFirebase(user) {
  if (!firebaseEnabled || !db) return
  const { pinHash, ...safeUser } = user
  await setDoc(doc(db, 'users', user.id), safeUser, { merge: true })
}

async function uploadProfileImage(userId, imageDataUrl) {
  if (!firebaseEnabled || !storage || !imageDataUrl) {
    return imageDataUrl
  }

  const storageRef = ref(storage, `profiles/${userId}.jpg`)
  await uploadString(storageRef, imageDataUrl, 'data_url')
  return getDownloadURL(storageRef)
}

async function uploadActivityEvidence(activityId, evidence) {
  if (!firebaseEnabled || !storage || !evidence) {
    return evidence
  }

  const storageRef = ref(storage, `activities/${activityId}/${evidence.name}`)
  await uploadString(storageRef, evidence.dataUrl, 'data_url')
  return getDownloadURL(storageRef)
}

export async function bootstrapPlatform() {
  const state = await readState()

  if (firebaseEnabled && auth?.currentUser) {
    const firebaseUserId = auth.currentUser.uid
    const localUser = state.users.find((user) => user.authUid === firebaseUserId)
    if (localUser && state.session.userId !== localUser.id) {
      state.session.userId = localUser.id
    } else if (!localUser) {
      const snapshot = await getDoc(doc(db, 'users', firebaseUserId))
      if (snapshot.exists()) {
        state.users.push(snapshot.data())
        state.session.userId = snapshot.data().id
        await writeState(state)
      }
    }
  }

  return hydrateState(state)
}

export async function signUp(payload) {
  const state = await readState()
  const phone = `${payload.phone ?? ''}`.trim()
  const normalizedPhone = normalizePhoneValue(phone)
  const normalizedPhoneHash = await hashValue(normalizedPhone)
  const legacyPhoneHash = await hashValue(payload.phone)
  const pin = normalizePinValue(payload.pin)
  const normalizedPinHash = await hashValue(pin)

  if (
    state.users.some((user) =>
      matchesStoredPhone(user, normalizedPhone, normalizedPhoneHash, legacyPhoneHash),
    )
  ) {
    throw new Error('An account with this phone number already exists.')
  }

  const userId = createId(payload.role === 'ngo_admin' ? 'ngo' : 'guardian')
  const profileImageData = payload.profileImage ? await fileToDataUrl(payload.profileImage) : null
  let authUid = userId

  if (firebaseEnabled && auth) {
    const email = buildAuthEmail(normalizedPhone)
    const firebaseCredentials = await createUserWithEmailAndPassword(auth, email, pin)
    authUid = firebaseCredentials.user.uid
  }

  const profileImage = await uploadProfileImage(userId, profileImageData)
  const region = payload.region || payload.village || payload.community || 'Western Ghats'
  const organizationId =
    payload.role === 'ngo_admin'
      ? createId('org')
      : payload.organizationId ||
        state.organizations.find((organization) => organization.region === region)?.id ||
        createId('org')

  if (!state.organizations.some((organization) => organization.id === organizationId)) {
    state.organizations.push({
      id: organizationId,
      name: payload.organization || `${region} Conservation Network`,
      region,
      createdAt: new Date().toISOString(),
    })
  }

  const user = {
    id: userId,
    authUid,
    role: payload.role,
    name: payload.name,
    phone,
    phoneIdentity: normalizedPhone,
    phoneHash: normalizedPhoneHash,
    pinHash: normalizedPinHash,
    language: payload.language,
    village: payload.village || payload.community || payload.organization || 'Field community',
    community: payload.community || payload.village || payload.organization || 'Field community',
    region,
    organization: payload.organization || `${region} Conservation Network`,
    organizationId,
    adminId: payload.adminId || '',
    profileImage,
    createdAt: new Date().toISOString(),
  }

  state.users.push(user)
  state.session.userId = userId

  if (!state.savingsGoals.some((goal) => goal.userId === userId)) {
    state.savingsGoals.push({
      id: createId('goal'),
      userId,
      title: payload.role === 'ngo_admin' ? 'Program reserve' : 'Emergency forest fund',
      targetAmount: payload.role === 'ngo_admin' ? 2500 : 800,
      savedAmount: 0,
      updatedAt: new Date().toISOString(),
    })
  }

  await mirrorUserToFirebase(user)
  return hydrateState(await writeState(state))
}

export async function signIn(payload) {
  const state = await readState()
  const phone = `${payload.phone ?? ''}`.trim()
  const normalizedPhone = normalizePhoneValue(phone)
  const normalizedPhoneHash = await hashValue(normalizedPhone)
  const legacyPhoneHash = await hashValue(payload.phone)
  const pin = normalizePinValue(payload.pin)
  const normalizedPinHash = await hashValue(pin)
  const legacyPinHash = await hashValue(payload.pin)
  const matchedPhoneUser = state.users.find((entry) =>
    matchesStoredPhone(entry, normalizedPhone, normalizedPhoneHash, legacyPhoneHash),
  )

  if (!matchedPhoneUser) {
    if (state.users.length === 0) {
      throw new Error(
        'No saved accounts exist on this app URL yet. If you signed up on another port or on localhost instead of 127.0.0.1, reopen that exact URL to log in.',
      )
    }

    throw new Error('No saved account matches this phone number on the current app URL.')
  }

  if (!matchesStoredPin(matchedPhoneUser, normalizedPinHash, legacyPinHash)) {
    throw new Error('The passcode is incorrect for this saved account.')
  }

  const user = matchedPhoneUser

  if (!user) {
    throw new Error('Phone number or passcode is incorrect.')
  }

  user.phone = phone
  user.phoneIdentity = normalizedPhone
  user.phoneHash = normalizedPhoneHash
  user.pinHash = normalizedPinHash

  if (firebaseEnabled && auth) {
    const email = buildAuthEmail(normalizedPhone)
    await signInWithEmailAndPassword(auth, email, pin)
  }

  state.session.userId = user.id
  return hydrateState(await writeState(state))
}

export async function signOut() {
  const state = await readState()
  state.session.userId = null

  if (firebaseEnabled && auth) {
    await firebaseSignOut(auth)
  }

  return hydrateState(await writeState(state))
}

export async function createActivity(userId, payload, options) {
  const state = await readState()
  const evidenceBefore = await normalizeEvidenceInput(payload.beforeImage, 'before-evidence')
  const evidenceAfter = await normalizeEvidenceInput(payload.afterImage, 'after-evidence')

  if (!evidenceBefore || !evidenceAfter) {
    throw new Error('Both before and after evidence must be captured in-app before saving this activity.')
  }

  if ([evidenceBefore, evidenceAfter].some((evidence) => evidence.source !== 'in-app-camera')) {
    throw new Error('Evidence must be captured directly in the app camera.')
  }

  const trustScore = deriveTrustScore(userId, state)
  const rewardEstimate = calculateReward(
    payload.activityType,
    [evidenceBefore, evidenceAfter].filter(Boolean).length,
    trustScore,
  )

  const activityId = createId('activity')
  const activity = {
    id: activityId,
    userId,
    region: payload.region,
    village: payload.village,
    activityType: payload.activityType,
    notes: payload.notes,
    createdAt: new Date().toISOString(),
    status: 'pending',
    flagged:
      payload.gps?.accuracy > 100 ||
      !evidenceAfter ||
      [evidenceBefore, evidenceAfter].some(
        (evidence) => evidence && evidence.source !== 'in-app-camera',
      ),
    syncState: options.isOnline ? 'synced' : 'queued',
    retryCount: 0,
    trustDelta: 0,
    rewardEstimate,
    gps: payload.gps,
    beforeEvidence: evidenceBefore,
    afterEvidence: evidenceAfter,
    reviewerNote: '',
  }

  if (firebaseEnabled && options.isOnline) {
    activity.beforeEvidence =
      activity.beforeEvidence
        ? { ...activity.beforeEvidence, remoteUrl: await uploadActivityEvidence(activityId, activity.beforeEvidence) }
        : null
    activity.afterEvidence =
      activity.afterEvidence
        ? { ...activity.afterEvidence, remoteUrl: await uploadActivityEvidence(activityId, activity.afterEvidence) }
        : null
  } else {
    state.queue.push({
      id: createId('queue'),
      userId,
      activityId,
      kind: 'activity_upload',
      status: 'queued',
      createdAt: new Date().toISOString(),
    })
  }

  state.activities.unshift(activity)
  return hydrateState(await writeState(state))
}

export async function syncQueuedItems(isOnline) {
  const state = await readState()
  if (!isOnline) {
    return hydrateState(state)
  }

  const nextQueue = []
  for (const queueEntry of state.queue) {
    const activity = state.activities.find((item) => item.id === queueEntry.activityId)
    if (!activity) continue

    activity.syncState = 'synced'
    activity.retryCount += 1

    if (firebaseEnabled) {
      await mirrorUserToFirebase(state.users.find((user) => user.id === activity.userId))
    }
  }

  state.queue = nextQueue
  return hydrateState(await writeState(state))
}

export async function reviewActivity(activityId, decision, reviewerId, note) {
  const state = await readState()
  const activity = state.activities.find((item) => item.id === activityId)
  if (!activity) {
    return hydrateState(state)
  }

  activity.status = decision
  activity.reviewerNote = note
  activity.flagged = decision === 'manual_review'

  const alreadySettled = state.transactions.some(
    (transaction) => transaction.referenceId === activityId && transaction.type === 'reward',
  )

  if (decision === 'approved' && !alreadySettled) {
    state.transactions.unshift({
      id: createId('txn'),
      userId: activity.userId,
      type: 'reward',
      amount: activity.rewardEstimate,
      status: 'settled',
      createdAt: new Date().toISOString(),
      referenceId: activityId,
      description: `${activity.activityType} verified by NGO`,
    })
  }

  if (decision === 'approved') {
    activity.trustDelta = 4
  } else if (decision === 'rejected') {
    activity.trustDelta = -7
  } else {
    activity.trustDelta = -2
  }

  const reviewer = state.users.find((user) => user.id === reviewerId)
  if (reviewer && firebaseEnabled) {
    await mirrorUserToFirebase(reviewer)
  }

  return hydrateState(await writeState(state))
}

export async function moveToSavings(userId, amount) {
  const state = await readState()
  const wallet = deriveWallet(userId, state)
  const numericAmount = Number(amount)
  if (numericAmount <= 0 || numericAmount > wallet.availableBalance) {
    throw new Error('Savings transfer exceeds the available wallet balance.')
  }

  state.transactions.unshift({
    id: createId('txn'),
    userId,
    type: 'savings_transfer',
    amount: -numericAmount,
    status: 'settled',
    createdAt: new Date().toISOString(),
    referenceId: '',
    description: 'Moved into savings reserve',
  })

  const goal = state.savingsGoals.find((item) => item.userId === userId)
  if (goal) {
    goal.savedAmount += numericAmount
    goal.updatedAt = new Date().toISOString()
  }

  return hydrateState(await writeState(state))
}

export async function updateSavingsGoal(userId, changes) {
  const state = await readState()
  const goal = state.savingsGoals.find((item) => item.userId === userId)
  if (goal) {
    goal.title = changes.title
    goal.targetAmount = Number(changes.targetAmount)
    goal.updatedAt = new Date().toISOString()
  }

  return hydrateState(await writeState(state))
}

export async function updateUserLanguage(userId, language) {
  const state = await readState()
  const user = state.users.find((item) => item.id === userId)

  if (user) {
    user.language = language
    await mirrorUserToFirebase(user)
  }

  return hydrateState(await writeState(state))
}

export async function saveModuleProgress(userId, moduleId, changes) {
  const state = await readState()
  const existing = state.moduleProgress.find((entry) => entry.userId === userId && entry.moduleId === moduleId)
  if (existing) {
    Object.assign(existing, changes, { updatedAt: new Date().toISOString() })
  } else {
    state.moduleProgress.push({
      id: createId('progress'),
      userId,
      moduleId,
      currentLessonIndex: 0,
      audioProgress: 0,
      quizScore: 0,
      completedAt: null,
      updatedAt: new Date().toISOString(),
      ...changes,
    })
  }

  return hydrateState(await writeState(state))
}

export async function completeModuleQuiz(userId, moduleId, score) {
  const state = await readState()
  let progress = state.moduleProgress.find((entry) => entry.userId === userId && entry.moduleId === moduleId)
  if (!progress) {
    progress = {
      id: createId('progress'),
      userId,
      moduleId,
      currentLessonIndex: 0,
      audioProgress: 100,
      quizScore: score,
      completedAt: null,
      updatedAt: new Date().toISOString(),
    }
    state.moduleProgress.push(progress)
  }

  progress.quizScore = score
  progress.audioProgress = 100
  progress.updatedAt = new Date().toISOString()

  if (!progress.completedAt && score >= 60) {
    const module = literacyModules.find((entry) => entry.id === moduleId)
    progress.completedAt = new Date().toISOString()
    state.transactions.unshift({
      id: createId('txn'),
      userId,
      type: 'literacy_reward',
      amount: module?.reward ?? 20,
      status: 'settled',
      createdAt: new Date().toISOString(),
      referenceId: moduleId,
      description: `${module?.title ?? 'Learning module'} completed`,
    })
  }

  return hydrateState(await writeState(state))
}

export async function exportGuardianRows() {
  const state = await readState()
  return deriveLeaderboard(hydrateState(state))
}
