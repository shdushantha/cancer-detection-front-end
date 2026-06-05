import React from 'react';
import { CANCER_CONFIGS, type CancerType } from '../types/api';

interface Props {
  selected: CancerType;
  onChange: (t: CancerType) => void;
}

export const CancerTypeSelector: React.FC<Props> = ({ selected, onChange }) => (
  <div className="cancer-selector">
    {(Object.keys(CANCER_CONFIGS) as CancerType[]).map((type) => {
      const cfg = CANCER_CONFIGS[type];
      const active = selected === type;
      return (
        <button
          key={type}
          className={`cancer-tab ${active ? 'active' : ''}`}
          style={{ '--tab-color': cfg.color, '--tab-accent': cfg.accentColor } as React.CSSProperties}
          onClick={() => onChange(type)}
        >
          <span className="cancer-tab__icon">{cfg.icon}</span>
          <span className="cancer-tab__label">{cfg.label}</span>
          <span className="cancer-tab__desc">{cfg.description}</span>
          {active && <span className="cancer-tab__indicator" />}
        </button>
      );
    })}
  </div>
);
