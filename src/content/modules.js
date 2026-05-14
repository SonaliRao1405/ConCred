export const literacyModules = [
  {
    id: 'forest-income-basics',
    title: 'Forest Income Basics',
    category: 'Money confidence',
    accent: 'spring',
    unlockRule: { minApprovedActivities: 0, minTrustScore: 0 },
    durationMinutes: 6,
    reward: 25,
    lessons: [
      'Conservation rewards are strongest when every activity has a clear record, a place, and a purpose.',
      'Your wallet is not just a number. It is the living record of trusted work across your forest route.',
      'Separating earned balance, pending rewards, and savings helps households make calmer financial decisions.',
    ],
    quiz: [
      {
        prompt: 'What strengthens trust in your rewards?',
        answers: ['A clear record of work', 'Deleting old activities', 'Skipping verification'],
        correctIndex: 0,
      },
      {
        prompt: 'Why separate savings from available balance?',
        answers: ['To protect future goals', 'To hide your earnings', 'To avoid literacy modules'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'savings-habits',
    title: 'Savings Habits for Lean Seasons',
    category: 'Savings',
    accent: 'earth',
    unlockRule: { minApprovedActivities: 2, minTrustScore: 55 },
    durationMinutes: 7,
    reward: 40,
    lessons: [
      'Small weekly savings movements can matter more than one large move made too late.',
      'Naming a savings goal helps families keep direction during uncertain income cycles.',
      'Savings consistency is a signal of future resilience, not just present discipline.',
    ],
    quiz: [
      {
        prompt: 'What makes a goal easier to protect?',
        answers: ['Giving it a clear name', 'Moving all funds at once', 'Ignoring progress'],
        correctIndex: 0,
      },
      {
        prompt: 'What does savings consistency show?',
        answers: ['Future resilience', 'GPS accuracy', 'Photo quality'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'trust-and-credit',
    title: 'Trust, Proof, and Credit',
    category: 'Credit readiness',
    accent: 'moss',
    unlockRule: { minApprovedActivities: 4, minTrustScore: 60 },
    durationMinutes: 8,
    reward: 50,
    lessons: [
      'Trust grows from repeated approvals, honest uploads, and stable participation.',
      'A high trust score can support future NGO recommendations and credit-readiness conversations.',
      'Rejected or weakly documented work lowers confidence, so quality matters as much as quantity.',
    ],
    quiz: [
      {
        prompt: 'What grows trust score fastest?',
        answers: ['Consistent approved work', 'Many rejected uploads', 'Turning off sync'],
        correctIndex: 0,
      },
      {
        prompt: 'Why does evidence quality matter?',
        answers: ['It improves verification confidence', 'It changes your language setting', 'It hides ledger history'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'family-budget-planning',
    title: 'Family Budget Planning',
    category: 'Budgeting',
    accent: 'amber',
    unlockRule: { minApprovedActivities: 6, minTrustScore: 65 },
    durationMinutes: 8,
    reward: 60,
    lessons: [
      'A simple budget works best when each rupee or credit has one clear job.',
      'Irregular income months still benefit from a steady split between essentials, savings, and buffers.',
      'Budgeting is not restriction. It is protection for future decisions.',
    ],
    quiz: [
      {
        prompt: 'What is the purpose of a budget?',
        answers: ['To give money a plan', 'To remove your wallet history', 'To replace rewards'],
        correctIndex: 0,
      },
      {
        prompt: 'What helps with uneven income months?',
        answers: ['A stable savings and essentials split', 'Ignoring savings entirely', 'Only checking the leaderboard'],
        correctIndex: 0,
      },
    ],
  },
  {
    id: 'fraud-and-safety',
    title: 'Fraud and Safety in the Field',
    category: 'Safety',
    accent: 'alert',
    unlockRule: { minApprovedActivities: 8, minTrustScore: 70 },
    durationMinutes: 6,
    reward: 70,
    lessons: [
      'Accurate uploads protect both your reputation and the credibility of the community program.',
      'Device sharing, duplicate evidence, and unclear timestamps create avoidable trust damage.',
      'Safety means honest reporting, guarded devices, and quick clarification when the NGO requests it.',
    ],
    quiz: [
      {
        prompt: 'What harms trust quickly?',
        answers: ['Duplicate evidence uploads', 'Clear explanations', 'Strong GPS lock'],
        correctIndex: 0,
      },
      {
        prompt: 'What should happen after an NGO clarification request?',
        answers: ['Respond with better context', 'Delete the activity', 'Ignore the queue'],
        correctIndex: 0,
      },
    ],
  },
]
