import React, { useState } from 'react';
import { createCampaign } from '../api';

interface Props {
  onCreated: () => void;
  showToast: (msg: string, type: 'success' | 'error') => void;
}

export function CampaignForm({ onCreated, showToast }: Props) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createCampaign(name);
      setName('');
      onCreated();
      showToast('Кампанію створено успішно', 'success');
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
          <span className="mat-icon">add_circle</span>
          Додати кампанію
        </div>
      </div>
      <form onSubmit={handleSubmit} className="form-body">
        <div className="form-group">
          <label htmlFor="campaignName">Назва кампанії</label>
          <input
            id="campaignName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="напр. Літній розпродаж 2024"
            disabled={loading}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading || !name.trim()}>
          <span className="mat-icon">add</span>
          {loading ? 'Створення...' : 'Створити кампанію'}
        </button>
      </form>
    </div>
  );
}
