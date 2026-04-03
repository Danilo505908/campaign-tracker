import { Request, Response } from 'express';
import { createCampaign, getAllCampaigns, getCampaignStats, deleteCampaignById } from '../services/campaign.service';
import { recordEvent } from '../services/event.service';

export const postCampaign = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Name is required' });
    }
    const campaign = await createCampaign(name);
    res.status(201).json(campaign);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await getAllCampaigns();
    res.status(200).json(campaigns);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCampaign = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid campaign ID' });
    }
    await deleteCampaignById(id);
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const postEvent = async (req: Request, res: Response) => {
  try {
    const { campaignId, type } = req.body;
    if (!campaignId || typeof campaignId !== 'number') {
      return res.status(400).json({ error: 'Valid campaignId is required' });
    }
    if (type !== 'click' && type !== 'impression') {
      return res.status(400).json({ error: 'Type must be click or impression' });
    }
    const event = await recordEvent(campaignId, type);
    res.status(201).json(event);
  } catch (error: any) {
    if (error.message === 'Campaign not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Invalid event type') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const stats = await getCampaignStats();
    res.status(200).json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
