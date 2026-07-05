const Lead = require('../models/Lead');

// @desc    Get all leads assigned to logged-in user
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ assignedTo: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single lead by ID
// @route   GET /api/leads/:id
// @access  Private
const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Check lead ownership
    if (lead.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this lead' });
    }

    res.status(200).json(lead);
  } catch (error) {
    console.error('Get lead error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, value, stage } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Please provide at least a lead name' });
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      company,
      value: value || 0,
      stage: stage || 'Lead',
      assignedTo: req.user._id,
    });

    res.status(201).json(lead);
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res) => {
  try {
    const { name, email, phone, company, value, stage } = req.body;

    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Check ownership
    if (lead.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this lead' });
    }

    // Update fields
    lead.name = name !== undefined ? name : lead.name;
    lead.email = email !== undefined ? email : lead.email;
    lead.phone = phone !== undefined ? phone : lead.phone;
    lead.company = company !== undefined ? company : lead.company;
    lead.value = value !== undefined ? value : lead.value;
    lead.stage = stage !== undefined ? stage : lead.stage;

    const updatedLead = await lead.save();

    res.status(200).json(updatedLead);
  } catch (error) {
    console.error('Update lead error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Check ownership
    if (lead.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this lead' });
    }

    await lead.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Lead successfully deleted' });
  } catch (error) {
    console.error('Delete lead error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
};
