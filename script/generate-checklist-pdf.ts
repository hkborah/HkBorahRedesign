import PDFDocument from "pdfkit";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve("client/public/last-firefighter-90-day-checklist.pdf");
const COVER = path.resolve("attached_assets/image_1778398480861.png");
const COVER_ORDER_OF_CHAOS = path.resolve("attached_assets/book-cover-order-of-chaos.png");

const COLORS = {
  bg: "#020617",
  panel: "#0f172a",
  panelBorder: "#1e293b",
  textPrimary: "#e2e8f0",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  amber: "#f59e0b",
  amberSoft: "#fbbf24",
};

interface DayTask {
  day: string;
  task: string;
}
interface WeekBlock {
  week: string;
  goal: string;
  days: DayTask[];
}
interface MonthBlock {
  title: string;
  weeks: WeekBlock[];
}

const MONTHS: MonthBlock[] = [
  {
    title: "Month 1: Discover & Prepare (Weeks 1\u20134)",
    weeks: [
      {
        week: "Week 1 \u2013 Pick Your Problem",
        goal: "Choose one specific, measurable problem to attack.",
        days: [
          { day: "1", task: "Write down the problem in one sentence (e.g., \u201CBilling errors in the north region call centre\u201D)" },
          { day: "2", task: "Estimate the cost of this problem per week/month (money, time, customer goodwill)" },
          { day: "3", task: "Identify the one metric that would tell you if the problem is solved (e.g., \u201Cerror rate < 2%\u201D)" },
          { day: "4", task: "Check that you have at least 3\u20116 months of historical data for this problem" },
          { day: "5", task: "Name the person who will own the pilot (can be you)" },
          { day: "Weekend", task: "Review and finalise your problem statement. Share it with one colleague for feedback." },
        ],
      },
      {
        week: "Week 2 \u2013 Find Your Data",
        goal: "Gather the data you already have into one place.",
        days: [
          { day: "1", task: "List all sources of data related to your problem (call logs, CRM, spreadsheets, emails)" },
          { day: "2", task: "Export each source into a common format (CSV or Excel)" },
          { day: "3", task: "Create a single folder on your computer or shared drive: \u201C90\u2011Day Pilot \u2013 Data\u201D" },
          { day: "4", task: "Copy all exports into that folder" },
          { day: "5", task: "Open one file. Make sure column names are consistent (e.g., \u201CDate\u201D not \u201CDate of call\u201D)" },
          { day: "Weekend", task: "Repeat column cleaning for all files. Don\u2019t aim for perfection \u2013 just consistent enough." },
        ],
      },
      {
        week: "Week 3 \u2013 Choose Your Tool",
        goal: "Pick a free or open\u2011source AI tool and get comfortable with it.",
        days: [
          { day: "1", task: "Read Appendix A of The Last Firefighter \u2013 tool recommendations" },
          { day: "2", task: "Choose one tool: Orange (open source) or Hugging Face AI Sheets (for text)" },
          { day: "3", task: "Install the tool (or open the web app)" },
          { day: "4", task: "Run the tool\u2019s tutorial or sample dataset (usually built in)" },
          { day: "5", task: "Load one of your own data files into the tool \u2013 just explore" },
          { day: "Weekend", task: "Watch a 15\u2011min YouTube tutorial for that tool" },
        ],
      },
      {
        week: "Week 4 \u2013 Prepare Your Team",
        goal: "Get one key person on board (quietly \u2013 no big presentation).",
        days: [
          { day: "1", task: "Identify the one person whose support you need (manager, team lead, or a trusted peer)" },
          { day: "2", task: "Write a two\u2011sentence summary: \u201CI\u2019m trying a small pilot on [problem]. I\u2019ll show you results in 4 weeks.\u201D" },
          { day: "3", task: "Schedule a 15\u2011minute chat with that person" },
          { day: "4", task: "In the chat, say your two sentences. Ask: \u201CAny concerns?\u201D" },
          { day: "5", task: "If they say yes, thank them. If they say no, ask: \u201CWhat would make you comfortable?\u201D" },
          { day: "Weekend", task: "Adjust your plan based on their feedback. Do not expand scope." },
        ],
      },
    ],
  },
  {
    title: "Month 2: Model & Analyse (Weeks 5\u20138)",
    weeks: [
      {
        week: "Week 5 \u2013 Build Your First Model",
        goal: "Let the AI find patterns in your data.",
        days: [
          { day: "1", task: "Combine your cleaned data files into one master spreadsheet (if not already)" },
          { day: "2", task: "Open your chosen AI tool and import the master file" },
          { day: "3", task: "Run a \u201Cpattern finder\u201D or \u201Ccorrelation\u201D function (in Orange: \u201CCorrelations\u201D widget)" },
          { day: "4", task: "Write down the top 3 patterns the tool finds (e.g., \u201CX and Y together predict error\u201D)" },
          { day: "5", task: "Do any of these patterns make sense? Note any that surprise you." },
          { day: "Weekend", task: "Don\u2019t judge the patterns yet \u2013 just collect them." },
        ],
      },
      {
        week: "Week 6 \u2013 Validate the Results",
        goal: "Test if the patterns are real or random.",
        days: [
          { day: "1", task: "Take the most promising pattern. Write it as a hypothesis: \u201CWhen [condition A] and [B], defect rate is [X%]\u201D" },
          { day: "2", task: "Find a separate chunk of data (e.g., last month\u2019s records) that the model has not seen" },
          { day: "3", task: "Manually check 10\u201120 cases that match the pattern. How many actually had a defect?" },
          { day: "4", task: "Calculate the pattern\u2019s accuracy = (correct predictions / total cases) \u00D7 100" },
          { day: "5", task: "If accuracy is > 60%, keep it. If less, go back to Week 5 and pick another pattern." },
          { day: "Weekend", task: "Document the winning pattern in one paragraph." },
        ],
      },
      {
        week: "Week 7 \u2013 Refine Once",
        goal: "Improve the model by adding one more data source or cleaning one variable.",
        days: [
          { day: "1", task: "Identify one missing variable that might improve the model (e.g., time of day, agent ID)" },
          { day: "2", task: "Find that data in another system. Export and add it to your master file." },
          { day: "3", task: "Re\u2011run the pattern finder with the new data." },
          { day: "4", task: "Compare new accuracy vs old accuracy. Did it improve?" },
          { day: "5", task: "If yes, keep the new variable. If no, discard it." },
          { day: "Weekend", task: "Finalise your model. You now have a working predictor." },
        ],
      },
      {
        week: "Week 8 \u2013 Prepare Your Pilot",
        goal: "Design a tiny, safe live test.",
        days: [
          { day: "1", task: "Decide: \u201CWhen the model flags [condition], we will do [one specific action]\u201D" },
          { day: "2", task: "Keep the action small (e.g., \u201Csend a 2\u2011minute email check\u201D, \u201Creview the next 5 cases\u201D)" },
          { day: "3", task: "Choose a timebox: 1 week, and only on one team / one shift / one product line" },
          { day: "4", task: "Define success: \u201CWe will see a [X%] reduction in [metric]\u201D" },
          { day: "5", task: "Write a one\u2011page pilot plan (use Appendix D template)" },
          { day: "Weekend", task: "Share the plan with the one person from Week 4. Get a green light to run." },
        ],
      },
    ],
  },
  {
    title: "Month 3: Intervene, Calibrate & Scale (Weeks 9\u201312)",
    weeks: [
      {
        week: "Week 9 \u2013 Run the Pilot",
        goal: "Execute your tiny live test.",
        days: [
          { day: "1", task: "Start the pilot on Monday morning." },
          { day: "2", task: "Each day, apply the action to every flagged case." },
          { day: "3", task: "Keep a simple log: date, flagged? action taken? outcome?" },
          { day: "4", task: "End of day: spend 5 minutes reviewing the log." },
          { day: "5", task: "Do not change the process mid\u2011week. Stick to the plan." },
          { day: "Weekend", task: "Compile the week\u2019s log into a single table." },
        ],
      },
      {
        week: "Week 10 \u2013 Measure the Results",
        goal: "Calculate what changed.",
        days: [
          { day: "1", task: "Compare the defect rate during the pilot vs the previous month\u2019s rate" },
          { day: "2", task: "If you prevented defects, calculate cost saved per defect \u00D7 number prevented" },
          { day: "3", task: "Count how many alerts were false alarms. Calculate false alarm rate." },
          { day: "4", task: "Was the cost of false alarms worth the savings from real catches?" },
          { day: "5", task: "Write a one\u2011page summary: what worked, what didn\u2019t, what you learned." },
          { day: "Weekend", task: "Prepare three bullet points of key results to share." },
        ],
      },
      {
        week: "Week 11 \u2013 Share Your Findings",
        goal: "Tell one person (the same from Week 4) what happened.",
        days: [
          { day: "1", task: "Schedule a 15\u2011minute meeting with the person." },
          { day: "2", task: "In the meeting: \u201CI ran a small pilot. Here\u2019s what happened. [show 3 bullet points]\u201D" },
          { day: "3", task: "Do not ask for budget or expansion yet \u2013 just share." },
          { day: "4", task: "Ask: \u201CWhat do you think?\u201D Listen." },
          { day: "5", task: "If they\u2019re interested, offer to share the one\u2011page summary." },
          { day: "Weekend", task: "Send the one\u2011page summary via email." },
        ],
      },
      {
        week: "Week 12 \u2013 Plan Your Next 90 Days",
        goal: "Decide what to do next \u2013 scale, kill, or pivot.",
        days: [
          { day: "1", task: "Review your pilot results. Was success clear? (Defects down? Money saved?)" },
          { day: "2", task: "If yes \u2192 plan to scale. If no \u2192 plan a new pilot on a different problem." },
          { day: "3", task: "Write a one\u2011page \u201CNext 90 Days\u201D plan with one goal (e.g., scale to second team)" },
          { day: "4", task: "Share the plan with the same person. Ask: \u201CCan we try this?\u201D" },
          { day: "5", task: "Celebrate. You are no longer a firefighter \u2013 you are an architect." },
          { day: "Weekend", task: "Rest. Then start again at Week 1 with a new problem." },
        ],
      },
    ],
  },
];

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 50;
const CONTENT_W = PAGE_W - MARGIN * 2;

