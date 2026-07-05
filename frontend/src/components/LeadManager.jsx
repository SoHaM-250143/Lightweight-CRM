import React, { useState } from 'react';
import { useLeads } from '../context/LeadContext';
import { Search, Plus, Edit2, Trash2, X, AlertCircle, Sparkles, Briefcase, Mail, Phone, DollarSign } from 'lucide-react';

const LeadManager = () => {
  const { leads, addLead, updateLead, removeLead, error: contextError } = useLeads();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState(null); // null for Add, Lead object for Edit

  // Form Fields State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [value, setValue] = useState('');
  const [stage, setStage] = useState('Lead');
  const [validationError, setValidationError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter leads based on search term
  const filteredLeads = leads.filter((lead) => {
    const search = searchTerm.toLowerCase();
    return (
      lead.name.toLowerCase().includes(search) ||
      (lead.email && lead.email.toLowerCase().includes(search)) ||
      (lead.company && lead.company.toLowerCase().includes(search)) ||
      lead.stage.toLowerCase().includes(search)
    );
  });

  // Open Modal Handler
  const openModal = (lead = null) => {
    setValidationError(null);
    if (lead) {
      // Edit Mode
      setCurrentLead(lead);
      setName(lead.name);
      setEmail(lead.email || '');
      setPhone(lead.phone || '');
      setCompany(lead.company || '');
      setValue(lead.value || '');
      setStage(lead.stage || 'Lead');
    } else {
      // Add Mode
      setCurrentLead(null);
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setValue('');
      setStage('Lead');
    }
    setIsModalOpen(true);
  };

  // Close Modal Handler
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentLead(null);
  };

  // Delete Handler
  const handleDelete = async (id, leadName) => {
    if (window.confirm(`Are you sure you want to delete the lead for "${leadName}"?`)) {
      try {
        await removeLead(id);
      } catch (err) {
        console.error('Failed to delete lead:', err);
      }
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);

    if (!name) {
      setValidationError('Lead name is required');
      return;
    }

    const leadData = {
      name,
      email: email || undefined,
      phone: phone || undefined,
      company: company || undefined,
      value: value ? Number(value) : 0,
      stage,
    };

    setIsSubmitting(true);
    try {
      if (currentLead) {
        // Edit Operation
        await updateLead(currentLead._id, leadData);
      } else {
        // Create Operation
        await addLead(leadData);
      }
      closeModal();
    } catch (err) {
      setValidationError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search leads by name, company, stage..."
            className="w-full bg-slate-900/50 border border-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-500 outline-none transition-all duration-200 text-sm"
          />
        </div>

        {/* Add Lead button */}
        <button
          onClick={() => openModal()}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-violet-600/10 hover:shadow-violet-600/25 flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Add Lead
        </button>
      </div>

      {/* Leads Table Container */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-slate-950 border border-slate-850 text-slate-600 mb-4">
              <Briefcase size={28} />
            </div>
            <h4 className="text-base font-bold text-white mb-1">No Leads Found</h4>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
              {searchTerm ? 'No results matched your search term.' : 'Click "Add Lead" to seed your sales pipeline opportunities.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="py-4 px-6">Lead / Company</th>
                  <th className="py-4 px-6">Contact Info</th>
                  <th className="py-4 px-6">Stage</th>
                  <th className="py-4 px-6">Value</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-sm">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-slate-900/20 transition-colors group"
                  >
                    {/* Name & Company */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white group-hover:text-violet-400 transition-colors">
                          {lead.name}
                        </span>
                        <span className="text-xs text-slate-500 mt-0.5">
                          {lead.company || 'No Company'}
                        </span>
                      </div>
                    </td>

                    {/* Email & Phone */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-0.5 text-xs text-slate-400">
                        {lead.email && (
                          <span className="flex items-center gap-1.5">
                            <Mail size={12} className="text-slate-600" />
                            {lead.email}
                          </span>
                        )}
                        {lead.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone size={12} className="text-slate-600" />
                            {lead.phone}
                          </span>
                        )}
                        {!lead.email && !lead.phone && <span className="text-slate-600 italic">No details</span>}
                      </div>
                    </td>

                    {/* Stage */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          lead.stage === 'Won'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : lead.stage === 'Lost'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : lead.stage === 'Negotiation'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : lead.stage === 'Proposal'
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                            : lead.stage === 'Contacted'
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}
                      >
                        {lead.stage}
                      </span>
                    </td>

                    {/* Value */}
                    <td className="py-4 px-6 font-bold text-slate-200">
                      {formatCurrency(lead.value)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => openModal(lead)}
                          className="p-2 rounded-lg bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 transition-all duration-200"
                          title="Edit Lead"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(lead._id, lead.name)}
                          className="p-2 rounded-lg bg-slate-950 text-rose-400/80 hover:text-rose-400 border border-slate-800 hover:border-rose-500/20 transition-all duration-200"
                          title="Delete Lead"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal Container */}
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-955">
              <div className="flex items-center gap-2">
                <Sparkles className="text-violet-400" size={18} />
                <h3 className="font-bold text-white text-lg">
                  {currentLead ? 'Edit Lead Opportunity' : 'Create Lead Opportunity'}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* Validation Errors */}
                {(validationError || contextError) && (
                  <div className="flex items-start gap-2.5 p-3 rounded-lg text-sm bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <span>{validationError || contextError}</span>
                  </div>
                )}

                {/* Lead Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Lead Name / Prospect Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Acme Corp Account, Jane Doe"
                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 outline-none transition-all duration-200"
                    required
                  />
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Industries"
                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 outline-none transition-all duration-200"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="prospect@company.com"
                      className="w-full bg-slate-950/50 border border-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 outline-none transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full bg-slate-950/50 border border-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Value & Stage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Estimated Deal Value ($)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-600">
                        <DollarSign size={16} />
                      </div>
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="e.g. 5000"
                        className="w-full bg-slate-950/50 border border-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-slate-600 outline-none transition-all duration-200"
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Sales Pipeline Stage
                    </label>
                    <select
                      value={stage}
                      onChange={(e) => setStage(e.target.value)}
                      className="w-full bg-slate-955 border border-slate-805 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl px-4 py-2.5 text-white outline-none transition-all duration-200"
                    >
                      <option value="Lead">Lead</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Proposal">Proposal</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Won">Closed Won</option>
                      <option value="Lost">Closed Lost</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-955">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-violet-600/10 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : currentLead ? (
                    'Save Changes'
                  ) : (
                    'Create Lead'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadManager;
