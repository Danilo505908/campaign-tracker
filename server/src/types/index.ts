export interface Campaign {
  id: number;
  name: string;
  createdAt: string;
}

export interface Event {
  id: number;
  campaignId: number;
  type: 'click' | 'impression';
  createdAt: string;
}

export interface CampaignStats {
  campaignId: number;
  name: string;
  clicks: number;
  impressions: number;
  ctr: number;
}
