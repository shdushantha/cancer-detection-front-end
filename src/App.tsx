import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { CancerTypeSelector } from './components/CancerTypeSelector';
import { FileUpload } from './components/FileUpload';
import { ModeSelector } from './components/ModeSelector';
import { ResultPanel } from './components/ResultPanel';
import { useAnalysis } from './hooks/useAnalysis';
import type { CancerType, AnalysisMode } from './types/api';
import './styles.css';

const App: React.FC = () => {
  const [cancerType, setCancerType] = useState<CancerType>('lung');
  const [mode, setMode]             = useState<AnalysisMode>('full');
  const [file, setFile]             = useState<File | null>(null);
  const [preview, setPreview]       = useState<string | null>(null);

  const { loading, error, result, analyze, fetchMetrics, reset } = useAnalysis();

  const handleFile = (f: File, p: string) => { setFile(f); setPreview(p); reset(); };
  const handleClear = () => { setFile(null); setPreview(null); reset(); };

  const handleCancerChange = (t: CancerType) => { setCancerType(t); reset(); };

  const handleRun = () => {
    if (!file) return;
    analyze(mode, cancerType, file);
  };

  const handleMetrics = () => fetchMetrics(cancerType);

  const canRun = !!file && !loading;

  return (
    <div className="app">
      {/* ── Background ─────────────────────────────────── */}
      <div className="bg-grid" aria-hidden />
      <div className="bg-glow" aria-hidden />

      {/* ── Header ─────────────────────────────────────── */}
      <header className="header">
        <div className="header__logo">
          <Activity size={22} strokeWidth={2} />
          <span className="header__wordmark">LifeLens</span>
        </div>
        <div className="header__tagline">AI-Assisted Cancer Detection Platform</div>
        <div className="header__badge">v1.0 · Research Use Only</div>
      </header>

      {/* ── Main layout ────────────────────────────────── */}
      <main className="layout">

        {/* Left column — controls */}
        <aside className="panel panel--controls">

          <section className="panel__section">
            <h2 className="panel__label">01 — Cancer Type</h2>
            <CancerTypeSelector selected={cancerType} onChange={handleCancerChange} />
          </section>

          <section className="panel__section">
            <h2 className="panel__label">02 — Patient Image</h2>
            <FileUpload file={file} preview={preview} onFile={handleFile} onClear={handleClear} />
          </section>

          <section className="panel__section">
            <h2 className="panel__label">03 — Analysis Mode</h2>
            <ModeSelector selected={mode} onChange={setMode} onMetrics={handleMetrics} />
          </section>

          <button
            className={`run-btn ${canRun ? 'run-btn--ready' : ''}`}
            onClick={handleRun}
            disabled={!canRun}
          >
            {loading ? (
              <><span className="run-btn__spinner" /> Analysing...</>
            ) : (
              <><Activity size={16} /> Run Analysis</>
            )}
          </button>

        </aside>

        {/* Right column — results */}
        <section className="panel panel--results">
          <div className="results-header">
            <h2 className="panel__label">Results</h2>
            {result && (
              <button className="clear-btn" onClick={reset}>Clear</button>
            )}
          </div>
          <ResultPanel result={result} loading={loading} error={error} />
        </section>

      </main>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="footer">
        ⚠ For research and clinical decision support only. Not a substitute for professional medical diagnosis.
      </footer>
    </div>
  );
};

export default App;
