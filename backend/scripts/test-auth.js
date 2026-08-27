const authService = require('../src/services/auth.service');
const { seedInMemoryStore } = require('../src/config/seedData');
const { inMemoryStore } = require('../src/config/supabase');

async function testAuth() {
  await seedInMemoryStore(inMemoryStore);
  console.log('Testing registration...');
  const res = await authService.register({
    name: 'Accessibility Hero',
    email: 'hero@accessflow.ai',
    password: 'Password123!',
    preferredLanguage: 'te',
    explanationLevel: 'simple',
  });
  console.log('Registration success:', res.user.email, 'Token exists:', Boolean(res.token));

  console.log('Testing login...');
  const loginRes = await authService.login({
    email: 'hero@accessflow.ai',
    password: 'Password123!',
  });
  console.log('Login success:', loginRes.user.email, 'Language:', loginRes.user.preferred_language);

  console.log('Testing demo login...');
  const demoLogin = await authService.login({
    email: 'demo@accessflow.ai',
    password: 'Password123!',
  });
  console.log('Demo Login success:', demoLogin.user.name);
}

testAuth().catch(console.error);
