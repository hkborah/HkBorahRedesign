
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
    // BLUEPRINT STAGE
    {
        id: "blueprint-process",
        stage: "Blueprint",
        domain: "Process & Systems",
        title: "Engineering the Founding Team",
        description: "The primary architectural challenge of the Blueprint Stage is not to build a product, but to engineer the initial operational and team structures.",
        questions: [
            {
                q: "We're co-founders and close friends... How can we create a simple, yet effective, framework for resolving conflicts?",
                a: "**The Founders' Governance Blueprint:**\n1. Codify Decision Domains: Assign one founder as the 'Decision Owner' for key functions.\n2. Define a Dispute Resolution Cascade: Agree on a pre-defined resolution process (e.g., 48-hour cooling off).\n3. Schedule Architectural Reviews: Mandate a formal review of this governance blueprint every quarter.",
                principle: "A strong co-founder relationship isn't built on friendship; it's engineered with a clear governance protocol."
            },
            {
                q: "Our 'CEO' and 'CTO' titles are meaningless right now... What's a practical system for assigning and documenting who owns what?",
                a: "**The Role Architecture Matrix:**\n1. Map Core Business Functions.\n2. Assign 'Decision Owner' and 'Execution Owner'.\n3. Implement a 'Request for Comment' (RFC) Process.\n4. Schedule Quarterly Role Audits.",
                principle: "Titles are labels; true operational integrity comes from a clearly defined architecture of ownership and authority."
            },
            {
                q: "I'm being told to split equity 50/50... What is a structured, fair method to divide equity?",
                a: "**The Dynamic Equity Allocation Model:**\n1. Quantify Non-Time Contributions (Cash, IP).\n2. Factor in Time & Risk Differentials.\n3. Implement a Vesting Schedule Tied to Commitment Milestones.\n4. Codify Everything in a Founders' Agreement.",
                principle: "Equity should not be a reflection of equality, but a precise measure of the value and risk contributed to the foundation."
            },
            {
                q: "My idea of 'full-time' and my co-founder's are completely different... How do we establish a clear 'Founder Service Level Agreement'?",
                a: "**The Founder Commitment Protocol:**\n1. Define 'Core Operational Hours'.\n2. Establish Communication Response Time Standards.\n3. Codify an External Commitments Policy.\n4. Set a Regular Cadence for Protocol Review.",
                principle: "Assumed alignment is the most dangerous form of operational debt; codify all commitments."
            }
        ]
    },
    {
        id: "blueprint-data",
        stage: "Blueprint",
        domain: "Data & Metrics",
        title: "Architecting for Insight",
        description: "In the Blueprint Stage, the primary architectural challenge is not to gather vast quantities of data, but to architect for actionable insight.",
        questions: [
            {
                q: "We're pre-launch... What is the 'Day Zero' data architecture we should be building now?",
                a: "**The Pre-Traction Dashboard:**\n1. Measure 'Customer Interview Velocity'.\n2. Track 'Hypotheses Tested per Week'.\n3. Optimize for 'Time-to-Learning'.",
                principle: "Before you can measure the growth of your business, you must first measure the velocity of your learning."
            },
            {
                q: "My co-founder and I look at the same, limited data and come to completely different conclusions... What is a structured framework to avoid 'data-driven' stalemates?",
                a: "**The Hypothesis Alignment Framework:**\n1. Co-Author a Falsifiable Hypothesis.\n2. Pre-Commit to Success and Failure Metrics.\n3. Conduct a 'Data Autopsy,' Not a Debate.",
                principle: "Data does not create alignment; a disciplined framework for interrogating data does."
            },
            {
                q: "I'm being told to design our initial data model for massive scale... What is a first-principles approach to architecting a 'disposable' data model?",
                a: "**The Iterative Data Schema:**\n1. Optimize for Write Speed, Not Read Speed.\n2. Build for Refactoring, Not Permanence.\n3. Delay the Data Warehouse.",
                principle: "Your initial data model is not a foundation for a skyscraper; it is disposable scaffolding for rapid learning."
            },
            {
                q: "We're about to start collecting user data. What is a 'Minimum Viable Governance' checklist?",
                a: "**The Day-One Data Governance Checklist:**\n1. Radical Transparency in Plain English.\n2. Implement 'Active Consent' (Clickwrap).\n3. Practice Data Minimization.\n4. Have a Simple Breach Response Plan.",
                principle: "Your initial data policies are not about avoiding lawsuits; they are about architecting a foundation of trust with your first users."
            }
        ]
    },
    {
        id: "blueprint-strategy",
        stage: "Blueprint",
        domain: "Strategy & Leadership",
        title: "Designing the Core Narrative",
        description: "In the Blueprint Stage, the primary challenge is designing, testing, and refining your core narrative—the story that attracts your first believers.",
        questions: [
            {
                q: "My co-founder is my best friend, but we've never formally discussed equity... What is a structured process for creating a Founders' Agreement?",
                a: "**The Founders' Governance Blueprint:**\n1. Define Roles & Responsibilities.\n2. Codify Rights & Rewards.\n3. Clarify Commitments & Contingencies.",
                principle: "A strong co-founder relationship isn't built on friendship; it's engineered with a clear governance protocol."
            },
            {
                q: "How do we build a compelling 'strategic narrative' that frames our company as a movement?",
                a: "**The Strategic Narrative Framework:**\n1. Name a Big, Relevant Change in the World.\n2. Show There Will Be Winners and Losers.\n3. Tease the 'Promised Land'.\n4. Introduce Features as 'Magic'.",
                principle: "Don't sell a product; sell a point of view on how the world is changing."
            },
            {
                q: "Everyone says 'culture is important,' but that feels like a problem for later. What is a practical, day-one system for intentionally designing our culture?",
                a: "**The Culture-by-Design Blueprint:**\n1. Define Values as Verbs.\n2. Architect with the 'Words-Actions-Behaviors' Framework.\n3. Operationalize Values in Hiring.",
                principle: "Culture is not what you write on the wall; it is the sum of the behaviors you reward and tolerate."
            },
            {
                q: "My co-founder and I have very different personal financial situations... What is a process for having an open conversation about our individual goals?",
                a: "**The Founder Alignment Protocol:**\n1. Share Personal Runways.\n2. Define 'Ramen Profitable' as the First Milestone.\n3. Align on the Fundraising Trigger.\n4. Codify in the Founders' Agreement.",
                principle: "Co-founder alignment is not just about vision; it is about a shared, transparent understanding of the venture's financial and personal constraints."
            }
        ]
    },

    // FOUNDATION STAGE
    {
        id: "foundation-process",
        stage: "Foundation",
        domain: "Process & Systems",
        title: "Building the Product Engine",
        description: "Transitioning from ad-hoc creation to the disciplined construction of a repeatable product engine.",
        questions: [
            {
                q: "We're drowning in user feedback... What is a repeatable system for triaging all this inbound feedback?",
                a: "**The Unified Feedback Pipeline:**\n1. Establish a Single Source of Truth.\n2. Implement a Triage Protocol.\n3. Conduct a Weekly Synthesis.\n4. Link Insights to Strategic Goals.",
                principle: "Raw feedback is a liability; a system for converting it into structured insight is your most valuable asset."
            },
            {
                q: "What is a lightweight but disciplined product development process that allows us to maintain velocity?",
                a: "**The Disciplined Velocity Framework:**\n1. Adopt Two-Week Sprints.\n2. Allocate a 'Debt & Quality' Budget.\n3. Establish a 'Definition of Done'.\n4. Hold Weekly Demos.",
                principle: "True speed is not about how fast you can build; it's about how quickly you can ship value without breaking the foundation."
            },
            {
                q: "We have a growing list of feature requests... What is a process for evaluating new feature ideas?",
                a: "**The Core Value Proposition Filter:**\n1. Define the Core Job-to-be-Done.\n2. Apply the Filter.\n3. Use the 'No, and Here's Why' Protocol.\n4. Maintain an 'Idea Backlog'.",
                principle: "Focus is not saying yes to the right thing; it is a system for saying no to a thousand good ideas."
            },
            {
                q: "What is a process for conducting a 'scalability audit' on our current tech stack?",
                a: "**The 10x Scalability Audit:**\n1. Identify Core Workflows.\n2. Simulate 10x Load.\n3. Locate the First Bottleneck.\n4. Prioritize the Fix.",
                principle: "Don't build for infinite scale; identify and fix the next most likely point of failure."
            },
             {
                q: "What is the 'minimum viable onboarding process' we can build?",
                a: "**The Minimum Viable Onboarding Blueprint:**\n1. Map the 'Aha!' Moment.\n2. Automate the Path.\n3. Create a 'Founder Welcome Video'.\n4. Offer Group 'Office Hours'.",
                principle: "The goal of scalable onboarding is not to eliminate the founder, but to codify the founder's knowledge into a repeatable system."
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
                q: "What is a 'Minimum Viable Data Stack' we can implement without a data engineer?",
                a: "**The Manual Single Source of Truth (SSoT):**\n1. Establish a Central Ledger.\n2. Implement a 'Weekly Synthesis' Ritual.\n3. Use a Product Analytics Tool for Cohorts.\n4. Operate from the SSoT.",
                principle: "A single source of truth is the output of a disciplined process, not the input of an expensive tool."
            },
            {
                q: "What is a rigorous system for identifying the 3-5 actionable, non-vanity metrics?",
                a: "**The PMF Signal Dashboard:**\n1. Activation Rate.\n2. Cohort Retention Curve.\n3. The Sean Ellis PMF Score.\n4. Churn Rate.",
                principle: "Actionable metrics force decisions; vanity metrics fuel delusion."
            },
            {
                q: "What is a systematic process for creating a shared 'data dictionary'?",
                a: "**The Living Data Dictionary:**\n1. Start with One Metric.\n2. Create a Central Document.\n3. Assign Ownership.\n4. Integrate into Workflow.",
                principle: "A shared data dictionary is the constitution for a data-driven culture."
            },
            {
                q: "What is a process for identifying the 'critical path' in our product?",
                a: "**The Critical Path to Value Framework:**\n1. Qualitatively Identify the 'Aha!' Moment.\n2. Map the Critical Steps.\n3. Instrument Only the Milestones.\n4. Define and Measure Activation.",
                principle: "Don't track what users do; track if they succeed in finding value."
            },
            {
                q: "What is a system for diagnosing 'False Product-Market Fit'?",
                a: "**The Leading vs. Lagging Indicator Framework:**\n1. Identify Leading Indicators (Hope).\n2. Identify Lagging Indicators (Evidence).\n3. The PMF Litmus Test.",
                principle: "Leading indicators give you the right to keep playing the game; lagging indicators tell you that you're starting to win."
            }
        ]
    },
    {
        id: "foundation-strategy",
        stage: "Foundation",
        domain: "Strategy & Leadership",
        title: "Forging a Defensible Position",
        description: "Transitioning from merely achieving traction to forging a truly defensible position in the market.",
        questions: [
            {
                q: "What is a data-driven process for definitive choosing our beachhead Ideal Customer Profile (ICP)?",
                a: "**The Power User Signal Framework:**\n1. Isolate the Highest Retention Cohort.\n2. Analyze Their Attributes.\n3. Interview for the 'Job To Be Done'.\n4. Ruthlessly Redefine and Refocus.",
                principle: "Don't choose your ideal customer; let your best-retained users choose them for you."
            },
            {
                q: "What is a strategic framework for building a durable, long-term competitive moat?",
                a: "**The Moat Architecture Blueprint:**\n1. Identify Your 'Secret Sauce'.\n2. Build a Data Flywheel.\n3. Engineer a Network Effect.\n4. Cultivate a Brand of Trust.",
                principle: "A true moat is not built from features; it is architected from the unique structure of your business."
            },
            {
                q: "How do we evolve our strategic narrative to a compelling vision of the future?",
                a: "**The Promised Land Narrative:**\n1. Name a Big, Relevant Change in the World.\n2. Show There Will Be Winners and Losers.\n3. Tease the 'Promised Land'.\n4. Introduce Your Product as 'Magic'.",
                principle: "Stop selling your product; start selling a point of view on how the world is changing."
            },
            {
                q: "What is a non-emotional, evidence-based framework for making the 'pivot or persevere' decision?",
                a: "**The Pivot/Persevere Decision Matrix:**\n1. Assess Leading Indicators (The Signal).\n2. Assess Lagging Indicators (The Runway).\n3. Evaluate the Next Testable Hypothesis.\n4. Make the Call.",
                principle: "Perseverance without a clear next hypothesis is not grit; it is a slow death."
            }
        ]
    },

    // SKYLINE STAGE
    {
        id: "skyline-process",
        stage: "Skyline",
        domain: "Process & Systems",
        title: "The Organizational OS",
        description: "Evolving from functional teams to a fully integrated Organizational Operating System (OS).",
        questions: [
            {
                q: "How do we implement a formal operating system, like EOS or OKRs, without introducing soul-crushing corporate bureaucracy?",
                a: "**The Entrepreneurial Operating System (EOS) Blueprint:**\n1. Clarify the Vision.\n2. Define Accountability.\n3. Set Quarterly 'Rocks'.\n4. Install a Meeting Pulse.",
                principle: "Scaling requires moving from a culture of personality to a culture of process."
            },
            {
                q: "What is a process for creating a true leadership team... that doesn't require my constant intervention?",
                a: "**The Leadership Team Operating System:**\n1. Implement a Weekly Leadership Meeting.\n2. Use the Accountability Chart.\n3. Mandate Cross-Functional Rocks.\n4. Establish a 'State of the Company' Cadence.",
                principle: "A true leadership team is not a group of people who report to the CEO; it is a system that solves problems for the CEO."
            },
            {
                q: "What is a framework for safely delegating significant decision-making authority?",
                a: "**The Delegated Authority Framework:**\n1. Triage with 'One-Way vs. Two-Way Doors'.\n2. Define 'Guardrails,' Not Prescriptions.\n3. Implement a 'Disagree and Commit' Protocol.\n4. Use a Decision Log.",
                principle: "Your job as a leader is not to make great decisions; it's to build a system that produces great decision-makers."
            },
            {
                q: "What is a process for annual and quarterly strategic planning that allows us to manage this complexity?",
                a: "**The Annual & Quarterly Planning Cadence (EOS):**\n1. Annual Planning (Two Days).\n2. Quarterly Planning (One Day).\n3. Cascade Priorities.\n4. Weekly Review.",
                principle: "Strategic planning is not a one-time event; it is a disciplined, rhythmic process that aligns the entire organization."
            }
        ]
    },
    {
        id: "skyline-data",
        stage: "Skyline",
        domain: "Data & Metrics",
        title: "The Growth Accounting System",
        description: "Elevating beyond simple KPIs and constructing a sophisticated Growth Accounting System.",
        questions: [
            {
                q: "What is the 'minimum viable data stack' for a scaling company?",
                a: "**The Scalable Data Foundation:**\n1. Centralize with a Data Warehouse.\n2. Automate Ingestion (ELT).\n3. Hire a 'Data Generalist' First.\n4. Implement a BI Tool.",
                principle: "A scalable company is built on a scalable data foundation, not on a collection of spreadsheets."
            },
            {
                q: "What is a practical system for creating and enforcing a company-wide 'data dictionary'?",
                a: "**The Centralized Data Dictionary Protocol:**\n1. Establish a Governance Council.\n2. Use a Dedicated Tool.\n3. Link Definitions to Dashboards.\n4. Treat Changes as a Release.",
                principle: "A shared data dictionary is the constitution for a data-driven culture."
            },
            {
                q: "What is a lightweight but effective data governance framework we can implement now?",
                a: "**The Minimum Viable Governance Framework:**\n1. Appoint a Data Protection Officer (DPO).\n2. Implement Role-Based Access Control (RBAC).\n3. Conduct a Data Audit and Classification.\n4. Automate Data Subject Requests.",
                principle: "At scale, data governance is not an optional chore; it is a foundational pillar of customer trust and risk management."
            },
            {
                q: "What is the process for separating our production and analytical data stores?",
                a: "**The Production/Analytics Decoupling Process:**\n1. Set Up a Read Replica.\n2. Implement Change Data Capture (CDC).\n3. Migrate Dashboards Sequentially.\n4. Deprecate Direct Access.",
                principle: "A scalable architecture never forces its transactional and analytical systems to compete for the same resources."
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
                q: "What is a system for transitioning my own role from 'Chief Problem Solver' to 'Chief Architect'?",
                a: "**The Architect's Transition Protocol:**\n1. Delegate Through Systems, Not Tasks.\n2. Redefine Your Role as Coach and Mentor.\n3. Shift Focus from In the Business to On the Business.",
                principle: "Your job as a leader is not to make great decisions; it's to build a system that produces great decision-makers."
            },
            {
                q: "What is a repeatable, strategic process for defining our executive roles and vetting for 'builder-scaler' DNA?",
                a: "**The Builder-Scaler Vetting Framework:**\n1. Screen for a 'Builder' History.\n2. Use a Real-World Strategic Challenge.\n3. Interview for Comfort with Ambiguity.\n4. Onboard for Integration, Not Just Execution.",
                principle: "Don't hire leaders to run your existing playbook; hire them to architect the next chapter of it."
            },
            {
                q: "What is a personal operating system for a scaling-stage CEO?",
                a: "**The CEO's Operating Cadence:**\n1. Implement a Weekly Leadership Meeting (L10).\n2. Hold a Quarterly Offsite.\n3. Block Non-Negotiable 'Think Time'.\n4. Triage All Other Decisions.",
                principle: "A CEO's job is not to be busy; it is to create the space for the few decisions that truly matter."
            },
            {
                q: "What is a structured process for a technical or product-focused founder to gracefully 'fire themselves' from their old job?",
                a: "**The Founder's Role Evolution Protocol:**\n1. Redefine Your Role as 'Keeper of the Vision'.\n2. Transition from Approver to Advisor.\n3. Channel Your Energy into a New Domain.\n4. Create a Formal Review Cadence.",
                principle: "To scale your company, you must be willing to give away your Legos, especially the ones you love most."
            }
        ]
    }
];