function paintBackground(doc: PDFKit.PDFDocument) {
  doc.save();
  doc.rect(0, 0, PAGE_W, PAGE_H).fill(COLORS.bg);
  doc.restore();
}

function ensureSpace(doc: PDFKit.PDFDocument, needed: number) {
  if (doc.y + needed > PAGE_H - MARGIN) {
    doc.addPage();
  }
}

async function generate() {
  const doc = new PDFDocument({
    size: [PAGE_W, PAGE_H],
    margin: MARGIN,
    autoFirstPage: false,
    info: {
      Title: "The 90-Day Predictive Quality Implementation Checklist",
      Author: "HK Borah",
      Subject: "Companion checklist to The Last Firefighter",
    },
  });

  doc.on("pageAdded", () => paintBackground(doc));

  const stream = fs.createWriteStream(OUT);
  doc.pipe(stream);

  // ===== COVER PAGE =====
  doc.addPage();

  doc.font("Helvetica").fontSize(9).fillColor(COLORS.amber)
    .text("THE PREDICTIVE QUALITY FRAMEWORK  /  D-M-A-I-C", MARGIN, MARGIN, {
      characterSpacing: 2,
    });

  doc.moveDown(4);
  doc.fillColor(COLORS.textPrimary).font("Times-Bold").fontSize(36)
    .text("The 90-Day Predictive Quality", MARGIN, doc.y, { width: CONTENT_W });
  doc.fillColor(COLORS.amber).font("Times-Bold").fontSize(36)
    .text("Implementation Checklist", { width: CONTENT_W });

  doc.moveDown(1);
  doc.fillColor(COLORS.textSecondary).font("Helvetica").fontSize(13)
    .text(
      "A companion field guide to The Last Firefighter. Print one copy per cycle. Tick a box. Watch the chaos shrink.",
      { width: CONTENT_W, lineGap: 4 }
    );

  doc.moveDown(2);

  // Cover image (book cover)
  if (fs.existsSync(COVER)) {
    const imgW = 200;
    const imgX = (PAGE_W - imgW) / 2;
    try {
      doc.image(COVER, imgX, doc.y, { width: imgW });
      doc.y = doc.y + imgW * 1.4 + 10;
    } catch {}
  }

  // How to use box
  const boxY = doc.y + 10;
  const boxH = 110;
  doc.save();
  doc.roundedRect(MARGIN, boxY, CONTENT_W, boxH, 6)
    .lineWidth(1)
    .fillAndStroke(COLORS.panel, COLORS.panelBorder);
  doc.restore();

  doc.fillColor(COLORS.amber).font("Helvetica-Bold").fontSize(9)
    .text("HOW TO USE THIS CHECKLIST", MARGIN + 16, boxY + 14, { characterSpacing: 1.5 });

  const items = [
    "Print one copy for each 90-day cycle.",
    "Check off each box as you complete the task.",
    "At the end of each week, review your progress.",
    "The goal is progress, not perfection. Miss a day? Pick up where you left off.",
  ];
  doc.fillColor(COLORS.textSecondary).font("Helvetica").fontSize(10);
  let y = boxY + 32;
  for (const it of items) {
    doc.fillColor(COLORS.amber).text("\u2022", MARGIN + 16, y, { continued: false });
    doc.fillColor(COLORS.textSecondary).text(it, MARGIN + 30, y, {
      width: CONTENT_W - 46,
    });
    y += 16;
  }

  // Footer on cover
  doc.fillColor(COLORS.textMuted).font("Helvetica").fontSize(8)
    .text("HK BORAH  /  hkborah.com", MARGIN, PAGE_H - MARGIN - 10, {
      width: CONTENT_W,
      align: "center",
      characterSpacing: 1.5,
    });

  // ===== CONTENT PAGES =====
  for (const month of MONTHS) {
    doc.addPage();

    // Month heading band
    doc.save();
    doc.rect(MARGIN, MARGIN, CONTENT_W, 4).fill(COLORS.amber);
    doc.restore();
    doc.moveDown(0.4);

    doc.fillColor(COLORS.amber).font("Helvetica").fontSize(8)
      .text("PHASE", MARGIN, MARGIN + 14, { characterSpacing: 2 });
    doc.fillColor(COLORS.textPrimary).font("Times-Bold").fontSize(22)
      .text(month.title, MARGIN, MARGIN + 26, { width: CONTENT_W });

    doc.y = MARGIN + 70;

    for (const week of month.weeks) {
      ensureSpace(doc, 180);

      // Week header
      doc.fillColor(COLORS.amberSoft).font("Times-Bold").fontSize(15)
        .text(week.week, MARGIN, doc.y, { width: CONTENT_W });
      doc.fillColor(COLORS.textSecondary).font("Helvetica-Oblique").fontSize(10)
        .text(`Goal: ${week.goal}`, MARGIN, doc.y + 2, {
          width: CONTENT_W,
          lineGap: 2,
        });
      doc.moveDown(0.5);

      // Table header
      const tableTop = doc.y + 4;
      const colDay = MARGIN;
      const colDayW = 64;
      const colTask = MARGIN + colDayW + 8;
      const colTaskW = CONTENT_W - colDayW - 8 - 32 - 8;
      const colDone = MARGIN + CONTENT_W - 32;
      const colDoneW = 32;

      doc.save();
      doc.rect(MARGIN, tableTop, CONTENT_W, 22).fill(COLORS.panel);
      doc.restore();

      doc.fillColor(COLORS.amber).font("Helvetica-Bold").fontSize(8);
      doc.text("DAY", colDay + 8, tableTop + 7, { width: colDayW, characterSpacing: 1.5 });
      doc.text("TASK", colTask, tableTop + 7, { width: colTaskW, characterSpacing: 1.5 });
      doc.text("DONE", colDone, tableTop + 7, { width: colDoneW, align: "center", characterSpacing: 1.5 });

      let rowY = tableTop + 22;

      for (const d of week.days) {
        // Measure the height needed for the task wrapped text
        doc.font("Helvetica").fontSize(10);
        const taskHeight = doc.heightOfString(d.task, { width: colTaskW, lineGap: 2 });
        const rowH = Math.max(28, taskHeight + 14);

        if (rowY + rowH > PAGE_H - MARGIN) {
          doc.addPage();
          // re-draw a small spacer at top
          doc.y = MARGIN;
          rowY = MARGIN;
        }

        // Row separator
        doc.save();
        doc.moveTo(MARGIN, rowY).lineTo(MARGIN + CONTENT_W, rowY)
          .lineWidth(0.5).strokeColor(COLORS.panelBorder).stroke();
        doc.restore();

        // Day text
        doc.fillColor(COLORS.amber).font("Helvetica-Bold").fontSize(10)
          .text(d.day, colDay + 8, rowY + 7, { width: colDayW });

        // Task text
        doc.fillColor(COLORS.textPrimary).font("Helvetica").fontSize(10)
          .text(d.task, colTask, rowY + 7, { width: colTaskW, lineGap: 2 });

        // Checkbox
        const boxSize = 12;
        const boxX = colDone + (colDoneW - boxSize) / 2;
        const boxYpos = rowY + (rowH - boxSize) / 2;
        doc.save();
        doc.roundedRect(boxX, boxYpos, boxSize, boxSize, 2)
          .lineWidth(1)
          .strokeColor(COLORS.amber)
          .stroke();
        doc.restore();

        rowY += rowH;
      }

      // Bottom border
      doc.save();
      doc.moveTo(MARGIN, rowY).lineTo(MARGIN + CONTENT_W, rowY)
        .lineWidth(0.5).strokeColor(COLORS.panelBorder).stroke();
      doc.restore();

      doc.y = rowY + 24;
    }
  }

  // ===== FINAL CTA PAGE =====
  doc.addPage();

  doc.fillColor(COLORS.amber).font("Helvetica").fontSize(9)
    .text("THE FOUNDATION", MARGIN, MARGIN + 20, { characterSpacing: 2 });

  doc.fillColor(COLORS.textPrimary).font("Times-Bold").fontSize(28)
    .text("From Firefighter to Architect.", MARGIN, MARGIN + 40, { width: CONTENT_W });

  doc.moveDown(1);
  doc.fillColor(COLORS.textSecondary).font("Helvetica").fontSize(11)
    .text(
      "This checklist is a field tool. The complete methodology \u2013 the 80+ cornerstone case files showing how AI and Six Sigma merge to predict and prevent defects \u2013 is in the book.",
      { width: CONTENT_W, lineGap: 3 }
    );

  doc.moveDown(2);

  // Two-column book layout
  const books = [
    {
      cover: COVER,
      tag: "PREDICTIVE QUALITY",
      title: "The Last Firefighter",
      subtitle: "Merging AI and Six Sigma for Predictive Quality",
      desc: "The definitive analysis of the core methodology and the 80+ cornerstone case files showing how AI and Six Sigma merge to predict and prevent defects.",
      url: "https://notionpress.com/in/read/the-last-firefighter",
      cta: "BUY ON NOTIONPRESS \u2192",
    },
    {
      cover: COVER_ORDER_OF_CHAOS,
      tag: "FOUNDER'S BLUEPRINT",
      title: "The Order of Chaos",
      subtitle: "The Architectural Scaling Framework",
      desc: "The deep analysis of the cornerstone case files for each domain \u2013 the foundational problems every founder must solve when scaling from chaos to structure.",
      url: "https://notionpress.com/in/read/the-order-of-chaos",
      cta: "BUY ON NOTIONPRESS \u2192",
    },
  ];

  const colGap = 20;
  const colW = (CONTENT_W - colGap) / 2;
  const colTop = doc.y;
  const coverW = 100;

  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    const colX = MARGIN + i * (colW + colGap);

    // Card panel
    const cardH = 320;
    doc.save();
    doc.roundedRect(colX, colTop, colW, cardH, 6)
      .lineWidth(1)
      .fillAndStroke(COLORS.panel, COLORS.panelBorder);
    doc.restore();

    // Cover image (centered in column)
    if (fs.existsSync(book.cover)) {
      const imgX = colX + (colW - coverW) / 2;
      try {
        doc.image(book.cover, imgX, colTop + 18, { width: coverW });
      } catch {}
    }

    const textTop = colTop + 18 + coverW * 1.4 + 14;
    const padX = 16;
    const innerW = colW - padX * 2;

    doc.fillColor(COLORS.amber).font("Helvetica").fontSize(7)
      .text(book.tag, colX + padX, textTop, {
        width: innerW,
        align: "center",
        characterSpacing: 2,
      });

    doc.fillColor(COLORS.textPrimary).font("Times-Bold").fontSize(16)
      .text(book.title, colX + padX, textTop + 12, {
        width: innerW,
        align: "center",
      });

    doc.fillColor(COLORS.amberSoft).font("Times-Italic").fontSize(9)
      .text(book.subtitle, colX + padX, doc.y + 2, {
        width: innerW,
        align: "center",
        lineGap: 1,
      });

    doc.fillColor(COLORS.textSecondary).font("Helvetica").fontSize(9)
      .text(book.desc, colX + padX, doc.y + 8, {
        width: innerW,
        align: "center",
        lineGap: 2,
      });

    // Per-card CTA button
    const btnH = 30;
    const btnY = colTop + cardH - btnH - 14;
    const btnPad = 12;
    doc.save();
    doc.roundedRect(colX + btnPad, btnY, colW - btnPad * 2, btnH, 3)
      .lineWidth(1)
      .fillAndStroke(COLORS.amber, COLORS.amber);
    doc.restore();

    doc.fillColor(COLORS.bg).font("Helvetica-Bold").fontSize(9)
      .text(book.cta, colX + btnPad, btnY + 11, {
        width: colW - btnPad * 2,
        align: "center",
        characterSpacing: 1.2,
        link: book.url,
        underline: false,
      });
  }

  doc.y = colTop + 320 + 10;
  doc.fillColor(COLORS.textMuted).font("Helvetica").fontSize(8)
    .text("Both books available on NotionPress  \u2014  notionpress.com", MARGIN, doc.y, {
      width: CONTENT_W,
      align: "center",
      characterSpacing: 1,
    });

  // Footer
  doc.fillColor(COLORS.textMuted).font("Helvetica").fontSize(8)
    .text(
      "HK BORAH  /  hkborah.com  /  The Predictive Quality Framework",
      MARGIN,
      PAGE_H - MARGIN - 10,
      { width: CONTENT_W, align: "center", characterSpacing: 1.5 }
    );

  doc.end();

  await new Promise<void>((resolve, reject) => {
    stream.on("finish", () => resolve());
    stream.on("error", reject);
  });

  console.log(`PDF generated: ${OUT}`);
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
