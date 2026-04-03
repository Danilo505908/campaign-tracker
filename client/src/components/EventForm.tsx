import React, { useState } from 'react';
import { recordEvent } from '../api';
import type { Campaign } from '../types';

interface Props {
  campaigns: Campaign[];
  onEventRecorded: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export function EventForm({ campaigns, onEventRecorded, showToast }: Props) {
  const [campaignId, setCampaignId] = useState('');
  const [type, setType] = useState<'click' | 'impression'>('click');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignId) return;
    setLoading(true);
    try {
      await recordEvent(Number(campaignId), type);
      onEventRecorded();
      showToast(`Подію "${type === 'click' ? 'Клік' : 'Показ'}" записано`, 'success');
    } catch (err) {
      const error = err as Error;
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <span className="mat-icon">send</span>
          Відправити подію
        </div>
      </div>
      <form onSubmit={handleSubmit} className="form-body">
        <div className="form-group">
          <label htmlFor="campaignSelect">Кампанія</label>
          <select
            id="campaignSelect"
            value={campaignId}
            onChange={(e) => setCampaignId(e.target.value)}
            disabled={loading}
          >
            <option value="">— Оберіть кампанію —</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="typeSelect">Тип події</label>
          <select
            id="typeSelect"
            value={type}
            onChange={(e) => setType(e.target.value as 'click' | 'impression')}
            disabled={loading}
          >
            <option value="click">Клік</option>
            <option value="impression">Показ</option>
          </select>
        </div>
        <button type="submit" className="btn btn-success" disabled={loading || !campaignId}>
          <span className="mat-icon">send</span>
          {loading ? 'Запис...' : 'Записати подію'}
        </button>
      </form>
    </div>
  );
}
