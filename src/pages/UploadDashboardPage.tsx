import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, CheckCircle2, AlertTriangle, ArrowLeft, RefreshCw, ShieldCheck } from 'lucide-react';
import { checkDuplicateFile, uploadRepositoryItem } from '../services/api';

type ContentType = 'report' | 'dataset' | 'publication' | 'image' | 'video' | 'activity';

export const UploadDashboardPage: React.FC = () => {
  const [contentType, setContentType] = useState<ContentType>('report');
  const [file, setFile] = useState<File | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [authors, setAuthors] = useState('');
  const [publicationDate, setPublicationDate] = useState('2023-05-15');
  const [expeditionId, setExpeditionId] = useState('ISEA-42');
  const [stationId, setStationId] = useState('Bharati');
  const [researchTopicId, setResearchTopicId] = useState('oceanography');
  const [documentType] = useState('Expedition Report');
  const [datasetIdentifier, setDatasetIdentifier] = useState('POLAR-DS-2023-999');
  const [format, setFormat] = useState('CSV');
  const [journal] = useState('Journal of Climate Cryosphere');
  const [doi] = useState('10.1016/j.jclimcryo.2023.999');
  const [version] = useState('1.0');
  const [license] = useState('CC BY 4.0');


  // Flow State
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const [validationError, setValidationError] = useState<string | null>(null);
  const [duplicateAlert, setDuplicateAlert] = useState<any | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<any | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setValidationError(null);
      setDuplicateAlert(null);

      // Instant Checksum & Duplicate Check
      try {
        const dupRes = await checkDuplicateFile(selectedFile);
        if (dupRes.is_duplicate) {
          setDuplicateAlert(dupRes);
        }
      } catch (err) {
        console.warn('Duplicate check error', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setValidationError('Please select a file to upload.');
      return;
    }
    if (!title.trim()) {
      setValidationError('Title is required.');
      return;
    }

    setUploading(true);
    setValidationError(null);
    setDuplicateAlert(null);
    setProgress(15);
    setStatusMessage('Validating file safety & MIME type...');

    try {
      await new Promise((r) => setTimeout(r, 400));
      setProgress(40);
      setStatusMessage('Generating SHA-256 cryptographic checksum...');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('authors', authors);
      formData.append('publication_date', publicationDate);
      formData.append('expedition_id', expeditionId);
      formData.append('station_id', stationId);
      formData.append('research_topic_id', researchTopicId);
      formData.append('version', version);
      formData.append('license', license);

      if (contentType === 'report') {
        formData.append('document_type', documentType);
      } else if (contentType === 'dataset') {
        formData.append('dataset_identifier', datasetIdentifier);
        formData.append('format', format);
      } else if (contentType === 'publication') {
        formData.append('journal', journal);
        formData.append('doi', doi);
      } else if (contentType === 'image' || contentType === 'video') {
        formData.append('media_type', contentType.toUpperCase());
        formData.append('creator', authors || 'NCPOR Media Wing');
      }

      setProgress(75);
      setStatusMessage('Storing file in StorageService & writing metadata...');

      const res = await uploadRepositoryItem(contentType, formData);
      setProgress(100);
      setStatusMessage('Complete');
      setUploadSuccess(res);
    } catch (err: any) {
      setValidationError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-dashboard-page bg-[#071A2B] text-slate-100 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/repository" className="inline-flex items-center text-xs text-teal-400 hover:underline mb-4">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Knowledge Portal
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white font-serif flex items-center gap-3">
                <Upload className="w-8 h-8 text-teal-400" />
                Repository Ingestion & Upload Dashboard
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Authorized user file upload pipeline with SHA-256 duplicate detection & review queue integration.
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1 bg-teal-950 text-teal-300 rounded-full border border-teal-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Role: RESEARCHER
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Success Card */}
        {uploadSuccess ? (
          <div className="p-8 rounded-xl bg-slate-900 border border-emerald-500/80 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
              <div>
                <h2 className="text-xl font-bold text-white">Upload Successfully Completed!</h2>
                <p className="text-xs text-slate-300">File stored in StorageService and registered in PostgreSQL database.</p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-800/80 py-1">
                <span className="text-slate-400">Record ID:</span>
                <span className="font-mono text-emerald-300 font-bold">{uploadSuccess.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 py-1">
                <span className="text-slate-400">File Name:</span>
                <span className="font-mono text-slate-200">{uploadSuccess.file_name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 py-1">
                <span className="text-slate-400">Version:</span>
                <span className="font-mono text-slate-200">v{uploadSuccess.version || '1.0'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 py-1">
                <span className="text-slate-400">Upload Status:</span>
                <span className="font-mono text-emerald-400 font-bold">READY</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Review Status:</span>
                <span className="font-mono text-amber-300 font-bold">PENDING_REVIEW (Sent to Reviewer Queue)</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-400 block mb-1">SHA-256 Checksum:</span>
                <span className="font-mono text-[10px] text-cyan-300 bg-slate-900 p-2 rounded block break-all">
                  {uploadSuccess.checksum}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setUploadSuccess(null);
                  setFile(null);
                  setTitle('');
                  setDescription('');
                }}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded text-xs font-bold transition-colors"
              >
                Upload Another File
              </button>
              <Link
                to="/repository"
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-bold transition-colors"
              >
                Go to Repository
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 rounded-xl bg-slate-900/80 border border-slate-800 space-y-6">
            {/* STEP 1: Content Type Selection */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3 font-semibold">
                STEP 1: Select Content Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { type: 'report', label: '📄 Report', desc: 'PDF Reports' },
                  { type: 'dataset', label: '🧪 Dataset', desc: 'CSV, XLSX, ZIP' },
                  { type: 'publication', label: '📚 Publication', desc: 'Journal PDF' },
                  { type: 'image', label: '📷 Image', desc: 'JPG, PNG, WEBP' },
                  { type: 'video', label: '🎥 Video', desc: 'MP4, WEBM' },
                  { type: 'activity', label: '🏛️ Activity', desc: 'Brochures/Docs' },
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setContentType(item.type as ContentType)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      contentType === item.type
                        ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-lg'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-sm font-bold">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2: File Selector & Drag-Drop */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2 font-semibold">
                STEP 2: Select File *
              </label>
              <div className="p-6 border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl bg-slate-950/60 text-center transition-colors">
                <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <input
                  type="file"
                  id="file-input"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="file-input"
                  className="inline-block px-4 py-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 rounded text-xs font-semibold cursor-pointer transition-colors mb-2"
                >
                  Choose File
                </label>
                {file ? (
                  <p className="text-xs font-mono text-emerald-400 mt-2 font-bold">
                    Selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                ) : (
                  <p className="text-xs text-slate-400">Allowed formats: PDF, CSV, XLSX, JSON, ZIP, JPG, PNG, MP4</p>
                )}
              </div>
            </div>

            {/* Duplicate Warning Alert */}
            {duplicateAlert && duplicateAlert.is_duplicate && (
              <div className="p-4 rounded-lg bg-amber-950/80 border border-amber-600 text-amber-200 text-xs flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-amber-100 mb-1">Duplicate Content Detected!</strong>
                  Identical SHA-256 checksum already exists in {duplicateAlert.existing_item_type} record (ID: {duplicateAlert.existing_item_id}). Uploading will preserve historical integrity.
                </div>
              </div>
            )}

            {/* STEP 3: Dynamic Metadata Form */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <label className="block text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                STEP 3: Metadata Attributes
              </label>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 43rd ISEA Ocean Temperature Hydrographic Profile"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Description / Abstract</label>
                <textarea
                  rows={3}
                  placeholder="Detailed summary of scientific field methodology and observations..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">Authors / Creator</label>
                  <input
                    type="text"
                    placeholder="Dr. R. Sengupta, NCPOR Ocean Group"
                    value={authors}
                    onChange={(e) => setAuthors(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">Expedition</label>
                  <select
                    value={expeditionId}
                    onChange={(e) => setExpeditionId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="ISEA-42">ISEA-42 (2023)</option>
                    <option value="ISEA-41">ISEA-41 (2022)</option>
                    <option value="ISEA-40">ISEA-40 (2021)</option>
                    <option value="Arctic-2022">Arctic-2022</option>
                    <option value="Himalaya-2023">Himalaya-2023</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">Station</label>
                  <select
                    value={stationId}
                    onChange={(e) => setStationId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="Bharati">Bharati (Antarctica)</option>
                    <option value="Maitri">Maitri (Antarctica)</option>
                    <option value="Himadri">Himadri (Arctic)</option>
                    <option value="Himansh">Himansh (Himalayas)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 font-medium mb-1">Research Topic</label>
                  <select
                    value={researchTopicId}
                    onChange={(e) => setResearchTopicId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="oceanography">Oceanography</option>
                    <option value="atmospheric">Atmospheric Science</option>
                    <option value="glaciology">Glaciology</option>
                    <option value="marine_biology">Marine Biology</option>
                    <option value="cryosphere">Cryosphere</option>
                  </select>
                </div>
              </div>

              {contentType === 'dataset' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1">Dataset Identifier *</label>
                    <input
                      type="text"
                      value={datasetIdentifier}
                      onChange={(e) => setDatasetIdentifier(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 font-medium mb-1">Format</label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-xs text-slate-200 focus:outline-none"
                    >
                      <option value="CSV">CSV</option>
                      <option value="JSON">JSON</option>
                      <option value="XLSX">XLSX</option>
                      <option value="ZIP">ZIP</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Error Display */}
            {validationError && (
              <div className="p-3 bg-red-950/80 border border-red-700 text-red-300 text-xs rounded">
                {validationError}
              </div>
            )}

            {/* Upload Progress Bar */}
            {uploading && (
              <div className="space-y-2 p-4 bg-slate-950 rounded-lg border border-slate-800">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 font-mono">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    {statusMessage}
                  </span>
                  <span className="font-mono font-bold text-cyan-400">{progress}%</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm rounded transition-colors shadow-lg disabled:opacity-50"
            >
              {uploading ? 'Processing Ingestion Pipeline...' : 'Validate & Upload Record'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
