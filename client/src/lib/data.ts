export const CHAT_INITIAL_MESSAGES = [
  {
    role: "assistant",
    content: "Welcome to the Idea Clinic."
  },
  {
    role: "assistant",
    content: "I am the digital clone of HK Borah. As a Business Architect, I design systems for scale."
  },
  {
    role: "assistant",
    content: "How can I help you today?"
  }
];

export interface CodexEntry {
    id: string;
    stage: "Blueprint" | "Foundation" | "Skyline";
    domain: "Process & Systems" | "Data & Metrics" | "Strategy & Leadership";
    title: string;
    description: string;
    coreObjective?: string;
    sections?: CodexSection[];
    questions?: { q: string; a: string; principle: string }[];
}

export interface CodexSection {
    id: string;
    title: string;
    description: string;
    questions: { q: string; a: string; principle: string }[];
}

export const CODEX_ENTRIES: CodexEntry[] = [
    {
        id: "blueprint-process",
        stage: "Blueprint",
        domain: "Process & Systems",
        title: "Blueprint Stage - Process & Systems",
        description: "Engineering the Founding Team",
        coreObjective: "The primary architectural challenge of the Blueprint Stage is not to build a product, but to engineer the initial operational and team structures that make building a successful product possible. The unexamined assumption is that a strong founding team is merely a group of talented individuals. This is false. A strong founding team is a complex system with its own clear, documented, and disciplined operating protocols.\n\nTo achieve this objective, we have deconstructed the challenge into seven essential, mutually exclusive, and collectively exhaustive systems.",
        sections: [
            {
                id: "blueprint-process-founders",
                title: "I. The Founders' Operating System: Aligning the Core",
                description: "Engineering governance protocols to ensure co-founders work as a unified system rather than competing individuals.",
                questions: [
                    {
                        q: "We're co-founders and close friends, which is great until we hit a major disagreement. How can we create a simple, yet effective, framework for resolving conflicts, making critical business decisions, and adjusting our responsibilities over time, so our friendship doesn't become a liability?",
                        a: "**The Founders' Governance Blueprint:**\n• Codify Decision Domains: Create a simple matrix. List all key business functions (e.g., Product, Fundraising, Sales, Hiring). For each, assign one founder as the 'Decision Owner.' This eliminates ambiguity on 90% of issues.\n• Define a Dispute Resolution Cascade: For high-stakes decisions, agree on a pre-defined resolution process: 1) 48-hour cooling-off period, 2) each founder writes a one-page argument, 3) if deadlocked, bring in a mutually-respected advisor for a non-binding tie-breaker vote.\n• Schedule Architectural Reviews: Mandate a formal review of this governance blueprint every quarter.",
                        principle: "A strong co-founder relationship isn't built on friendship; it's engineered with a clear governance protocol."
                    },
                    {
                        q: "Our 'CEO' and 'CTO' titles are meaningless right now; we're both stepping on each other's toes. What's a practical system for assigning and documenting who owns what, who has the final say, and how we formally revisit these roles every few months to prevent resentment and confusion?",
                        a: "**The Role Architecture Matrix:**\n• Map Core Business Functions: List every critical process in the business, from customer discovery to deploying code. Ignore titles completely.\n• Assign 'Decision Owner' and 'Execution Owner': For each function, designate one founder as the 'Decision Owner' (the 'what' and 'why') and one as the 'Execution Owner' (the 'how'). They can be the same person, but the distinction is critical.\n• Implement a 'Request for Comment' (RFC) Process: For decisions crossing functional boundaries, the Decision Owner must issue a simple, one-paragraph RFC to the other founder, who has 24 hours to provide input.\n• Schedule Quarterly Role Audits: Put a recurring 90-day event on the calendar to review the Role Architecture Matrix.",
                        principle: "Titles are labels; true operational integrity comes from a clearly defined architecture of ownership and authority."
                    },
                    {
                        q: "I'm being told to split equity 50/50, but I'm working full-time and investing my own money, while my co-founder is part-time for now. What is a structured, fair method to divide equity that considers cash invested, pre-existing IP, and differing time commitments from the start, so we don't end up in a huge fight later?",
                        a: "**The Dynamic Equity Allocation Model:**\n• Quantify Non-Time Contributions: Assign a clear, agreed-upon 'equity value' to all non-time assets. Cash invested is simple. Pre-existing Intellectual Property (IP) should be valued based on what it would cost to replicate.\n• Factor in Time & Risk Differentials: The founder working full-time without a salary is taking on significantly more risk and opportunity cost. This commitment must be weighted more heavily than the part-time contribution.\n• Implement a Vesting Schedule Tied to Commitment Milestones: All equity for all founders must be subject to vesting, typically over four years with a one-year cliff. For the part-time founder, you can structure vesting to accelerate once they become full-time.\n• Codify Everything in a Founders' Agreement: Do not proceed on a handshake. Every aspect of this model must be documented in a legally binding Founders' Agreement.",
                        principle: "Equity should not be a reflection of equality, but a precise measure of the value and risk contributed to the foundation."
                    },
                    {
                        q: "My idea of 'full-time' and my co-founder's are completely different, and it's causing problems. How do we establish and write down a clear 'Founder Service Level Agreement' that defines expected working hours, communication standards, and rules for outside projects to ensure we're both truly on the same page?",
                        a: "**The Founder Commitment Protocol:**\n• Define 'Core Operational Hours': Agree on a block of daily hours where both founders are guaranteed to be working and available for high-bandwidth communication. This is not about tracking time; it's about creating a reliable window for collaboration.\n• Establish Communication Response Time Standards: Define the expected response times for different channels. For example: urgent text messages within 1 hour, emails within 12 hours.\n• Codify an External Commitments Policy: Be explicit about what, if any, outside work or side projects are permissible. This policy should clearly state that any IP developed related to the company's mission belongs to the company.\n• Set a Regular Cadence for Protocol Review: This is a living document. Schedule a brief, 30-minute review every month to ensure the protocol still aligns with current business and personal needs.",
                        principle: "Assumed alignment is the most dangerous form of operational debt; codify all commitments."
                    }
                ]
            }
        ]
    }
];

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    slug: string;
    image: string;
}

export const BLOG_POSTS: BlogPost[] = [
    {
        id: "1",
        title: "The Architecture of Scaling",
        excerpt: "Understanding how organizations evolve from startup chaos to enterprise discipline through systematic architectural thinking.",
        content: "Full content here",
        date: "Nov 15, 2024",
        slug: "architecture-of-scaling",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
    },
    {
        id: "2",
        title: "Founder Operating Systems",
        excerpt: "How to build governance protocols that keep co-founder relationships thriving while making critical business decisions.",
        content: "Full content here",
        date: "Nov 8, 2024",
        slug: "founder-operating-systems",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
    },
    {
        id: "3",
        title: "The MVP Blueprint",
        excerpt: "A framework for building the absolute minimum product that tests your core hypothesis without wasting engineering resources.",
        content: "Full content here",
        date: "Nov 1, 2024",
        slug: "mvp-blueprint",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
    }
];
