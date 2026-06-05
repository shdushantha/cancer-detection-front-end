import React, { useState } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import type {
  PredictionResponse, GradCAMResponse, EmbeddingResponse,
  UncertaintyResponse, MetricsResponse, FullAnalysisResponse,
} from '../types/api';
import type { ResultData } from '../hooks/useAnalysis';

// ── Helpers ───────────────────────────────────────────────
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const round2 = (v: number) => v.toFixed(2);

const ConfidenceBar: React.FC<{ label: string; value: number; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className="conf-bar">
    <div className="conf-bar__header">
      <span className="conf-bar__label">{label}</span>
      <span className="conf-bar__value">{(value * 100).toFixed(2)}%</span>
    </div>
    <div className="conf-bar__track">
      <div
        className={`conf-bar__fill ${highlight ? 'conf-bar__fill--highlight' : ''}`}
        style={{ width: `${value * 100}%` }}
      />
    </div>
  </div>
);

const UncertaintyBadge: React.FC<{ level: string; is_uncertain: boolean }> = ({ level, is_uncertain }) => {
  const map = { low: { color: '#22c55e', icon: <CheckCircle size={14} /> }, medium: { color: '#f59e0b', icon: <AlertCircle size={14} /> }, high: { color: '#ef4444', icon: <AlertTriangle size={14} /> } };
  const { color, icon } = map[level as keyof typeof map] || map.low;
  return (
    <span className="uncertainty-badge" style={{ '--badge-color': color } as React.CSSProperties}>
      {icon} {level.toUpperCase()} uncertainty {is_uncertain ? '— flag for review' : '— confident'}
    </span>
  );
};

// ── Sub-renderers ─────────────────────────────────────────
const PredictResult: React.FC<{ data: PredictionResponse }> = ({ data }) => (
  <div className="result-block">
    <div className="result-verdict">
      <span className="result-verdict__label">Prediction</span>
      <span className="result-verdict__value">{data.prediction}</span>
      <span className="result-verdict__conf">{data.confidence_percent.toFixed(1)}% confidence</span>
    </div>
    <div className="result-section">
      <p className="result-section__title">Class Probabilities</p>
      {Object.entries(data.confidence_scores)
        .sort(([, a], [, b]) => b - a)
        .map(([cls, val]) => (
          <ConfidenceBar key={cls} label={cls} value={val} highlight={cls === data.prediction} />
        ))}
    </div>
  </div>
);

const GradCAMResult: React.FC<{ data: GradCAMResponse }> = ({ data }) => (
  <div className="result-block">
    <div className="result-verdict">
      <span className="result-verdict__label">Prediction</span>
      <span className="result-verdict__value">{data.prediction}</span>
      <span className="result-verdict__conf">{data.confidence_percent.toFixed(1)}% confidence</span>
    </div>
    <div className="result-section">
      <p className="result-section__title">Grad-CAM Activation Map</p>
      <p className="result-section__sub">Highlighted regions show areas that most influenced the model's prediction.</p>
      <div className="gradcam-images">
        <div className="gradcam-card">
          <p className="gradcam-card__label">Heatmap</p>
          <img src={`data:image/png;base64,${data.heatmap_base64}`} alt="Grad-CAM heatmap" className="gradcam-img" />
        </div>
        <div className="gradcam-card">
          <p className="gradcam-card__label">Overlay</p>
          <img src={`data:image/png;base64,${data.overlay_base64}`} alt="Grad-CAM overlay" className="gradcam-img" />
        </div>
      </div>
    </div>
  </div>
);

