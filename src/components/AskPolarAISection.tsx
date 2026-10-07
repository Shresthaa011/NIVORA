import React, { useState } from 'react';
import { MOCK_AI_RESPONSES } from '../data/mockData';
import type { AIQueryResponse } from '../types/polar';
import { Sparkles, ArrowRight, ShieldCheck, FileText, Database, Code2 } from 'lucide-react';

export const AskPolarAISection: React.FC = () => {
  const [queryInput, setQueryInput] = useState('');
  const [activeResponse, setActiveResponse] = useState<AIQueryResponse | null>(MOCK_AI_RESPONSES.default);
  const [isSearching, setIsSearching] = useState(false);

  const samplePrompts = [
    { label: "What research has India conducted at Bharati Station?", key: "default" },
    { label: "What datasets are available for Antarctic climate research?", key: "datasets" },
    { label: "Which expeditions studied glacier dynamics?", key: "expeditions" }
  ];

  const handleQuerySubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSearching(true);
    setTimeout(() => {
      // Find matching mock response or return default
      const lower = queryInput.toLowerCase();
      if (lower.includes('dataset') || lower.includes('climate')) {
        setActiveResponse(MOCK_AI_RESPONSES.datasets);
      } else if (lower.includes('expedition') || lower.includes('glacier')) {
        setActiveResponse(MOCK_AI_RESPONSES.expeditions);
      } else {
        setActiveResponse({
          query: queryInput || "What research has India conducted at Bharati Station?",
          answer: `Based on 1,420 peer-reviewed articles from NCPOR, India's polar research program covers atmospheric observations, glaciology, biological diversity, and oceanic processes across Antarctica and the Arctic.`,
          confidenceScore: 0.95,
          sources: MOCK_AI_RESPONSES.default.sources
        });
      }
      setIsSearching(false);
    }, 400);
  };

  const handlePromptClick = (prompt: { label: string; key: string }) => {
    setQueryInput(prompt.label);
    setActiveResponse(MOCK_AI_RESPONSES[prompt.key] || MOCK_AI_RESPONSES.default);
  };

  return (
    <section id="ask-polar-ai" className="section-container" style={{ paddingTop: '36px' }}>
      <div className="ai-section-box">
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div className="ai-badge">
            <Sparkles size={14} />
            GROUNDED RAG KNOWLEDGE ASSISTANT
          </div>

          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'white', marginBottom: '12px' }}>
            Ask Polar AI
          </h2>

          <p style={{ color: '#CBD5E1', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Explore verified polar knowledge through an AI assistant grounded in scientific sources.
          </p>

          {/* AI Question Form Input */}
          <form onSubmit={handleQuerySubmit} className="ai-input-wrapper">
            <Sparkles size={20} style={{ color: 'var(--color-polar-cyan)', marginLeft: '8px' }} />
            <input
              type="text"
              className="ai-input"
              placeholder="Ask about an expedition, dataset, station or scientific discovery..."
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
            />
            <button type="submit" className="btn-submit-ai" disabled={isSearching}>
              <span>{isSearching ? 'Querying RAG...' : 'Ask Polar AI'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Example Questions Pills */}
          <div className="ai-prompts-row" style={{ justifyContent: 'center' }}>
            <span style={{ color: '#94A3B8', fontSize: '0.8rem', fontWeight: 600 }}>Try asking:</span>
            {samplePrompts.map((p) => (
              <button
                key={p.key}
                type="button"
                className="prompt-pill"
                onClick={() => handlePromptClick(p)}
              >
                "{p.label}"
              </button>
            ))}
          </div>

          {/* AI Response Box Demo Grounding View */}
          {activeResponse && (
            <div className="ai-response-preview" style={{ textAlign: 'left' }}>
              <div className="ai-res-header">
                <div className="ai-res-title">
                  <ShieldCheck size={18} />
                  <span>GROUNDED ANSWER FROM SCIENTIFIC REPOSITORY</span>
                </div>
                <div className="ai-confidence">
                  <span>Confidence: {(activeResponse.confidenceScore * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6', fontSize: '0.95rem', color: '#F1F5F9', marginBottom: '20px' }}>
                {activeResponse.answer}
              </div>

              <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                  GROUNDED SOURCES & CITATIONS ({activeResponse.sources.length}):
                </div>

                <div className="ai-sources-list">
                  {activeResponse.sources.map((src) => (
                    <div key={src.id} className="ai-source-chip">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {src.type === 'Dataset' ? <Database size={14} style={{ color: '#06B6D4' }} /> : <FileText size={14} style={{ color: '#38BDF8' }} />}
                        <span style={{ fontWeight: 600, color: 'white' }}>{src.title}</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontFamily: 'monospace' }}>
                        {src.doi ? `DOI: ${src.doi}` : src.id}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#64748B' }}>
                <Code2 size={12} />
                <span>RAG API Endpoint Ready: <code>POST /api/ai/query</code> (Vectors: Milvus/pgvector, LLM: Llama/Gemini)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
