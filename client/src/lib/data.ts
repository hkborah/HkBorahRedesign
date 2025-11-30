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
            },
            {
                id: "blueprint-process-validation",
                title: "II. The Validation Engine: From Idea to Evidence",
                description: "Building systematic processes for customer discovery and validating core business assumptions with real evidence.",
                questions: [
                    {
                        q: "All my customer interviews end with 'that's a neat idea,' but I'm not learning anything concrete. What's a disciplined process for asking questions that gets people to talk about what they actually do and how they've solved this problem in the past, instead of just giving me their opinion on my future product?",
                        a: "**The Past Pain Interview Framework:**\n• Ban All Future-Tense Questions: Your first rule is to eliminate all hypothetical questions. Never ask 'Would you use...' or 'Do you like...' These questions invite speculation, not evidence.\n• Probe for Specific, Recent Instances: Instead of asking about the problem in general, ask, 'Tell me about the last time you encountered this problem.' This forces them to recall a specific, factual event.\n• Quantify the Cost of Their Last Workaround: Ask questions that force a number. 'How much time did you lose?' 'How much did that workaround cost you?' 'On a scale of 1-10, how frustrating was that specific instance?' This turns vague complaints into measurable pain.\n• Ask Them to Walk You Through Their Current Process: Have them share their screen or describe, step-by-step, how they solve this problem today. This will reveal the true, often ugly, reality of their existing workflow and where the real opportunities lie.",
                        principle: "Customer opinions are noise; evidence is found exclusively in their past behavior."
                    },
                    {
                        q: "My vision is huge, and I'm stuck in analysis paralysis, not knowing what to test first. How can I systematically deconstruct my idea into its core, riskiest beliefs and then create a series of low-cost experiments to quickly validate or invalidate each one with hard data?",
                        a: "**The Assumption Deconstruction & Test Sequence:**\n• List Foundational Beliefs: Write down every single belief that must be true for your business to succeed. Examples: 'People have problem X,' 'They will pay Y for a solution,' 'We can reach them through channel Z'.\n• Rank by Risk and Uncertainty: Create a 2x2 matrix. On one axis, 'Impact on Business if Wrong.' On the other, 'Level of Current Evidence.' The assumptions in the 'High Impact / Low Evidence' quadrant are your foundational risks.\n• Design a 'Falsification Experiment' for #1: Isolate the single riskiest assumption. Design the cheapest, fastest experiment you can run in under two weeks to prove it wrong. The goal is falsification, not validation, as this removes bias.\n• Execute, Measure, Learn, Repeat: Run the experiment. If the hypothesis survives, move to the next riskiest assumption. If it is invalidated, you have just saved months of building on a flawed foundation and can now pivot with evidence.",
                        principle: "A grand vision is built not by adding features, but by systematically eliminating foundational risks."
                    },
                    {
                        q: "My interviews say one thing, but my landing page analytics say another. I'm drowning in conflicting data. What's a structured way to combine qualitative insights with quantitative metrics to make a logical, data-backed call on whether to change direction, push forward, or abandon the concept?",
                        a: "**The Evidence Synthesis Framework:**\n• Map 'Why' to 'What': Treat your qualitative interview data as the 'Why' and your quantitative analytics as the 'What.' Create a simple table mapping specific user quotes (the 'Why') to the analytics that should reflect that sentiment (the 'What'). For example, if users say 'I need this now,' your landing page conversion rate should be high.\n• Assess 'Signal Strength': Not all data is equal. An action (e.g., entering a credit card) is a stronger signal than an opinion (e.g., a positive comment). A pattern across 10 users is stronger than a single data point. Assign a simple 1-3 signal strength score to each piece of evidence.\n• Formulate a 'Reconciliation Hypothesis': Based on the mapped data, create a new, single hypothesis that explains the discrepancy. For example: 'Users say they want the solution, but they are not converting because they don't believe our landing page delivers that solution.'\n• Design the Next Experiment: Your next action must be an experiment designed specifically to test the Reconciliation Hypothesis. In the example above, this would mean radically changing the landing page copy to match the interview language, then re-measuring conversion.",
                        principle: "Data doesn't conflict; our interpretation does. A rigorous synthesis process turns noise into the next load-bearing hypothesis."
                    },
                    {
                        q: "I'm told to find the first 10 users who are desperate for my solution, but I'm just finding people who are mildly interested. What's a repeatable process for creating a precise profile of my perfect first customer and then systematically finding them in their natural habitats online to build a core group of super-fans?",
                        a: "**The Early Adopter Signal Blueprint:**\n• Define the 'Pain Signature': Move beyond demographics. Define your ideal early adopter by their behaviors. What specific tools are they currently 'hacking' together? What specific keywords are they searching for? What specific frustrations have they publicly posted about? This behavioral profile is your Pain Signature.\n• Identify the 'Digital Watering Holes': Where do people exhibiting this Pain Signature congregate online? This is rarely a generic platform like Facebook. It is more likely a specific subreddit, a niche industry forum, a Slack community, or the comments section of a particular blog.\n• Craft a 'Problem-First Pitch': Do not pitch your solution. Enter these communities and pitch the problem. Post a question like, 'I'm researching how people deal with X. It seems incredibly frustrating. How is everyone here handling it?' This attracts the signal of pain to you.\n• Recruit for a 'Feedback Partnership': From the respondents, invite the most passionate ones to be part of a small, high-touch feedback group. Offer them direct access and the ability to shape the product. You are not recruiting users; you are recruiting co-creators.",
                        principle: "Don't search for customers; engineer a system to attract the signal of their pain."
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
