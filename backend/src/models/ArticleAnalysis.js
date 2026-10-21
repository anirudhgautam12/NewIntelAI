import mongoose from 'mongoose';

const articleAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    inputType: {
      type: String,
      enum: ['text', 'url'],
      required: true
    },
    articleUrl: {
      type: String
    },
    title: {
      type: String,
      trim: true,
      default: 'Untitled Article'
    },
    originalText: {
      type: String,
      required: true
    },
    processedText: {
      type: String,
      default: ''
    },
    summary: {
      short: { type: String, default: '' },
      medium: { type: String, default: '' },
      detailed: { type: String, default: '' }
    },
    sentiment: {
      label: {
        type: String,
        enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL']
      },
      confidence: { type: Number, default: 0 },
      scores: {
        positive: { type: Number, default: 0 },
        neutral: { type: Number, default: 0 },
        negative: { type: Number, default: 0 }
      }
    },
    keywords: [
      {
        keyword: { type: String },
        relevance: { type: Number }
      }
    ],
    entities: [
      {
        text: { type: String },
        label: { type: String }
      }
    ],
    originalWordCount: {
      type: Number,
      default: 0
    },
    summaryWordCount: {
      type: Number,
      default: 0
    },
    compressionRatio: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['PROCESSING', 'COMPLETED', 'FAILED'],
      default: 'PROCESSING'
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Create compound index for querying history
articleAnalysisSchema.index({ userId: 1, createdAt: -1 });

const ArticleAnalysis = mongoose.model('ArticleAnalysis', articleAnalysisSchema);

export default ArticleAnalysis;
