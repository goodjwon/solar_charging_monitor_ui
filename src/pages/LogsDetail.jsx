import { useState } from 'react';
import { MdArrowBack, MdFilterList, MdSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css';

const LogsDetail = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const logs = [
    { time: '12:00:05', message: 'Battery fully charged', type: 'info' },
    { time: '11:45:22', message: 'Solar panel voltage drop detected', type: 'warn' },
    { time: '11:30:15', message: 'High load detected (1.5kW)', type: 'warn' },
    { time: '10:15:30', message: 'System performing optimally', type: 'info' },
    { time: '09:30:00', message: 'System started', type: 'info' },
    { time: '08:45:12', message: 'Battery temperature normal', type: 'info' },
    { time: '08:00:00', message: 'Solar generation started', type: 'info' },
    { time: '07:30:45', message: 'Low battery warning', type: 'warn' },
    { time: '06:15:20', message: 'Night mode activated', type: 'info' },
    { time: '05:00:00', message: 'System health check passed', type: 'info' },
  ];

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'ALL' || log.type === filter.toLowerCase();
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <header>
        <div className="header-content">
          <div className="header-title">
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}>
              <MdArrowBack /> Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <h2 style={{ color: 'var(--text-primary)', fontSize: '24px' }}>
              System Logs
            </h2>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MdFilterList style={{ color: 'var(--text-secondary)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Filter:</span>
              {['ALL', 'INFO', 'WARN', 'ERROR'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '4px',
                    border: 'none',
                    background: filter === type ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '200px' }}>
              <MdSearch style={{ color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'var(--text-primary)',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Log List */}
        <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <span className="card-title">Log Entries ({filteredLogs.length})</span>
          </div>
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {filteredLogs.map((log, index) => (
              <div key={index} className="log-item">
                <span className="log-time">{log.time}</span>
                <span className="log-msg">{log.message}</span>
                <span className={`log-type ${log.type}`}>{log.type.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="glass-card widget-metric">
          <div className="card-header"><span className="card-title">Total Logs</span></div>
          <div className="metric-value" style={{ color: 'var(--primary-color)' }}>
            {logs.length}
          </div>
          <div className="metric-sub">Today</div>
        </div>

        <div className="glass-card widget-metric">
          <div className="card-header"><span className="card-title">Info</span></div>
          <div className="metric-value" style={{ color: '#2196F3' }}>
            {logs.filter(l => l.type === 'info').length}
          </div>
          <div className="metric-sub">Informational</div>
        </div>

        <div className="glass-card widget-metric">
          <div className="card-header"><span className="card-title">Warnings</span></div>
          <div className="metric-value" style={{ color: '#FFC107' }}>
            {logs.filter(l => l.type === 'warn').length}
          </div>
          <div className="metric-sub">Needs attention</div>
        </div>

        <div className="glass-card widget-metric">
          <div className="card-header"><span className="card-title">Errors</span></div>
          <div className="metric-value" style={{ color: '#F44336' }}>
            {logs.filter(l => l.type === 'error').length}
          </div>
          <div className="metric-sub">Critical issues</div>
        </div>
      </div>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <p>© 2025 Solar Monitor. Licensed by <a href="https://electrowave.kr/" target="_blank" rel="noopener noreferrer">electrowave.kr</a></p>
          <p>Developed by <strong>goodjwon</strong></p>
        </div>
      </footer>
    </div>
  );
};

export default LogsDetail;
