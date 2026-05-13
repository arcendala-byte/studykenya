const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  content: { type: String, required: true },
  image: { type: String },
  author: { type: String, default: 'Admin' },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

// Pre-save middleware to generate slug
BlogPostSchema.pre('save', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);
