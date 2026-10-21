import React, { useState } from 'react';
import { Type, Link2, Sparkles } from 'lucide-react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';

/**
 * News article submission panel supporting manual paste or URL scrape request
 */
const ArticleInput = ({ onSubmit, isLoading }) => {
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'url'
  const [articleText, setArticleText] = useState('');
  const [articleUrl, setArticleUrl] = useState('');
  const [summaryLength, setSummaryLength] = useState('medium');
  const [validationError, setValidationError] = useState('');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setValidationError('');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (activeTab === 'text') {
      if (!articleText || articleText.trim().length < 100) {
        setValidationError('The article text must contain at least 100 characters.');
        return;
      }
      onSubmit({
        inputType: 'text',
        articleText: articleText.trim(),
        summaryLength
      });
    } else {
      if (!articleUrl) {
        setValidationError('An article URL is required.');
        return;
      }
      if (!articleUrl.startsWith('http://') && !articleUrl.startsWith('https://')) {
        setValidationError('Please enter a valid HTTP/HTTPS URL.');
        return;
      }
      onSubmit({
        inputType: 'url',
        articleUrl: articleUrl.trim(),
        summaryLength
      });
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="w-full flex flex-col gap-6 max-w-3xl mx-auto">
      
      {/* Input Tab Switcher Buttons */}
      <div className="flex bg-brand-surface border border-brand-border p-1 rounded-xl">
        <button
          type="button"
          onClick={() => handleTabChange('text')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none ${
            activeTab === 'text'
              ? 'bg-brand-accent text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-brand-surface-elevated/40'
          }`}
        >
          <Type className="w-4 h-4 shrink-0" />
          <span>Paste Text</span>
        </button>
        
        <button
          type="button"
          onClick={() => handleTabChange('url')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none ${
            activeTab === 'url'
              ? 'bg-brand-accent text-white shadow-md'
              : 'text-gray-400 hover:text-white hover:bg-brand-surface-elevated/40'
          }`}
        >
          <Link2 className="w-4 h-4 shrink-0" />
          <span>News URL</span>
        </button>
      </div>

      {/* Main Input Form Group */}
      <div className="glass-panel p-6 rounded-xl flex flex-col gap-5">
        
        {activeTab === 'text' ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 tracking-wide">Article Body</label>
            <textarea
              value={articleText}
              onChange={(e) => setArticleText(e.target.value)}
              placeholder="Paste the complete news article text here..."
              rows={8}
              className="w-full px-4 py-3 bg-brand-surface border border-brand-border rounded-lg text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 transition-all resize-y"
              required
            />
            <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
              <span>Minimum 100 characters required</span>
              <span>{articleText.length} characters</span>
            </div>
          </div>
        ) : (
          <Input
            label="Article URL"
            id="articleUrl"
            type="text"
            value={articleUrl}
            onChange={(e) => setArticleUrl(e.target.value)}
            placeholder="https://example.com/news/article-headline"
            required
            error={validationError && activeTab === 'url' ? validationError : undefined}
          />
        )}

        {/* Granular Summary Preference Selector */}
        <div className="flex flex-col gap-2.5 mt-1 border-t border-brand-border/40 pt-4">
          <label className="text-xs font-semibold text-gray-400 tracking-wide">Target Summary Granularity</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'short', title: 'Short', desc: 'Quick overview' },
              { id: 'medium', title: 'Medium', desc: 'Balanced summary' },
              { id: 'detailed', title: 'Detailed', desc: 'More context' }
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSummaryLength(opt.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all duration-200 cursor-pointer focus:outline-none ${
                  summaryLength === opt.id
                    ? 'border-brand-accent bg-brand-accent/10 text-white'
                    : 'border-brand-border bg-brand-surface text-gray-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span className="text-xs font-bold">{opt.title}</span>
                <span className="text-[10px] text-gray-500 mt-0.5 tracking-wide">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {validationError && activeTab === 'text' && (
          <span className="text-xs text-red-400 font-medium tracking-wide mt-1">
            {validationError}
          </span>
        )}
      </div>

      {/* Submission CTA button */}
      <div className="flex justify-center">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading}
          icon={Sparkles}
          className="w-full md:w-auto md:px-16"
        >
          {isLoading ? 'Processing Article...' : 'Analyze Article'}
        </Button>
      </div>
      
    </form>
  );
};

export default ArticleInput;
