import type { Card, InvestorData, StartupData } from '../types'

interface InvestorFull extends InvestorData {
  match: string[]
  miss: string[]
  objections: Record<string, string>
}

export const INVESTORS: InvestorFull[] = [
  {
    name: 'The Skeptical Professor', emoji: '📐', pref: 'logos', pref_label: 'Logos', badge: 'logos',
    hint: "Speaks in data and citations. If you don't have numbers, don't waste his time.",
    match: [
      "The data checks out. I've seen a dozen pitches this week without a single coherent business model — yours had one. The traction numbers are thin, but the logic is sound. I'm in, conditionally.",
      "Finally, someone who did their homework. The market sizing is plausible and your analogy clarified the mechanism. I have concerns about unit economics at scale, but the foundation is there.",
      "I appreciate the rigour. The statistical framing was clean and the model holds up to basic scrutiny. I'll want to see a sensitivity analysis before signing, but you've earned a yes.",
    ],
    miss: [
      "Where are the numbers? You gave me a story and a feeling. I need evidence. Come back when you have data that doesn't rely on my goodwill to interpret.",
      "This pitch was all emotion and no substance. I don't invest in feelings — I invest in models. What is your customer acquisition cost? What's your churn rate? You answered neither.",
      "I've sat through a lot of pitches and this one lacked the one thing I look for: evidence. The idea might be fine. I genuinely can't tell, because you didn't show me anything to evaluate.",
    ],
    objections: {
      logos: "What does your month-12 cohort retention look like, and how does it compare to the category average?",
      pathos: "You've told me why customers feel the pain — but what's the measurable size of that pain? What do people currently spend to solve it?",
      ethos: "Your credentials are noted, but credentials don't predict market fit. What have you tested, and what did the data show?",
    },
  },
  {
    name: 'The Excited Tech VC', emoji: '🚀', pref: 'pathos', pref_label: 'Pathos', badge: 'pathos',
    hint: "Wants to change the world. Show her the dream — skip the boring business model.",
    match: [
      "Okay, I feel this. You didn't just pitch me a product — you showed me the world it creates. That personal story? That's the why. That's what gets a team through year two when everything is broken. I'm in.",
      "This is exactly the kind of pitch that gets me out of bed in the morning. You made me feel the problem and I believe you're the right person to solve it. The rest we can figure out together.",
      "The vision is there, the passion is real. I've backed founders on less. The future you painted was specific enough to be believable and ambitious enough to be exciting. Let's talk terms.",
    ],
    miss: [
      "I kept waiting for the moment that made me feel something, and it never came. You gave me data and credentials — but why does this matter to you? Why are you the one to build this?",
      "This was technically correct but emotionally flat. I don't invest in technically correct — I invest in obsession. Convince me you'd build this even if I said no.",
      "The numbers are fine. But fine doesn't change the world. I need to believe in you, not just your spreadsheet. What's the human story underneath this?",
    ],
    objections: {
      pathos: "Paint the future more specifically — what does a customer's life look like two years after adopting this, in concrete detail?",
      logos: "The numbers are solid, but they don't tell me why you. What's the personal conviction that makes you the right founder for this problem?",
      ethos: "I appreciate the track record, but past success in a different domain doesn't transfer automatically. What have you felt about this problem that others haven't?",
    },
  },
  {
    name: 'The Risk-Averse Banker', emoji: '🏦', pref: 'ethos', pref_label: 'Ethos', badge: 'ethos',
    hint: "Track record and credibility above everything. Who else has trusted you? Why should he?",
    match: [
      "The partnership you named carries weight with me. I've worked with them and I know what their involvement means. Combined with your track record, I'm comfortable with the risk profile. I'll proceed.",
      "Due diligence on your background checks out. The reference to your previous exit establishes you know how to operate under pressure. The downside protection is acceptable. Conditionally funded.",
      "I don't take risks — I take calculated positions on people I trust. Your credentials are verifiable and the partnerships add institutional confidence I need to see. We can move forward.",
    ],
    miss: [
      "You've given me ambition and market data. What I need is proof that you've done something like this before. Who has trusted you with capital, and what happened to it?",
      "The emotional appeal doesn't move the needle for me. I need to know: what is your track record, who are your references, and what does your cap table look like right now?",
      "I'm sure your vision is compelling. But vision without execution history is a liability. Come back when you can show me evidence that you've delivered on commitments before.",
    ],
    objections: {
      ethos: "Who on your advisory board has direct experience in this specific market, and how actively are they involved on a week-to-week basis?",
      pathos: "The story is compelling, but what happens to investor capital if the market doesn't respond the way you've described in the first 18 months?",
      logos: "The model is clean, but models fail. What's the worst-case scenario, and what's your contingency plan?",
    },
  },
  {
    name: 'The Customer Advocate', emoji: '🛒', pref: 'pathos', pref_label: 'Pathos', badge: 'pathos',
    hint: "Is this solving a real human problem? She wants to feel the pain, not read a slide.",
    match: [
      "You showed me the person behind the problem, not just the problem itself. That story about the user you interviewed — that's the entire company in miniature. I believe the pain is real. I'm funding this.",
      "This pitch understood something most founders miss: the customer is the product. Everything you described was grounded in real human experience. I want to back founders who think this way.",
      "I've heard a hundred pitches that describe user pain in the abstract. You showed me a specific person with a specific moment of frustration. That's signal. That's why this will work.",
    ],
    miss: [
      "You described a market segment, not a human being. Who is the actual person suffering from this problem? What does their day look like? I need to feel it, not just read about it.",
      "The credentials are real, the numbers are real — but where's the customer? You haven't shown me a single moment of genuine human pain. That's the only thing I care about.",
      "I'm still waiting to meet your customer. Not the demographic — the person. The pitch felt like a product brief, not a story about someone whose life is worse without this solution.",
    ],
    objections: {
      pathos: "Tell me about the most surprising thing a user told you during research — the thing that genuinely changed how you thought about the problem.",
      logos: "Your TAM is large, but large markets have a lot of existing solutions. What does a customer say when you ask why they haven't solved this themselves?",
      ethos: "Your experience is in the industry, not necessarily with end users. How much direct field time have you spent talking to the people who'd actually use this?",
    },
  },
  {
    name: 'The Angel Investor', emoji: '💼', pref: 'mixed', pref_label: 'Ethos + Logos', badge: 'mixed',
    hint: "The toughest room. She's seen it all. Balance credibility with cold evidence.",
    match: [
      "You're the first founder today who gave me both: a reason to trust you and a reason to believe the market is real. The combination is rare. I have follow-up questions, but the answer is yes.",
      "The credentials back up the numbers and the numbers back up the credentials. That's a tight loop. I've passed on pitches with better stories because the logic fell apart. Yours held. I'm in.",
      "I've been doing this long enough to know what a fundable pitch sounds like. You gave me credibility and evidence in the right proportion. The objections are manageable. Let's move to term sheet.",
    ],
    miss: [
      "One of those two things without the other isn't enough for me. I need to trust the founder and trust the market. Right now I have one. Come back with both.",
      "You leaned hard into emotion and it's not what I needed. I respect the passion, but I've seen passion without discipline lose money at scale. Show me the evidence underneath the feeling.",
      "There's a gap. The best pitches I fund have credibility and data running in parallel — not one carrying the other. Keep working on the balance.",
    ],
    objections: {
      mixed: "Walk me through the single biggest assumption your model rests on, and tell me how you'd know within 90 days if it's wrong.",
      ethos: "Your background is strong, but the market you're entering is different from where you've operated. What's your specific edge here beyond general competence?",
      pathos: "The emotional case is clear. But emotion doesn't protect against competition. What is the structural moat — what makes this defensible in year three?",
      logos: "The numbers work if your assumptions hold. But what's the most charitable case for why a well-funded competitor could still beat you even with your head start?",
    },
  },
]

