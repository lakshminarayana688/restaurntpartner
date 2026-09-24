import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  X,
  Camera,
  Building,
  ShieldCheck,
} from 'lucide-react';

export const DocumentUploadScreen: React.FC = () => {
  const { documents, updateDocument, submitDocumentsForVerification, setScreen, showToast } = useApp();
  const [previewDoc, setPreviewDoc] = useState<string | null>(null);

  const handleSimulateUpload = (id: string) => {
    updateDocument(id, {
      status: 'UPLOADED',
      fileName: `FEEDO_${id.toUpperCase()}_DOC.pdf`,
      fileSize: '1.8 MB',
      uploadedAt: 'Just now',
    });
    showToast('Document uploaded successfully!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 p-6 sm:p-10">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-6">
          <div>
            <button
              onClick={() => setScreen('register')}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Details</span>
            </button>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Restaurant Verification</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload statutory and business compliance documents for FEEDO onboarding approval.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted & Safe</span>
          </div>
        </div>

        {/* Document Cards Grid */}
        <div className="space-y-4 mb-8">
          {documents.map((doc) => {
            const isUploaded = doc.status !== 'NOT_UPLOADED';

            return (
              <div
                key={doc.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isUploaded
                    ? 'border-emerald-200 bg-emerald-50/20 shadow-2xs'
                    : 'border-slate-200 bg-slate-50/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`p-3 rounded-xl shrink-0 ${
                        isUploaded
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{doc.name}</h3>
                        {doc.isRequired ? (
                          <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.2 rounded">
                            Required
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-200 text-slate-600 font-medium px-1.5 py-0.2 rounded">
                            Optional
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{doc.description}</p>
                      {doc.fileName && (
                        <p className="text-[11px] text-emerald-700 font-medium mt-1">
                          ✓ {doc.fileName} ({doc.fileSize}) • {doc.uploadedAt}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {isUploaded ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc.name)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSimulateUpload(doc.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Replace</span>
                        </button>
                        <span className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 rounded-full border border-emerald-300">
                          ✓ Uploaded
                        </span>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSimulateUpload(doc.id)}
                        className="px-4 py-2 text-xs font-bold text-white bg-feedo-500 hover:bg-feedo-600 rounded-xl flex items-center gap-1.5 shadow-md shadow-feedo-500/20 transition-all cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            FEEDO verifies documents within 24-48 hours.
          </p>
          <button
            type="button"
            onClick={submitDocumentsForVerification}
            className="py-3.5 px-8 bg-gradient-to-r from-feedo-500 to-feedo-600 hover:from-feedo-600 hover:to-feedo-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-feedo-500/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Submit for Verification</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 mb-4">{previewDoc} — Document Preview</h3>
            <div className="w-full h-64 bg-slate-100 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 p-6 text-center">
              <FileText className="w-16 h-16 text-slate-400 mb-2" />
              <p className="text-xs font-bold text-slate-700">Official Compliance Document</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Verified digital watermark: FEEDO_PARTNER_KYC_OK
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
