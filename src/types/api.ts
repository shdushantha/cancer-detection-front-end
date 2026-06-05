// ── Cancer Types ──────────────────────────────────────────
export type CancerType = 'lung' | 'skin' | 'breast';

export const CANCER_CONFIGS: Record<CancerType, {
  label: string;
  description: string;
  classes: string[];
  icon: string;
  color: string;
  accentColor: string;
}> = {
  lung: {
    label: 'Lung Cancer',
    description: 'Histopathological lung tissue analysis',
    classes: ['lung_aca', 'lung_n', 'lung_scc'],
    icon: '🫁',
    color: '#4f9cf9',
    accentColor: '#93c5fd',
  },
  skin: {
    label: 'Skin Cancer',
    description: 'Dermoscopic lesion classification',
    classes: ['akiec', 'bcc', 'bkl', 'df', 'mel', 'nv', 'vasc'],
    icon: '🔬',
    color: '#f97316',
    accentColor: '#fdba74',
  },
  breast: {
    label: 'Breast Cancer',
    description: 'Mammographic tissue screening',
    classes: ['benign', 'malignant', 'normal'],
    icon: '🩺',
    color: '#ec4899',
    accentColor: '#f9a8d4',
  },
};

// ── API Response Types ────────────────────────────────────
export interface PredictionResponse {
  cancer_type: CancerType;
  prediction: string;
  confidence_scores: Record<string, number>;
  confidence_percent: number;
  top_prediction: string;
}

export interface GradCAMResponse {
  cancer_type: CancerType;
  prediction: string;
  confidence_percent: number;
  heatmap_base64: string;
  overlay_base64: string;
  cam_scores: number[][];
}

export interface EmbeddingResponse {
  cancer_type: CancerType;
  prediction: string;
  embedding_dim: number;
  embedding_vector: number[];
}

export interface UncertaintyResponse {
  cancer_type: CancerType;
  mean_probabilities: Record<string, number>;
  uncertainty_std: Record<string, number>;
  prediction: string;
  confidence_percent: number;
  is_uncertain: boolean;
  uncertainty_level: 'low' | 'medium' | 'high';
}

export interface ClassMetrics {
  precision: number;
  recall: number;
  f1_score: number;
  support: number;
}

export interface MetricsResponse {
  cancer_type: CancerType;
  accuracy: number;
  auc_roc: number;
  sensitivity: number;
  specificity: number;
  confusion_matrix: number[][];
  classification_report: Record<string, ClassMetrics>;
  note: string;
}

export interface FullAnalysisResponse {
  cancer_type: CancerType;
  prediction: string;
  confidence_scores: Record<string, number>;
  confidence_percent: number;
  heatmap_base64: string;
  overlay_base64: string;
  embedding_dim: number;
  embedding_vector: number[];
  mean_probabilities: Record<string, number>;
  uncertainty_std: Record<string, number>;
  is_uncertain: boolean;
  uncertainty_level: 'low' | 'medium' | 'high';
}

export type AnalysisMode = 'predict' | 'gradcam' | 'embeddings' | 'uncertainty' | 'full';

export interface ApiError {
  detail: string;
}
