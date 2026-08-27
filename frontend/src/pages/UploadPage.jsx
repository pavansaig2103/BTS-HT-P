import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { documentApi } from '../services/documentApi';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Award
} from 'lucide-react';

export const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  const validateAndSetFile = (selectedFile) => {
    setError(null);
    if (!selectedFile) return;

    const allowedMime = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedMime.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload a PDF, PNG, or JPEG document.');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File exceeds 10MB maximum limit. Please select a smaller document.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || uploading) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await documentApi.upload(formData);
      if (res.success && res.data) {
        const workflowId = res.data.workflow?.id;
        const documentId = res.data.document?.id;
        navigate(`/processing?docId=${documentId}&wfId=${workflowId}`);
      }
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
      setUploading(false);
    }
  };

  // Sample document 1-click test button
  const handleUseSampleScholarship = async () => {
    // Generate a dummy text PDF blob on the fly or proceed with sample text
    const sampleContent = `%PDF-1.4
% Sample Scholarship Application Scheme Guidelines
STATE POST-MATRIC MERIT-CUM-MEANS SCHOLARSHIP SCHEME (2026-27).
Eligibility Criteria:
1. Candidate must have scored >= 75% aggregate marks in 12th standard.
2. Annual parental income from all sources must be less than INR 2,50,000.
Required Attachments:
- Attested Marks Memo from College Principal
- MeeSeva Integrated Income Certificate
- Aadhaar Linked Bank Passbook Copy
- Institutional Bonafide Study Certificate
Last Date for Submission: 15-October-2026.
%%EOF`;

    const sampleBlob = new Blob([sampleContent], { type: 'application/pdf' });
    const sampleFile = new File([sampleBlob], 'State_Merit_Scholarship_2026.pdf', { type: 'application/pdf' });
    validateAndSetFile(sampleFile);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Step 1: Document Ingestion</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Upload Your Application Document
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Upload any official PDF or scanned image notification (scholarship, government welfare, university admission). AccessFlow AI will convert it into your personal step-by-step workflow.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all bg-white ${
          dragging
            ? 'border-indigo-600 bg-indigo-50/50 scale-[1.01]'
            : 'border-slate-300 hover:border-indigo-400 shadow-sm'
        }`}
      >
        <input
          id="doc-upload"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => validateAndSetFile(e.target.files?.[0])}
          className="hidden"
        />

        <div className="space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <label htmlFor="doc-upload" className="cursor-pointer block text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
              {file ? `Selected: ${file.name}` : 'Click to browse files or drag and drop here'}
            </label>
            <p className="text-xs text-slate-500">
              Supports text-based PDF (primary), PNG, and JPEG up to 10MB
            </p>
          </div>

          {file && (
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 px-3.5 py-1.5 rounded-xl border border-emerald-200 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{file.name} ({(file.size / 1024).toFixed(1)} KB) ready</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* 1-Click Sample Button */}
        <button
          type="button"
          onClick={handleUseSampleScholarship}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <Award className="w-4 h-4 text-indigo-600" />
          <span>Load Sample Scholarship PDF</span>
        </button>

        {/* Start Analysis Button */}
        <button
          type="button"
          disabled={!file || uploading}
          onClick={handleUpload}
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-200 transition-all"
        >
          <span>{uploading ? 'Processing Pipeline...' : 'Generate Accessible Workflow'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Privacy Guarantee Note */}
      <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <Lock className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-slate-800">Private & Secure Storage</span>
          <p>
            Your uploaded documents are securely stored in private storage buckets and only accessible by your authenticated account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
