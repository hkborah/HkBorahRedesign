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
            },
            {
                id: "blueprint-process-mvp",
                title: "III. The MVP Blueprint: A System for Scoped Execution",
                description: "Building and launching your MVP with discipline and scope discipline.",
                questions: [
                    {
                        q: "Our MVP launch is perpetually 'two weeks away' because we're stuck in a 'just one more feature' loop. How can we implement a ruthless, hypothesis-driven system to define the absolute bare-minimum product that tests our biggest assumption, and then force ourselves to stick to that scope?",
                        a: "**The Single-Hypothesis MVP Blueprint:**\n• State the Core Hypothesis: Write down, in a single sentence, the one belief that, if false, will kill your entire business. (e.g., 'Sales professionals will pay $20/month to automate follow-up emails.') This is the only thing you are allowed to test.\n• Define the Minimum Feature Set to Test It: List the absolute, bare-minimum user actions required to generate a clear pass/fail signal for that one hypothesis. For the example above: 1) Sign up, 2) Connect email, 3) Enter credit card, 4) See one automated email sent. Nothing else.\n• Create a 'Future Features' Backlog: Every other feature idea, no matter how brilliant, goes into a separate, locked backlog that cannot be touched until the core hypothesis is validated. This provides psychological relief without compromising scope.\n• Define the Success Metric in Advance: Before writing code, define the quantitative outcome that proves the hypothesis. (e.g., '10% of landing page visitors will complete the payment flow.') If you do not hit this number, the hypothesis is false. The experiment is over.",
                        principle: "An MVP is not a product; it is a scientific instrument designed to falsify your single greatest business risk."
                    },
                    {
                        q: "My fear of shipping a buggy, embarrassing V1 is holding us back from launching. What's a simple, practical checklist or framework we can use to define 'good enough for launch,' balancing speed with a baseline level of quality, so we don't ruin our reputation with our first users?",
                        a: "**The Viability Threshold Framework:**\n• Define the 'Critical Learning Path': Identify the single, linear sequence of actions a user must complete to validate your core hypothesis. This might only be three or four clicks. This is the only part of the product that needs to be reliable.\n• Set a 'Stability Mandate' for the Critical Path Only: This path must be tested and functional. Everything else—settings pages, user profiles, edge-case features—can be buggy or non-existent. You are not shipping a house; you are shipping a single, load-bearing beam to see if it holds weight.\n• Establish a 'User Experience Floor': The Critical Learning Path does not need to be beautiful, but it must be usable. A user should be able to complete it without needing a manual. This is your quality floor.\n• Create a 'High-Fidelity Feedback Channel': Give your first ten users a direct line of communication (e.g., your personal cell number) to report any issues on the critical path. This turns bugs from embarrassing failures into valuable, immediate data points.",
                        principle: "The viability of an MVP is measured by its capacity to learn, not its lack of flaws."
                    },
                    {
                        q: "It's just me (non-technical) and one engineer, and our priorities are a mess of bug fixes, new features, and user feedback. What is a dead-simple weekly planning and prioritization process we can use to make sure we're consistently focused on the most important learning objective, not just the loudest request?",
                        a: "**The Weekly Learning Cadence:**\n• Monday: Set the 'Weekly Learning Goal' (30 mins): Start the week by agreeing on the single most important question you need to answer in the next five days. (e.g., 'What is the conversion rate on our new pricing page?'). All work for the week must serve this goal.\n• Tuesday-Thursday: Focused Execution: The engineer's work is focused solely on the tasks required to answer the Weekly Learning Goal. The non-technical founder's work is focused on getting user feedback related to that goal. All other requests are deferred.\n• Friday: Review & Reset (30 mins): Review the data from the week's work. Did you answer the question? Document the learning in a single paragraph. Based on the result, define the candidate for next week's Learning Goal.\n• Maintain a 'Single Prioritized Backlog': All tasks, bugs, and ideas live in one list, prioritized ruthlessly against the current and next potential Learning Goal. This makes prioritization an objective process, not an emotional debate.",
                        principle: "Progress is not measured by activity, but by the disciplined, rhythmic conversion of assumptions into knowledge."
                    },
                    {
                        q: "We're getting great feedback from early users, but it's scattered across emails, texts, and call notes, and I'm worried we're losing it. What's a simple system for a two-person team to capture, organize, and prioritize all this feedback so it systematically drives what we build next week?",
                        a: "**The Unified Feedback Pipeline:**\n• Establish a 'Single Source of Truth': Choose one simple, accessible tool (a dedicated Trello board, a Notion database, even a structured Google Sheet) to be the only place feedback is stored. All notes from calls, emails, and texts must be transferred here within 24 hours. This is a non-negotiable rule.\n• Implement a 'Triage Protocol': Every new piece of feedback must be tagged with three pieces of information: the user's email, the source (e.g., 'User Call'), and a category (e.g., 'Bug', 'Feature Request', 'Usability Issue', 'Key Insight').\n• Conduct a 'Weekly Feedback Synthesis': Every Friday, spend 30 minutes reviewing all the feedback from that week. Your goal is not to create a to-do list, but to identify the most frequently recurring problem or theme.\n• Link Insights to the Next 'Weekly Learning Goal': The primary theme from your synthesis directly informs the following week's Learning Goal. This creates a closed loop between what users are saying and what you are building.",
                        principle: "Raw feedback is a liability; a system for converting it into structured insight is your most valuable asset."
                    }
                ]
            },
            {
                id: "blueprint-process-tech",
                title: "IV. The Foundational Tech Architecture: Building for Iteration, Not Infinity",
                description: "Making strategic decisions about technology infrastructure that prioritize learning velocity over premature optimization.",
                questions: [
                    {
                        q: "As a non-technical founder, I'm getting conflicting advice on our tech stack. Some say 'build for a billion users,' but we have none. What is a practical framework for choosing our initial technology based on what actually matters now: how fast we can build an MVP, how easy it is to hire for, and how cheaply we can change direction?",
                        a: "**The Business-First Tech Stack Framework:**\n• Prioritize 'Speed to Learning': Your primary asset is time. The correct tech stack is the one that allows your team to build, test, and iterate on hypotheses in the shortest possible time. This often means choosing simpler, more established technologies over the latest trends.\n• Assess 'Talent Availability': Your second most critical resource is engineering talent. Choose a stack for which you can easily and affordably hire your first and second engineers. A niche, 'perfect' technology with no available developers is an architectural dead end.\n• Optimize for 'Pivot Cost': The architecture must be cheap to change or discard. Avoid complex, high-commitment systems that lock you into a specific path. Your goal is maximum strategic flexibility, not premature optimization.\n• Leverage 'Managed Services & Open Source': Offload all non-essential infrastructure management to cloud providers and use established open-source libraries. Your engineering resources should be focused exclusively on building your core, proprietary value, not on reinventing the wheel.",
                        principle: "Your initial tech stack is not a foundation for a skyscraper; it is disposable scaffolding for rapid learning."
                    },
                    {
                        q: "I'm constantly fighting with my technical co-founder about speed versus 'doing it right.' How can we establish a process for negotiating technical debt, where we can agree to cut specific corners for the sake of learning faster, but also have a system to track and pay down that debt before it kills us?",
                        a: "**The Conscious Debt Accrual Protocol:**\n• Categorize All Debt: Classify every shortcut as either 'Learning Debt' (a conscious trade-off made to validate a critical hypothesis faster) or 'Sloppiness Debt' (unnecessary laziness or poor craftsmanship). Only Learning Debt is strategically permissible.\n• Maintain a 'Debt Registry': Create a simple, shared document where every piece of Learning Debt is recorded. The entry must include what it is, why it was incurred, and the estimated cost (in engineering hours) to fix it.\n• Set 'Debt Ceilings': Agree on a maximum amount of technical debt (e.g., 'no more than 40 hours of total refactoring work') that can be carried at any one time. You cannot take on new debt if you are at your ceiling.\n• Schedule 'Debt Repayment Sprints': Dedicate a fixed percentage of every development cycle (e.g., 15% of engineering time) to paying down items from the Debt Registry. This is a non-negotiable part of your operational budget.",
                        principle: "Technical debt is not a moral failing; it is a strategic financial instrument that must be consciously managed, not emotionally debated."
                    },
                    {
                        q: "We just burned three weeks building a custom settings page instead of working on our core value proposition. What is a simple decision-making framework we can use to quickly decide whether to build a feature ourselves, use a no-code tool, or integrate a third-party service, so we stop wasting engineering time on non-essential work?",
                        a: "**The Core vs. Commodity Decision Matrix:**\n• Define Your 'Core Innovation Zone': Write down the one or two things that are uniquely your company's intellectual property and the primary reason customers will choose you. This is your Core. Everything else is a commodity.\n• Classify Every Feature Request: For any new feature, ask: 'Is this part of our Core Innovation Zone?' If the answer is no, it is a 'Commodity' function (e.g., authentication, billing, admin panels).\n• Apply the Build/Integrate/Buy Rule:\n  - Build: Only allocate engineering resources to build features that fall within your Core Innovation Zone.\n  - Integrate/Buy: For all Commodity functions, the default action is to use a third-party API or service.\n  - No-Code: Use no-code tools for internal processes or temporary, non-critical prototypes, never for core product infrastructure.",
                        principle: "Engineering resources are for building your unique competitive advantage, not for reinventing commodity infrastructure."
                    },
                    {
                        q: "I'm overwhelmed by analytics tools. What is the bare-minimum set of tracking and analytics we need to install from day one to answer our most critical business questions, without getting bogged down in complex setups and useless vanity metrics?",
                        a: "**The Minimum Viable Analytics Blueprint:**\n• Identify the 'One Metric That Matters' (OMTM): Based on your current core hypothesis, define the single data point that proves or disproves it (e.g., 'Conversion rate on the payment page,' 'Number of users who complete the core workflow'). This is your OMTM for this stage.\n• Instrument the 'Critical Path': Install analytics to track only the user's journey along the critical path that leads to the OMTM. Ignore every other page, button, and metric.\n• Build a 'Manual Funnel': Instead of a complex dashboard, create a simple spreadsheet. Manually track the number of users who enter each step of your critical path each week. This forces you to internalize the data and feel the drop-offs viscerally.\n• Pair Quantitative with Qualitative: The numbers tell you what is happening; you need a system to find out why. For every user who drops off the critical path, you must have a system to attempt to find out why (e.g., a pop-up survey, a triggered email).",
                        principle: "The goal of early-stage analytics is not to know everything; it is to know the one thing that matters most, right now."
                    }
                ]
            },
            {
                id: "blueprint-process-hiring",
                title: "V. The First Hire Protocol: Systematizing Early Team Building",
                description: "Architecting your first hire to be a strategic co-builder rather than just an employee executing tasks.",
                questions: [
                    {
                        q: "As a non-technical founder, I'm ready to hire my first engineer, but I don't know if I need an order-taker who can just code my specs, or a strategic partner who will challenge my ideas. How do I figure out which profile is right for me, and how does that choice impact the job description, the questions I ask, and the salary I offer?",
                        a: "**The General vs. Soldier Hiring Framework:**\n• Acknowledge Your Architectural Gap: As a non-technical founder, you have a critical gap in your strategic architecture. You must hire a 'General' – someone who can own the entire technical strategy, not just execute tasks. A 'Soldier' is a luxury for later-stage companies with established technical leadership.\n• Write a 'Problem' Job Description, Not a 'Task' List: Your job description should not list technologies. It should describe the business problem you are solving and the mission you are on. You are looking for someone who is excited by the problem, not the tools.\n• Interview for Product Sense and Scrappiness: Your interview process must test for business and product intuition. Ask questions like, 'Here's our core hypothesis. What's the simplest possible experiment you would build to test it?' or 'Tell me about a time you built something with severe constraints'.\n• Compensate with Significant Equity: A 'General' is a quasi-founder and must be compensated as such. This means a lower initial salary but a significant equity stake, vesting over time. They are taking a foundational risk and must share in the foundational upside.",
                        principle: "A non-technical founder's first engineer is not an employee; they are the missing pillar of the company's foundational architecture."
                    },
                    {
                        q: "I know asking Google-style algorithm questions is the wrong way to hire for a chaotic, early-stage startup. How can I design an interview process that actually screens for the things that matter here, like a candidate's ability to handle uncertainty, their gut for product, and their instinct to build the simplest possible thing?",
                        a: "**The Pragmatic Builder Interview Protocol:**\n• The 'Deconstruction' Session (30 mins): Present your core business problem and current MVP idea. Ask the candidate to spend 30 minutes deconstructing it with you. You are looking for their ability to ask clarifying questions, identify the riskiest assumptions, and simplify the problem.\n• The 'Whiteboard Architecture' Test (45 mins): Ask them to sketch the simplest possible technical architecture to test the single biggest risk identified in the previous session. The goal is not a perfect diagram, but to see if their instinct is to reach for simple, off-the-shelf tools or to over-engineer a complex solution.\n• The 'Past Project Archeology' (45 mins): Ask them to walk you through a past project they built. Do not ask what they did; ask why they made specific technical trade-offs. Probe for instances where they consciously chose a 'good enough' solution to ship faster.\n• The 'Ambiguity' Scenario: Describe a realistic scenario where user feedback completely invalidates the last two weeks of work. Ask them how they would feel and what they would do next. You are testing for resilience and a focus on learning over coding.",
                        principle: "Don't test if they can build the right thing; test if they have the instinct to find the right thing to build."
                    },
                    {
                        q: "We're about to bring on our first employee, and we have no formal processes. What's a 'minimum viable onboarding' plan we can create to make sure our new hire understands our goals, our code, and how we work, so they can be productive in their first month instead of feeling lost?",
                        a: "**The 30-Day Immersion Blueprint:**\n• Week 1: The 'Brain Dump' & Customer Immersion: The first week is dedicated to knowledge transfer. The new hire's only job is to read every key document and listen to at least five recorded customer interviews. They must produce a one-page summary of their understanding of the problem, vision, and key risks.\n• Week 2: The 'First Small Win': Assign a small, well-defined, low-risk project that can be completed within one week. The goal is not the output, but for them to learn the codebase, the deployment process, and how to get unstuck by asking questions.\n• Week 3: The 'Hypothesis Ownership': Give them ownership of a single, small learning goal for the week. They are responsible for defining the experiment, building the minimum required feature, and presenting the results (and their interpretation) at the end of the week.\n• Week 4: The '30-Day Retroactive': At the end of the month, the new hire leads a meeting where they present: 1) What they believe the company's biggest strengths are, 2) What they see as the biggest risks or blind spots, and 3) Their proposed goals for the next 60 days.",
                        principle: "The purpose of early-stage onboarding is not to train an employee, but to accelerate their transformation into a strategic partner."
                    },
                    {
                        q: "How can I set meaningful goals for my first hire when we don't have metrics like revenue or user growth yet? What's a framework for setting 30/60/90-day objectives that are tied to validating hypotheses and running experiments, rather than just checking off a list of features?",
                        a: "**The Learning Velocity Objectives Framework:**\n• Define a 30-Day 'De-Risking' Goal: The first month's objective must be tied to validating or invalidating the company's single biggest assumption. The goal is not 'Build feature X,' but 'Run an experiment that gives us a clear signal on whether users will pay for X.'\n• Set a 60-Day 'Capability' Goal: The second month's objective should focus on building a new, repeatable capability for the company. Examples: 'Build a system for deploying experiments in under an hour,' or 'Create a repeatable process for recruiting and interviewing five users per week.'\n• Establish a 90-Day 'Insight' Goal: The third month's objective should be to generate a major new insight that changes the company's direction. The goal is not to complete a roadmap, but to produce evidence that forces a significant change to the roadmap.\n• Measure 'Experiment Velocity' as the Core KPI: The primary metric for performance is not features shipped, but the number of well-designed experiments run per month. This aligns their incentives with the company's true need: learning.",
                        principle: "In a pre-product/market fit startup, performance is not measured by the output of work, but by the velocity of validated learning."
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
