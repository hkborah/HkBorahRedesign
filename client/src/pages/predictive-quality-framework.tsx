import * as React from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Compass, Cpu, Search, Wrench, Gauge, CheckCircle2, Download, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import logoUrl from "@assets/HKB Transparent_1764559024056.png";

const PHASES = [
  {
    letter: "D",
    word: "Discover",
    icon: Search,
    text: "Use AI to scan your data – call notes, transaction logs, agent comments – and find hidden patterns, correlations, and anomalies that no human could spot.",
  },
  {
    letter: "M",
    word: "Model",
    icon: Cpu,
    text: "Build simple predictive models from those patterns. Forecast defects before they happen. Identify leading indicators.",
  },
  {
    letter: "A",
    word: "Analyse",
    icon: Compass,
    text: "Apply human judgment. Validate the model's findings. Separate genuine signal from random noise. Ask “why” – the machine can't.",
  },
  {
    letter: "I",
    word: "Intervene",
    icon: Wrench,
    text: "Act on the predictions. Fix root causes. Redesign processes. Test changes on a digital twin before touching the real system.",
  },
  {
    letter: "C",
    word: "Calibrate",
    icon: Gauge,
    text: "Keep the system sharp. Set dynamic control limits. Retrain models as the world changes. Adjust alert thresholds based on real costs.",
  },
];

const ROADMAP = [
  {
    timeframe: "Weeks 1‑4",
    phase: "Discover (D)",
    detail:
      "Pick one problem. Export your data (even a spreadsheet). Use a free AI tool like Orange or Hugging Face AI Sheets to find hidden patterns. No coding. No data science team.",
  },
  {
    timeframe: "Weeks 5‑8",
    phase: "Model (M)",
    detail:
      "Build a simple predictive model. Akkio, Obviously AI, or AutoGluon (all free tiers). The model will tell you which combinations of factors predict a defect.",
  },
  {
    timeframe: "Week 9",
    phase: "Analyse & Intervene (A + I)",
    detail:
      "Validate the model with your team. Pick one small fix. Test it on a digital twin (even a spreadsheet simulation) or run a tiny live pilot on one team.",
  },
  {
    timeframe: "Weeks 10‑11",
    phase: "Intervene & Calibrate (I + C)",
    detail:
      "Roll out the fix. Measure the results. Set alerts at the right threshold (not too many false alarms). Retrain the model with new data.",
  },
  {
    timeframe: "Week 12",
    phase: "Calibrate & Scale (C)",
    detail:
      "Review what worked. Document the learning. Plan your next 90 days. You're no longer a firefighter – you're an architect.",
  },
];

const WHY_IT_WORKS = [
  {
    title: "Leverages existing Six Sigma muscle memory",
    text: "Same five letters, same order. No retraining required.",
  },
  {
    title: "AI‑first, not AI‑only",
    text: "The machine discovers and models. You analyse, intervene, and calibrate. Partnership, not replacement.",
  },
  {
    title: "Practical, not theoretical",
    text: "No PhD needed. Use open‑source tools, free tiers, and your existing data.",
  },
];

const ZEROS = [
  {
    title: "Zero risk",
    text: "Start with a silent pilot. Don't change anything. Just run the AI in the background and compare its predictions to reality.",
  },
  {
    title: "Zero licence fees",
    text: "Every tool recommended in The Last Firefighter is open source or has a free tier.",
  },
  {
    title: "Zero data science hires",
    text: "If you can use Excel, you can use these tools.",
  },
  {
    title: "Zero disruption",
    text: "Your team keeps doing their jobs. The AI just gives them better information.",
  },
];

