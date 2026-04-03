import type { Campaign, CampaignStats, Event } from './types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const fetchCampaigns = async (): Promise<Campaign[]> => {
  const response = await fetch(`${API_URL}/campaigns`);
  if (!response.ok) throw new Error('Failed to fetch campaigns');
  return response.json();
};

export const createCampaign = async (name: string): Promise<Campaign> => {
  const response = await fetch(`${API_URL}/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error('Failed to create campaign');
  return response.json();
};

export const deleteCampaign = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/campaigns/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete campaign');
};

export const recordEvent = async (campaignId: number, type: 'click' | 'impression'): Promise<Event> => {
  const response = await fetch(`${API_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ campaignId, type }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to record event');
  }
  return response.json();
};

export const fetchStats = async (): Promise<CampaignStats[]> => {
  const response = await fetch(`${API_URL}/stats`);
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
};
