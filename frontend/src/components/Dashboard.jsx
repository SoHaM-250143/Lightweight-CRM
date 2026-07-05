import React from 'react';
import { useLeads } from '../context/LeadContext';
import { Users, DollarSign, TrendingUp, Award, RefreshCw, Calendar, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { leads, loading, fetchLeads } = useLeads();

  // Metric calculations
  const totalLeads = leads.length;
  const activeLeads = leads.filter((l) => l.stage !== 'Won' && l.stage !== 'Lost');
  const wonLeads = leads.filter((l) => l.stage === 'Won');
  const lostLeads = leads.filter((l) => l.stage === 'Lost');
  
  const pipelineValue = activeLeads.reduce((acc, curr) => acc + (curr.value || 0), 0);
  const wonValue = wonLeads.reduce((acc, curr) => acc + (curr.value || 0), 0);

  const closedCount = wonLeads.length + lostLeads.length;
  const winRate = closedCount > 0 ? Math.round((wonLeads.length / closedCount) * 100) : 0;

  // Lead distribution calculations
  const stages = ['Lead', 'Contacted', 'Proposal', 'Negotiation', 'Won', 'Lost'];
  const stageStats = stages.map((stage) => {
    const count = leads.filter((l) => l.stage === stage).length;
    const percentage = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
    
    // Pick stage styles
    let colorClass = 'bg-slate-500';
    if (stage === 'Lead') colorClass = 'bg-blue-500';
    if (stage === 'Contacted') colorClass = 'bg-sky-500';
    if (stage === 'Proposal') colorClass = 'bg-indigo-500';
    if (stage === 'Negotiation') colorClass = 'bg-amber-500';
    if (stage === 'Won') colorClass = 'bg-emerald-500';
    if (stage === 'Lost') colorClass = 'bg-rose-500';

    return { stage, count, percentage, colorClass };
  });

  // Recent leads list (last 5)
  const recentLeads = leads.slice(0, 5);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (loading && leads.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Leads Card */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:border-slate-700/80 hover:translate-y-[-2px] group">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-blue-500/5 blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-950/40 px-2.5 py-1 rounded-lg border border-slate-800/50">
              Active: {activeLeads.length}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-400">Total CRM Leads</p>
          <h3 className="text-3xl font-extrabold text-white mt-2 tracking-tight">{totalLeads}</h3>
        </div>

        {/* Pipeline Value Card */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:border-slate-700/80 hover:translate-y-[-2px] group">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-violet-500/5 blur-2xl pointer-events-none group-hover:bg-violet-500/10 transition-colors" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <DollarSign size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-950/40 px-2.5 py-1 rounded-lg border border-slate-800/50">
              In Pipeline
            </span>
          </div>
          <p className="text-sm font-medium text-slate-400">Active Pipeline Value</p>
          <h3 className="text-3xl font-extrabold text-white mt-2 tracking-tight">{formatCurrency(pipelineValue)}</h3>
        </div>

        {/* Closed Won Value Card */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:border-slate-700/80 hover:translate-y-[-2px] group">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-emerald-500/5 blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-950/40 px-2.5 py-1 rounded-lg border border-slate-800/50">
              Closed Won
            </span>
          </div>
          <p className="text-sm font-medium text-slate-400">Revenue Won</p>
          <h3 className="text-3xl font-extrabold text-white mt-2 tracking-tight">{formatCurrency(wonValue)}</h3>
        </div>

        {/* Win Rate Card */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:border-slate-700/80 hover:translate-y-[-2px] group">
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-amber-500/5 blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <TrendingUp size={20} />
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-950/40 px-2.5 py-1 rounded-lg border border-slate-800/50">
              Won / Closed
            </span>
          </div>
          <p className="text-sm font-medium text-slate-400">Conversion Win Rate</p>
          <h3 className="text-3xl font-extrabold text-white mt-2 tracking-tight">{winRate}%</h3>
        </div>
      </div>

      {/* Main Charts / List section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pipeline Stage Distribution Progress bars */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 lg:col-span-1">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Pipeline Stages</h3>
            <button
              onClick={fetchLeads}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="space-y-5">
            {stageStats.map((item) => (
              <div key={item.stage} className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">{item.stage}</span>
                  <span className="text-slate-350">
                    {item.count} lead{item.count !== 1 ? 's' : ''} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-850">
                  <div
                    className={`h-full rounded-full ${item.colorClass} transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Recent Opportunities</h3>
                <p className="text-slate-500 text-xs mt-1">Recently created or modified leads</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 text-slate-500 border border-slate-855">
                <Calendar size={16} />
              </div>
            </div>

            {recentLeads.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-800/80 rounded-xl bg-slate-950/20">
                <p className="text-slate-500 text-sm">No lead opportunities found.</p>
                <p className="text-slate-650 text-xs mt-1">Add leads to see summaries here.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {recentLeads.map((lead) => (
                  <div key={lead._id} className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">{lead.name}</span>
                      <span className="text-xs text-slate-400 mt-0.5">
                        {lead.company || 'Individual'} {lead.email ? `• ${lead.email}` : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-slate-200">{formatCurrency(lead.value)}</span>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                          lead.stage === 'Won'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : lead.stage === 'Lost'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : lead.stage === 'Negotiation'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}
                      >
                        {lead.stage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