export default function PredictiveQualityFramework() {
  React.useEffect(() => {
    const prevTitle = document.title;
    document.title = "The Predictive Quality Framework (D‑M‑A‑I‑C) | HK Borah";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-950 flex flex-col">
        {/* Header */}
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <Link href="/">
            <img
              src={logoUrl}
              alt="HK Borah"
              className="h-8 object-contain opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
              data-testid="img-logo"
            />
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-slate-400 hover:text-amber-500 gap-2" data-testid="button-back">
              <ArrowLeft className="h-4 w-4" /> Back to Interface
            </Button>
          </Link>
        </div>

        <div className="container mx-auto px-6 py-12 max-w-7xl space-y-24">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <span className="text-amber-500 font-mono text-sm uppercase tracking-widest block">
              The Predictive Quality Framework (D‑M‑A‑I‑C)
            </span>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-100" data-testid="text-hero-title">
              Stop Fighting Fires.<br />
              <span className="text-amber-500">Start Architecting Calm.</span>
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed font-light">
              Every quality professional knows the 2&nbsp;AM phone call. Another defect. Another crisis. Another exhausted team.
            </p>
            <div className="space-y-4 text-base text-slate-400 leading-relaxed font-light">
              <p>
                For decades, we've relied on DMAIC – Define, Measure, Analyse, Improve, Control. It works. But the world has changed. Processes are faster, data is messier, and defects often come from combinations no human can see.
              </p>
              <p>
                That's where AI comes in. But you don't need to become a data scientist. You need a framework.
              </p>
              <p className="text-slate-300">
                Introducing the Predictive Quality Framework: <span className="text-amber-400 font-medium">D‑M‑A‑I‑C</span>.
                The same five letters. A radically different meaning. Designed for the age of AI.
              </p>
            </div>
          </div>

          {/* Framework Explained */}
          <div className="space-y-12">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-800" />
              <span className="text-sm font-mono text-slate-500 uppercase tracking-widest">
                01. The Framework Explained
              </span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-serif font-bold text-slate-100">What is D‑M‑A‑I‑C?</h2>
              <p className="text-lg text-slate-400 font-light leading-relaxed max-w-4xl">
                It's a five‑stage model for moving your quality operations from reactive firefighting to predictive prevention.
                It mirrors the familiar rhythm of Six Sigma's DMAIC, but each phase now integrates AI where it matters most –
                without losing human judgment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {PHASES.map((phase, idx) => {
                const Icon = phase.icon;
                return (
                  <div
                    key={phase.letter}
                    className="border border-slate-800 bg-slate-900/30 rounded-lg p-6 flex flex-col gap-4 hover:border-amber-500/40 transition-colors"
                    data-testid={`card-phase-${phase.letter.toLowerCase()}`}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="text-5xl font-serif font-bold text-amber-500">{phase.letter}</span>
                      <span className="font-mono text-xs text-slate-500">0{idx + 1}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <Icon className="h-4 w-4 text-amber-400" />
                      <h3 className="text-xl font-serif">{phase.word}</h3>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed font-light">{phase.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Why It Works */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-800" />
              <span className="text-sm font-mono text-slate-500 uppercase tracking-widest">
                02. Why D‑M‑A‑I‑C Works
              </span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {WHY_IT_WORKS.map((item) => (
                <div
                  key={item.title}
                  className="border border-slate-800 bg-slate-900/20 rounded-lg p-6 space-y-3"
                  data-testid={`card-why-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                >
                  <CheckCircle2 className="h-5 w-5 text-amber-500" />
                  <h3 className="text-lg font-serif text-slate-100">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 90-Day Roadmap */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-800" />
              <span className="text-sm font-mono text-slate-500 uppercase tracking-widest">
                03. Apply D‑M‑A‑I‑C in 90 Days
              </span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <div className="space-y-6 max-w-4xl">
              <h2 className="text-4xl font-serif font-bold text-slate-100">The 90‑Day Implementation Roadmap</h2>
              <p className="text-lg text-slate-400 font-light leading-relaxed">
                You don't need a six‑month pilot or a million‑rupee budget. The D‑M‑A‑I‑C framework is designed to be operational from day one. Here's how any organisation – call centre, bank, hospital, factory, BPO – can implement it in just 90 days.
              </p>
            </div>

            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/20">
              <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 border-b border-slate-800 bg-slate-900/40">
                <div className="md:col-span-2 text-xs font-mono text-slate-500 uppercase tracking-widest">Timeframe</div>
                <div className="md:col-span-3 text-xs font-mono text-slate-500 uppercase tracking-widest">Phase</div>
                <div className="md:col-span-7 text-xs font-mono text-slate-500 uppercase tracking-widest">What You Do</div>
              </div>
              {ROADMAP.map((row, idx) => (
                <div
                  key={row.timeframe}
                  className={`md:grid md:grid-cols-12 gap-4 px-6 py-5 ${
                    idx !== ROADMAP.length - 1 ? "border-b border-slate-800" : ""
                  } hover:bg-slate-900/30 transition-colors`}
                  data-testid={`row-roadmap-${idx}`}
                >
                  <div className="md:col-span-2 text-amber-400 font-mono text-sm mb-2 md:mb-0">{row.timeframe}</div>
                  <div className="md:col-span-3 text-slate-200 font-serif text-base mb-2 md:mb-0">{row.phase}</div>
                  <div className="md:col-span-7 text-slate-400 font-light leading-relaxed text-sm">{row.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Why This Works (Zeros) */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-800" />
              <span className="text-sm font-mono text-slate-500 uppercase tracking-widest">
                04. Why This Works (And Why It's Obvious)
              </span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ZEROS.map((item) => (
                <div
                  key={item.title}
                  className="border border-slate-800 bg-slate-900/20 rounded-lg p-6 flex gap-4 items-start"
                  data-testid={`card-zero-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                >
                  <div className="text-3xl font-serif font-bold text-amber-500 leading-none">0</div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-serif text-slate-100">{item.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-light">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-8 max-w-3xl mx-auto text-center space-y-3">
              <span className="text-xs font-mono text-amber-500 uppercase tracking-widest block">
                The Only Thing You Need
              </span>
              <p className="text-xl text-slate-200 font-serif italic">
                A single problem. A single spreadsheet. And the willingness to try.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-8 border-t border-slate-900 pt-24">
            <div className="space-y-4 max-w-3xl">
              <span className="text-amber-500 font-mono text-sm uppercase tracking-widest block">05. Ready to Start Your 90 Days?</span>
              <h2 className="text-4xl font-serif font-bold text-slate-100">From Firefighter to Architect</h2>
              <p className="text-slate-400 font-light leading-relaxed text-lg">
                The complete step‑by‑step plan – including a printable checklist, tool recommendations, and case files for every industry – is in Chapter 28 of <span className="italic">The Last Firefighter</span>.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://notionpress.com/"
                target="_blank"
                rel="noreferrer"
                data-testid="link-notionpress"
              >
                <Button variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-slate-950 gap-2">
                  <ExternalLink className="h-4 w-4" /> Buy the Book on NotionPress
                </Button>
              </a>
              <a
                href="https://www.amazon.com/"
                target="_blank"
                rel="noreferrer"
                data-testid="link-amazon"
              >
                <Button variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-slate-950 gap-2">
                  <ExternalLink className="h-4 w-4" /> Buy the Book on Amazon
                </Button>
              </a>
              <a
                href="/last-firefighter-90-day-checklist.pdf"
                target="_blank"
                rel="noreferrer"
                download
                data-testid="link-download-checklist"
              >
                <Button
                  variant="ghost"
                  className="text-slate-300 hover:text-amber-500 gap-2"
                  data-testid="button-download-checklist"
                >
                  <Download className="h-4 w-4" /> Download 90‑Day Checklist (PDF)
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