const EmbeddingResult: React.FC<{ data: EmbeddingResponse }> = ({ data }) => {
  const [expanded, setExpanded] = useState(false);
  const preview = data.embedding_vector.slice(0, 24);
  const shown   = expanded ? data.embedding_vector : preview;
  return (
    <div className="result-block">
      <div className="result-verdict">
        <span className="result-verdict__label">Prediction</span>
        <span className="result-verdict__value">{data.prediction}</span>
        <span className="result-verdict__conf">{data.embedding_dim}-dim vector</span>
      </div>
      <div className="result-section">
        <p className="result-section__title">Feature Embedding</p>
        <p className="result-section__sub">
          {data.embedding_dim}-dimensional latent space vector from the penultimate layer.
          Use for clustering, similarity search, or downstream models.
        </p>
        <div className="embedding-grid">
          {shown.map((v, i) => (
            <span key={i} className="embedding-cell" title={`dim[${i}]: ${v}`}>
              {v.toFixed(3)}
            </span>
          ))}
        </div>
        {data.embedding_vector.length > 24 && (
          <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
            {expanded ? <><ChevronUp size={13}/> Show less</> : <><ChevronDown size={13}/> Show all {data.embedding_dim} dims</>}
          </button>
        )}
      </div>
    </div>
  );
};

const UncertaintyResult: React.FC<{ data: UncertaintyResponse }> = ({ data }) => (
  <div className="result-block">
    <div className="result-verdict">
      <span className="result-verdict__label">Prediction</span>
      <span className="result-verdict__value">{data.prediction}</span>
      <span className="result-verdict__conf">{data.confidence_percent.toFixed(1)}% mean confidence</span>
    </div>
    <UncertaintyBadge level={data.uncertainty_level} is_uncertain={data.is_uncertain} />
    <div className="result-section">
      <p className="result-section__title">Mean Probabilities (MC Dropout)</p>
      {Object.entries(data.mean_probabilities)
        .sort(([, a], [, b]) => b - a)
        .map(([cls, val]) => (
          <div key={cls}>
            <ConfidenceBar label={cls} value={val} highlight={cls === data.prediction} />
            <span className="std-label">± {(data.uncertainty_std[cls] * 100).toFixed(2)}% std</span>
          </div>
        ))}
    </div>
  </div>
);

