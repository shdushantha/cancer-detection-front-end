import type {
  CancerType, AnalysisMode,
  PredictionResponse, GradCAMResponse,
  EmbeddingResponse, UncertaintyResponse,
  MetricsResponse, FullAnalysisResponse,
} from '../types/api';

const BASE = '/api/v1';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
  return res.json();
}

function buildForm(file: File): FormData {
  const fd = new FormData();
  fd.append('file', file);
  return fd;
}

export async function predict(type: CancerType, file: File): Promise<PredictionResponse> {
  const res = await fetch(`${BASE}/${type}/predict`, { method: 'POST', body: buildForm(file) });
  return handleResponse<PredictionResponse>(res);
}

export async function gradcam(type: CancerType, file: File): Promise<GradCAMResponse> {
  const res = await fetch(`${BASE}/${type}/gradcam`, { method: 'POST', body: buildForm(file) });
  return handleResponse<GradCAMResponse>(res);
}

export async function embeddings(type: CancerType, file: File): Promise<EmbeddingResponse> {
  const res = await fetch(`${BASE}/${type}/embeddings`, { method: 'POST', body: buildForm(file) });
  return handleResponse<EmbeddingResponse>(res);
}

export async function uncertainty(type: CancerType, file: File, passes = 20): Promise<UncertaintyResponse> {
  const res = await fetch(`${BASE}/${type}/uncertainty?n_passes=${passes}`, { method: 'POST', body: buildForm(file) });
  return handleResponse<UncertaintyResponse>(res);
}

export async function getMetrics(type: CancerType): Promise<MetricsResponse> {
  const res = await fetch(`${BASE}/${type}/metrics`);
  return handleResponse<MetricsResponse>(res);
}

export async function fullAnalysis(type: CancerType, file: File, passes = 20): Promise<FullAnalysisResponse> {
  const res = await fetch(`${BASE}/${type}/full-analysis?mc_passes=${passes}`, { method: 'POST', body: buildForm(file) });
  return handleResponse<FullAnalysisResponse>(res);
}

export async function runAnalysis(mode: AnalysisMode, type: CancerType, file: File) {
  switch (mode) {
    case 'predict':    return predict(type, file);
    case 'gradcam':    return gradcam(type, file);
    case 'embeddings': return embeddings(type, file);
    case 'uncertainty':return uncertainty(type, file);
    case 'full':       return fullAnalysis(type, file);
    default:           return predict(type, file);
  }
}
