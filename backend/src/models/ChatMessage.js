import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ArticleAnalysis',
      required: true
    },
    question: {
      type: String,
      required: true,
      trim: true
    },
    answer: {
      type: String,
      required: true
    },
    sources: [
      {
        chunkId: { type: String, required: true },
        text: { type: String, required: true }
      }
    ]
  },
  {
    timestamps: true
  }
);

// Create compound index for querying chat history on an article
chatMessageSchema.index({ articleId: 1, userId: 1, createdAt: 1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
