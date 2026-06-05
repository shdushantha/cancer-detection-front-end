import React from 'react';
import { Zap, Eye, Layers, AlertTriangle, BarChart3, Telescope } from 'lucide-react';
import type { AnalysisMode } from '../types/api';

interface ModeConfig {
  label: string;
  description: string;
  icon: React.ReactNode;
}

const MODES: Record<AnalysisMode, ModeConfig> = {
  predict:     { label: 'Predict',      description: 'Class + confidence',         icon: <Zap size={15} /> },
  gradcam:     { label: 'Grad-CAM',     description: 'Heatmap visualisation',      icon: <Eye size={15} /> },
  embeddings:  { label: 'Embeddings',   description: 'Feature vector',             icon: <Layers size={15} /> },
  uncertainty: { label: 'Uncertainty',  description: 'MC Dropout confidence',      icon: <AlertTriangle size={15} /> },
  full:        { label: 'Full Analysis',description: 'All features combined',      icon: <Telescope size={15} /> },
};

interface Props {
  selected: AnalysisMode;
  onChange: (m: AnalysisMode) => void;
  onMetrics: () => void;
}

export const ModeSelector: React.FC<Props> = ({ selected, onChange, onMetrics }) => (
  <div className="mode-selector">
    <div className="mode-selector__group">
      {(Object.entries(MODES) as [AnalysisMode, ModeConfig][]).map(([mode, cfg]) => (
        <button
          key={mode}
          className={`mode-btn ${selected === mode ? 'active' : ''}`}
          onClick={() => onChange(mode)}
        >
          <span className="mode-btn__icon">{cfg.icon}</span>
          <span className="mode-btn__label">{cfg.label}</span>
          <span className="mode-btn__desc">{cfg.description}</span>
        </button>
      ))}
    </div>
    <button className="mode-btn mode-btn--metrics" onClick={onMetrics}>
      <span className="mode-btn__icon"><BarChart3 size={15} /></span>
      <span className="mode-btn__label">Model Metrics</span>
      <span className="mode-btn__desc">Performance statistics</span>
    </button>
  </div>
);
