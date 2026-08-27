const bcrypt = require('bcryptjs');

async function seedInMemoryStore(inMemoryStore) {
  if (inMemoryStore.users.length > 0) return;

  const passwordHash = await bcrypt.hash('Password123!', 10);
  const userId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  const profileId = 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22';
  const docId = 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33';
  const workflowId = 'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44';

  inMemoryStore.users.push({
    id: userId,
    name: 'Aarav Sharma',
    email: 'demo@accessflow.ai',
    password_hash: passwordHash,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  inMemoryStore.user_accessibility_profiles.push({
    id: profileId,
    user_id: userId,
    preferred_language: 'en',
    explanation_level: 'simple',
    guidance_mode: 'step_by_step',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  inMemoryStore.documents.push({
    id: docId,
    user_id: userId,
    original_filename: 'National_Merit_Scholarship_2026_Notification.pdf',
    storage_path: 'demo/National_Merit_Scholarship_2026_Notification.pdf',
    mime_type: 'application/pdf',
    file_size: 412350,
    status: 'ready',
    raw_extracted_text:
      'GOVERNMENT SCHOLARSHIP PORTAL - POST-MATRIC MERIT-CUM-MEANS SCHOLARSHIP SCHEME (2026-27). Eligible applicants must have secured >= 75% aggregate in intermediate/class XII and annual family income < INR 2,50,000. All documents including attested Marks Memo, MeeSeva Integrated Income Certificate, Aadhaar Linked Bank Passbook, and Bonafide Certificate from Head of Institution must be submitted before 15-Oct-2026.',
    document_title: 'Post-Matric Merit-cum-Means Scholarship Scheme (2026-27)',
    document_type: 'Government Scholarship Scheme Guidelines',
    ai_analysis_confidence: 'confirmed',
    ai_analysis: {
      documentTitle: 'Post-Matric Merit-cum-Means Scholarship Scheme (2026-27)',
      documentType: 'Scholarship Guidelines & Application Procedure',
      summary:
        'State and Central joint scholarship providing financial assistance to meritorious undergraduate students from economically weaker backgrounds.',
      deadlines: [
        {
          title: 'Application Deadline',
          value: '15-Oct-2026',
          confidence: 'confirmed',
          sourceText: 'must be submitted before 15-Oct-2026',
        },
      ],
      difficultTerms: [
        {
          term: 'Attested',
          simpleExplanation:
            'Signed and stamped by an authorized official (like your College Principal or a Gazetted Officer) to confirm it is genuine.',
          teluguExplanation:
            'పత్రం నిజమైనదని ధృవీకరించడానికి కళాశాల ప్రిన్సిపాల్ లేదా అధికారి సంతకం మరియు స్టాంప్ చేయడం.',
        },
        {
          term: 'MeeSeva Integrated Certificate',
          simpleExplanation:
            'Official government certificate issued through digital service centers confirming caste and parental income.',
          teluguExplanation:
            'మీసేవా ద్వారా జారీ చేయబడిన అధికారిక ప్రభుత్వ ఆదాయ మరియు కుల ధృవీకరణ పత్రం.',
        },
        {
          term: 'Aadhaar Seeded Account',
          simpleExplanation:
            'A bank account linked directly to your Aadhaar number to receive government Direct Benefit Transfer (DBT) funds.',
          teluguExplanation:
            'ప్రభుత్వ స్కాలర్‌షిప్ నగదు నేరుగా జమ కావడానికి ఆధార్‌తో అనుసంధానించబడిన బ్యాంక్ ఖాతా.',
        },
        {
          term: 'Bonafide Certificate',
          simpleExplanation:
            'A formal letter from your college principal proving that you are an enrolled, regular student in the specified course.',
          teluguExplanation:
            'మీరు ప్రస్తుత విద్యా సంవత్సరంలో ఆ కళాశాలలో చదువుతున్నారని ప్రిన్సిపాల్ ఇచ్చే స్టడీ సర్టిఫికేట్.',
        },
      ],
      warnings: [
        'Application cannot be edited after final submission.',
        "Bank account must be active and in the applicant's own name (joint accounts with parents not allowed without verification).",
        'MeeSeva Income certificate must be issued after 01-April-2026.',
      ],
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  inMemoryStore.workflows.push({
    id: workflowId,
    user_id: userId,
    document_id: docId,
    title: 'Merit-cum-Means Scholarship 2026 Preparation',
    status: 'active',
    total_steps: 6,
    completed_steps: 4,
    progress_percentage: 66.67,
    readiness_status: 'NOT_READY',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const steps = [
    {
      id: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
      workflow_id: workflowId,
      step_order: 1,
      title: 'Verify Basic Eligibility & Profile Information',
      official_instruction:
        'Applicant must ensure aggregate marks in qualifying examination >= 75.0% and annual parental income from all sources does not exceed INR 2,50,000/-.',
      simplified_explanation:
        'Check that your 12th/Intermediate marks are at least 75% and your family income is under ₹2.5 Lakhs per year. Enter your name and Aadhaar number exactly as written on official cards.',
      status: 'completed',
      is_required: true,
      confidence: 'confirmed',
      source_text:
        'Eligible applicants must have secured >= 75% aggregate in intermediate/class XII and annual family income < INR 2,50,000.',
      field_payload: {
        fields: [
          { name: 'fullName', label: 'Full Name as per Aadhaar', type: 'text', value: 'Aarav Sharma' },
          { name: 'twelfthPercentage', label: '12th Standard Aggregate %', type: 'number', value: '84.5' },
        ],
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
      workflow_id: workflowId,
      step_order: 2,
      title: 'Enter Current Academic & Course Enrollment Details',
      official_instruction:
        'Submit current institutional affiliation code, registered AISHE course code, roll number, and admission receipt serial number.',
      simplified_explanation:
        'Enter details about your current degree, college name, and first year admission roll number.',
      status: 'completed',
      is_required: true,
      confidence: 'confirmed',
      source_text: 'Bonafide Certificate from Head of Institution with course code must be verified.',
      field_payload: {
        fields: [
          { name: 'collegeName', label: 'Institution Name', type: 'text', value: 'Government Engineering College' },
          { name: 'course', label: 'Enrolled Course', type: 'text', value: 'B.Tech Computer Science (1st Year)' },
        ],
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380003',
      workflow_id: workflowId,
      step_order: 3,
      title: 'Obtain & Upload Attested 12th Marks Memo',
      official_instruction:
        'Upload high-resolution scanned copy of Intermediate/Class XII consolidated mark sheet duly attested by Principal or Gazetted Officer.',
      simplified_explanation:
        'Get a photocopy of your 12th marks card, ask your college principal to put an official stamp and sign on it (this is called "attesting"), and upload a clear picture or PDF.',
      status: 'completed',
      is_required: true,
      confidence: 'confirmed',
      source_text: 'All documents including attested Marks Memo must be submitted.',
      field_payload: {
        documentType: 'Marks Memo',
        uploadedFile: 'Class_12_Consolidated_Marksheet_Attested.pdf',
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380004',
      workflow_id: workflowId,
      step_order: 4,
      title: 'Upload MeeSeva Income Certificate (Valid for 2026-27)',
      official_instruction:
        'Furnish digitised MeeSeva or competent Revenue Authority Income Certificate bearing barcode issued on or after 01-04-2026.',
      simplified_explanation:
        'Upload your family income certificate issued from MeeSeva center. Make sure it was issued in the current financial year with a valid QR/barcode.',
      status: 'completed',
      is_required: true,
      confidence: 'confirmed',
      source_text: 'MeeSeva Integrated Income Certificate valid for current financial year.',
      field_payload: {
        documentType: 'Income Certificate',
        uploadedFile: 'MeeSeva_Income_Cert_2026.pdf',
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380005',
      workflow_id: workflowId,
      step_order: 5,
      title: 'Link Aadhaar-Seeded Bank Account for Direct Benefit Transfer',
      official_instruction:
        'Provide Nationalized/Commercial Bank IFSC, Account Number, and proof of NPCI Aadhaar seeding for scholarship remittance.',
      simplified_explanation:
        'Enter your bank account number and IFSC code. Important: This account must be in your name and linked with your Aadhaar card so scholarship money can reach you directly.',
      status: 'pending',
      is_required: true,
      confidence: 'confirmed',
      source_text: 'Aadhaar Linked Bank Passbook for direct disbursement.',
      field_payload: {
        fields: [
          { name: 'accountNumber', label: 'Bank Account Number', type: 'text', value: '' },
          { name: 'ifscCode', label: 'IFSC Code', type: 'text', value: '' },
        ],
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380006',
      workflow_id: workflowId,
      step_order: 6,
      title: 'Final Verification & Readiness Review',
      official_instruction:
        'Inspect all uploaded documents, verify eligibility criteria satisfaction, and prepare final acknowledgement checklist.',
      simplified_explanation:
        'Review all your uploaded certificates and details. AccessFlow will confirm whether everything is ready before you submit on the official portal.',
      status: 'pending',
      is_required: true,
      confidence: 'confirmed',
      source_text: 'Final verification before submission deadline 15-Oct-2026.',
      field_payload: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  inMemoryStore.workflow_steps.push(...steps);

  const reqs = [
    {
      id: 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
      workflow_id: workflowId,
      step_id: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
      requirement_type: 'eligibility',
      title: 'Minimum 75% Academic Aggregate',
      description: 'Applicant scored 84.5% in Class 12th board exams (meets >= 75% requirement).',
      is_required: true,
      is_satisfied: true,
      confidence: 'confirmed',
      source_text: 'Eligible applicants must have secured >= 75% aggregate',
      status: 'satisfied',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
      workflow_id: workflowId,
      step_id: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380003',
      requirement_type: 'document',
      title: 'Attested 12th Marks Memo',
      description: 'Consolidated mark sheet stamped and signed by College Principal.',
      is_required: true,
      is_satisfied: true,
      confidence: 'confirmed',
      source_text: 'attested Marks Memo',
      status: 'satisfied',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380003',
      workflow_id: workflowId,
      step_id: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380004',
      requirement_type: 'document',
      title: 'MeeSeva Income Certificate (Valid 2026-27)',
      description: 'Income certificate confirming annual family income is under ₹2.5 Lakhs.',
      is_required: true,
      is_satisfied: true,
      confidence: 'confirmed',
      source_text: 'MeeSeva Integrated Income Certificate',
      status: 'satisfied',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380004',
      workflow_id: workflowId,
      step_id: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380005',
      requirement_type: 'document',
      title: 'Bank Passbook Copy with Aadhaar Seeding Proof',
      description: 'Copy of first page of bank passbook showing Account Number, IFSC, and Aadhaar linkage.',
      is_required: true,
      is_satisfied: false,
      confidence: 'confirmed',
      source_text: 'Aadhaar Linked Bank Passbook',
      status: 'missing',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380005',
      workflow_id: workflowId,
      step_id: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
      requirement_type: 'document',
      title: 'Institutional Bonafide Certificate',
      description: 'Certificate from current college proving active enrollment in first year.',
      is_required: true,
      is_satisfied: true,
      confidence: 'confirmed',
      source_text: 'Bonafide Certificate from Head of Institution',
      status: 'satisfied',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  inMemoryStore.workflow_requirements.push(...reqs);

  inMemoryStore.ai_interactions.push({
    id: '16eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
    user_id: userId,
    workflow_id: workflowId,
    step_id: 'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380003',
    question: 'What does attested mean in Step 3?',
    answer:
      'In Step 3, "attested" means that a qualified authority—such as your College Principal, Headmaster, or a Gazetted Officer—must verify your original 12th marks sheet, stamp the photocopy with their official seal, and sign it. This officially certifies to the scholarship board that your uploaded copy is genuine.',
    grounded: true,
    confidence: 'confirmed',
    created_at: new Date().toISOString(),
  });

  console.log('🌱 Seeded in-memory store with demo scholarship application workflow.');
}

module.exports = { seedInMemoryStore };
