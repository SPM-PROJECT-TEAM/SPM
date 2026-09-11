import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chapter_title, question, short_notes, board, grade, subject } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json({ detail: "Question text is required." }, { status: 400 });
    }

    const cleanTitle = chapter_title || "Chapter Source Material";
    const apiKey = process.env.GEMINI_API_KEY;
    const lowerQ = question.trim().toLowerCase();

    // -------------------------------------------------------------------------
    // 0. INTENT DETECTION: GREETING & CONVERSATIONAL SMALL TALK
    // -------------------------------------------------------------------------
    const isGreeting =
      ["hi", "hello", "hey", "hlo", "hiii", "heyya", "good morning", "good afternoon", "good evening", "namaste"].includes(lowerQ) ||
      lowerQ.startsWith("hi ") ||
      lowerQ.startsWith("hello ") ||
      lowerQ.startsWith("hey ");

    const isIdentity =
      lowerQ.includes("who are you") ||
      lowerQ.includes("what can you do") ||
      lowerQ.includes("what is your name") ||
      lowerQ.includes("help me");

    const isThanks =
      lowerQ.includes("thank") ||
      lowerQ.includes("thx") ||
      lowerQ.includes("awesome") ||
      lowerQ.includes("great job") ||
      lowerQ.includes("perfect");

    if (isGreeting || isIdentity) {
      const conceptsSample = short_notes?.key_concepts
        ? short_notes.key_concepts.slice(0, 2).map((c: string) => `• ${c}`).join("\n")
        : `• Key principles and definitions of ${cleanTitle}`;

      const greetingResponse =
        `Hello! I am your AI Tutor Agent for ${cleanTitle} (${board || "CBSE"} ${grade || "Class 10"} ${subject || "Mathematics"}).\n\n` +
        `I am here to assist you with deep concept explanations, step-by-step problem solving, and exam preparation. Here are a few ways we can work together:\n\n` +
        `1. Concept Explanations:\n${conceptsSample}\n\n` +
        `2. Step-by-Step Numericals: Complete formula derivations and algebraic working.\n` +
        `3. Interactive Quiz: Type "Quiz me" to test your understanding with instant feedback.\n` +
        `4. Board Exam Tips: Learn key traps and scoring strategies for this chapter.\n\n` +
        `What specific concept or question would you like to explore?`;

      return NextResponse.json({ answer: greetingResponse, source: "eduai-tutor-agent" });
    }

    if (isThanks) {
      return NextResponse.json({
        answer: `You're very welcome! I'm glad that helped. Feel free to ask any follow-up questions on ${cleanTitle} whenever you're ready!`,
        source: "eduai-tutor-agent",
      });
    }

    // -------------------------------------------------------------------------
    // 1. INTENT DETECTION: INTERACTIVE QUIZ REQUEST
    // -------------------------------------------------------------------------
    const isQuizRequest =
      lowerQ.includes("quiz me") ||
      lowerQ.includes("test me") ||
      lowerQ.includes("ask me a question") ||
      lowerQ.includes("test my knowledge");

    if (isQuizRequest) {
      const concepts = short_notes?.key_concepts || [];
      const topicToQuiz = concepts.length > 0 ? concepts[Math.floor(Math.random() * concepts.length)] : cleanTitle;
      const cleanConceptTopic = topicToQuiz.split(":")[0] || cleanTitle;

      const quizResponse =
        `Practice Quiz Question — ${cleanTitle}\n\n` +
        `Topic: ${cleanConceptTopic}\n\n` +
        `Question: Explain the fundamental principle behind ${cleanConceptTopic} and state the primary formula or condition applied when solving textbook problems on this topic.\n\n` +
        `Reply with your answer below, and I will evaluate your response step-by-step!`;

      return NextResponse.json({ answer: quizResponse, source: "eduai-tutor-agent" });
    }

    // -------------------------------------------------------------------------
    // 2. LLM CALL (GEMINI / POLLINATIONS) WITH TIMEOUTS & REFINED SYSTEM PROMPT
    // -------------------------------------------------------------------------
    const systemPrompt = `You are EduAI Tutor Agent, a world-class, highly articulate, patient, and professional AI tutor for school students in India.
You specialize in ${board || "CBSE"} ${grade || "Class 10"} ${subject || "Mathematics"} — Chapter: "${cleanTitle}".

Chapter Context:
${JSON.stringify(short_notes || {})}

Student Question: "${question}"

Guidelines:
1. Speak in a refined, professional, and clear tone (like a top-tier private tutor).
2. Never output raw markdown clutter like raw asterisks or unrendered formatting symbols.
3. For Math/Physics: Provide Given Parameters → Governing Formula → Step-by-Step Working → Final Answer with SI Units.
4. For Theory: Provide Direct Answer → Core Principles → Examples → Exam Tips.
5. Keep explanations thorough, elegant, articulate, and accurate for ${grade} level.`;

    if (apiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] }),
            signal: controller.signal,
          }
        );
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return NextResponse.json({ answer: text, source: "gemini-1.5-flash" });
          }
        }
      } catch (err) {
        console.warn("Gemini API request timed out or failed", err);
      }
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const polRes = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: question },
          ],
          model: "openai",
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (polRes.ok) {
        const polText = await polRes.text();
        if (polText && polText.length > 20) {
          return NextResponse.json({ answer: polText, source: "eduai-agent-llm" });
        }
      }
    } catch (polErr) {
      console.warn("Pollinations AI endpoint timed out or failed", polErr);
    }

    // -------------------------------------------------------------------------
    // 3. REFINED REASONING ENGINE (GROUNDED & ELEGANT)
    // -------------------------------------------------------------------------
    let answerText = "";
    const keyConcepts = short_notes?.key_concepts || [];
    const formulasDefs = short_notes?.formulas_and_definitions || [];
    const summary = short_notes?.summary || "";
    const recapPoints = short_notes?.recap_points || [];

    const matchedFormula = formulasDefs.find((f: any) =>
      lowerQ.includes(f.term.toLowerCase()) || f.term.toLowerCase().split(" ").some((w: string) => w.length > 3 && lowerQ.includes(w))
    );

    const matchedConcept = keyConcepts.find((c: string) =>
      lowerQ.includes(c.toLowerCase().slice(0, 15)) || c.toLowerCase().split(" ").some((w: string) => w.length > 4 && lowerQ.includes(w))
    );

    if (matchedFormula) {
      answerText =
        `${matchedFormula.term} — ${cleanTitle}\n\n` +
        `Definition & Core Rule:\n` +
        `${matchedFormula.definition}\n\n` +
        `Application in ${grade} ${subject}:\n` +
        `In ${cleanTitle}, ${matchedFormula.term} defines the essential relationship required to solve textbook problems.\n\n` +
        `Step-by-Step Working Method:\n` +
        `1. Identify known and unknown variables from the problem statement.\n` +
        `2. Write down the governing formula clearly.\n` +
        `3. Perform step-by-step substitution and calculate the final value with units.\n\n` +
        `Exam Strategy: Stating the formula before calculation ensures full step-marks in board evaluation.`;
    } else if (matchedConcept) {
      answerText =
        `Concept Explanation: ${cleanTitle}\n\n` +
        `Core Principle:\n` +
        `${matchedConcept}\n\n` +
        `Detailed Analysis:\n` +
        `In ${cleanTitle} (${board} ${grade}), this concept forms a fundamental building block. When approaching questions on this topic:\n` +
        `• Understand the underlying physical or mathematical definitions.\n` +
        `• Follow systematic problem-solving steps.\n\n` +
        `Summary Context:\n` +
        `${summary}`;
    } else {
      answerText =
        `EduAI Tutor Analysis — ${cleanTitle}\n\n` +
        `Overview:\n` +
        `Regarding "${question}" in ${cleanTitle} (${board || "CBSE"} ${grade || "Class 10"} ${subject || "Mathematics"}):\n\n` +
        `${summary || `This chapter establishes foundational principles and mathematical/scientific problem-solving rules.`}\n\n` +
        `Key Rules & Definitions:\n` +
        `${formulasDefs.length > 0 ? formulasDefs.slice(0, 3).map((f: any) => `• ${f.term}: ${f.definition}`).join("\n") : `• Focus on core textbook definitions and standard equations.`}\n\n` +
        `Problem-Solving Guidance:\n` +
        `1. Identify given quantities and target variables.\n` +
        `2. Select and state the appropriate formula.\n` +
        `3. Substitute values carefully and verify final units.\n\n` +
        (recapPoints.length > 0 ? `Exam Tip: ${recapPoints[0]}` : `Exam Tip: Always double-check sign rules and SI unit conversions.`);
    }

    return NextResponse.json({ answer: answerText, source: "eduai-tutor-agent" });
  } catch (error) {
    console.error("EduAI Tutor chat API error", error);
    return NextResponse.json({ detail: "Invalid request payload" }, { status: 400 });
  }
}
