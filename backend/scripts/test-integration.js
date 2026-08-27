const API_BASE = 'http://localhost:5000/api';
const HEALTH_URL = 'http://localhost:5000/health';

async function request(url, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, {
    ...options,
    headers,
    body: options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function runIntegrationTests() {
  console.log('================================================================');
  console.log('🧪 ACCESSFLOW AI FULL-STACK END-TO-END INTEGRATION TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. HEALTH CHECK
  console.log('1️⃣ [VERIFICATION] Backend Health & Status Route...');
  try {
    const healthRes = await request(HEALTH_URL);
    assert(healthRes.status === 200, `GET /health status is 200 OK (Received: ${healthRes.status})`);
    assert(healthRes.data.status === 'ok', `Response health status confirmed: "ok"`);
    assert(healthRes.data.service === 'AccessFlow AI Backend', `Service Identifier: "${healthRes.data.service}"`);
  } catch (err) {
    assert(false, `Health check failed: ${err.message}`);
  }

  // 2. AUTHENTICATION (REGISTER -> LOGIN -> GET /ME)
  console.log('\n2️⃣ [AUTHENTICATION] End-to-End JWT Auth Lifecycle...');
  const testEmail = `champion_${Date.now()}@accessflow.ai`;
  const testPassword = 'SecurePassword123!';
  let authToken = null;
  let userId = null;

  try {
    const regRes = await request(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: {
        name: 'Aarav Accessibility Tester',
        email: testEmail,
        password: testPassword,
        preferredLanguage: 'en',
        explanationLevel: 'simple',
      },
    });
    assert(regRes.status === 201, `POST /api/auth/register returned 201 Created`);
    assert(Boolean(regRes.data.data?.token), `JWT Token returned upon registration`);
    authToken = regRes.data.data?.token;
    userId = regRes.data.data?.user?.id;
  } catch (err) {
    assert(false, `Registration failed: ${err.message}`);
  }

  try {
    const loginRes = await request(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: {
        email: testEmail,
        password: testPassword,
      },
    });
    assert(loginRes.status === 200, `POST /api/auth/login returned 200 OK`);
    assert(Boolean(loginRes.data.data?.token), `JWT Token received from login`);
  } catch (err) {
    assert(false, `Login failed: ${err.message}`);
  }

  try {
    const meRes = await request(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    assert(meRes.status === 200, `GET /api/auth/me returned 200 OK`);
    assert(meRes.data.data?.user?.email === testEmail, `Verified token payload matches user (${testEmail})`);
  } catch (err) {
    assert(false, `GET /auth/me failed: ${err.message}`);
  }

  // 3. ACCESSIBILITY PROFILE MANAGEMENT
  console.log('\n3️⃣ [ACCESSIBILITY PREFERENCES] Language & Adaptation Switching...');
  try {
    const profilePatchRes = await request(`${API_BASE}/profile`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${authToken}` },
      body: {
        preferred_language: 'te',
        explanation_level: 'detailed',
        guidance_mode: 'step_by_step',
      },
    });
    assert(profilePatchRes.status === 200, `PATCH /api/profile returned 200 OK`);
    assert(
      profilePatchRes.data.data?.profile?.preferred_language === 'te',
      `Language updated to Telugu ('te')`
    );
    assert(
      profilePatchRes.data.data?.profile?.explanation_level === 'detailed',
      `Explanation level saved as 'detailed'`
    );
  } catch (err) {
    assert(false, `Profile update failed: ${err.message}`);
  }

  // 4. DEMO MODE & PRE-SEEDED WORKFLOW VERIFICATION
  console.log('\n4️⃣ [DEMO WORKFLOW & SEED DATA] Testing Pre-Seeded Scholarship Workflow...');
  let demoToken = null;
  let demoWorkflowId = null;

  try {
    const demoLoginRes = await request(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: {
        email: 'demo@accessflow.ai',
        password: 'Password123!',
      },
    });
    assert(demoLoginRes.status === 200, `Demo user authentication returned 200 OK`);
    demoToken = demoLoginRes.data.data?.token;

    const demoWfRes = await request(`${API_BASE}/workflows`, {
      headers: { Authorization: `Bearer ${demoToken}` },
    });
    assert(demoWfRes.status === 200, `GET /api/workflows returned 200 OK for demo user`);
    const demoWorkflows = demoWfRes.data.data?.workflows || [];
    assert(demoWorkflows.length > 0, `Pre-seeded scholarship workflows detected (${demoWorkflows.length} found)`);

    demoWorkflowId = demoWorkflows[0]?.id;
    console.log(`     Target Demo Workflow: "${demoWorkflows[0]?.title}" (ID: ${demoWorkflowId})`);
  } catch (err) {
    assert(false, `Demo workflow retrieval failed: ${err.message}`);
  }

  // 5. DETERMINISTIC WORKFLOW STATE ENGINE & READINESS
  console.log('\n5️⃣ [DETERMINISTIC STATE ENGINE] Verifying Progress & Readiness Logic...');
  try {
    const wfDetailRes = await request(`${API_BASE}/workflows/${demoWorkflowId}`, {
      headers: { Authorization: `Bearer ${demoToken}` },
    });
    assert(wfDetailRes.status === 200, `GET /api/workflows/:id returned 200 OK`);
    const workflow = wfDetailRes.data.data?.workflow || {};
    const steps = workflow.steps || [];
    const requirements = workflow.requirements || [];

    assert(Array.isArray(steps) && steps.length === 6, `Workflow contains exactly 6 structured steps`);
    assert(Array.isArray(requirements) && requirements.length === 5, `Workflow contains 5 requirements`);

    // Verify step update triggers deterministic progress recalculation
    const step5 = steps.find((s) => s.step_order === 5);
    const updateStepRes = await request(`${API_BASE}/workflows/${demoWorkflowId}/steps/${step5.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${demoToken}` },
      body: {
        status: 'completed',
        fieldPayload: {
          accountNumber: '987654321012',
          ifscCode: 'SBIN0001234',
        },
      },
    });
    assert(updateStepRes.status === 200, `PATCH step 5 status to 'completed' succeeded`);

    // Check recalculated progress
    const progress = updateStepRes.data.data?.progress;
    assert(
      progress?.progressPercentage >= 66.67,
      `Deterministic progress calculation verified: ${progress?.progressPercentage}%`
    );

    // Verify checklist summary
    const checklistRes = await request(`${API_BASE}/workflows/${demoWorkflowId}/checklist`, {
      headers: { Authorization: `Bearer ${demoToken}` },
    });
    assert(checklistRes.status === 200, `GET /api/workflows/:id/checklist returned 200 OK`);
    const checklist = checklistRes.data.data?.checklist;
    assert(
      checklist?.summary?.totalSteps === 6,
      `Checklist reflects total steps: ${checklist?.summary?.totalSteps}`
    );
    assert(
      checklist?.readinessStatus === 'NOT_READY' || checklist?.readinessStatus === 'READY_FOR_FINAL_REVIEW',
      `Deterministic readiness status computed: ${checklist?.readinessStatus}`
    );
  } catch (err) {
    assert(false, `Deterministic state check failed: ${err.message}`);
  }

  // 6. AI ADAPTATION & INTELLIGENCE WITH GEMINI / FALLBACK
  console.log('\n6️⃣ [AI INTELLIGENCE & ADAPTATION] Bilingual Telugu Simplification & Q&A...');
  try {
    const adaptRes = await request(`${API_BASE}/ai/adapt`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: {
        text: 'The applicant must furnish an attested copy of the marks memo and MeeSeva income certificate before the deadline.',
        language: 'te',
        explanationLevel: 'simple',
      },
    });
    assert(adaptRes.status === 200, `POST /api/ai/adapt returned 200 OK`);
    const adaptedText = adaptRes.data.data?.adaptedExplanation || adaptRes.data.data?.adaptedText;
    assert(Boolean(adaptedText), `AI successfully returned adapted explanation`);
    console.log(`     Telugu Adapted Text: "${adaptedText?.substring(0, 80)}..."`);
  } catch (err) {
    assert(false, `AI text adaptation failed: ${err.message}`);
  }

  try {
    const askRes = await request(`${API_BASE}/ai/ask`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authToken}` },
      body: {
        question: 'What is a MeeSeva income certificate and how do I get one?',
      },
    });
    assert(askRes.status === 200, `POST /api/ai/ask returned 200 OK`);
    assert(Boolean(askRes.data.data?.answer), `AI copilot provided grounded answer`);
    console.log(`     AI Copilot Answer: "${askRes.data.data?.answer?.substring(0, 90)}..."`);
  } catch (err) {
    assert(false, `AI Q&A failed: ${err.message}`);
  }

  console.log('\n================================================================');
  console.log(`🏁 FINAL TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runIntegrationTests().catch((err) => {
  console.error('Fatal test execution error:', err);
  process.exit(1);
});
