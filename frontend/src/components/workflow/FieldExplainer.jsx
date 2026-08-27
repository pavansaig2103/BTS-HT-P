import React from 'react';
import { HelpCircle, Info, UploadCloud, CheckCircle2 } from 'lucide-react';

export const FieldExplainer = ({ field, value, onChange }) => {
  return (
    <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between">
        <label htmlFor={`field-${field.name}`} className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <span>{field.label}</span>
          {field.required && <span className="text-rose-500 font-bold">*</span>}
        </label>
        {field.type === 'file' && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            Attachment
          </span>
        )}
      </div>

      {field.type === 'file' ? (
        <div className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl p-4 text-center bg-white transition-colors cursor-pointer group">
          <input
            id={`field-${field.name}`}
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && onChange) {
                onChange(file.name);
              }
            }}
          />
          <label htmlFor={`field-${field.name}`} className="cursor-pointer block">
            <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-indigo-600 mx-auto mb-1.5 transition-colors" />
            <span className="text-xs font-semibold text-indigo-600 group-hover:underline">
              {value ? `Selected: ${value}` : 'Upload scanned copy (PDF or Image)'}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Maximum file size 10MB</p>
          </label>
        </div>
      ) : (
        <input
          id={`field-${field.name}`}
          type={field.type || 'text'}
          value={value || ''}
          placeholder={field.placeholder || `Enter ${field.label}`}
          onChange={(e) => onChange && onChange(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-all"
        />
      )}
    </div>
  );
};

export default FieldExplainer;
