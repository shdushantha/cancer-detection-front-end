import { useState, useCallback } from 'react';
import type { CancerType, AnalysisMode } from '../types/api';
import { runAnalysis, getMetrics } from '../api/cancer';

export type ResultData = Record<string, unknown> | null;

interface AnalysisState {
  loading: boolean;
  error: string | null;
  result: ResultData;
}

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    loading: false,
    error: null,
    result: null,
  });

  const analyze = useCallback(async (
    mode: AnalysisMode,
    cancerType: CancerType,
    file: File,
  ) => {
    setState({ loading: true, error: null, result: null });
    try {
      const data = await runAnalysis(mode, cancerType, file) as ResultData;
      setState({ loading: false, error: null, result: data });
    } catch (e) {
      setState({ loading: false, error: (e as Error).message, result: null });
    }
  }, []);

  const fetchMetrics = useCallback(async (cancerType: CancerType) => {
    setState({ loading: true, error: null, result: null });
    try {
      const data = await getMetrics(cancerType);
      setState({ loading: false, error: null, result: data as ResultData });
    } catch (e) {
      setState({ loading: false, error: (e as Error).message, result: null });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, result: null });
  }, []);

  return { ...state, analyze, fetchMetrics, reset };
}
