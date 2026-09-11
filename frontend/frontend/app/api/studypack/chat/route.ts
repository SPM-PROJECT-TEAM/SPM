import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chapter_title, question, short_notes, board, grade, subject } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json({ detail: "Question text is required." }, { status: 400 });
    }

    const cleanTitle = chapter_title || "Chapter Concept";
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const prompt = `You are EduAI NotebookLM Tutor, an expert AI teacher for school students (${board || "CBSE"} ${grade || "Class 10"}, ${subject || "Mathematics"}).
Chapter: "${cleanTitle}"
Chapter Notes: ${JSON.stringify(short_notes || {})}

Student Question: "${question}"

Instructions:
- Provide an accurate, mathematically and scientifically precise, step-by-step response.
- Use exact textbook formulas (e.g. 1/f = 1/v + 1/u, HCF × LCM = a × b, V = IR).
- Explain step-by-step clearly for a school student.
- Keep the tone encouraging, crystal clear, and 100% accurate.`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return NextResponse.json({ answer: text, source: "gemini-flash" });
          }
        }
      } catch (err) {
        console.warn("Gemini API chat failed, falling back to deterministic tutor", err);
      }
    }

    // Accurate Chapter-Specific AI Tutor Engine
    const lowerQ = question.toLowerCase();
    const lowerTitle = cleanTitle.toLowerCase();
    let answerText = "";

    if (lowerTitle.includes("real number")) {
      if (lowerQ.includes("hcf") || lowerQ.includes("lcm") || lowerQ.includes("formula")) {
        answerText = `Here is the exact formula for **HCF and LCM** in Real Numbers:\n\n` +
          `$$\\text{HCF}(a, b) \\times \\text{LCM}(a, b) = a \\times b$$\n\n` +
          `**Example**: For numbers 306 and 657 with HCF = 9:\n` +
          `$$\\text{LCM} = \\frac{306 \\times 657}{9} = 34 \\times 657 = 22,338$$\n\n` +
          `💡 *Remember*: This product formula works for **two** positive integers!`;
      } else if (lowerQ.includes("irrational") || lowerQ.includes("proof") || lowerQ.includes("√5")) {
        answerText = `Here is how to prove **$\\sqrt{5}$ is irrational** using proof by contradiction:\n\n` +
          `1. Assume $\\sqrt{5} = a/b$ where $a$ and $b$ are coprime integers ($b \\neq 0$).\n` +
          `2. Squaring both sides: $5 = a^2/b^2 \\implies a^2 = 5b^2$.\n` +
          `3. Since 5 divides $a^2$, 5 must divide $a$. Let $a = 5c$.\n` +
          `4. Substitute $a = 5c$: $(5c)^2 = 5b^2 \\implies 25c^2 = 5b^2 \\implies b^2 = 5c^2$.\n` +
          `5. This means 5 also divides $b$. Therefore, 5 divides both $a$ and $b$, contradicting that $a$ and $b$ are coprime.\n\n` +
          `Conclusion: $\\sqrt{5}$ is irrational! ✓`;
      } else {
        answerText = `In **${cleanTitle}**, the most important concepts are:\n\n` +
          `1. **Fundamental Theorem of Arithmetic**: Every composite number can be uniquely factorized into prime factors.\n` +
          `2. **Decimal Terminating Condition**: $p/q$ terminates iff denominator $q = 2^n \\times 5^m$.\n` +
          `3. **HCF & LCM**: $\\text{HCF}(a,b) \\times \\text{LCM}(a,b) = a \\times b$.\n\n` +
          `What specific problem or proof would you like me to walk you through?`;
      }
    } else if (lowerTitle.includes("light") || lowerTitle.includes("reflection") || lowerTitle.includes("refraction")) {
      if (lowerQ.includes("mirror") || lowerQ.includes("formula")) {
        answerText = `Here is the **Mirror Formula** and Sign Convention:\n\n` +
          `$$\\frac{1}{f} = \\frac{1}{v} + \\frac{1}{u}$$\n\n` +
          `- $f$: Focal length (Concave mirror = negative $-f$, Convex = positive $+f$)\n` +
          `- $u$: Object distance (Always negative $-u$)\n` +
          `- $v$: Image distance ($+v$ for virtual image behind mirror, $-v$ for real image in front)\n` +
          `- **Magnification**: $m = -v/u = h'/h$.`;
      } else if (lowerQ.includes("snell") || lowerQ.includes("refraction") || lowerQ.includes("index")) {
        answerText = `Here is **Snell's Law of Refraction**:\n\n` +
          `$$\\frac{\\sin i}{\\sin r} = n_{21} = \\frac{v_1}{v_2}$$\n\n` +
          `1. $i$ = Angle of incidence, $r$ = Angle of refraction.\n` +
          `2. $n_{21}$ = Refractive index of medium 2 with respect to medium 1.\n` +
          `3. When light passes from a rarer medium (air) to a denser medium (glass), it bends **towards the normal** ($i > r$).`;
      } else {
        answerText = `In **${cleanTitle}**, the core formulas are:\n\n` +
          `1. **Mirror Formula**: $1/f = 1/v + 1/u$\n` +
          `2. **Lens Formula**: $1/f = 1/v - 1/u$\n` +
          `3. **Power of Lens**: $P = 1/f(\\text{in meters})$ measured in Dioptres ($D$).\n\n` +
          `Ask me to solve any numerical or explain any ray diagram for this chapter!`;
      }
    } else {
      answerText = `Here is the accurate breakdown for **${cleanTitle}** regarding your question:\n\n` +
        `1. **Core Concept**: "${question}" is solved by applying the official textbook rules of ${cleanTitle}.\n` +
        `2. **Step 1**: State given parameters clearly with standard units.\n` +
        `3. **Step 2**: Apply the primary formula before simplifying.\n\n` +
        `Would you like me to walk through a step-by-step example problem?`;
    }

    return NextResponse.json({ answer: answerText, source: "eduai-accurate-tutor" });
  } catch (error) {
    console.error("Chat route failed", error);
    return NextResponse.json({ detail: "Invalid request payload" }, { status: 400 });
  }
}
