-- AccessFlow AI Seed Data
-- Realistic Demo Scholarship Application Workflow

-- Seed Demo User (password: Password123!)
-- Hash generated with bcrypt cost 10
INSERT INTO users (id, name, email, password_hash)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Aarav Sharma',
    'demo@accessflow.ai',
    '$2a$10$7Z/U5Q0yG.0QG/i.tVfKjeYvLXZbHk/vTq7J4fTz0b3LhS9.y3Fte'
) ON CONFLICT (email) DO NOTHING;

-- Seed Accessibility Profile
INSERT INTO user_accessibility_profiles (id, user_id, preferred_language, explanation_level, guidance_mode)
VALUES (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'en',
    'simple',
    'step_by_step'
) ON CONFLICT (user_id) DO NOTHING;

-- Seed Document
INSERT INTO documents (
    id,
    user_id,
    original_filename,
    storage_path,
    mime_type,
    file_size,
    status,
    raw_extracted_text,
    document_title,
    document_type,
    ai_analysis_confidence,
    ai_analysis
)
VALUES (
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'National_Merit_Scholarship_2026_Notification.pdf',
    'demo/National_Merit_Scholarship_2026_Notification.pdf',
    'application/pdf',
    412350,
    'ready',
    'GOVERNMENT SCHOLARSHIP PORTAL - POST-MATRIC MERIT-CUM-MEANS SCHOLARSHIP SCHEME (2026-27). Eligible applicants must have secured >= 75% aggregate in intermediate/class XII and annual family income < INR 2,50,000. All documents including attested Marks Memo, MeeSeva Integrated Income Certificate, Aadhaar Linked Bank Passbook, and Bonafide Certificate from Head of Institution must be submitted before 15-Oct-2026.',
    'Post-Matric Merit-cum-Means Scholarship Scheme (2026-27)',
    'Government Scholarship Scheme Guidelines',
    'confirmed',
    '{
        "documentTitle": "Post-Matric Merit-cum-Means Scholarship Scheme (2026-27)",
        "documentType": "Scholarship Guidelines & Application Procedure",
        "summary": "State and Central joint scholarship providing financial assistance to meritorious undergraduate students from economically weaker backgrounds.",
        "deadlines": [{"title": "Application Deadline", "value": "15-Oct-2026", "confidence": "confirmed", "sourceText": "must be submitted before 15-Oct-2026"}],
        "difficultTerms": [
            {"term": "Attested", "simpleExplanation": "Signed and stamped by an authorized official (like your College Principal or a Gazetted Officer) to confirm it is genuine.", "teluguExplanation": "పత్రం నిజమైనదని ధృవీకరించడానికి కళాశాల ప్రిన్సిపాల్ లేదా అధికారి సంతకం మరియు స్టాంప్ చేయడం."},
            {"term": "MeeSeva Integrated Certificate", "simpleExplanation": "Official government certificate issued through digital service centers confirming caste and parental income.", "teluguExplanation": "మీసేవా ద్వారా జారీ చేయబడిన అధికారిక ప్రభుత్వ ఆదాయ మరియు కుల ధృవీకరణ పత్రం."},
            {"term": "Aadhaar Seeded Account", "simpleExplanation": "A bank account linked directly to your Aadhaar number to receive government Direct Benefit Transfer (DBT) funds.", "teluguExplanation": "ప్రభుత్వ స్కాలర్‌షిప్ నగదు నేరుగా జమ కావడానికి ఆధార్‌తో అనుసంధానించబడిన బ్యాంక్ ఖాతా."},
            {"term": "Bonafide Certificate", "simpleExplanation": "A formal letter from your college principal proving that you are an enrolled, regular student in the specified course.", "teluguExplanation": "మీరు ప్రస్తుత విద్యా సంవత్సరంలో ఆ కళాశాలలో చదువుతున్నారని ప్రిన్సిపాల్ ఇచ్చే స్టడీ సర్టిఫికేట్."}
        ],
        "warnings": [
            "Application cannot be edited after final submission.",
            "Bank account must be active and in the applicant''s own name (joint accounts with parents not allowed without verification).",
            "MeeSeva Income certificate must be issued after 01-April-2026."
        ]
    }'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Seed Workflow
INSERT INTO workflows (
    id,
    user_id,
    document_id,
    title,
    status,
    total_steps,
    completed_steps,
    progress_percentage,
    readiness_status
)
VALUES (
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'Merit-cum-Means Scholarship 2026 Preparation',
    'active',
    6,
    4,
    66.67,
    'NOT_READY'
) ON CONFLICT (id) DO NOTHING;

