export interface ChatIntent {
  keywords: string[];
  response: string;
}

export const CHAT_INTENTS: ChatIntent[] = [
  {
    keywords: ['register', 'registration', 'enroll', 'sign up', 'join', 'book a seat', 'how do i register'],
    response:
      "Easy — head to the Events page and hit “View Details” on any card that has an Open status. The event will open a beautiful details panel with a “Register” button, which launches a short form: your name, email, college, and phone. Submit that and you're locked in, champ. 🙌",
  },
  {
    keywords: ['verify', 'certificate id', 'validation', 'check my certificate', 'verify a certificate'],
    response:
      "To verify, open the Certificate Portal from the top nav, type in the Certificate ID (like INNOVENTA-2026-001), and press Search. You'll see the participant, event, and a “Certificate Verified ✓” badge — or a friendly “Certificate Not Found” if it doesn't match our records.",
  },
  {
    keywords: ['download', 'download my certificate', 'get my certificate', 'pdf'],
    response:
      "Find your certificate in the Certificate Portal and press the “Download Certificate” button — it saves an elegant certificate image straight to your device. Anything you add to My Certificates also has its own Download action, so you can grab it any time.",
  },
  {
    keywords: ['what events', 'available', 'upcoming', 'events', 'hackathon', 'workshop', 'seminar', 'competition', 'list of events'],
    response:
      "We've got a packed lineup: hackathons, hands-on workshops, tech talks, competitions, and seminars. Head to the Events page and use the search bar and category filters to narrow things down — every card shows date, type, and status at a glance.",
  },
  {
    keywords: ['save', 'my certificates', 'add to my', 'saved', 'favorite'],
    response:
      "Once a certificate is verified, hit “Add to My Certificates” and it's stored safely on this device. Open My Certificates anytime to view, download, or remove them. And don't worry — the app won't add the same certificate twice.",
  },
  {
    keywords: ['who are you', 'hello', 'hi', 'hey', 'help', 'what can you do'],
    response:
      "Hi! I'm your friendly neighbourhood INNOVENTA assistant. 🕸️ I can point you to events, walk you through registration, help you verify a certificate, and explain the download flow. Ask me anything in plain language!",
  },
  {
    keywords: ['theme', 'dark', 'light mode', 'change color'],
    response:
      "Look for the sun/moon toggle in the top nav — one tap switches between our signature midnight-navy dark mode and a clean light mode. Your choice is remembered even after you refresh.",
  },
];

export const FALLBACK_RESPONSE =
  "Hmm, I'm not quite sure about that one — I'm a local assistant with a limited view of the world. 🕷️ Try asking how to register for an event, how to verify or download a certificate, or what events are available.";

export const SUGGESTED_QUESTIONS = [
  'How do I register for an event?',
  'How do I verify a certificate?',
  'What events are available?',
  'How do I save a certificate?',
];

export function getChatResponse(message: string): string {
  const query = message.toLowerCase();
  let best: ChatIntent | undefined;
  let bestScore = 0;
  for (const intent of CHAT_INTENTS) {
    let score = 0;
    for (const keyword of intent.keywords) {
      if (keyword.includes(' ')) {
        if (query.includes(keyword)) score += 3;
      } else if (query.includes(keyword)) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }
  return best ? best.response : FALLBACK_RESPONSE;
}