export type Scope = { characterId?: string; global?: boolean };

export interface IngestRequest {
  scope: Scope;
  text: string;
  meta?: { messageId?: string; ts?: number };
}

export interface QueryRequest {
  scope: Scope;
  query: string;
  limit?: number;
  maxChars?: number;
}

export interface QueryResponse {
  hint: Record<string, Array<Record<string, unknown>>>;
  approxChars: number;
  sources: Array<{ id: string; score: number }>;
}