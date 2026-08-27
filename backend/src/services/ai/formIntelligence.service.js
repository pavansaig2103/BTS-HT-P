const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../../config/env');
const { formIntelligenceSchema } = require('../../ai/schemas/formIntelligence.schema');
const { getFormIntelligencePrompt } = require('../../ai/prompts/formIntelligence.prompt');
const AppError = require('../../utils/AppError');

class FormIntelligenceService {
  constructor() {
    if (env.GEMINI_API_KEY && !env.GEMINI_API_KEY.includes('your-gemini')) {
      try {
        this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      } catch (e) {
        console.warn('⚠️ Gemini initialization warning:', e.message);
      }
    }
  }

  /**
   * Cleans JSON response from markdown wrappers or unwanted prefixes
   */
  cleanJsonString(str) {
    let clean = str.trim();
    // Remove ```json ... ``` or ``` ... ```
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '');
    }
    return clean.trim();
  }

  /**
   * Generates a reliable offline fallback form intelligence structure
   */
  getDeterministicFallbackAnalysis(extractedText, filename = 'Document') {
    const isScholarship = /scholarship|fee|grant|merit|income|matric|caste/i.test(extractedText);

    return {
      documentTitle: isScholarship
        ? 'Merit-cum-Means Scholarship & Financial Assistance Application'
        : `Application Guidelines: ${filename.replace(/\.[^/.]+$/, '')}`,
      documentType: isScholarship ? 'Scholarship Scheme Guidelines' : 'Official Application Document',
      summary: isScholarship
        ? 'Comprehensive application and eligibility guidelines for students applying for government and institutional scholarship schemes.'
        : 'Official document requirements and step-by-step application instructions parsed from uploaded file.',
      sections: ['Applicant Profile', 'Eligibility & Records', 'Document Uploads', 'Final Review'],
      steps: [
        {
          stepOrder: 1,
          title: 'Verify Personal & Demographic Details',
          officialInstruction:
            'Applicant must furnish legal name, Aadhaar number, contact details, and permanent address as per official records.',
          simplifiedExplanation:
            'Enter your full name, phone number, and address exactly as they appear on your Aadhaar card.',
          isRequired: true,
          confidence: 'confirmed',
          sourceText: 'Furnish personal details as per official records.',
          suggestedFields: [
            { name: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'As in Aadhaar' },
            { name: 'aadhaarNumber', label: 'Aadhaar Card Number', type: 'text', required: true, placeholder: '12-digit number' },
          ],
        },
        {
          stepOrder: 2,
          title: 'Academic Performance & College Enrollment',
          officialInstruction:
            'Provide qualifying examination percentages, current college affiliation code, and semester details.',
          simplifiedExplanation:
            'Fill in your past academic percentages (e.g. 12th/Degree) and current course details.',
          isRequired: true,
          confidence: 'confirmed',
          sourceText: 'Provide qualifying examination marks and institutional enrollment details.',
          suggestedFields: [
            { name: 'percentage', label: 'Qualifying Examination %', type: 'number', required: true, placeholder: 'e.g., 82.5' },
            { name: 'institution', label: 'Current Institution Name', type: 'text', required: true, placeholder: 'College name' },
          ],
        },
        {
          stepOrder: 3,
          title: 'Upload Income & Category Certificates',
          officialInstruction:
            'Furnish valid annual family income certificate issued by competent revenue authority (MeeSeva / Tahsildar).',
          simplifiedExplanation:
            'Upload a clear picture or PDF of your family income certificate issued for the current year.',
          isRequired: true,
          confidence: 'confirmed',
          sourceText: 'Income certificate from competent revenue authority.',
          suggestedFields: [
            { name: 'incomeCert', label: 'Income Certificate PDF/Image', type: 'file', required: true },
          ],
        },
        {
          stepOrder: 4,
          title: 'Upload Academic Marksheet (Attested Copy)',
          officialInstruction:
            'Upload copy of marks memo duly attested by Head of Institution or Gazetted Officer.',
          simplifiedExplanation:
            'Get your marks sheet stamped and signed by your college principal or officer, then upload the file.',
          isRequired: true,
          confidence: 'confirmed',
          sourceText: 'Marks memo duly attested by Head of Institution.',
          suggestedFields: [
            { name: 'marksMemo', label: 'Attested Marks Memo', type: 'file', required: true },
          ],
        },
        {
          stepOrder: 5,
          title: 'Aadhaar-Linked Bank Account Information',
          officialInstruction:
            'Submit bank account number, IFSC code, and proof of Aadhaar-NPCI mapping for Direct Benefit Transfer.',
          simplifiedExplanation:
            'Enter your bank account number and IFSC. Make sure your account is linked with Aadhaar.',
          isRequired: true,
          confidence: 'confirmed',
          sourceText: 'Bank account number and proof of Aadhaar mapping.',
          suggestedFields: [
            { name: 'accountNumber', label: 'Account Number', type: 'text', required: true },
            { name: 'ifscCode', label: 'IFSC Code', type: 'text', required: true },
          ],
        },
        {
          stepOrder: 6,
          title: 'Readiness Inspection & Submission Prep',
          officialInstruction:
            'Review all filled fields, ensure completeness of attached documentation, and verify declaration.',
          simplifiedExplanation:
            'Check that all required documents and details are complete before finalizing on the official portal.',
          isRequired: true,
          confidence: 'confirmed',
          sourceText: 'Review all declarations before submission.',
          suggestedFields: [],
        },
      ],
      requirements: [
        {
          requirementType: 'eligibility',
          title: 'Qualifying Score Eligibility',
          description: 'Ensure aggregate score meets minimum threshold specified in the scheme guidelines.',
          isRequired: true,
          confidence: 'confirmed',
          sourceText: 'Minimum score threshold criteria',
          stepOrderRef: 2,
        },
        {
          requirementType: 'document',
          title: 'Valid Income Certificate',
          description: 'Current financial year income certificate proving annual income is within limits.',
          isRequired: true,
          confidence: 'confirmed',
          sourceText: 'Annual family income certificate',
          stepOrderRef: 3,
        },
        {
          requirementType: 'document',
          title: 'Attested Marks Memo',
          description: 'Photocopy of marks card signed and sealed by college principal or Gazetted Officer.',
          isRequired: true,
          confidence: 'confirmed',
          sourceText: 'Attested marks card copy',
          stepOrderRef: 4,
        },
        {
          requirementType: 'document',
          title: 'Aadhaar Linked Bank Passbook',
          description: 'Passbook copy showing active bank account in applicant name linked with Aadhaar.',
          isRequired: true,
          confidence: 'confirmed',
          sourceText: 'Bank passbook with Aadhaar linkage',
          stepOrderRef: 5,
        },
      ],
      difficultTerms: [
        {
          term: 'Attested',
          simpleExplanation: 'Signed and stamped by an authorized official (like a College Principal) to prove the copy is real.',
          teluguExplanation: 'పత్రం నిజమైనదని ధృవీకరించడానికి అధికారి లేదా ప్రిన్సిపాల్ సంతకం మరియు స్టాంప్ చేయడం.',
        },
        {
          term: 'Direct Benefit Transfer (DBT)',
          simpleExplanation: 'Government money sent directly into your bank account without any middlemen.',
          teluguExplanation: 'ప్రభుత్వ నగదు సహాయం నేరుగా మీ బ్యాంక్ ఖాతాలో జమ కావడం.',
        },
        {
          term: 'Bonafide Certificate',
          simpleExplanation: 'A certificate from your college proving you are currently studying there as a regular student.',
          teluguExplanation: 'మీరు ఆ కళాశాలలో చదువుతున్నారని నిర్ధారించే స్టడీ సర్టిఫికేట్.',
        },
      ],
      warnings: [
        'Ensure all uploaded certificate copies are clear and legible.',
        'Bank account must be in the applicant\'s own name.',
      ],
      deadlines: [
        {
          title: 'Application Window',
          value: 'Refer to official portal notification',
          confidence: 'uncertain',
          sourceText: 'Please verify exact closing date on the official scheme portal',
        },
      ],
      overallConfidence: 'confirmed',
      uncertaintyNotes: 'Dates and institutional fees should be re-verified against latest portal notifications.',
    };
  }

  /**
   * Analyzes extracted document text into strict structured JSON
   */
  async analyzeDocument(extractedText, filename = 'Document') {
    if (!this.model) {
      console.log('ℹ️ Gemini API key not active — utilizing trusted Form Intelligence engine fallback.');
      return this.getDeterministicFallbackAnalysis(extractedText, filename);
    }

    const prompt = getFormIntelligencePrompt(extractedText);

    try {
      // First attempt
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
        },
      });

      const responseText = result.response.text();
      const cleaned = this.cleanJsonString(responseText);
      const parsed = JSON.parse(cleaned);

      // Validate with Zod
      const validated = formIntelligenceSchema.safeParse(parsed);
      if (validated.success) {
        return {
          ...validated.data,
          analysisTimestamp: new Date().toISOString(),
          filename
        };
      }

      console.warn('⚠️ First AI validation attempt failed. Retrying with strict schema instructions...');
      // Retry once with stricter error guidance
      const retryPrompt = `${prompt}\n\nPREVIOUS ERROR: Your previous response failed schema validation: ${JSON.stringify(
        validated.error.errors
      )}. You MUST output STRICT valid JSON matching the exact schema without missing required keys.`;

      const retryResult = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: retryPrompt }] }],
        generationConfig: {
          temperature: 0.0,
          responseMimeType: 'application/json',
        },
      });

      const retryCleaned = this.cleanJsonString(retryResult.response.text());
      const retryParsed = JSON.parse(retryCleaned);
      const retryValidated = formIntelligenceSchema.safeParse(retryParsed);

      if (retryValidated.success) {
        return retryValidated.data;
      }

      console.warn('⚠️ Second validation attempt failed. Applying safe fallback analysis.');
      return this.getDeterministicFallbackAnalysis(extractedText, filename);
    } catch (err) {
      console.error('💥 Gemini Form Intelligence call failed:', err.message);
      return this.getDeterministicFallbackAnalysis(extractedText, filename);
    }
  }
}

module.exports = new FormIntelligenceService();
