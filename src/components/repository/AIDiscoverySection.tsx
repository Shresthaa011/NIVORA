import React from 'react';
import { Sparkles, Brain, Compass, FileText, ArrowRight } from 'lucide-react';

export const AIDiscoverySection: React.FC = () => {
  const capabilities = [
    {
      icon: <Brain className="w-6 h-6 text-cyan-400" />,
      title: 'Semantic Search',
      description: 'Understands complex scientific research intent and contextual concepts rather than relying solely on exact keyword matching.',
      tag: 'Vector Embeddings Ready',
    },
    {
      icon: <Compass className="w-6 h-6 text-teal-400" />,
      title: 'Smart Recommendations',
      description: 'Intelligently connects related expedition reports, research publications, and hydrographic datasets based on research domain and geographic region.',
      tag: 'Knowledge Graph Powered',
    },
    {
      icon: <FileText className="w-6 h-6 text-sky-400" />,
      title: 'Knowledge Summarization',
      description: 'Generates concise, factual executive summaries of lengthy polar field mission logs and 100+ page expedition reports instantly.',
      tag: 'Source Grounded AI',
    },
  ];

  return (
    <div className="my-12 p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-slate-900 via-[#071F33] to-[#0A2640] border border-cyan-800/50 shadow-2xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-mono tracking-wider uppercase mb-3 w-fit">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Polar Intelligence Subsystem
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif mb-2">
          AI-Powered Knowledge Discovery
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mb-8 leading-relaxed">
          Find relevant polar research faster with intelligent recommendations, contextual search, and factual document summarization.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {capabilities.map((cap, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 w-fit mb-4">
                  {cap.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2 font-serif">{cap.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{cap.description}</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <span className="text-[10px] font-mono font-semibold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {cap.tag}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
