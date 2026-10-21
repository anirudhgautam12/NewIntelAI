import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Search,
  MessageSquare,
  History,
  TrendingUp,
  Fingerprint,
  Newspaper,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';

/**
 * Landing Showcase Page for NewsIntel AI
 */
const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCtaClick = () => {
    if (isAuthenticated) {
      navigate('/analyze');
    } else {
      navigate('/register');
    }
  };

  const featureItems = [
    {
      title: 'AI Summarization',
      desc: 'Condense lengthy articles into short, medium, or detailed formats using offline Seq2Seq models.',
      icon: BookOpen
    },
    {
      title: 'Sentiment Intelligence',
      desc: 'Identify POSITIVE, NEUTRAL, or NEGATIVE tones with confidence scores from RoBERTa.',
      icon: TrendingUp
    },
    {
      title: 'Keyword Discovery',
      desc: 'Pinpoint primary key phrases and topics with exact relevance scores powered by KeyBERT.',
      icon: Search
    },
    {
      title: 'Entity Recognition',
      desc: 'Automatically extract and group organizations, locations, people, and monetary values.',
      icon: Fingerprint
    },
    {
      title: 'Grounded Chat Q&A',
      desc: 'Ask contextual questions about the text using local FAISS indexes and Google Gemini RAG.',
      icon: MessageSquare
    },
    {
      title: 'Intelligence History',
      desc: 'Recall, inspect, filter, and manage your analysis portfolio and chat records securely.',
      icon: History
    }
  ];

  const stepItems = [
    { num: '01', title: 'Upload Content', desc: 'Paste raw news text or submit a public article URL.' },
    { num: '02', title: 'NLP Extraction', desc: 'Models preprocess and extract details locally on your machine.' },
    { num: '03', title: 'Inspect Insights', desc: 'Analyze summaries, sentiment probability, and entity labels.' },
    { num: '04', title: 'Interactive RAG', desc: 'Ask questions and receive context-supported factual replies.' }
  ];

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-brand-bg">
      {/* Dynamic Background Glow circles */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-glow-indigo rounded-full pointer-events-none select-none z-0" />
      <div className="absolute bottom-[200px] left-[-200px] w-[400px] h-[400px] bg-glow-indigo rounded-full pointer-events-none select-none z-0 opacity-50" />

      <Navbar />

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 flex flex-col items-center text-center gap-6">
        <Badge variant="primary" className="py-1 px-3">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 shrink-0 text-brand-accent animate-pulse" />
          AI-Powered News Intelligence
        </Badge>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-none max-w-4xl font-heading">
          Understand News.<br />
          <span className="bg-gradient-to-r from-brand-accent to-purple-400 bg-clip-text text-transparent">
            Faster.
          </span>
        </h1>
        
        <p className="text-gray-400 text-base sm:text-lg max-w-2xl leading-relaxed tracking-wide">
          Transform lengthy news articles into concise summaries, sentiment insights, key entities, and context-grounded answers powered by modern local AI.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button variant="primary" size="lg" onClick={handleCtaClick} icon={ArrowRight}>
            Analyze News
          </Button>
          <a href="#features">
            <Button variant="secondary" size="lg">
              Explore Features
            </Button>
          </a>
        </div>

        {/* Visual Preview cards mockup */}
        <div className="w-full max-w-5xl mt-16 p-2 rounded-2xl border border-brand-border bg-brand-surface/40 backdrop-blur-sm shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent z-10 rounded-2xl pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 text-left">
            {/* mock card 1 */}
            <div className="glass-panel rounded-xl p-4 flex flex-col gap-2.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">AI Summary</span>
              <h4 className="text-xs font-bold text-white font-heading">AI models generate instant reports</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                The global semiconductor manufacturing supply chain faces minor logistic constraints owing to elevated localized regulatory updates...
              </p>
            </div>
            
            {/* mock card 2 */}
            <div className="glass-panel rounded-xl p-4 flex flex-col gap-3">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sentiment Intelligence</span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-green-400 bg-green-950/20 border border-green-500/20 px-2 py-0.5 rounded">
                  POSITIVE
                </span>
                <span className="text-xs text-gray-300 font-bold">87% confidence</span>
              </div>
              <div className="w-full bg-brand-surface h-1.5 rounded-full overflow-hidden border border-brand-border mt-1">
                <div className="bg-green-500 h-full w-[87%]" />
              </div>
            </div>

            {/* mock card 3 */}
            <div className="glass-panel rounded-xl p-4 flex flex-col gap-2.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Extracted Entities</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className="text-[10px] bg-brand-surface border border-brand-border px-2 py-0.5 rounded text-gray-300">
                  Google (ORG)
                </span>
                <span className="text-[10px] bg-brand-surface border border-brand-border px-2 py-0.5 rounded text-gray-300">
                  New Delhi (GPE)
                </span>
                <span className="text-[10px] bg-brand-surface border border-brand-border px-2 py-0.5 rounded text-gray-300">
                  BART Model (PRODUCT)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature section */}
      <section id="features" className="relative z-10 border-t border-brand-border bg-brand-surface/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white tracking-tight font-heading">
              Platform Features
            </h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto mt-2 leading-relaxed tracking-wide">
              Advanced natural language processing modules built directly into a secure unified system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureItems.map((feat, index) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={index}
                  className="glass-panel rounded-xl p-6 hover:border-brand-accent/30 transition-all duration-300 flex flex-col gap-3 group"
                >
                  <div className="p-2.5 bg-brand-surface border border-brand-border rounded-lg text-brand-accent shrink-0 w-fit group-hover:bg-brand-accent group-hover:text-white transition-colors duration-200">
                    <IconComp className="w-5 h-5 shrink-0" />
                  </div>
                  <h3 className="text-base font-bold text-gray-200 font-heading">{feat.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed tracking-wide">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section id="how-it-works" className="relative z-10 border-t border-brand-border py-20 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white tracking-tight font-heading">
              How It Works
            </h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto mt-2 leading-relaxed tracking-wide">
              Ingest, process, and query your news intelligence report in four steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stepItems.map((step, idx) => (
              <div
                key={idx}
                className="glass-panel rounded-xl p-6 border border-brand-border/60 flex flex-col gap-3 relative overflow-hidden"
              >
                <span className="absolute top-2 right-4 text-5xl font-black text-brand-border/20 font-heading select-none">
                  {step.num}
                </span>
                <h3 className="text-sm font-bold text-gray-200 mt-4 font-heading">{step.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed mt-1 tracking-wide">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="relative z-10 border-t border-brand-border py-20 bg-gradient-to-b from-brand-surface/10 to-[#030712] text-center flex flex-col items-center gap-5">
        <h2 className="text-3xl font-extrabold text-white font-heading max-w-md">
          Turn information overload into understanding.
        </h2>
        <p className="text-xs text-gray-400 max-w-sm leading-relaxed tracking-wide">
          Unlock structured insights from article URLs or pasted documents instantly.
        </p>
        <Button variant="primary" size="lg" onClick={handleCtaClick} className="mt-2 px-12">
          Start Analyzing
        </Button>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
