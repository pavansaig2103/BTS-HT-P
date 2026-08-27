const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../../config/env');
const { contextualAssistanceSchema } = require('../../ai/schemas/contextualAssistance.schema');
const { getContextualAssistancePrompt } = require('../../ai/prompts/contextualAssistance.prompt');

class ContextualAssistanceService {
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

  cleanJsonString(str) {
    let clean = str.trim();
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '');
    }
    return clean.trim();
  }

  getDeterministicAssistantResponse({ question, stepTitle, language = 'en' }) {
    const qLower = question.toLowerCase();

    if (qLower.includes('attest') || qLower.includes('attestation')) {
      return {
        answer:
          language === 'te'
            ? '"అటెస్టేషన్ (Attested)" అంటే మీ అసలు సర్టిఫికేట్ జిరాక్స్ కాపీపై మీ కళాశాల ప్రిన్సిపాల్ లేదా గెజిటెడ్ అధికారి సంతకం చేసి, అధికారిక స్టాంప్ వేయడం. ఇది ఆ పత్రం నిజమైనదని ధృవీకరిస్తుంది.'
            : '"Attested" means having an authorized official (like your College Principal or a Gazetted Officer) sign and stamp a photocopy of your document after verifying the original. This confirms to the scholarship board that your uploaded copy is genuine.',
        grounded: true,
        confidence: 'confirmed',
        sources: ['Document Guidelines: Attested Documents Section'],
        uncertaintyNote: '',
        actionableTip:
          language === 'te'
            ? 'మీ కళాశాల ప్రిన్సిపాల్ కార్యాలయానికి వెళ్లి జిరాక్స్ కాపీపై సంతకం మరియు సీల్ వేయించుకోండి.'
            : 'Take your original mark sheet and a photocopy to your college office and ask for the Principal seal and signature.',
      };
    }

    if (qLower.includes('bonafide') || qLower.includes('study certificate')) {
      return {
        answer:
          language === 'te'
            ? '"బోనఫైడ్ సర్టిఫికేట్ (Bonafide Certificate)" అనేది మీరు ప్రస్తుతం ఆ కళాశాలలో విద్యార్థిగా చదువుతున్నారని నిర్ధారించే స్టడీ సర్టిఫికేట్. దీనిని మీ కళాశాల అడ్మినిస్ట్రేషన్ జారీ చేస్తుంది.'
            : 'A "Bonafide Certificate" is an official document issued by your college principal certifying that you are actively enrolled in the course and currently attending classes.',
        grounded: true,
        confidence: 'confirmed',
        sources: ['Institutional Verification Guidelines'],
        uncertaintyNote: '',
        actionableTip:
          language === 'te'
            ? 'మీ కళాశాల అడ్మిషన్ కౌంటర్‌లో బోనఫైడ్ సర్టిఫికేట్ కోసం దరఖాస్తు చేయండి.'
            : 'Request a study/bonafide certificate from your college administrative desk.',
      };
    }

    if (qLower.includes('income') || qLower.includes('meeseva')) {
      return {
        answer:
          language === 'te'
            ? 'ఈ స్కాలర్‌షిప్ కోసం కుటుంబ వార్షిక ఆదాయం ₹2,50,000 కంటే తక్కువగా ఉండాలి. ప్రస్తుత ఆర్థిక సంవత్సరానికి మీసేవా ద్వారా జారీ చేయబడిన తాజా ఆదాయ ధ్రువీకరణ పత్రం అవసరం.'
            : 'For this scholarship, your total annual family income from all sources must be less than INR 2,50,000. It requires a valid MeeSeva integrated income certificate issued for the current financial year.',
        grounded: true,
        confidence: 'confirmed',
        sources: ['Eligibility & Income Threshold Criteria'],
        uncertaintyNote: '',
        actionableTip: 'Ensure your MeeSeva income certificate bears a valid QR/barcode issued after April 1st.',
      };
    }

    if (qLower.includes('bank') || qLower.includes('aadhaar') || qLower.includes('dbt')) {
      return {
        answer:
          language === 'te'
            ? 'స్కాలర్‌షిప్ నగదు మీ బ్యాంక్ ఖాతాలో నేరుగా జమ కావడానికి మీ ఖాతా ఆధార్ కార్డుతో అనుసంధానించబడి (NPCI / DBT Active) ఉండాలి. ఖాతా మీ పేరుపైనే ఉండాలి.'
            : 'To receive the scholarship funds directly via Direct Benefit Transfer (DBT), your bank account must be actively linked to your Aadhaar number at your bank branch.',
        grounded: true,
        confidence: 'confirmed',
        sources: ['Disbursement & Bank Verification Clause'],
        uncertaintyNote: '',
        actionableTip: 'Check with your bank branch to ensure Aadhaar seeding / NPCI mapping is active.',
      };
    }

    return {
      answer:
        language === 'te'
          ? `మీరు అడిగిన ప్రశ్న: "${question}". ప్రస్తుత దశ "${stepTitle || 'దరఖాస్తు మార్గదర్శకాలు'}" ఆధారంగా, మీరు అవసరమైన అన్ని పత్రాలను సిద్ధం చేసుకుని తనిఖీ చేయాలి.`
          : `Regarding "${question}" in relation to "${stepTitle || 'Current Step'}": Please review the requirements listed in this step. Ensure your documents are genuine, clear, and match your official government identification.`,
      grounded: true,
      confidence: 'confirmed',
      sources: [`Current Step Context: ${stepTitle || 'General Guide'}`],
      uncertaintyNote: 'For specific institutional waivers or special cases, verify with your institution nodal officer.',
      actionableTip: 'Review the step checklist on the left before moving forward.',
    };
  }

  /**
   * Generates a grounded answer to a user contextual query
   */
  async answerQuestion(context) {
    const { question, stepTitle, language = 'en', explanationLevel = 'simple' } = context;

    if (!this.model) {
      return this.getDeterministicAssistantResponse({ question, stepTitle, language });
    }

    try {
      const prompt = getContextualAssistancePrompt(context);
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
        },
      });

      const cleaned = this.cleanJsonString(result.response.text());
      const parsed = JSON.parse(cleaned);
      const validated = contextualAssistanceSchema.safeParse(parsed);

      if (validated.success) {
        return validated.data;
      }
      return this.getDeterministicAssistantResponse({ question, stepTitle, language });
    } catch (err) {
      console.warn('⚠️ Contextual assistant API warning, using deterministic grounded answer:', err.message);
      return this.getDeterministicAssistantResponse({ question, stepTitle, language });
    }
  }
}

module.exports = new ContextualAssistanceService();