export const STARTUPS: StartupData[] = [
  { name: 'NapDesk', desc: 'A marketplace for renting empty office nap pods during lunch hours in Copenhagen.' },
  { name: 'FridgeFriend', desc: 'An app that turns your leftover ingredients into a personalised weekly meal plan with a built-in shopping list.' },
  { name: 'ParkPact', desc: 'A peer-to-peer platform letting homeowners rent their driveway to commuters at a fraction of garage prices.' },
  { name: 'GriefBot', desc: 'A structured digital companion that helps people process loss through guided journaling and reflection exercises.' },
  { name: 'SoberScore', desc: 'A gamified app that turns alcohol-free streaks into real discounts at local restaurants and events.' },
  { name: 'DeskBreak', desc: 'A browser extension that enforces a 5-minute movement break every 90 minutes of screen time — no override.' },
  { name: 'WillBot', desc: 'An app that helps families create legally sound basic wills through a guided conversation flow.' },
  { name: 'LostLocal', desc: 'Guided audio walking tours that reveal a city the way locals actually experience it — off the tourist trail.' },
  { name: 'ClinicQueue', desc: 'A real-time waiting-room management tool for GP clinics that cuts average wait times by 35%.' },
  { name: 'TradeLoop', desc: 'A B2B marketplace connecting small manufacturers with surplus material sellers, cutting sourcing costs.' },
]

