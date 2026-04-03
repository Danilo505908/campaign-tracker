import { dbRun, dbAll, dbGet } from '../db/db';
import { Campaign, CampaignStats } from '../types';

export const createCampaign = async (name: string): Promise<Campaign> => {
  const result = await dbRun('INSERT INTO campaigns (name) VALUES (?)', [name]);
  const campaign = await dbGet<Campaign>('SELECT * FROM campaigns WHERE id = ?', [result.lastID]);
  return campaign!;
};

export const getAllCampaigns = async (): Promise<Campaign[]> => {
  return await dbAll<Campaign>('SELECT * FROM campaigns ORDER BY createdAt DESC');
};

export const deleteCampaignById = async (id: number): Promise<void> => {
  await dbRun('DELETE FROM events WHERE campaignId = ?', [id]);
  await dbRun('DELETE FROM campaigns WHERE id = ?', [id]);
};

export const getCampaignStats = async (): Promise<CampaignStats[]> => {
  const sql = `
    SELECT 
      c.id as campaignId,
      c.name,
      SUM(CASE WHEN e.type = 'click' THEN 1 ELSE 0 END) as clicks,
      SUM(CASE WHEN e.type = 'impression' THEN 1 ELSE 0 END) as impressions
    FROM campaigns c
    LEFT JOIN events e ON c.id = e.campaignId
    GROUP BY c.id
    ORDER BY c.createdAt DESC
  `;
  const rawStats = await dbAll<any>(sql);
  
  return rawStats.map(stat => {
    const clicks = stat.clicks || 0;
    const impressions = stat.impressions || 0;
    // Calculate CTR
    const ctr = impressions === 0 ? 0 : (clicks / impressions) * 100;
    return {
      campaignId: stat.campaignId,
      name: stat.name,
      clicks,
      impressions,
      ctr
    };
  });
};
