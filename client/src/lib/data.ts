
export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content?: string;
  date: string;
  image?: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Your First Board Meeting Is Not a Report",
    category: "THOUGHTS",
    excerpt: "Why most founders fail at board management and how to turn it into a strategic asset.",
    date: "Nov 28, 2025",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2664&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "The $40 Million Mistake",
    category: "WAR STORIES",
    excerpt: "A deep dive into a scaling failure that could have been prevented with proper architectural alignment.",
    date: "Nov 15, 2025",
    image: "https://images.unsplash.com/photo-1628348070889-cb656235b4eb?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Architecting for Chaos",
    category: "FOUNDER'S BLUEPRINT",
    excerpt: "Chaos is not an enemy; it is a symptom of growth. Here is how to harness it.",
    date: "Oct 30, 2025",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop"
  },
  {
    id: "4",
    title: "The Silence of Leadership",
    category: "LEADERSHIP",
    excerpt: "True leadership is not about being the loudest voice in the room.",
    date: "Oct 12, 2025",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2671&auto=format&fit=crop"
  }
];

export const CHAT_INITIAL_MESSAGES = [
  {
    role: "assistant",
    content: "Welcome to the Order of Chaos."
  },
  {
    role: "assistant",
    content: "I am the digital clone of HK Borah. As a Business Architect, I design systems for scale."
  },
  {
    role: "assistant",
    content: "Where is the friction in your business today?"
  }
];
