import React, { useState } from 'react';
import { useLeads } from '../context/LeadContext';
import { Sparkles, DollarSign, X, AlertCircle, Edit2, Trash2, Mail, Phone, ArrowRight } from 'lucide-react';

const KanbanBoard = () => {
  const { leads, updateLead, removeLead, error: contextError } = useLeads();
  const stages = ['Lead', 'Contacted', 'Proposal', 'Negotiation', 'Won', 'Lost'];

  // State to track which column is currently hovered over by a dragged item
  const [dragOverColumn, setDragOverColumn] = useState(null);

  // Modal Editing States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [value, setValue] = useState('');
  const [stage, setStage] = useState('Lead');
  const [validationError, setValidationError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Drag and Drop handlers
  const handleDragStart = (e, leadId) => {
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, targetStage) => {
    e.preventDefault(); // Required to allow drop!
  };

  const handleDragEnter = (e, targetStage) => {
    e.preventDefault();
    setDragOverColumn(targetStage);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    // Do not clear if we just entered a child element in the same column
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    setDragOverColumn(null);
    const leadId = e.dataTransfer.getData('text/plain');
    if (!leadId) return;

    const leadToUpdate = leads.find((l) => l._id === leadId);
    if (!leadToUpdate || leadToUpdate.stage === targetStage) return;

    try {
      await updateLead(leadId, { stage: targetStage });
    } catch (err) {
      console.error('Failed to move lead stage:', err);
    }
  };

  // Open Edit Modal Handler
  const openEditModal = (lead) => {
    setValidationError(null);
    setCurrentLead(lead);
    setName(lead.name);
    setEmail(lead.email || '');
    setPhone(lead.phone || '');
    setCompany(lead.company || '');
    setValue(lead.value || '');
    setStage(lead.stage || 'Lead');
    setIsModalOpen(true);
  };

  // Close Modal Handler
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentLead(null);
  };

  // Delete Handler from Kanban
  const handleDelete = async (id, leadName) => {
    if (window.confirm(`Are you sure you want to delete the lead for "${leadName}"?`)) {
      try {
        await removeLead(id);
        closeModal();
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
      await updateLead(currentLead._id, leadData);
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
      {/* Board Scrollable Wrapper */}
      <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <div className="flex gap-4 min-w-[1250px] h-[calc(100vh-220px)] items-stretch">
          {stages.map((colStage) => {
            const columnLeads = leads.filter((l) => l.stage === colStage);
            const columnValueSum = columnLeads.reduce((acc, curr) => acc + (curr.value || 0), 0);
            const isHovered = dragOverColumn === colStage;

            // Pick stage header border color
            let borderColor = 'border-slate-800';
            let bgGlow = 'bg-slate-500/5';
            let dotColor = 'bg-slate-500';
            
            if (colStage === 'Lead') { borderColor = 'border-blue-500/40'; bgGlow = 'bg-blue-500/5'; dotColor = 'bg-blue-400'; }
            if (colStage === 'Contacted') { borderColor = 'border-sky-500/40'; bgGlow = 'bg-sky-500/5'; dotColor = 'bg-sky-400'; }
            if (colStage === 'Proposal') { borderColor = 'border-indigo-500/40'; bgGlow = 'bg-indigo-500/5'; dotColor = 'bg-indigo-400'; }
            if (colStage === 'Negotiation') { borderColor = 'border-amber-500/40'; bgGlow = 'bg-amber-500/5'; dotColor = 'bg-amber-400'; }
            if (colStage === 'Won') { borderColor = 'border-emerald-500/40'; bgGlow = 'bg-emerald-500/5'; dotColor = 'bg-emerald-400'; }
            if (colStage === 'Lost') { borderColor = 'border-rose-500/40'; bgGlow = 'bg-rose-500/5'; dotColor = 'bg-rose-400'; }

            return (
              <div
                key={colStage}
                onDragOver={(e) => handleDragOver(e, colStage)}
                onDragEnter={(e) => handleDragEnter(e, colStage)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, colStage)}
                className={`flex-1 flex flex-col bg-slate-900/35 border rounded-2xl p-4 transition-all duration-200 select-none ${
                  isHovered ? 'border-violet-500 bg-violet-600/[0.03] scale-[1.01] shadow-lg shadow-violet-500/5' : 'border-slate-800/80'
                }`}
              >
                {/* Column Header */}
                <div className="flex flex-col mb-4 pb-3 border-b border-slate-800/60">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
                      <span className="font-bold text-white text-sm tracking-wide">{colStage}</span>
                    </div>
                    <span className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-950/60 border border-slate-800/80 font-bold text-slate-400">
                      {columnLeads.length}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-500 mt-1.5 flex items-center gap-0.5">
                    <DollarSign size={12} className="text-slate-650 shrink-0" />
                    {formatCurrency(columnValueSum)}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-slate-800/60 scrollbar-track-transparent">
                  {columnLeads.length === 0 ? (
                    <div className="h-28 border border-dashed border-slate-800/60 rounded-xl flex items-center justify-center text-center p-4">
                      <p className="text-xs text-slate-600 font-medium">Drag opportunities here</p>
                    </div>
                  ) : (
                    columnLeads.map((lead) => (
                      <div
                        key={lead._id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead._id)}
                        onClick={() => openEditModal(lead)}
                        className={`bg-slate-900 border border-slate-850 hover:border-slate-700/80 hover:bg-slate-850/30 rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all duration-150 relative group shadow-sm`}
                      >
                        {/* Name & Company */}
                        <div className="flex flex-col mb-2">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                            {lead.company || 'Individual'}
                          </span>
                          <span className="text-sm font-semibold text-white group-hover:text-violet-400 transition-colors">
                            {lead.name}
                          </span>
                        </div>

                        {/* Value */}
                        <div className="font-bold text-slate-200 text-sm mb-3">
                          {formatCurrency(lead.value)}
                        </div>

                        {/* Contact details icons */}
                        <div className="flex gap-2 text-slate-500 border-t border-slate-800/60 pt-3">
                          {lead.email && <Mail size={12} className="text-slate-500" title={lead.email} />}
                          {lead.phone && <Phone size={12} className="text-slate-500" title={lead.phone} />}
                          <span className="text-[10px] ml-auto text-slate-600 font-medium">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Modal (Kanban view integration) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={closeModal} />
          
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-955">
              <div className="flex items-center gap-2">
                <Sparkles className="text-violet-400" size={18} />
                <h3 className="font-bold text-white text-lg">Update Pipeline Lead</h3>
              </div>
              <button onClick={closeModal} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {(validationError || contextError) && (
                  <div className="flex items-start gap-2.5 p-3 rounded-lg text-sm bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <span>{validationError || contextError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Lead Name / Prospect Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl px-4 py-2.5 text-white placeholder-slate-650 outline-none transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl px-4 py-2.5 text-white placeholder-slate-650 outline-none transition-all duration-200"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl px-4 py-2.5 text-white placeholder-slate-650 outline-none transition-all duration-200"
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
                      className="w-full bg-slate-950/50 border border-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl px-4 py-2.5 text-white placeholder-slate-650 outline-none transition-all duration-200"
                    />
                  </div>
                </div>

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
                        className="w-full bg-slate-950/50 border border-slate-800 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 rounded-xl pl-9 pr-4 py-2.5 text-white outline-none transition-all duration-200"
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

              <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-955">
                {/* Delete button from inside Edit modal */}
                <button
                  type="button"
                  onClick={() => handleDelete(currentLead._id, currentLead.name)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 border border-rose-500/10 hover:border-rose-500/20 transition-all flex items-center gap-1.5"
                >
                  <Trash2 size={14} />
                  Delete Lead
                </button>
                <div className="flex gap-3">
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
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
