"use client"

import { useState, useCallback } from 'react';
import { marketIntelligenceAPI, MarketIntelligenceResponse } from '@/lib/market-intelligence-api';
import { useAuthStore } from '@/lib/store';

interface UseMarketIntelligenceReturn {
  data: MarketIntelligenceResponse | null;
  loading: boolean;
  error: string | null;
  analyze: (productId: string, productName?: string) => Promise<MarketIntelligenceResponse>;
  reset: () => void;
  loadCached: (cachedData: MarketIntelligenceResponse) => void;
}

export function useMarketIntelligence(): UseMarketIntelligenceReturn {
  const [data, setData] = useState<MarketIntelligenceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const analyze = useCallback(async (productId: string, productName?: string): Promise<MarketIntelligenceResponse> => {
    if (!user?.uid) {
      throw new Error('User not authenticated');
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Generate a unique session ID
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      const result = await marketIntelligenceAPI.analyzeProduct({
        product_id: productId,
        session_id: sessionId,
      });
      
      setData(result);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  const loadCached = useCallback((cachedData: MarketIntelligenceResponse) => {
    setData(cachedData);
    setError(null);
  }, []);

  return { data, loading, error, analyze, reset, loadCached };
}

