import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { apiRequest } from '../utils/api';

const LeadContext = createContext();

export const LeadProvider = ({ children }) => {
  const { token } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch leads from server
  const fetchLeads = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest('/leads', 'GET', null, token);
      setLeads(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch leads');
      setLoading(false);
    }
  };

  // Trigger fetch when token is loaded/syncs
  useEffect(() => {
    if (token) {
      fetchLeads();
    } else {
      setLeads([]);
    }
  }, [token]);

  // Create lead
  const addLead = async (leadData) => {
    setError(null);
    try {
      const newLead = await apiRequest('/leads', 'POST', leadData, token);
      setLeads((prevLeads) => [newLead, ...prevLeads]);
      return newLead;
    } catch (err) {
      setError(err.message || 'Failed to create lead');
      throw err;
    }
  };

  // Update lead details/stage
  const updateLead = async (id, leadData) => {
    setError(null);
    try {
      const updatedLead = await apiRequest(`/leads/${id}`, 'PUT', leadData, token);
      setLeads((prevLeads) =>
        prevLeads.map((lead) => (lead._id === id ? updatedLead : lead))
      );
      return updatedLead;
    } catch (err) {
      setError(err.message || 'Failed to update lead');
      throw err;
    }
  };

  // Delete lead
  const removeLead = async (id) => {
    setError(null);
    try {
      await apiRequest(`/leads/${id}`, 'DELETE', null, token);
      setLeads((prevLeads) => prevLeads.filter((lead) => lead._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete lead');
      throw err;
    }
  };

  return (
    <LeadContext.Provider
      value={{
        leads,
        loading,
        error,
        fetchLeads,
        addLead,
        updateLead,
        removeLead,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};
