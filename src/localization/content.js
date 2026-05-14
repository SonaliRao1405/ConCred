export function getLocalizedActivityLabel(activityId, t, fallback = activityId) {
  return t(`uploads.activities.${activityId}`, {}, fallback)
}

export function getLocalizedStatus(status, t) {
  return t(`common.status.${status}`, {}, `${status}`.replaceAll('_', ' '))
}

export function getLocalizedSyncState(syncState, t) {
  return t(`common.syncState.${syncState}`, {}, syncState)
}

export function getLocalizedModule(module, getMessage, t) {
  const basePath = `literacy.modules.${module.id}`
  const translatedQuiz = getMessage(`${basePath}.quiz`, null)

  return {
    ...module,
    title: t(`${basePath}.title`, {}, module.title),
    category: t(`${basePath}.category`, {}, module.category),
    lessons: getMessage(`${basePath}.lessons`, module.lessons),
    quiz: module.quiz.map((question, index) => ({
      ...question,
      prompt: translatedQuiz?.[index]?.prompt ?? question.prompt,
      answers: translatedQuiz?.[index]?.answers ?? question.answers,
    })),
  }
}

export function formatTransactionDescription(entry, modules, activities, t) {
  if (entry.type === 'reward') {
    const activity = activities.find((item) => item.id === entry.referenceId)
    return t('rewards.ledger.activityReward', {
      activity: activity
        ? getLocalizedActivityLabel(activity.activityType, t, activity.activityType)
        : entry.description,
    }, entry.description)
  }

  if (entry.type === 'literacy_reward') {
    const module = modules.find((item) => item.id === entry.referenceId)
    const moduleTitle = module ? t(`literacy.modules.${module.id}.title`, {}, module.title) : entry.referenceId
    return t('rewards.ledger.moduleReward', { module: moduleTitle }, entry.description)
  }

  if (entry.type === 'savings_transfer') {
    return t('rewards.ledger.savingsTransfer', {}, entry.description)
  }

  return entry.description
}

export function translateRuntimeMessage(message, t) {
  const runtimeMap = {
    'An account with this phone number already exists.': 'errors.duplicatePhone',
    'Phone number or passcode is incorrect.': 'errors.invalidLogin',
    'Savings transfer exceeds the available wallet balance.': 'errors.savingsExceedsBalance',
    'No saved accounts exist in this browser yet. If you want the same account across deployments and devices, connect Firebase for cloud-backed sign-in.':
      'errors.noAccountsInBrowser',
    'No saved account matches this phone number in this app.': 'errors.phoneNotFound',
    'No saved accounts exist on this app URL yet. If you signed up on another port or on localhost instead of 127.0.0.1, reopen that exact URL to log in.':
      'errors.noAccountsOnUrl',
    'No saved account matches this phone number on the current app URL.':
      'errors.phoneNotFoundOnUrl',
    'The passcode is incorrect for this saved account.': 'errors.incorrectPasscode',
    'Both before and after evidence must be captured in-app before saving this activity.':
      'errors.capturePairRequired',
    'Evidence must be captured directly in the app camera.': 'errors.cameraOnlyEvidence',
    'Lock GPS before saving this activity.': 'errors.gpsRequired',
    'GPS signal is too weak to verify this claim. Try locking GPS again.': 'errors.gpsWeak',
    'Before and after images must be different captures.': 'errors.sameImagePair',
    'This image has already been used in another activity and cannot be uploaded again.':
      'errors.duplicateEvidence',
    'This work location has already been claimed by an earlier capture and cannot be uploaded again.':
      'errors.duplicateLocationClaim',
    'Please sign in again before deleting this account.': 'errors.reauthDelete',
    'Something went wrong while processing your request.': 'errors.generic',
  }

  const translationKey = runtimeMap[message]
  return translationKey ? t(translationKey, {}, message) : message
}
