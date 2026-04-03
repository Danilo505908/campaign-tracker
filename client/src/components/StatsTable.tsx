import type { CampaignStats } from '../types';

interface Props {
  stats: CampaignStats[];
  onDelete: (id: number) => void;
}

export function StatsTable({ stats, onDelete }: Props) {
  const maxCtr = stats.length ? Math.max(...stats.map(s => s.ctr), 1) : 1;

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">
          <span className="mat-icon">bar_chart</span>
          Список кампаній
        </div>
        {stats.length > 0 && (
          <span className="panel-badge">{stats.length}</span>
        )}
      </div>

      <div className="table-wrap">
        {stats.length === 0 ? (
          <div className="empty-state">
            <span className="mat-icon">campaign</span>
            <span>Немає кампаній. Створіть першу — і тут з'явиться статистика.</span>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Кампанія</th>
                <th>Кліки</th>
                <th>Покази</th>
                <th>CTR</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {stats.map((stat) => (
                <tr key={stat.campaignId}>
                  <td>
                    <div className="campaign-name">{stat.name}</div>
                  </td>
                  <td>
                    <span className="badge blue">{stat.clicks.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className="badge green">{stat.impressions.toLocaleString()}</span>
                  </td>
                  <td>
                    <div className="ctr-bar-wrap">
                      <div className="ctr-bar">
                        <div
                          className="ctr-bar-fill"
                          style={{ width: `${(stat.ctr / maxCtr) * 100}%` }}
                        />
                      </div>
                      <span className="badge yellow">{stat.ctr.toFixed(2)}%</span>
                    </div>
                  </td>
                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => onDelete(stat.campaignId)}
                      title="Видалити кампанію"
                    >
                      delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