const MetricsResult: React.FC<{ data: MetricsResponse }> = ({ data }) => (
  <div className="result-block">
    <div className="metrics-summary">
      {[
        { label: 'Accuracy',    value: pct(data.accuracy) },
        { label: 'AUC-ROC',     value: round2(data.auc_roc) },
        { label: 'Sensitivity', value: pct(data.sensitivity) },
        { label: 'Specificity', value: pct(data.specificity) },
      ].map(({ label, value }) => (
        <div key={label} className="metric-card">
          <span className="metric-card__value">{value}</span>
          <span className="metric-card__label">{label}</span>
        </div>
      ))}
    </div>
    <div className="result-section">
      <p className="result-section__title">Per-Class Report</p>
      <table className="report-table">
        <thead>
          <tr><th>Class</th><th>Precision</th><th>Recall</th><th>F1</th><th>Support</th></tr>
        </thead>
        <tbody>
          {Object.entries(data.classification_report).map(([cls, m]) => (
            <tr key={cls}>
              <td className="report-table__cls">{cls}</td>
              <td>{pct(m.precision)}</td>
              <td>{pct(m.recall)}</td>
              <td>{pct(m.f1_score)}</td>
              <td>{m.support}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="result-section">
      <p className="result-section__title">Confusion Matrix</p>
      <div className="cm-wrap">
        <table className="cm-table">
          <tbody>
            {data.confusion_matrix.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={`cm-cell ${i === j ? 'cm-cell--diag' : ''}`}
                    style={{ opacity: 0.3 + 0.7 * (cell / Math.max(...data.confusion_matrix.flat())) }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const FullResult: React.FC<{ data: FullAnalysisResponse }> = ({ data }) => (
  <div className="result-block">
    <div className="result-verdict">
      <span className="result-verdict__label">Final Prediction</span>
      <span className="result-verdict__value">{data.prediction}</span>
      <span className="result-verdict__conf">{data.confidence_percent.toFixed(1)}% confidence</span>
    </div>
    <UncertaintyBadge level={data.uncertainty_level} is_uncertain={data.is_uncertain} />

    <div className="result-section">
      <p className="result-section__title">Confidence Scores</p>
      {Object.entries(data.confidence_scores)
        .sort(([, a], [, b]) => b - a)
        .map(([cls, val]) => (
          <ConfidenceBar key={cls} label={cls} value={val} highlight={cls === data.prediction} />
        ))}
    </div>

    <div className="result-section">
      <p className="result-section__title">Grad-CAM Activation</p>
      <div className="gradcam-images">
        <div className="gradcam-card">
          <p className="gradcam-card__label">Heatmap</p>
          <img src={`data:image/png;base64,${data.heatmap_base64}`} alt="heatmap" className="gradcam-img" />
        </div>
        <div className="gradcam-card">
          <p className="gradcam-card__label">Overlay</p>
          <img src={`data:image/png;base64,${data.overlay_base64}`} alt="overlay" className="gradcam-img" />
        </div>
      </div>
    </div>

    <div className="result-section">
      <p className="result-section__title">MC Dropout Uncertainty</p>
      {Object.entries(data.mean_probabilities)
        .sort(([, a], [, b]) => b - a)
        .map(([cls, val]) => (
          <div key={cls}>
            <ConfidenceBar label={cls} value={val} highlight={cls === data.prediction} />
            <span className="std-label">± {(data.uncertainty_std[cls] * 100).toFixed(2)}% std</span>
          </div>
        ))}
    </div>

    <div className="result-section">
      <p className="result-section__title">Embedding Vector</p>
      <p className="result-section__sub">{data.embedding_dim}-dim feature vector (first 16 shown)</p>
      <div className="embedding-grid">
        {data.embedding_vector.slice(0, 16).map((v, i) => (
          <span key={i} className="embedding-cell">{v.toFixed(3)}</span>
        ))}
      </div>
    </div>
  </div>
);

// ── Main Result Panel ─────────────────────────────────────
interface Props {
  result: ResultData;
  loading: boolean;
  error: string | null;
}

export const ResultPanel: React.FC<Props> = ({ result, loading, error }) => {
  if (loading) return (
    <div className="result-panel result-panel--loading">
      <div className="spinner" />
      <p className="loading-text">Analysing image...</p>
      <p className="loading-sub">Running inference on model</p>
    </div>
  );

  if (error) return (
    <div className="result-panel result-panel--error">
      <AlertTriangle size={28} strokeWidth={1.5} />
      <p className="error-title">Analysis Failed</p>
      <p className="error-msg">{error}</p>
    </div>
  );

  if (!result) return (
    <div className="result-panel result-panel--empty">
      <div className="empty-icon"><Info size={32} strokeWidth={1} /></div>
      <p className="empty-title">No results yet</p>
      <p className="empty-sub">Upload a patient image, select a cancer type and analysis mode, then click Run Analysis.</p>
    </div>
  );

  const r = result as Record<string, unknown>;

  // Detect result type from shape
  if ('accuracy' in r)         return <div className="result-panel"><MetricsResult data={r as unknown as MetricsResponse} /></div>;
  if ('overlay_base64' in r && 'embedding_vector' in r)
                                return <div className="result-panel"><FullResult data={r as unknown as FullAnalysisResponse} /></div>;
  if ('overlay_base64' in r)   return <div className="result-panel"><GradCAMResult data={r as unknown as GradCAMResponse} /></div>;
  if ('embedding_vector' in r) return <div className="result-panel"><EmbeddingResult data={r as unknown as EmbeddingResponse} /></div>;
  if ('uncertainty_std' in r)  return <div className="result-panel"><UncertaintyResult data={r as unknown as UncertaintyResponse} /></div>;
  return <div className="result-panel"><PredictResult data={r as unknown as PredictionResponse} /></div>;
};
