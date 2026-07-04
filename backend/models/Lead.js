const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a lead name'],
    trim: true,
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  company: {
    type: String,
    trim: true,
  },
  value: {
    type: Number,
    default: 0,
  },
  stage: {
    type: String,
    enum: ['Lead', 'Contacted', 'Proposal', 'Negotiation', 'Won', 'Lost'],
    default: 'Lead',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please assign this lead to a user'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Lead', LeadSchema);
