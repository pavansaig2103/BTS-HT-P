const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../src/config/env');

async function testGeminiModels() {
  console.log('Testing Gemini API key:', env.GEMINI_API_KEY ? `${env.GEMINI_API_KEY.substring(0, 8)}...` : 'NONE');
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

  const candidateModels = [
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro-latest',
    'gemini-2.0-flash',
    'gemini-2.0-flash-exp',
    'gemini-pro',
  ];

  for (const modelName of candidateModels) {
    try {
      console.log(`Trying model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say "AccessFlow AI Online"');
      console.log(`✅ Success with ${modelName}:`, result.response.text().trim());
      break;
    } catch (e) {
      console.log(`❌ Failed with ${modelName}:`, e.message.substring(0, 100));
    }
  }
}

testGeminiModels();