export const ALL_CARDS: Card[] = [
  { type: 'ethos', text: 'Show credentials' },
  { type: 'ethos', text: 'Name a partner' },
  { type: 'ethos', text: 'Reference past success' },
  { type: 'pathos', text: 'Tell a personal story' },
  { type: 'pathos', text: 'Show the human impact' },
  { type: 'pathos', text: 'Paint the future' },
  { type: 'logos', text: 'Drop a statistic' },
  { type: 'logos', text: 'Show the business model' },
  { type: 'logos', text: 'Use an analogy' },
]

export function shuffleDraw(n = 7): Card[] {
  const shuffled = [...ALL_CARDS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

export function pickStartup(used: string[]): StartupData {
  const available = STARTUPS.filter(s => !used.includes(s.name))
  const pool = available.length ? available : STARTUPS
  return pool[Math.floor(Math.random() * pool.length)]
}

export function localEvaluate(
  investor: typeof INVESTORS[0],
  cards: Card[],
  repScore: number,
): { reaction: string; ethos: number; pathos: number; logos: number; funded: boolean; objection: string } {
  const counts = { ethos: 0, pathos: 0, logos: 0 }
  cards.forEach(c => counts[c.type as keyof typeof counts]++)

  const repMod = (repScore - 100) * 0.2
  const e = Math.round(Math.min(100, Math.max(0, counts.ethos * 28 + Math.random() * 18 + repMod)))
  const p = Math.round(Math.min(100, Math.max(0, counts.pathos * 28 + Math.random() * 18 + repMod)))
  const l = Math.round(Math.min(100, Math.max(0, counts.logos * 28 + Math.random() * 18 + repMod)))

  let match: boolean
  if (investor.pref === 'logos') match = counts.logos >= 2
  else if (investor.pref === 'pathos') match = counts.pathos >= 2
  else if (investor.pref === 'ethos') match = counts.ethos >= 2
  else match = counts.ethos >= 1 && counts.logos >= 1

  const repPenalty = repScore < 70 ? 0.3 : 0
  const funded = match && Math.random() > 0.2 + repPenalty

  const pool = match ? investor.match : investor.miss
  const reaction = pool[Math.floor(Math.random() * pool.length)]

  const weakType = counts.ethos === 0 ? 'ethos' : counts.pathos === 0 ? 'pathos' : counts.logos === 0 ? 'logos' : investor.pref
  const objKey = investor.objections[weakType] ? weakType : Object.keys(investor.objections)[0]

  return { reaction, ethos: e, pathos: p, logos: l, funded, objection: investor.objections[objKey] }
}
