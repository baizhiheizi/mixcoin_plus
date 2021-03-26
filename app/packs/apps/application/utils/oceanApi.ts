import axios from 'axios';

const oceanEventApi = axios.create({
  baseURL: 'https://events.ocean.one/',
  timeout: 3000,
});

const oceanExampleApi = axios.create({
  baseURL: 'https://example.ocean.one/',
  timeout: 3000,
});

export const WS_ENDPOINT = 'wss://events.ocean.one';

export function fetchTrades(marketId: string, offset?: string, limit?: number) {
  return oceanEventApi.get(
    `/markets/${marketId}/trades?order=DESC&limit=${limit || 500}&offset=${
      offset || new Date().toISOString()
    }`,
  );
}

export function fetchTiker(marketId: string) {
  return oceanEventApi.get(`/markets/${marketId}/ticker`);
}

export function fetchCandles(marketId: string, granularity: number) {
  return oceanExampleApi.get(`/markets/${marketId}/candles/${granularity}`);
}

export interface ITick {
  volume?: number;
  amount: string;
  funds: string;
  price: string;
  side: 'ASK' | 'BID';
}

export interface ITrade {
  amount: string;
  base: string;
  created_at: string;
  price: string;
  quote: string;
  side: 'ASK' | 'BID';
  trade_id: string;
}