-- Seed Steps
INSERT INTO workflow_steps (id, workflow_id, step_order, title, official_instruction, simplified_explanation, status, is_required, confidence, source_text, field_payload)
VALUES
(
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    1,
    'Verify Basic Eligibility & Profile Information',
    'Applicant must ensure aggregate marks in qualifying examination >= 75.0% and annual parental income from all sources does not exceed INR 2,50,000/-.',
    'Check that your 12th/Intermediate marks are at least 75% and your family income is under ₹2.5 Lakhs per year. Enter your name and Aadhaar number exactly as written on official cards.',
    'completed',
    true,
    'confirmed',
    'Eligible applicants must have secured >= 75% aggregate in intermediate/class XII and annual family income < INR 2,50,000.',
    '{"fields": [{"name": "fullName", "label": "Full Name as per Aadhaar", "type": "text", "value": "Aarav Sharma"}, {"name": "twelfthPercentage", "label": "12th Standard Aggregate %", "type": "number", "value": "84.5"}]}'::jsonb
),
(
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    2,
    'Enter Current Academic & Course Enrollment Details',
    'Submit current institutional affiliation code, registered AISHE course code, roll number, and admission receipt serial number.',
    'Enter details about your current degree, college name, and first year admission roll number.',
    'completed',
    true,
    'confirmed',
    'Bonafide Certificate from Head of Institution with course code must be verified.',
    '{"fields": [{"name": "collegeName", "label": "Institution Name", "type": "text", "value": "Government Engineering College"}, {"name": "course", "label": "Enrolled Course", "type": "text", "value": "B.Tech Computer Science (1st Year)"}]}'::jsonb
),
(
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380003',
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    3,
    'Obtain & Upload Attested 12th Marks Memo',
    'Upload high-resolution scanned copy of Intermediate/Class XII consolidated mark sheet duly attested by Principal or Gazetted Officer.',
    'Get a photocopy of your 12th marks card, ask your college principal to put an official stamp and sign on it (this is called "attesting"), and upload a clear picture or PDF.',
    'completed',
    true,
    'confirmed',
    'All documents including attested Marks Memo must be submitted.',
    '{"documentType": "Marks Memo", "uploadedFile": "Class_12_Consolidated_Marksheet_Attested.pdf"}'::jsonb
),
(
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380004',
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    4,
    'Upload MeeSeva Income Certificate (Valid for 2026-27)',
    'Furnish digitised MeeSeva or competent Revenue Authority Income Certificate bearing barcode issued on or after 01-04-2026.',
    'Upload your family income certificate issued from MeeSeva center. Make sure it was issued in the current financial year with a valid QR/barcode.',
    'completed',
    true,
    'confirmed',
    'MeeSeva Integrated Income Certificate valid for current financial year.',
    '{"documentType": "Income Certificate", "uploadedFile": "MeeSeva_Income_Cert_2026.pdf"}'::jsonb
),
(
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380005',
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    5,
    'Link Aadhaar-Seeded Bank Account for Direct Benefit Transfer',
    'Provide Nationalized/Commercial Bank IFSC, Account Number, and proof of NPCI Aadhaar seeding for scholarship remittance.',
    'Enter your bank account number and IFSC code. Important: This account must be in your name and linked with your Aadhaar card so scholarship money can reach you directly.',
    'pending',
    true,
    'confirmed',
    'Aadhaar Linked Bank Passbook for direct disbursement.',
    '{"fields": [{"name": "accountNumber", "label": "Bank Account Number", "type": "text"}, {"name": "ifscCode", "label": "IFSC Code", "type": "text"}]}'::jsonb
),
(
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380006',
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    6,
    'Final Verification & Readiness Review',
    'Inspect all uploaded documents, verify eligibility criteria satisfaction, and prepare final acknowledgement checklist.',
    'Review all your uploaded certificates and details. AccessFlow will confirm whether everything is ready before you submit on the official portal.',
    'pending',
    true,
    'confirmed',
    'Final verification before submission deadline 15-Oct-2026.',
    '{}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Seed Requirements
INSERT INTO workflow_requirements (id, workflow_id, step_id, requirement_type, title, description, is_required, is_satisfied, confidence, source_text, status)
VALUES
(
    'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380001',
    'eligibility',
    'Minimum 75% Academic Aggregate',
    'Applicant scored 84.5% in Class 12th board exams (meets >= 75% requirement).',
    true,
    true,
    'confirmed',
    'Eligible applicants must have secured >= 75% aggregate',
    'satisfied'
),
(
    'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380003',
    'document',
    'Attested 12th Marks Memo',
    'Consolidated mark sheet stamped and signed by College Principal.',
    true,
    true,
    'confirmed',
    'attested Marks Memo',
    'satisfied'
),
(
    'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380003',
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380004',
    'document',
    'MeeSeva Income Certificate (Valid 2026-27)',
    'Income certificate confirming annual family income is under ₹2.5 Lakhs.',
    true,
    true,
    'confirmed',
    'MeeSeva Integrated Income Certificate',
    'satisfied'
),
(
    'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380004',
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380005',
    'document',
    'Bank Passbook Copy with Aadhaar Seeding Proof',
    'Copy of first page of bank passbook showing Account Number, IFSC, and Aadhaar linkage.',
    true,
    false,
    'confirmed',
    'Aadhaar Linked Bank Passbook',
    'missing'
),
(
    'f5eebc99-9c0b-4ef8-bb6d-6bb9bd380005',
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380002',
    'document',
    'Institutional Bonafide Certificate',
    'Certificate from current college proving active enrollment in first year.',
    true,
    true,
    'confirmed',
    'Bonafide Certificate from Head of Institution',
    'satisfied'
) ON CONFLICT (id) DO NOTHING;

-- Seed Sample AI Interaction
INSERT INTO ai_interactions (id, user_id, workflow_id, step_id, question, answer, grounded, confidence)
VALUES (
    '16eebc99-9c0b-4ef8-bb6d-6bb9bd380a66',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'd3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44',
    'e4eebc99-9c0b-4ef8-bb6d-6bb9bd380003',
    'What does attested mean in Step 3?',
    'In Step 3, "attested" means that a qualified authority—such as your College Principal, Headmaster, or a Gazetted Officer—must verify your original 12th marks sheet, stamp the photocopy with their official seal, and sign it. This officially certifies to the scholarship board that your uploaded copy is genuine.',
    true,
    'confirmed'
) ON CONFLICT (id) DO NOTHING;
