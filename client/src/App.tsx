import { useState, useEffect, useCallback } from 'react';
import { fetchCampaigns, fetchStats, deleteCampaign } from './api';
import type { Campaign, CampaignStats } from './types';
import { CampaignForm } from './components/CampaignForm';
import { EventForm } from './components/EventForm';
import { StatsTable } from './components/StatsTable';

function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<CampaignStats[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const loadData = useCallback(async () => {
    try {
      const [campaignsData, statsData] = await Promise.all([
        fetchCampaigns(),
        fetchStats(),
      ]);
      setCampaigns(campaignsData);
      setStats(statsData);
    } catch (err) {
      console.error(err);
      showToast('Помилка завантаження даних', 'error');
    }
  }, [showToast]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDeleteCampaign = useCallback(async (id: number) => {
    if (!window.confirm('Видалити кампанію? Усі пов\'язані події також буде видалено.')) return;
    try {
      await deleteCampaign(id);
      showToast('Кампанію видалено', 'success');
      loadData();
    } catch (err) {
      const error = err as Error;
      showToast(error.message, 'error');
    }
  }, [loadData, showToast]);

  // Derived KPI totals
  const totalClicks = stats.reduce((s, c) => s + c.clicks, 0);
  const totalImpressions = stats.reduce((s, c) => s + c.impressions, 0);
  const avgCtr = stats.length
    ? (stats.reduce((s, c) => s + c.ctr, 0) / stats.length).toFixed(2)
    : '0.00';

  return (
    <div className="dashboard">
      {/* ── Main Area ── */}
      <div className="main-area">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-brand">
            <svg width="52" height="52" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              <rect x="12" y="2" width="40" height="40" rx="12" fill="#006194" />
              <g filter="url(#filter0_dd_1_224)">
                <rect x="12" y="2" width="40" height="40" rx="12" fill="white" fillOpacity="0.01" shapeRendering="crispEdges" />
              </g>
              <path d="M31.45 27.75C29.85 27.6667 28.5 27.05 27.4 25.9C26.3 24.75 25.75 23.3667 25.75 21.75C25.75 20.0833 26.3333 18.6667 27.5 17.5C28.6667 16.3333 30.0833 15.75 31.75 15.75C33.3667 15.75 34.75 16.3 35.9 17.4C37.05 18.5 37.6667 19.85 37.75 21.45L35.65 20.825C35.4333 19.925 34.9667 19.1875 34.25 18.6125C33.5333 18.0375 32.7 17.75 31.75 17.75C30.65 17.75 29.7083 18.1417 28.925 18.925C28.1417 19.7083 27.75 20.65 27.75 21.75C27.75 22.7 28.0375 23.5333 28.6125 24.25C29.1875 24.9667 29.925 25.4333 30.825 25.65L31.45 27.75V27.75M32.65 31.7C32.5 31.7333 32.35 31.75 32.2 31.75C32.05 31.75 31.9 31.75 31.75 31.75C30.3667 31.75 29.0667 31.4875 27.85 30.9625C26.6333 30.4375 25.575 29.725 24.675 28.825C23.775 27.925 23.0625 26.8667 22.5375 25.65C22.0125 24.4333 21.75 23.1333 21.75 21.75C21.75 20.3667 22.0125 19.0667 22.5375 17.85C23.0625 16.6333 23.775 15.575 24.675 14.675C25.575 13.775 26.6333 13.0625 27.85 12.5375C29.0667 12.0125 30.3667 11.75 31.75 11.75C33.1333 11.75 34.4333 12.0125 35.65 12.5375C36.8667 13.0625 37.925 13.775 38.825 14.675C39.725 15.575 40.4375 16.6333 40.9625 17.85C41.4875 19.0667 41.75 20.3667 41.75 21.75C41.75 21.9 41.75 22.05 41.75 22.2C41.75 22.35 41.7333 22.5 41.7 22.65L39.75 22.05V21.75C39.75 19.5167 38.975 17.625 37.425 16.075C35.875 14.525 33.9833 13.75 31.75 13.75C29.5167 13.75 27.625 14.525 26.075 16.075C24.525 17.625 23.75 19.5167 23.75 21.75C23.75 23.9833 24.525 25.875 26.075 27.425C27.625 28.975 29.5167 29.75 31.75 29.75C31.8 29.75 31.85 29.75 31.9 29.75C31.95 29.75 32 29.75 32.05 29.75L32.65 31.7V31.7M40.275 32.25L36 27.975L34.75 31.75L31.75 21.75L41.75 24.75L37.975 26L42.25 30.275L40.275 32.25V32.25" fill="white" />
              <defs>
                <filter id="filter0_dd_1_224" x="0" y="0" width="64" height="64" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feMorphology radius="4" operator="erode" in="SourceAlpha" result="effect1_dropShadow_1_224" />
                  <feOffset dy="4" />
                  <feGaussianBlur stdDeviation="3" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.380392 0 0 0 0 0.580392 0 0 0 0.2 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_224" />
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                  <feMorphology radius="3" operator="erode" in="SourceAlpha" result="effect2_dropShadow_1_224" />
                  <feOffset dy="10" />
                  <feGaussianBlur stdDeviation="7.5" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.380392 0 0 0 0 0.580392 0 0 0 0.2 0" />
                  <feBlend mode="normal" in2="effect1_dropShadow_1_224" result="effect2_dropShadow_1_224" />
                  <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_1_224" result="shape" />
                </filter>
              </defs>
            </svg>
            <div>
              <div className="brand-name">Ad Performance</div>
              <div className="brand-sub">Tracker</div>
            </div>
          </div>
          <div className="topbar-title">
            <h1>Огляд активності</h1>
            <p>Простий інструмент для керування та аналізу рекламних кампаній</p>
          </div>
        </div>

        {/* Content */}
        <div className="content">
          {/* KPI Cards */}
          <div className="kpi-row">
            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">Загальні Кліки</span>
                <div className="kpi-icon blue"><span className="mat-icon">ads_click</span></div>
              </div>
              <div className="kpi-value">{totalClicks.toLocaleString()}</div>
              <div className="kpi-trend">
                <span className="mat-icon">trending_up</span>
                всі кампанії
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">Загальні Покази</span>
                <div className="kpi-icon green"><span className="mat-icon">visibility</span></div>
              </div>
              <div className="kpi-value">{totalImpressions.toLocaleString()}</div>
              <div className="kpi-trend">
                <span className="mat-icon">trending_up</span>
                всі кампанії
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">Середній CTR</span>
                <div className="kpi-icon yellow"><span className="mat-icon">percent</span></div>
              </div>
              <div className="kpi-value">{avgCtr}%</div>
              <div className="kpi-trend">
                <span className="mat-icon">bar_chart</span>
                середнє по всіх
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-header">
                <span className="kpi-label">Тренд за тиждень</span>
                <div className="kpi-icon purple"><span className="mat-icon">insights</span></div>
              </div>
              <div className="kpi-value">{stats.length}</div>
              <div className="kpi-trend">
                <span className="mat-icon">campaign</span>
                активних кампаній
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="content-grid">
            {/* Stats Table */}
            <StatsTable stats={stats} onDelete={handleDeleteCampaign} />

            {/* Side Forms */}
            <div className="side-forms">
              <CampaignForm onCreated={loadData} showToast={showToast} />
              <EventForm campaigns={campaigns} onEventRecorded={loadData} showToast={showToast} />
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          <span className="mat-icon">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

export default App;
