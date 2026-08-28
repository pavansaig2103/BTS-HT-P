const getFormIntelligencePrompt = (extractedText) => {
  return `You are AccessFlow AI's Form Intelligence Engine.
Your task is to analyze the extracted text of an official application or guideline document (such as a scholarship application, government scheme, or admission form) and output STRICT, machine-parseable JSON only.

CRITICAL RULES:
1. DO NOT include any extra explanatory text or markdown — output MUST be a single JSON object.
2. NEVER invent facts. If a value cannot be confidently extracted from the document, use null or an empty array and do not fabricate data.
3. The backend will validate the JSON schema strictly. Ensure the JSON keys and types exactly match the required shape.
4. The AI may suggest content, but final step completion, progress numbers and readiness MUST be computed by the backend database; do not output progress metrics here.

REQUIRED OUTPUT SHAPE (exact):
{
  "documentTitle": string,
  "summary": string,
  "steps": [
    {
      "stepOrder": number,
      "title": string,
      "officialInstruction": string,
      "simplifiedExplanation": string,
      "requiredDocuments": string[]
    }
  ],
  "requirements": [
    { "title": string, "isSatisfied": boolean }
  ]
}

If a field is not present in the source text, use an empty array for lists and an empty string for text fields. Use false for isSatisfied when unknown.

DOCUMENT TEXT:
${extractedText}
`;
};

module.exports = {
  getFormIntelligencePrompt,
};
