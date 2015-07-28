var mongoose = require('mongoose');

var PortfolioSchema = new mongoose.Schema({
  title: { type: String, unique: true},
  description: String,
  portfolioImg: String,
  videoLink: String,
  date: Date,
  tags: Array,
  images: String
});

mongoose.model('Portfolio', PortfolioSchema);