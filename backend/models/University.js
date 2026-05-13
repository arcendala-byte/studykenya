const mongoose = require('mongoose');

const UniversitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  location: String,
  type: String,
  description: String,
  programs: [String],
  courses: [String],
  requirements: [String],
  fees: String,
  categories: [String],
  image: String,
  featured: { type: Boolean, default: false },
  website: String,
  createdAt: { type: Date, default: Date.now }
});

// Pre-save middleware to generate slug if not provided
UniversitySchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('University', UniversitySchema);
