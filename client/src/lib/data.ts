
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
    content: "Welcome to the Idea Clinic."
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

export interface CodexEntry {
    id: string;
    stage: "Blueprint" | "Foundation" | "Skyline";
    domain: "Process & Systems" | "Data & Metrics" | "Strategy & Leadership";
    title: string;
    description: string;
    questions: { q: string; a: string; principle: string }[];
}

export const CODEX_ENTRIES: CodexEntry[] = [
    {
        id: "blueprint-process",
        stage: "Blueprint",
        domain: "Process & Systems",
        title: "Engineering the Founding Team",
        description: "The primary architectural challenge of the Blueprint Stage is not to build a product, but to engineer the initial operational and team structures.",
        questions: [
            {
                q: "We're co-founders and close friends, which is great until we hit a major disagreement. How can we create a simple, yet effective, framework for resolving conflicts?",
                a: "You are asking a question about friendship, but you are facing a challenge of governance architecture. The belief that friendship can substitute for a clear, documented decision-making framework is a catastrophic, unexamined assumption.\n\n**The Founders' Governance Blueprint:**\n1. Codify Decision Domains: Assign one founder as the 'Decision Owner' for key functions.\n2. Define a Dispute Resolution Cascade: Agree on a pre-defined resolution process (e.g., 48-hour cooling off).\n3. Schedule Architectural Reviews: Mandate a formal review of this governance blueprint every quarter.",
                principle: "A strong co-founder relationship isn't built on friendship; it's engineered with a clear governance protocol."
            },
            {
                q: "Our 'CEO' and 'CTO' titles are meaningless right now. What's a practical system for assigning and documenting who owns what?",
                a: "This is not a problem of titles; it is a failure in your foundational architecture for defining operational ownership.\n\n**The Role Architecture Matrix:**\n1. Map Core Business Functions.\n2. Assign 'Decision Owner' and 'Execution Owner'.\n3. Implement a 'Request for Comment' (RFC) Process.\n4. Schedule Quarterly Role Audits.",
                principle: "Titles are labels; true operational integrity comes from a clearly defined architecture of ownership and authority."
            },
             {
                q: "I'm being told to split equity 50/50, but I'm working full-time and investing my own money. What is a structured, fair method to divide equity?",
                a: "The belief that equal equity is 'fair' is a catastrophic, unexamined assumption. You are facing a valuation problem.\n\n**The Dynamic Equity Allocation Model:**\n1. Quantify Non-Time Contributions (Cash, IP).\n2. Factor in Time & Risk Differentials.\n3. Implement a Vesting Schedule Tied to Commitment Milestones.\n4. Codify Everything in a Founders' Agreement.",
                principle: "Equity should not be a reflection of equality, but a precise measure of the value and risk contributed to the foundation."
            }
        ]
    },
    {
        id: "foundation-data",
        stage: "Foundation",
        domain: "Data & Metrics",
        title: "The PMF Dashboard",
        description: "Construct a Product-Market Fit (PMF) Dashboard—a robust, real-time system for validating and quantifying your value proposition.",
        questions: [
            {
                q: "What is a 'Minimum Viable Data Stack' we can implement without a data engineer to create a single source of truth?",
                a: "You are not facing a data engineering problem; you are facing a data discipline problem.\n\n**The Manual Single Source of Truth (SSoT):**\n1. Establish a Central Ledger (Notion/Google Doc).\n2. Implement a 'Weekly Synthesis' Ritual.\n3. Use a Product Analytics Tool for Cohorts (free tier).\n4. Operate from the SSoT.",
                principle: "A single source of truth is the output of a disciplined process, not the input of an expensive tool."
            },
            {
                q: "What is a rigorous system for identifying the 3-5 actionable, non-vanity metrics that give us a true, unvarnished signal of product-market fit?",
                a: "You are not measuring progress; you are measuring activity. You need an architecture for measuring what actually matters.\n\n**The PMF Signal Dashboard:**\n1. Activation Rate (Leading Indicator).\n2. Cohort Retention Curve (The Truth).\n3. The Sean Ellis PMF Score (Benchmark).\n4. Churn Rate (The Leak).",
                principle: "Actionable metrics force decisions; vanity metrics fuel delusion."
            },
             {
                q: "Everyone on our team has a different definition of what an 'active user' is. What is a systematic process for creating a shared 'data dictionary'?",
                a: "This is not a problem of disagreement; it is a failure of your language architecture.\n\n**The Living Data Dictionary:**\n1. Start with One Metric ('Active User').\n2. Create a Central Document.\n3. Assign Ownership.\n4. Integrate into Workflow.",
                principle: "A shared data dictionary is the constitution for a data-driven culture."
            }
        ]
    },
    {
        id: "skyline-strategy",
        stage: "Skyline",
        domain: "Strategy & Leadership",
        title: "From Founder to Leader",
        description: "The profound transformation of the founder into an organizational leader, capable of sustained, high-leverage strategic guidance.",
        questions: [
            {
                q: "I've hired a full leadership team, but I'm still the bottleneck. What is a system for transitioning my own role from 'Chief Problem Solver' to 'Chief Architect'?",
                a: "You have not built a leadership team; you have hired a collection of direct reports. You must transition from playing the game to designing it.\n\n**The Architect's Transition Protocol:**\n1. Delegate Through Systems, Not Tasks.\n2. Redefine Your Role as Coach and Mentor.\n3. Shift Focus from In the Business to On the Business.",
                principle: "Your job as a leader is not to make great decisions; it's to build a system that produces great decision-makers."
            },
            {
                q: "Hiring our first VPs has been a painful mix of mis-hires. What is a repeatable, strategic process for defining our executive roles and vetting for 'builder-scaler' DNA?",
                a: "You are not facing a hiring problem; you are facing an architectural mismatch.\n\n**The Builder-Scaler Vetting Framework:**\n1. Screen for a 'Builder' History.\n2. Use a Real-World Strategic Challenge.\n3. Interview for Comfort with Ambiguity.\n4. Onboard for Integration, Not Just Execution.",
                principle: "Don't hire leaders to run your existing playbook; hire them to architect the next chapter of it."
            },
            {
                q: "My calendar is a chaotic mess of back-to-back meetings. What is a personal operating system for a scaling-stage CEO?",
                a: "Your calendar is not the problem; it is a symptom of a failed leadership architecture.\n\n**The CEO's Operating Cadence:**\n1. Implement a Weekly Leadership Meeting (L10).\n2. Hold a Quarterly Offsite.\n3. Block Non-Negotiable 'Think Time'.\n4. Triage All Other Decisions.",
                principle: "A CEO's job is not to be busy; it is to create the space for the few decisions that truly matter."
            }
        ]
    },
    // Placeholders for other cells to ensure the grid works
    {
        id: "blueprint-data",
        stage: "Blueprint",
        domain: "Data & Metrics",
        title: "Architecting for Insight",
        description: "Designing the data collection systems before you have big data.",
        questions: [
            {
                q: "We have no data yet. What should we measure?",
                a: "Measure the quality of your learning, not the quantity of your users.",
                principle: "In the Blueprint stage, learning is the only metric that matters."
            }
        ]
    },
    {
        id: "blueprint-strategy",
        stage: "Blueprint",
        domain: "Strategy & Leadership",
        title: "Designing the Core Narrative",
        description: "Crafting the story that attracts your first believers.",
        questions: [
            {
                q: "How do I tell a story that gets investors excited when I have no product?",
                a: "Sell the problem, not the solution. Investors invest in the size of the pain.",
                principle: "The narrative is the first product you ship."
            }
        ]
    },
    {
        id: "foundation-process",
        stage: "Foundation",
        domain: "Process & Systems",
        title: "Building the Product Engine",
        description: "Transitioning from 'hero mode' coding to a repeatable product delivery machine.",
        questions: [
            {
                q: "How do we ship faster without breaking things?",
                a: "Implement CI/CD and automated testing not as an afterthought, but as a prerequisite.",
                principle: "Speed comes from confidence, not haste."
            }
        ]
    },
    {
        id: "foundation-strategy",
        stage: "Foundation",
        domain: "Strategy & Leadership",
        title: "Forging a Defensible Position",
        description: "Moving from 'people like it' to 'people can't live without it'.",
        questions: [
            {
                q: "Competitors are copying us. What do we do?",
                a: "Ignore them. Focus on your customers' specific pain points that competitors are missing.",
                principle: "Defensibility comes from deep integration, not feature parity."
            }
        ]
    },
    {
        id: "skyline-process",
        stage: "Skyline",
        domain: "Process & Systems",
        title: "The Organizational OS",
        description: "Designing the systems that run the company so you don't have to.",
        questions: [
            {
                q: "How do I get my team to communicate better?",
                a: "Don't ask for better communication. Architect better information flows.",
                principle: "Communication issues are structural issues in disguise."
            }
        ]
    },
    {
        id: "skyline-data",
        stage: "Skyline",
        domain: "Data & Metrics",
        title: "The Growth Accounting System",
        description: "Understanding the mathematical levers of your business model.",
        questions: [
            {
                q: "We are growing but losing money. Why?",
                a: "You need to understand your Unit Economics at a granular level.",
                principle: "Growth without unit economics is just accelerated failure."
            }
        ]
    }
];
