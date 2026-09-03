import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { extractSupportingDocumentText, parseMultipartForm } from "./src/server/draftWizard";

dotenv.config();

// Gemini model used for all AI endpoints. Override via GEMINI_MODEL if needed.
const AI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Lazy instantiate GoogleGenAI
  const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. AI capabilities will fall back to rich context data.");
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "LAWPEX AI Litigation Server", timestamp: new Date().toISOString() });
  });

  // AI Legal Assistant Query Endpoint
  app.post("/api/ai/ask", async (req, res) => {
    try {
      const { prompt, mode = "general", context } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const ai = getGenAI();
      if (!ai) {
        // Fallback response if key is missing
        return res.json({
          answer: `[LAWPEX Legal AI - Offline Mode]\n\nRegarding: "${prompt}"\n\nKey Principles of Nigerian Law:\n1. **Jurisdiction**: Locus standi and competence of court (Salu v. Egeibon 1994).\n2. **Statutory Reference**: Administration of Criminal Justice Act (ACJA 2015), CAMA 2020, Evidence Act 2011 (s.84 on electronic evidence).\n3. **Procedure**: Adhere to Order of Courts and Rules of Professional Conduct for Legal Practitioners (2023 amendment).\n\n*Note: Configure GEMINI_API_KEY in Secrets for real-time generative research.*`,
          sources: ["ACJA 2015 s.221", "Evidence Act 2011 s.84", "Salu v. Egeibon (1994) LDLR (SC) pt 1002"],
        });
      }

      const systemInstruction = `You are LAWPEX AI, Nigeria's premier litigation and legal research assistant for lawyers, judges, legal scholars, and law firms.
You are deeply authoritative in Nigerian Jurisprudence, including:
- Constitution of the Federal Republic of Nigeria 1999 (as amended)
- Supreme Court of Nigeria Decisions (e.g. Amaechi v. INEC, Inakoju v. Adeleke, Madukolu v. Nkemdilim)
- Court of Appeal & High Court Rules (Federal High Court, NICN, Lagos High Court, FCT High Court, etc.)
- Statutes: CAMA 2020, Evidence Act 2011 (s.84, s.135, etc.), ACJA 2015, Electoral Act 2022, Criminal Code, Penal Code.
- Drafting conventions: High Court court headings, Parties (Claimant/Defendant, Applicant/Respondent), Prayers, Affidavits, Written Addresses.

Guardrails:
- Every substantive assertion must be traceable to a Nigerian source, statute, rule, or case.
- If Nigerian authority is absent or uncertain, say so plainly and suggest what the practitioner should verify.
- Never fabricate citations, suit numbers, statutory sections, judges, dates, or quotations.
- Mark the output as drafting/research assistance, not legal advice.

Provide precise, direct, cited, and practical research assistance. Format in clean markdown with bolding, numbered lists, citations, and statutory references.`;

      const response = await ai.models.generateContent({
        model: AI_MODEL,
        contents: prompt + (context ? `\n\n[Context: ${JSON.stringify(context)}]` : ""),
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      return res.json({
        answer: `${response.text || "No response generated from AI."}\n\n*LAWPEX note: This is drafting and research assistance only. Verify every authority, rule, deadline and filing requirement before use.*`,
        sources: ["Supreme Court of Nigeria Judgments", "Laws of the Federation of Nigeria (LFN)", "State High Court Rules"],
      });
    } catch (error: any) {
      console.error("Error in /api/ai/ask:", error);
      return res.status(500).json({
        error: error.message || "Failed to process legal query",
      });
    }
  });

  // AI Legal Drafting Endpoint
  app.post("/api/ai/draft", async (req, res) => {
    try {
      const { draftType, courtName, state, parties, facts, prayers } = req.body;
      const ai = getGenAI();

      if (!ai) {
        return res.json({
          draftText: `IN THE HIGH COURT OF ${state ? state.toUpperCase() : "LAGOS"} STATE\nIN THE ${courtName ? courtName.toUpperCase() : "LAGOS"} JUDICIAL DIVISION\nHOLDEN AT ${state ? state.toUpperCase() : "LAGOS"}\n\nSUIT NO: LD/______/2026\n\nBETWEEN:\n${parties?.claimant || "CLAIMANT NAME"} ................................................................ CLAIMANT\nAND\n${parties?.defendant || "DEFENDANT NAME"} ................................................................ DEFENDANT\n\nMOTION ON NOTICE\nBROUGHT PURSUANT TO ORDER 39 RULE 1 OF THE HIGH COURT RULES AND UNDER THE INHERENT JURISDICTION OF THIS HONORABLE COURT.\n\nTAKE NOTICE that this Honorable Court will be moved on the ____ day of ________ 2026 at 9:00 o'clock in the forenoon...\n\nFOR AN ORDER granting interlocutory injunction restraining the Defendant from interfering with the res...`,
        });
      }

      const prompt = `Draft a full professional Nigerian court document:
Type: ${draftType || "Motion on Notice"}
Court: ${courtName || "High Court of Lagos State"}
State/Division: ${state || "Lagos Judicial Division"}
Parties: Claimant: ${parties?.claimant || "[Claimant]"}, Defendant: ${parties?.defendant || "[Defendant]"}
Facts: ${facts || "Breach of contract and threat to res"}
Prayers requested: ${prayers || "An order of interlocutory injunction"}

Ensure full formal Nigerian court process formatting, including court heading, suit number placeholder, party designations, grounds, prayers, date, and counsel address block.`;

      const response = await ai.models.generateContent({
        model: AI_MODEL,
        contents: prompt,
        config: {
          systemInstruction: "You are a Senior Advocate of Nigeria (SAN) master legal draftsman. Produce complete, formal Nigerian legal process drafts. Do not invent legal authorities. Mark the output as drafting assistance to be reviewed by counsel before filing.",
          temperature: 0.2,
        },
      });

      return res.json({
        draftText: `${response.text || "Draft could not be generated."}\n\nNOTE: This LAWPEX output is drafting assistance and must be reviewed, settled and verified by counsel before filing.`,
      });
    } catch (error: any) {
      console.error("Error in /api/ai/draft:", error);
      return res.status(500).json({ error: error.message || "Failed to generate draft" });
    }
  });

  // No uploaded document is persisted: the multipart body is parsed and processed in memory.
  app.post(
    "/api/ai/draft-wizard",
    express.raw({ type: 'multipart/form-data', limit: '64mb' }),
    async (req, res) => {
      try {
        if (!Buffer.isBuffer(req.body)) {
          return res.status(400).json({ error: "A multipart drafting request is required." });
        }

        const { fields, files } = parseMultipartForm(req.body, req.headers["content-type"] || "");
        const facts = fields.facts?.trim();
        const instructions = fields.instructions?.trim();
        if (!facts || !instructions) {
          return res.status(400).json({ error: "Case facts and drafting instructions are required." });
        }

        if (files.length > 8) {
          return res.status(400).json({ error: "Upload no more than 8 supporting documents." });
        }

        const allowedExtensions = new Set(["pdf", "docx", "txt", "md"]);
        const invalid = files.find((file) => {
          const extension = file.filename.split(".").pop()?.toLowerCase() || "";
          return file.fieldName !== "documents" || !allowedExtensions.has(extension) || file.data.length > 10 * 1024 * 1024;
        });
        if (invalid) {
          return res.status(400).json({ error: `Unsupported or oversized document: ${invalid.filename}` });
        }

        const ai = getGenAI();
        if (!ai) {
          return res.status(503).json({
            error: "Ai Draft Wizard is unavailable until GEMINI_API_KEY is configured on the server.",
          });
        }

        const textDocuments = files
          .filter((file) => !file.filename.toLowerCase().endsWith(".pdf"))
          .map((file) => ({ file, text: extractSupportingDocumentText(file).slice(0, 160_000) }));
        const supportingText = textDocuments
          .map(({ file, text }) => `\n--- ${file.filename} ---\n${text}`)
          .join("\n");
        const pdfParts = files
          .filter((file) => file.filename.toLowerCase().endsWith(".pdf"))
          .map((file) => ({
            inlineData: {
              mimeType: "application/pdf",
              data: file.data.toString("base64"),
            },
          }));

        const prompt = `Prepare the appropriate Nigerian legal or court document from this matter brief.

MATTER TITLE: ${fields.matterTitle || "Not supplied"}
COURT / JURISDICTION: ${fields.court || "Not supplied"}
CLAIMANT / APPLICANT: ${fields.claimant || "Not supplied"}
DEFENDANT / RESPONDENT: ${fields.defendant || "Not supplied"}

CASE SCENARIO AND ISSUES:
${facts}

LAWYER'S DRAFTING INSTRUCTIONS:
${instructions}

SUPPORTING DOCUMENTS:
${supportingText || (pdfParts.length ? "The attached PDF documents form part of the brief." : "None supplied.")}

Return only the complete draft. Use clear [TO BE SUPPLIED] placeholders for missing filing information.`;

        const response = await ai.models.generateContent({
          model: AI_MODEL,
          contents: [{ role: "user", parts: [{ text: prompt }, ...pdfParts] }],
          config: {
            systemInstruction: `You are LAWPEX Ai Draft Wizard, a meticulous Nigerian legal drafting assistant.
- Select and prepare the court process or legal document requested by counsel.
- Follow formal Nigerian drafting conventions, court headings, party designations, reliefs, grounds, supporting depositions, addresses and signature blocks where applicable.
- Reconcile the case facts with every supporting document. Do not omit material facts supplied by counsel.
- Never invent a citation, statutory provision, court rule, suit number, date, party, quotation or fact.
- Where authority or procedural information is uncertain, insert a conspicuous [COUNSEL TO VERIFY: ...] note.
- Do not describe your reasoning and do not include markdown fences. Return the document itself.
- The output is a professional working draft that counsel must settle and verify before filing.`,
            temperature: 0.15,
          },
        });

        const draftText = response.text?.trim();
        if (!draftText) {
          return res.status(502).json({ error: "The drafting service returned an empty document." });
        }

        return res.json({
          documentTitle: fields.matterTitle || "LAWPEX Legal Draft",
          draftText,
          documentCount: files.length,
          notice: "Review every fact, authority, court rule, relief and filing requirement before professional use.",
        });
      } catch (error: any) {
        console.error("Error in /api/ai/draft-wizard:", error);
        return res.status(500).json({ error: error.message || "Failed to generate the legal draft." });
      }
    },
  );

  // AI Judgment Summarizer Endpoint
  app.post("/api/ai/summarize", async (req, res) => {
    try {
      const { judgmentText, caseName } = req.body;
      const ai = getGenAI();

      if (!ai || !judgmentText) {
        return res.json({
          summary: `### Summary of ${caseName || "Judgment"}\n- **Facts**: Dispute regarding ownership and validity of title.\n- **Key Issues**: Whether the lower court had jurisdiction and whether proper service was effected.\n- **Decision**: Appeal allowed / Judgment set aside.\n- **Ratio Decidendi**: Service of originating process is fundamental to jurisdiction. Non-service renders proceedings a nullity.`,
        });
      }

      const response = await ai.models.generateContent({
        model: AI_MODEL,
        contents: `Summarize the following Nigerian court judgment cleanly into:\n1. Summary of Facts\n2. Legal Issues Raised\n3. Court's Decision\n4. Ratio Decidendi (Key principles)\n5. Obiter Dicta\n\nText:\n${judgmentText}`,
      });

      return res.json({
        summary: response.text,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || "Failed to summarize judgment" });
    }
  });

  // Unknown API paths must stay JSON 404s rather than falling through to the SPA shell.
  app.use("/api", (req, res) => {
    res.status(404).json({ error: `No API route for ${req.method} ${req.originalUrl}` });
  });

  // Vite middleware in dev or static files in prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));

    // SPA fallback: every client-side route (/pricing, /case-law, ...) must return index.html
    // so deep links and page refreshes work.
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LAWPEX Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
