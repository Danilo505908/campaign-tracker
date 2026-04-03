import { dbRun, dbGet } from '../db/db';
import { Event } from '../types';

export const recordEvent = async (campaignId: number, type: 'click' | 'impression'): Promise<Event> => {
  // Validate campaign
  const campaign = await dbGet<{id: number}>('SELECT id FROM campaigns WHERE id = ?', [campaignId]);
  if (!campaign) {
    throw new Error('Campaign not found');
  }
  
  if (type !== 'click' && type !== 'impression') {
    throw new Error('Invalid event type');
  }
  
  const result = await dbRun('INSERT INTO events (campaignId, type) VALUES (?, ?)', [campaignId, type]);
  const event = await dbGet<Event>('SELECT * FROM events WHERE id = ?', [result.lastID]);
  return event!;
};
